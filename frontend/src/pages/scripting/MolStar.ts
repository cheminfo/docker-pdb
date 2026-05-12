/**
 * Script-facing surface for the Scripting page. Three globals are wired into
 * every script:
 *
 *   - `MolStar`  — class. `const ms = new MolStar();` returns the viewer.
 *   - `delay(s)` — `delay(2)` pauses the script.
 *   - `text`     — raw PDB text of the loaded structure.
 *
 *   const ms = new MolStar();
 *   const pdb = ms.loadPDB(text);
 *   const cys = pdb.select('[CYS]');
 *   cys.bonds.diameter(0.4);
 *   cys.bonds.color({ model: 'atoms' });
 *   cys.atoms.radius({ value: 1.4 });
 *
 * Each Selection has four representation channels (`atoms`, `bonds`,
 * `ribbon`, `surface`) plus `label(template)`; channel methods are
 * idempotent and merge into the existing Mol* representation. Selections
 * compose via `selection.select(sub)` (intersection).
 *
 * The runtime methods return `Promise<void>`; the script runner
 * (`runScript.ts` → `rewriteAwait.ts`) inserts `await` automatically before
 * every call to a `Promise`-returning method, so users write linear code
 * without `await`. Explicit `await` is also accepted (the rewrite is
 * idempotent) for power users.
 */

import { buildRamachandranPdb } from './buildRamachandranPdb.ts';
import type { ColorSpec } from './colorTheme.ts';
import type {
  CameraTransitionOptions,
  EchoOptions,
  LabelOptions,
  RotateOptions,
  ScriptApi,
  SelectionToken,
} from './helpers.ts';
import type { ContactsOptions, DistanceToOptions } from './measurements.ts';
import type {
  MolStarAtom,
  MolStarResidue,
  SecondaryStructureRange,
} from './parsePdb.ts';
import { parsePdb } from './parsePdb.ts';
import type { DihedralStats } from './ramachandran.ts';
import { computeDihedralStats } from './ramachandran.ts';
import {
  makeAtomsChannel,
  makeBondsChannel,
  makeDistancesChannel,
  makeHbondsChannel,
  makeRibbonChannel,
  makeSurfaceChannel,
} from './scriptChannels.ts';

export type {
  MolStarAtom,
  MolStarResidue,
  SecondaryStructureRange,
} from './parsePdb.ts';

/**
 * Strip a single `Promise<...>` wrapper from a type. Used by `Sync<T>` to
 * derive the synchronous-looking view that the editor exposes to scripts.
 * The runtime methods still return `Promise`s — `rewriteAwait.ts` injects
 * the `await` for the user.
 */
export type Unwrap<T> = T extends Promise<infer U> ? U : T;

/**
 * Recursively rewrite `T` so every method that returned `Promise<R>` now
 * returns `R`, and every nested object is itself `Sync`-rewritten. Apply
 * once at the editor boundary (`Sync<MolStarInstance>`, `Sync<PDB>`, …) to
 * get types that match what users actually type — no `await`, no
 * `Promise<void>` in hover tooltips. The runtime keeps its real async
 * signatures; only the script-facing surface is unwrapped.
 */
export type Sync<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Sync<Unwrap<R>>
    : T[K] extends object
      ? Sync<T[K]>
      : T[K];
};

/** Sphere/cylinder size factor: a multiplier on Mol*'s default sizing. */
export interface SizeOptions {
  /** Size factor (Mol* multiplier). For atoms: ×Van der Waals radius. */
  value: number;
}

/**
 * Methods every channel and Selection exposes for visibility toggling.
 * `show()` / `hide()` are no-ops if the channel hasn't been created yet
 * (call a setter like `.color(...)` or `.radius(...)` first). Returns the
 * receiver so visibility toggles fit into a chain.
 */
export interface VisibilityToggle<T> {
  show: () => T;
  hide: () => T;
}

/**
 * Aggregator returned by `ms.atoms` / `ms.bonds` / `ms.ribbon` /
 * `ms.surface` / `ms.label` / `ms.hbonds` / `ms.distances`. Calling
 * `.hide()` toggles `isHidden` on every cell of that kind across every
 * selection without dropping color/size state, so a later `.show()`
 * restores the prior visuals.
 */
export interface MsKindToggle {
  show: () => void;
  hide: () => void;
}

