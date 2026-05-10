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
  LociHelpers,
  MolScriptApi,
  PluginContext,
} from './molstarTypes.ts';
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
  label: (selection: SelectionToken, template: string) => Promise<void>;

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

  /** Draw a labeled distance line between the centroids of two selections. */
  distance: (
    selection1: SelectionToken,
    selection2: SelectionToken,
  ) => Promise<void>;
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

  async function clearAll(): Promise<void> {
    const structureRef =
      plugin.managers.structure.hierarchy.current.structures[0];
    if (!structureRef) return;
    const components = structureRef.components.filter((component) =>
      component.cell.transform.tags?.includes('animate'),
    );
    if (components.length > 0) {
      await plugin.managers.structure.hierarchy.remove(components);
    }
    await plugin.managers.structure.measurement.clear?.();
    plugin.managers.structure.selection.clear();
    channels.resetState();
    context.setEchoEntry(null);
    context.setRamachandranEntry(null);
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

    setAtoms: channels.setAtoms,
    setBonds: channels.setBonds,
    setRibbon: channels.setRibbon,
    setSurface: channels.setSurface,
    label: channels.label,
    setChannelVisibility: channels.setChannelVisibility,
    setSelectionVisibility: channels.setSelectionVisibility,

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
      const loci1 = await selectionToLoci(selection1);
      const loci2 = await selectionToLoci(selection2);
      if (!loci1 || !loci2) return;
      await plugin.managers.structure.measurement.addDistance(loci1, loci2);
    },
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
