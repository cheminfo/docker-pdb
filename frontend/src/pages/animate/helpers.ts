import type { EchoEntry } from './EchoOverlay.tsx';
import type { RamachandranEntry } from './RamachandranOverlay.tsx';
import type {
  AtomsPatch,
  BondsPatch,
  ChannelKey,
  RibbonPatch,
  SurfacePatch,
} from './channels.ts';
import { createChannels } from './channels.ts';
import type {
  DistanceToOptions,
  DistancesPatch,
  HbondsPatch,
} from './measurements.ts';
import { createMeasurements } from './measurements.ts';
import { createModelRegistry } from './models.ts';
import type {
  LociHelpers,
  MolScriptApi,
  PluginContext,
  StructureElementApi,
} from './molstarTypes.ts';
import type { ParsedPdb } from './parsePdb.ts';
import { parsePdb } from './parsePdb.ts';
import { computeRamachandran } from './ramachandran.ts';
import { compileSelection } from './selectionCompiler.ts';
import type { Selection as SelectionAst } from './selectionParser.ts';
import { parseSelection } from './selectionParser.ts';

/**
 * Wraps a parsed selection AST in an opaque token. The internal renderer
 * uses these directly; scripts see a richer `Selection` object (defined in
 * `MolStar.ts`) that extends this with rendering channels and methods.
 */
export interface SelectionToken {
  readonly __ast: SelectionAst;
  readonly source: string;
}

/** Position + font options for the on-canvas echo (HTML overlay). */
export interface EchoOptions {
  position?: 'top' | 'middle' | 'bottom';
  size?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

/**
 * Font options for `selection.label(...)`. Mirrors {@link EchoOptions} minus
 * `position` — 3D labels are anchored to atoms, not screen edges. `size` is
 * a Mol* size-factor multiplier on the default text size (`1` = default).
 */
export interface LabelOptions {
  /** Size factor (multiplier on the default 3D text size). */
  size?: number;
  /** Render text in bold. */
  bold?: boolean;
  /** Render text in italic. */
  italic?: boolean;
  /** Uniform CSS color for the text (name or `#rrggbb` / `#rgb`). */
  color?: string;
}

/** Options accepted by `ms.rotate(...)`. */
export interface RotateOptions {
  /**
   * Rotation axis.
   * @default 'y'
   */
  axis?: 'x' | 'y' | 'z';
  /**
   * Total rotation, in degrees.
   * @default 360
   */
  degrees?: number;
  /**
   * Rotation speed, in degrees per second.
   * @default 60
   */
  speed?: number;
}

/** Options accepted by `pdb.ramachandran(...)`. */
export interface RamachandranOptions {
  /** Where to anchor the overlay panel relative to the viewer. */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /**
   * Residue identifiers to highlight on both panels (formatted as
   * `resNum:chainId`, e.g. `'29:A'`). Highlighted residues are drawn as
   * larger blue markers regardless of their cis/trans color.
   */
  highlight?: readonly string[];
}

/**
 * Script-facing helper API. Each method maps to a channel verb (`setAtoms`,
 * `setBonds`, …) or a viewer/camera op, and translates the call to Mol* API
 * sequences.
 */
export interface ScriptApi {
  /** Parse a selection expression into a `Selection` token. */
  select: (expression: string) => SelectionToken;
  /** Intersect two selections (used by `selection.select(sub)`). */
  intersect: (a: SelectionToken, b: SelectionToken) => SelectionToken;
  readonly all: SelectionToken;
  readonly none: SelectionToken;

  /** Wipe every representation added by previous helper calls. */
  clear: () => Promise<void>;

  setAtoms: (selection: SelectionToken, patch: AtomsPatch) => Promise<void>;
  setBonds: (selection: SelectionToken, patch: BondsPatch) => Promise<void>;
  setRibbon: (selection: SelectionToken, patch: RibbonPatch) => Promise<void>;
  setSurface: (selection: SelectionToken, patch: SurfacePatch) => Promise<void>;
  setHbonds: (selection: SelectionToken, patch: HbondsPatch) => Promise<void>;
  setDistances: (
    selection: SelectionToken,
    patch: DistancesPatch,
  ) => Promise<void>;
  /** Add one distance line from `selection` to `other`. */
  addDistanceTo: (
    selection: SelectionToken,
    other: SelectionToken,
    options?: DistanceToOptions,
  ) => Promise<void>;
  /** Toggle visibility of a measurement-style channel for `selection`. */
  setMeasurementVisibility: (
    selection: SelectionToken,
    channel: 'distances' | 'hbonds',
    visible: boolean,
  ) => void;
  label: (
    selection: SelectionToken,
    template: string,
    options?: LabelOptions,
  ) => Promise<void>;