/**
 * Sphere channel — covers each atom of the selection.
 *
 * Channel objects are **chainable thenables**: every mutator returns the
 * channel itself synchronously and queues the underlying `Promise` work, so
 * `await chain` waits for every queued op (the auto-await rewrite makes
 * this transparent in user scripts). See `scriptChannels.ts`.
 */
export interface AtomsChannel
  extends VisibilityToggle<AtomsChannel>, PromiseLike<void> {
  /** Recolor (creates the spheres on first call). */
  color: (spec: ColorSpec) => AtomsChannel;
  /** Set sphere size factor. */
  radius: (options: SizeOptions) => AtomsChannel;
}

/** Bond channel — cylinders along bonds within the selection. */
export interface BondsChannel
  extends VisibilityToggle<BondsChannel>, PromiseLike<void> {
  /** Recolor (creates the cylinders on first call). */
  color: (spec: ColorSpec) => BondsChannel;
  /** Set bond cylinder size factor. */
  diameter: (value: number) => BondsChannel;
}

/** Cartoon / ribbon channel — protein backbone trace. */
export interface RibbonChannel
  extends VisibilityToggle<RibbonChannel>, PromiseLike<void> {
  /** Recolor (creates the ribbon on first call). */
  color: (spec: ColorSpec) => RibbonChannel;
  /**
   * Switch to Mol*'s `putty` representation — a uniform polymer tube that
   * ignores secondary-structure annotations, so helices and β-strands
   * render as plain coil. Useful to show the protein's backbone shape
   * without revealing where the helices and sheets sit.
   */
  tube: () => RibbonChannel;
  /**
   * Switch back to the standard SS-aware cartoon (the default). Helices
   * render as coils, β-strands as flat arrows.
   */
  cartoon: () => RibbonChannel;
}

/** Solvent-accessible surface channel. */
export interface SurfaceChannel
  extends VisibilityToggle<SurfaceChannel>, PromiseLike<void> {
  /** Recolor (creates a solid surface on first call unless `dots()` ran). */
  color: (spec: ColorSpec) => SurfaceChannel;
  /** Switch to a dotted Gaussian surface (subsequent `color()` keeps it). */
  dots: () => SurfaceChannel;
}

/**
 * Hydrogen-bond channel. Computes backbone N…O hydrogen bonds within the
 * selection's residues (distance window 2.5–3.5 Å, excluding peptide-bond
 * neighbours) and renders them as Mol*-managed dashed lines. Default
 * style is yellow with `diameter` 0.3.
 */
export interface HbondsChannel
  extends VisibilityToggle<HbondsChannel>, PromiseLike<void> {
  /** Recolor (creates the lines on first call). Default `{ value: 'yellow' }`. */
  color: (spec: ColorSpec) => HbondsChannel;
  /** Set the line size factor (Mol* `linesSize`). Default `0.3`. */
  diameter: (value: number) => HbondsChannel;
}

/**
 * Distances channel. Each `to(other, options?)` adds one labeled distance
 * line between this selection and `other`. `color` / `diameter` set the
 * default style for *subsequent* `to(...)` calls.
 */
export interface DistancesChannel
  extends VisibilityToggle<DistancesChannel>, PromiseLike<void> {
  /** Default color for subsequent `to(...)` lines. */
  color: (spec: ColorSpec) => DistancesChannel;
  /** Default line size factor for subsequent `to(...)` lines. */
  diameter: (value: number) => DistancesChannel;
  /** Add one labeled distance line to `other`. */
  to: (other: Selection, options?: DistanceToOptions) => DistancesChannel;
}

/**
 * Selection object returned by `pdb.select(...)` (and recursive sub-selects).
 * Channel objects let you build a representation incrementally; chained
 * methods on the selection itself cover camera/measurement/labels.
 *
 * `selection.show()` / `selection.hide()` toggle every channel that has been
 * created on this selection. Each channel also has its own `show()` / `hide()`.
 */
