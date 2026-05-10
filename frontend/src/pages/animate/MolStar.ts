/**
 * Script-facing surface for the Animate page. Three globals are wired into
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

import type { ColorSpec } from './colorTheme.ts';
import type {
  EchoOptions,
  RamachandranOptions,
  RotateOptions,
  ScriptApi,
  SelectionToken,
} from './helpers.ts';
import type { MolStarAtom, MolStarResidue } from './parsePdb.ts';
import { parsePdb } from './parsePdb.ts';
import {
  makeAtomsChannel,
  makeBondsChannel,
  makeRibbonChannel,
  makeSurfaceChannel,
} from './scriptChannels.ts';

export type { MolStarAtom, MolStarResidue } from './parsePdb.ts';

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
  /**
   * Add a residue/element/chain label overlay. The template can reference
   * `${atom.*}`, `${residue.*}`, or `${chain.*}` paths; today the renderer
   * picks Mol*'s built-in label level from the references and draws the
   * level's default text (residue name+number, atom id, or chain id).
   * Custom-text labels are not yet supported.
   */
  label: (template: string) => Promise<void>;
  /** Sub-select within this selection (intersection with `expression`). */
  select: (expression: string) => Selection;
  /** Zoom + center the camera on this selection's bounding sphere. */
  focus: () => Promise<void>;
  /**
   * Center + frame the camera on this selection's bounding sphere. `factor`
   * is the fraction (0–1) of the viewport the sphere should occupy
   * (default 0.75). Rotation-invariant, so framing survives `ms.spin(...)`.
   */
  zoom: (factor?: number) => Promise<void>;
  /** Draw a labeled distance line to the centroid of `other`. */
  distance: (other: Selection) => Promise<void>;
}

/** Handle on a loaded PDB structure, returned by `ms.loadPDB(text)`. */
export interface PDB {
  readonly text: string;
  readonly atoms: readonly MolStarAtom[];
  readonly residues: readonly MolStarResidue[];
  readonly chains: readonly string[];
  readonly ligands: readonly string[];

  readonly all: Selection;
  readonly none: Selection;

  select: (expression: string) => Selection;

  ramachandran: (options?: RamachandranOptions) => void;
  clearRamachandran: () => void;
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
  selectionHalos: (on: boolean) => Promise<void>;
  echo: (text: string, options?: EchoOptions) => void;
  clearEcho: () => void;
  clear: () => Promise<void>;
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
    selectionHalos(on: boolean) {
      return api.selectionHalos(on);
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
  }
  return MolStar;
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
  return {
    text,
    atoms: parsed.atoms,
    residues: parsed.residues,
    chains: parsed.chains,
    ligands: parsed.ligands,
    get all() {
      return wrap(api, api.all);
    },
    get none() {
      return wrap(api, api.none);
    },
    select: (expression) => wrap(api, api.select(expression)),
    ramachandran: (options) => api.ramachandran(options),
    clearRamachandran: () => api.clearRamachandran(),
  };
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
    label: (template: string) => api.label(selection, template),
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
    focus: () => api.focus(selection),
    zoom: (factor?: number) => api.zoom(selection, factor),
    distance: (other: Selection) => api.distance(selection, other),
  });
  return selection;
}