  /** Toggle visibility of a single channel of `selection`. */
  setChannelVisibility: (
    selection: SelectionToken,
    channel: ChannelKey,
    visible: boolean,
  ) => void;
  /** Toggle visibility of every channel of `selection`. */
  setSelectionVisibility: (selection: SelectionToken, visible: boolean) => void;

  selectionHalos: (on: boolean) => Promise<void>;

  focus: (selection: SelectionToken) => Promise<void>;
  /**
   * Center + frame the camera on `selection`'s bounding sphere such that the
   * sphere fills `factor` of the viewport. `factor = 1` matches `focus()`;
   * smaller values leave more margin around the selection.
   */
  zoom: (selection: SelectionToken, factor?: number) => Promise<void>;
  resetCamera: () => Promise<void>;
  /**
   * Spin the camera around the given axis. Pass `'off'` to stop.
   * @param axis - Rotation axis, or `'off'` to stop spinning.
   * @param speedDegreesPerSecond - Rotation speed in degrees per second.
   *   Defaults to `30`.
   */
  spin: (
    axis: 'x' | 'y' | 'z' | 'off',
    speedDegreesPerSecond?: number,
  ) => Promise<void>;
  /**
   * Rotate the camera by a finite number of degrees and resolve when the
   * rotation is finished. The trackball is left stopped on completion.
   */
  rotate: (options?: RotateOptions) => Promise<void>;

  echo: (text: string, options?: EchoOptions) => void;
  clearEcho: () => void;

  /**
   * Render a 2D Ramachandran (φ × ψ) plus an ω plot rotated 90° about the
   * y-axis (residue index × ω) on top of the viewer. Each point is colored
   * by its ω value: green = trans, red = cis, gray = neither.
   */
  ramachandran: (options?: RamachandranOptions) => void;
  clearRamachandran: () => void;

  delay: (seconds: number) => Promise<void>;

  /**
   * Draw a labeled distance line between the centroids of two selections.
   * Kept for backward compatibility — the canonical surface is now
   * `selection.distances.to(other, options?)`.
   */
  distance: (
    selection1: SelectionToken,
    selection2: SelectionToken,
  ) => Promise<void>;