export interface Selection extends SelectionToken, VisibilityToggle<Selection> {
  readonly atoms: AtomsChannel;
  readonly bonds: BondsChannel;
  readonly ribbon: RibbonChannel;
  readonly surface: SurfaceChannel;
  readonly hbonds: HbondsChannel;
  readonly distances: DistancesChannel;
  /**
   * Add a residue/element/chain label overlay. The template can reference
   * `${atom.*}`, `${residue.*}`, or `${chain.*}` paths; today the renderer
   * picks Mol*'s built-in label level from the references and draws the
   * level's default text (residue name+number, atom id, or chain id).
   * Custom-text labels are not yet supported. `options` mirror the `echo`
   * font preferences (`size`, `bold`, `italic`, `color`); `size` is a Mol*
   * size-factor multiplier on the default 3D text size.
   */
  label: (template: string, options?: LabelOptions) => Promise<void>;
  /** Sub-select within this selection (intersection with `expression`). */
  select: (expression: string) => Selection;
  /**
   * Zoom + center the camera on this selection's bounding sphere. Pass
   * `{ seconds }` to tween the move — useful for cinematic "fly in" effects.
   */
  focus: (options?: CameraTransitionOptions) => Promise<void>;
  /**
   * Center + frame the camera on this selection's bounding sphere. `factor`
   * is the fraction (0–1) of the viewport the sphere should occupy
   * (default 0.75). Rotation-invariant, so framing survives `ms.spin(...)`.
   * Pass `{ seconds }` to animate the move over that duration; omit for an
   * instant snap.
   */
  zoom: (factor?: number, options?: CameraTransitionOptions) => Promise<void>;
  /**
   * Draw a labeled distance line to the centroid of `other`. Kept as a
   * shorthand for `selection.distances.to(other)`.
   */
  distance: (other: Selection) => Promise<void>;
  /**
   * Compute and render contacts between this selection and `other` using
   * Mol*'s chemistry-aware `extensions/interactions` pipeline. Renders
   * dashed cylinders coloured per interaction kind (yellow for
   * hydrogen-bond, light blue for ionic, gray for hydrophobic, …).
   *
   * Designed for inter-molecular cases (e.g. ligand binding sites) where
   * the two selections cover disjoint atoms. For intra-helix backbone
   * H-bonds, use `selection.hbonds.show()` instead — Mol*'s
   * `ComputeContacts` hardcodes `skipIntraContacts: true` and can't
   * detect H-bonds that share a chain.
   */
  contactsWith: (other: Selection, options?: ContactsOptions) => Promise<void>;
}

/** Handle on a loaded PDB structure, returned by `ms.loadPDB(text)`. */
export interface PDB {
  readonly text: string;
  readonly atoms: readonly MolStarAtom[];
  readonly residues: readonly MolStarResidue[];
  readonly chains: readonly string[];
  readonly ligands: readonly string[];
  /**
   * Inclusive residue ranges declared by every `HELIX` record in the PDB
   * text. One entry per record (≈ one entry per α-helix), in source order.
   * Empty when the file carries no HELIX records.
   */
  readonly helices: readonly SecondaryStructureRange[];
  /**
   * Inclusive residue ranges declared by every `SHEET` record in the PDB
   * text. One entry per record (≈ one entry per β-strand — a single
   * β-sheet contains several entries), in source order. Empty when the
   * file carries no SHEET records.
   */
  readonly sheets: readonly SecondaryStructureRange[];

  readonly all: Selection;
  readonly none: Selection;

  select: (expression: string) => Selection;

  /**
   * Build a synthetic PDB string with one Cα per residue placed at
   * `(φ, ψ, ω)` in degrees — the 3D Ramachandran cloud. Three short axis
   * chains (`X` / `Y` / `Z`, residue names `XAX` / `YAX` / `ZAX`) are also
   * embedded and connected with `CONECT` records so they can be drawn as
   * lines. Pass the result to `pdb.createModel('rama', { pdb: … })` to swap
   * the protein view for the dihedral-space cloud.
   */
  ramachandranPdb: () => string;

  /**
   * Tally α-helix / β-sheet / coil residues and cis / trans peptide bonds
   * across the structure. Useful for one-line summaries (e.g. embedding the
   * cis count in an `ms.echo(...)` overlay).
   */
  dihedralStats: () => DihedralStats;

  /**
   * Create a named view of the structure. The active model's PDB text is
   * inherited unless `options.pdb` overrides it (e.g. a synthetic structure
   * with moved coordinates). The op log of the new model **starts empty** —
   * channel calls recorded against the parent are not replayed here, since
   * they were tied to the parent's structure and rarely make sense on a
   * fresh PDB.
   *
   * `options.camera` selects the projection used while this model is
   * active: `'orthographic'` removes perspective foreshortening (atoms
   * render at the same on-screen size regardless of depth — natural for
   * the Ramachandran cube), `'perspective'` keeps Mol*'s default. The
   * camera mode persists when this model becomes active again via
   * `switchModel`.
   *
   * The new model becomes active and `pdb` now follows it — channel calls
   * record into this model until `switchModel` is called. Returns the
   * same `pdb` handle so the call can be chained.
   */
  createModel: (
    name: string,
    options?: { pdb?: string; camera?: 'perspective' | 'orthographic' },
  ) => Promise<PDB>;
  /**
   * Activate a previously-created model. Tears down the current `scripting`
   * representations, reloads the Mol* structure when the target's PDB
   * differs, then replays the target's op log. Returns the same `pdb` handle.
   */
  switchModel: (name: string) => Promise<PDB>;
  /** Name of the currently active model (defaults to `'initial'`). */
  currentModel: () => string;
  /** Delete a model by name. The `'initial'` model cannot be deleted. */
  deleteModel: (name: string) => void;
  /** List every registered model name in creation order. */
  listModels: () => readonly string[];
}

/** The viewer instance returned by `new MolStar()`. */
export interface MolStarInstance {
  loadPDB: (text: string) => PDB;
  spin: (
    axis: 'x' | 'y' | 'z' | 'off',
    speedDegreesPerSecond?: number,
  ) => Promise<void>;
  rotate: (options?: RotateOptions) => Promise<void>;
  resetCamera: () => Promise<void>;
  /**
   * Frame every atom of the currently-loaded structure with a comfortable
   * margin. \`factor\` is the fraction (0–1) of the viewport the bounding
   * sphere should fill (default \`0.85\`, leaving a 15% margin); pass
   * \`{ seconds }\` to animate the move.
   *
   * Like \`selection.zoom\`, \`fit\` pins the camera so subsequent rep
   * additions / visibility flips don't trigger Mol*'s auto-fit. Use this
   * after a \`switchModel\` to re-centre on the protein once the synthetic
   * Ramachandran cloud (or any other view) has gone away.
   */
  fit: (factor?: number, options?: CameraTransitionOptions) => Promise<void>;
  selectionHalos: (on: boolean) => Promise<void>;
  /**
   * Toggle the viewer pane's full-screen mode. `true` enters fullscreen
   * (only the protein + its toolbar remain on the page), `false` exits;
   * omit to flip the current state. Use to drive animations that briefly
   * switch into a full-screen close-up before returning to the editor view.
   */
  fullscreen: (on?: boolean) => void;
  echo: (text: string, options?: EchoOptions) => void;
  clearEcho: () => void;
  clear: () => Promise<void>;
  /**
   * Restore the freshly-loaded view: clear every script-added representation
   * and measurement, drop the persistent selection, and reset the camera to
   * Mol*'s initial auto-frame (center, zoom, orientation). Equivalent to
   * clicking the page's Reset button from inside a script.
   */
  reset: () => Promise<void>;
  /**
   * Hide every representation Mol* added through its default preset
   * (polymer cartoon, ligand ball-and-stick, water spheres). Scripting-managed
   * components are untouched. Call this at the start of a scene that wants
   * full control of the canvas (e.g. to truly hide other helices).
   */
  hideDefaults: () => Promise<void>;
  /** Re-show whatever `hideDefaults()` hid. */
  showDefaults: () => Promise<void>;

  /**
   * Hierarchical visibility aggregators. Each one targets every
   * representation of that kind across every selection and toggles
   * `isHidden` without dropping the underlying color/size state — so
   * `ms.atoms.hide()` followed by `ms.atoms.show()` restores the exact
   * prior visual.
   */
  readonly atoms: MsKindToggle;
  readonly bonds: MsKindToggle;
  readonly ribbon: MsKindToggle;
  readonly surface: MsKindToggle;
  readonly label: MsKindToggle;
  readonly hbonds: MsKindToggle;
  readonly distances: MsKindToggle;
  readonly contacts: MsKindToggle;