  /**
   * Register the implicit `'initial'` model on first `ms.loadPDB(text)`.
   * Subsequent calls with the same text are a no-op; calls with different
   * text are silently ignored (use `createModel` to add another model).
   */
  ensureInitialModel: (text: string) => void;
  /** Create a named model cloning the active model's PDB and op log. */
  createModel: (name: string, options?: { pdb?: string }) => Promise<void>;
  /** Make a previously-created model active (re-runs its op log). */
  switchModel: (name: string) => Promise<void>;
  currentModel: () => string;
  deleteModel: (name: string) => void;
  listModels: () => string[];
}

/** Resources passed to `createScriptApi` from the page-level wiring. */
export interface ScriptApiContext {
  plugin: unknown;
  molScript: unknown;
  setEchoEntry: (entry: EchoEntry | null) => void;
  setRamachandranEntry: (entry: RamachandranEntry | null) => void;
  /** Raw PDB text of the loaded structure, used by `pdb.ramachandran(...)`. */
  pdbText: string;
  /** Lazily-imported Mol* color module for hex → Color conversion. */
  colorModule: { Color: (hex: number) => unknown };
  /** Lazily-imported Mol* `Loci` helpers, used by `selection.zoom(...)`. */
  lociHelpers: LociHelpers;
  /**
   * Lazily-imported Mol* `StructureElement` helpers used by the measurements
   * module to validate atom-loci before passing them to `addDistance`.
   */
  structureElement: StructureElementApi;
  /**
   * Mutable handle to the PDB text currently loaded inside Mol*. Persists
   * across script Runs (held by the page) so `clearAll` can detect when a
   * previous run left a swapped structure and restore the original.
   */
  loadedPdbRef: { current: string };
  /**
   * Toggle a CSS class on the viewer container so the Mol* canvas briefly
   * dims while a model swap is in flight. Lets the user see the transition
   * even when the swap completes in milliseconds.
   */
  setSwapping: (swapping: boolean) => void;
}

/**
 * Factory: build a `ScriptApi` bound to the given Mol* plugin and overlay
 * setters. The returned object is what student scripts execute against.
 * @param context - Plugin + Mol* modules + overlay setters.
 * @returns A ready-to-call `ScriptApi`.
 */
export function createScriptApi(context: ScriptApiContext): ScriptApi {
  const plugin = context.plugin as PluginContext;
  const molScript = context.molScript as MolScriptApi;
  const channels = createChannels({
    plugin,
    molScript,
    colorModule: context.colorModule,
  });
  const measurements = createMeasurements({
    plugin,
    molScript,
    colorModule: context.colorModule,
    structureElement: context.structureElement,
  });
  let parsedPdbCache: { text: string; parsed: ParsedPdb } | null = null;
  function getParsedPdb(): ParsedPdb {
    if (parsedPdbCache?.text !== context.pdbText) {
      parsedPdbCache = {
        text: context.pdbText,
        parsed: parsePdb(context.pdbText),
      };
    }
    return parsedPdbCache.parsed;
  }

  async function selectionToLoci(selection: SelectionToken): Promise<unknown> {
    const structure =
      plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj?.data;
    if (!structure) return null;
    const queryResult = molScript.Script.getStructureSelection(
      (builder) => compileSelection(selection.__ast, builder),
      structure,
    );
    return molScript.StructureSelection.toLociWithSourceUnits(queryResult);
  }

  async function rawDistance(
    selection1: SelectionToken,
    selection2: SelectionToken,
  ): Promise<void> {
    const loci1 = await selectionToLoci(selection1);
    const loci2 = await selectionToLoci(selection2);
    if (!loci1 || !loci2) return;
    await plugin.managers.structure.measurement.addDistance(loci1, loci2);
  }

  async function resetTransients(): Promise<void> {
    await plugin.managers.structure.measurement.clear?.();
    plugin.managers.structure.selection.clear();
    plugin.canvas3d?.setProps({ renderer: { selectStrength: 0 } });
    context.setEchoEntry(null);
    context.setRamachandranEntry(null);
  }

  const models = createModelRegistry({
    plugin,
    channels,
    loadedPdbRef: context.loadedPdbRef,
    setSwapping: context.setSwapping,
    resetTransients,
    rawDistance,
  });

  async function clearAll(): Promise<void> {
    // Restore the original structure if a previous Run swapped it out, then
    // strip every `animate`-tagged representation and reset transient state.
    await models.resetToOriginal(context.pdbText);
    await models.clearActive();
    await measurements.clearAll();
    await resetTransients();
  }

  return {
    select: selectFromString,
    intersect: (a, b) => ({
      __ast: { kind: 'and', left: a.__ast, right: b.__ast },
      source: `(${a.source}) and (${b.source})`,
    }),
    all: { __ast: { kind: 'group', name: 'all' }, source: 'all' },
    none: { __ast: { kind: 'group', name: 'none' }, source: 'none' },

    clear: clearAll,

    setAtoms: (selection, patch) => {
      models.recordOp({ kind: 'setAtoms', selection, patch });
      return channels.setAtoms(selection, patch);
    },
    setBonds: (selection, patch) => {
      models.recordOp({ kind: 'setBonds', selection, patch });
      return channels.setBonds(selection, patch);
    },
    setRibbon: (selection, patch) => {
      models.recordOp({ kind: 'setRibbon', selection, patch });
      return channels.setRibbon(selection, patch);
    },
    setSurface: (selection, patch) => {
      models.recordOp({ kind: 'setSurface', selection, patch });
      return channels.setSurface(selection, patch);
    },
    // Measurement-style channels (hbonds, distances) are not yet recorded
    // into the model op log — switching models drops their state. Acceptable
    // for now: the only consumers are scenes that don't use createModel.
    setHbonds: (selection, patch) =>
      measurements.setHbonds(selection, getParsedPdb(), patch),
    setDistances: (selection, patch) =>
      measurements.setDistances(selection, patch),
    addDistanceTo: (selection, other, options) =>
      measurements.addDistanceTo(selection, other, options),
    setMeasurementVisibility: (selection, channel, visible) => {
      measurements.setVisibility(selection, channel, visible);
    },
    label: (selection, template) => {
      models.recordOp({ kind: 'label', selection, template });
      return channels.label(selection, template);
    },
    setChannelVisibility: (selection, channel, visible) => {
      models.recordOp({
        kind: 'channelVisibility',
        selection,
        channel,
        visible,
      });
      channels.setChannelVisibility(selection, channel, visible);
    },
    setSelectionVisibility: (selection, visible) => {
      models.recordOp({ kind: 'selectionVisibility', selection, visible });
      channels.setSelectionVisibility(selection, visible);
    },

    selectionHalos: async (on) => {
      plugin.canvas3d?.setProps({ renderer: { selectStrength: on ? 0.3 : 0 } });
    },

    focus: async (selection) => {
      const loci = await selectionToLoci(selection);
      if (!loci) return;
      plugin.managers.structure.selection.fromLoci('set', loci);
      plugin.managers.camera.focusLoci(loci);
    },
    zoom: async (selection, factor = 0.75) => {
      const loci = await selectionToLoci(selection);
      if (!loci) return;
      const safeFactor = Math.max(0.05, Math.min(1, factor));
      const sphere = context.lociHelpers.getBoundingSphere(loci);
      const extraRadius = sphere
        ? (sphere.radius * (1 - safeFactor)) / safeFactor
        : 0;
      plugin.managers.camera.focusLoci(loci, { extraRadius });
    },
    resetCamera: async () => {
      plugin.managers.structure.selection.clear();
      plugin.managers.camera.reset();
    },
    spin: async (axis, speedDegreesPerSecond = 30) => {
      applyTrackball(plugin, axis, speedDegreesPerSecond);
    },
    rotate: async (options) => {
      const axis = options?.axis ?? 'y';
      const degrees = options?.degrees ?? 360;
      const speed = options?.speed ?? 60;
      if (degrees <= 0 || speed <= 0) {
        applyTrackball(plugin, 'off', 0);
        return;
      }
      applyTrackball(plugin, axis, speed);
      await new Promise<void>((resolve) => {
        setTimeout(resolve, (degrees / speed) * 1000);
      });
      applyTrackball(plugin, 'off', 0);
    },

    echo: (text, options) => {
      context.setEchoEntry({
        text,
        position: options?.position ?? 'top',
        size: options?.size ?? 24,
        bold: options?.bold ?? true,
        italic: options?.italic ?? false,
        color: options?.color ?? 'black',
      });
    },
    clearEcho: () => context.setEchoEntry(null),

    ramachandran: (options) => {
      const residues = computeRamachandran(context.pdbText);
      context.setRamachandranEntry({
        residues,
        position: options?.position ?? 'bottom-right',
        highlight: new Set(options?.highlight),
      });
    },
    clearRamachandran: () => context.setRamachandranEntry(null),

    delay: (seconds) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, Math.max(0, seconds) * 1000);
      }),

    distance: async (selection1, selection2) => {
      models.recordOp({ kind: 'distance', selection1, selection2 });
      await rawDistance(selection1, selection2);
    },

    ensureInitialModel: (text) => models.ensureInitial(text),
    createModel: (name, options) => models.createModel(name, options),
    switchModel: (name) => models.switchModel(name),
    currentModel: () => models.currentModel(),
    deleteModel: (name) => models.deleteModel(name),
    listModels: () => models.listModels(),
  };
}

function selectFromString(expression: string): SelectionToken {
  return { __ast: parseSelection(expression), source: expression };
}

function axisVector(axis: 'x' | 'y' | 'z'): [number, number, number] {
  if (axis === 'x') return [1, 0, 0];
  if (axis === 'y') return [0, 1, 0];
  return [0, 0, 1];
}

function applyTrackball(
  plugin: PluginContext,
  axis: 'x' | 'y' | 'z' | 'off',
  speedDegreesPerSecond: number,
) {
  const animate =
    axis === 'off'
      ? { name: 'off', params: {} }
      : {
          name: 'spin',
          params: {
            speed: speedDegreesPerSecond / 360,
            axis: axisVector(axis),
          },
        };
  plugin.canvas3d?.setProps({ trackball: { animate } });
}