  /**
   * Add a 3D arrow primitive (cylinder shaft + cone head) between
   * `from` and `to` (in Å, world coordinates). The shape is recorded
   * into the active model's op log so it replays on `switchModel`.
   * Defaults: `radius = 0.4`, `headLength = 4 × radius`, `headRadius = 2.4 × radius`.
   */
  arrow: (
    from: ArrowPoint,
    to: ArrowPoint,
    options?: ArrowOptions,
  ) => Promise<void>;
  /**
   * Add a uniform-radius cylinder primitive between `from` and `to`.
   * Defaults: `radius = 0.4`.
   */
  cylinder: (
    from: ArrowPoint,
    to: ArrowPoint,
    options?: CylinderOptions,
  ) => Promise<void>;
  /** Add a sphere primitive at `center`. Defaults: `radius = 0.4`. */
  sphere: (center: ArrowPoint, options?: SphereOptions) => Promise<void>;
  /**
   * Draw arbitrary text at a world-coordinate position. Used for axis
   * labels and any other free-floating annotation Mol*'s residue-anchored
   * label representation can't express (e.g. Greek letters).
   */
  text: (
    position: ArrowPoint,
    text: string,
    options?: TextOptions,
  ) => Promise<void>;
}

/** A 3D point passed to the shape helpers. */
export type ArrowPoint = readonly [number, number, number];

export interface ArrowOptions {
  /** Cylinder shaft radius in Å. Default `0.4`. */
  radius?: number;
  /** CSS color name or `#rrggbb` / `#rgb`. Default `'gray'`. */
  color?: string;
  /** Optional 3D label anchored to the arrow's centroid. */
  label?: string;
  /** Length of the conical head along the arrow axis (Å). */
  headLength?: number;
  /** Base radius of the cone (Å). */
  headRadius?: number;
}

export interface CylinderOptions {
  radius?: number;
  color?: string;
  label?: string;
}

export interface SphereOptions {
  radius?: number;
  color?: string;
  label?: string;
}

export interface TextOptions {
  /** CSS color name or `#rrggbb` / `#rgb`. Default `'gray'`. */
  color?: string;
  /** Size factor (multiplier on the default 3D text size). Default `1`. */
  size?: number;
  /** Render glyphs in bold. Default `false`. */
  bold?: boolean;
  /** Render glyphs in italic. Default `false`. */
  italic?: boolean;
  /** Tooltip; falls back to the rendered text. */
  label?: string;
}

/** Constructor surface exposed to scripts as the `MolStar` global. */
export type MolStarConstructor = new () => MolStarInstance;

/** `delay(2)` — pause the script. */
export type Delay = (seconds: number) => Promise<void>;

/**
 * Synchronous-looking views of the script-facing surface. The real runtime
 * methods return `Promise`s; `rewriteAwait.ts` injects `await` for the user,
 * so the editor (and any future Monaco/TS-aware completion source) should
 * advertise these flattened types instead of the raw async ones.
 */
export type ScriptingMolStar = Sync<MolStarInstance>;
export type ScriptingPDB = Sync<PDB>;
export type ScriptingSelection = Sync<Selection>;
export type ScriptingDelay = (seconds: number) => void;

/**
 * Build the script-facing `MolStar` class. Returned constructor closes over
 * the renderer; scripts call `new MolStar()` to get the viewer instance.
 * @param api - Internal renderer bound to the Mol* plugin.
 * @returns A constructor whose instances expose camera + `loadPDB`.
 */
export function createMolStarClass(api: ScriptApi): MolStarConstructor {
  class MolStar implements MolStarInstance {
    loadPDB(text: string): PDB {
      api.ensureInitialModel(text);
      return buildPdb(api, text);
    }
    spin(axis: 'x' | 'y' | 'z' | 'off', speedDegreesPerSecond?: number) {
      return api.spin(axis, speedDegreesPerSecond);
    }
    rotate(options?: RotateOptions) {
      return api.rotate(options);
    }
    resetCamera() {
      return api.resetCamera();
    }
    fit(factor?: number, options?: CameraTransitionOptions) {
      return api.fit(factor, options);
    }
    selectionHalos(on: boolean) {
      return api.selectionHalos(on);
    }
    fullscreen(on?: boolean) {
      api.setFullscreen(on);
    }
    echo(text: string, options?: EchoOptions) {
      api.echo(text, options);
    }
    clearEcho() {
      api.clearEcho();
    }
    clear() {
      return api.clear();
    }
    reset() {
      return api.reset();
    }
    hideDefaults() {
      return api.setDefaultsVisibility(false);
    }
    showDefaults() {
      return api.setDefaultsVisibility(true);
    }
    get atoms() {
      return makeKindToggle(api, 'atoms');
    }
    get bonds() {
      return makeKindToggle(api, 'bonds');
    }
    get ribbon() {
      return makeKindToggle(api, 'ribbon');
    }
    get surface() {
      return makeKindToggle(api, 'surface');
    }
    get label() {
      return makeKindToggle(api, 'label');
    }
    get hbonds() {
      return makeKindToggle(api, 'hbonds');
    }
    get distances() {
      return makeKindToggle(api, 'distances');
    }
    get contacts() {
      return makeKindToggle(api, 'contacts');
    }
    arrow(from: ArrowPoint, to: ArrowPoint, options?: ArrowOptions) {
      return api.addShape({
        kind: 'arrow',
        from,
        to,
        radius: options?.radius,
        color: options?.color,
        label: options?.label,
        headLength: options?.headLength,
        headRadius: options?.headRadius,
      });
    }
    cylinder(from: ArrowPoint, to: ArrowPoint, options?: CylinderOptions) {
      return api.addShape({
        kind: 'cylinder',
        from,
        to,
        radius: options?.radius,
        color: options?.color,
        label: options?.label,
      });
    }
    sphere(center: ArrowPoint, options?: SphereOptions) {
      return api.addShape({
        kind: 'sphere',
        center,
        radius: options?.radius,
        color: options?.color,
        label: options?.label,
      });
    }
    text(position: ArrowPoint, text: string, options?: TextOptions) {
      return api.addShape({
        kind: 'text',
        position,
        text,
        color: options?.color,
        size: options?.size,
        bold: options?.bold,
        italic: options?.italic,
        label: options?.label,
      });
    }
  }
  return MolStar;
}

function makeKindToggle(
  api: ScriptApi,
  kind:
    | 'atoms'
    | 'bonds'
    | 'ribbon'
    | 'surface'
    | 'label'
    | 'hbonds'
    | 'distances'
    | 'contacts',
): MsKindToggle {
  return {
    show: () => api.setKindVisibility(kind, true),
    hide: () => api.setKindVisibility(kind, false),
  };
}

/**
 * `await delay(seconds)` — used as the script's `delay` global.
 * @param seconds - Number of seconds to wait. Negative values resolve
 *   immediately.
 */
export const delay: Delay = (seconds) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, Math.max(0, seconds) * 1000);
  });

function buildPdb(api: ScriptApi, text: string): PDB {
  const parsed = parsePdb(text);
  const pdb: PDB = {
    text,
    atoms: parsed.atoms,
    residues: parsed.residues,
    chains: parsed.chains,
    ligands: parsed.ligands,
    helices: parsed.helices,
    sheets: parsed.sheets,
    get all() {
      return wrap(api, api.all);
    },
    get none() {
      return wrap(api, api.none);
    },
    select: (expression) => wrap(api, api.select(expression)),
    ramachandranPdb: () => buildRamachandranPdb(text),
    dihedralStats: () => computeDihedralStats(text),
    createModel: async (name, options) => {
      await api.createModel(name, options);
      return pdb;
    },
    switchModel: async (name) => {
      await api.switchModel(name);
      return pdb;
    },
    currentModel: () => api.currentModel(),
    deleteModel: (name) => api.deleteModel(name),
    listModels: () => api.listModels(),
  };
  return pdb;
}

function wrap(api: ScriptApi, token: SelectionToken): Selection {
  const selection = {} as Selection;
  Object.assign(selection, {
    __ast: token.__ast,
    source: token.source,
    atoms: makeAtomsChannel(api, selection),
    bonds: makeBondsChannel(api, selection),
    ribbon: makeRibbonChannel(api, selection),
    surface: makeSurfaceChannel(api, selection),
    hbonds: makeHbondsChannel(api, selection),
    distances: makeDistancesChannel(api, selection),
    label: (template: string, options?: LabelOptions) =>
      api.label(selection, template, options),
    select: (expression: string) =>
      wrap(api, api.intersect(selection, api.select(expression))),
    show: () => {
      api.setSelectionVisibility(selection, true);
      return selection;
    },
    hide: () => {
      api.setSelectionVisibility(selection, false);
      return selection;
    },
    focus: (options?: CameraTransitionOptions) => api.focus(selection, options),
    zoom: (factor?: number, options?: CameraTransitionOptions) =>
      api.zoom(selection, factor, options),
    distance: (other: Selection) => api.distance(selection, other),
    contactsWith: (other: Selection, options?: ContactsOptions) =>
      api.addContacts(selection, other, options),
  });
  return selection;
}
