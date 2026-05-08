import type { EchoEntry } from './EchoOverlay.tsx';
import type { RamachandranEntry } from './RamachandranOverlay.tsx';
import type { ColorSpec } from './colorTheme.ts';
import { buildColorParams } from './colorTheme.ts';
import type { MolScriptApi, PluginContext } from './molstarTypes.ts';
import { computeRamachandran } from './ramachandran.ts';
import { compileSelection } from './selectionCompiler.ts';
import type { Selection as SelectionAst } from './selectionParser.ts';
import { parseSelection } from './selectionParser.ts';

/**
 * Wraps a parsed selection AST in an opaque token. Helpers compile this to
 * Mol* MolScript only when they actually need to call into the viewer.
 */
export interface Selection {
  readonly __ast: SelectionAst;
  readonly source: string;
}

/** Options accepted by every representation helper. */
export interface RepOptions {
  /** Color spec applied at representation creation time. */
  color?: ColorSpec;
  /** Sphere/bond size factor; representation-specific defaults apply otherwise. */
  scale?: number;
}

/** Position + font options for the on-canvas echo (HTML overlay). */
export interface EchoOptions {
  position?: 'top' | 'middle' | 'bottom';
  size?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

/** Options accepted by `api.ramachandran(...)`. */
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
 * Script-facing helper API. Each method maps to a JSmol-style verb (`cpk`,
 * `cartoon`, `focus`, `echo`, …) and translates the call to Mol* API
 * sequences.
 */
export interface ScriptApi {
  /** Parse a selection expression into a `Selection` token. */
  select: (expression: string) => Selection;
  readonly all: Selection;
  readonly none: Selection;

  /** Wipe every representation added by previous helper calls. */
  clear: () => Promise<void>;

  cpk: (selection: Selection, options?: RepOptions) => Promise<void>;
  wireframe: (selection: Selection, options?: RepOptions) => Promise<void>;
  cartoon: (selection: Selection, options?: RepOptions) => Promise<void>;
  ribbon: (selection: Selection, options?: RepOptions) => Promise<void>;
  surface: (selection: Selection, options?: RepOptions) => Promise<void>;
  dots: (selection: Selection, options?: RepOptions) => Promise<void>;

  selectionHalos: (on: boolean) => Promise<void>;

  focus: (selection: Selection) => Promise<void>;
  resetCamera: () => Promise<void>;
  spin: (axis: 'x' | 'y' | 'z' | 'off', speedRpm?: number) => Promise<void>;

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
  distance: (sel1: Selection, sel2: Selection) => Promise<void>;
}

/** Resources passed to `createScriptApi` from the page-level wiring. */
export interface ScriptApiContext {
  plugin: unknown;
  molScript: unknown;
  setEchoEntry: (entry: EchoEntry | null) => void;
  setRamachandranEntry: (entry: RamachandranEntry | null) => void;
  /** Raw PDB text of the loaded structure, used by `api.ramachandran(...)`. */
  pdbText: string;
  /** Lazily-imported Mol* color module for hex → Color conversion. */
  colorModule: { Color: (hex: number) => unknown };
}

/**
 * Factory: build a `ScriptApi` bound to the given Mol* plugin and echo
 * setter. The returned object is what student scripts execute against.
 * @param context - Plugin + Mol* modules + echo overlay setter.
 * @returns A ready-to-call `ScriptApi`.
 */
export function createScriptApi(context: ScriptApiContext): ScriptApi {
  const plugin = context.plugin as PluginContext;
  const molScript = context.molScript as MolScriptApi;

  async function selectionToLoci(selection: Selection): Promise<unknown> {
    const structure = getStructureData(plugin);
    if (!structure) return null;
    const queryResult = molScript.Script.getStructureSelection(
      selectionExpression(selection),
      structure,
    );
    return molScript.StructureSelection.toLociWithSourceUnits(queryResult);
  }

  async function addRep(
    selection: Selection,
    representationType: string,
    options: RepOptions | undefined,
    sizeKey?: 'sizeFactor',
  ): Promise<void> {
    const structureRef =
      plugin.managers.structure.hierarchy.current.structures[0];
    if (!structureRef) return;
    const expression = compileSelection(selection.__ast, molScript.builder);
    const componentKey = `animate-${representationType}-${selection.source}`;
    const component =
      await plugin.builders.structure.tryCreateComponentFromExpression(
        structureRef.cell,
        expression,
        componentKey,
        { label: componentKey, tags: ['animate'] },
      );
    if (!component) return;
    const params = buildColorParams(
      representationType,
      options?.color,
      context.colorModule,
    );
    if (sizeKey && options?.scale !== undefined) {
      params.typeParams = {
        ...params.typeParams,
        [sizeKey]: options.scale,
      };
    }
    await plugin.builders.structure.representation.addRepresentation(
      component,
      params as unknown as Record<string, unknown>,
    );
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
    context.setEchoEntry(null);
    context.setRamachandranEntry(null);
  }

  return {
    select: selectFromString,
    all: { __ast: { kind: 'group', name: 'all' }, source: 'all' },
    none: { __ast: { kind: 'group', name: 'none' }, source: 'none' },

    clear: clearAll,

    cpk: (selection, options) =>
      addRep(selection, 'spacefill', options, 'sizeFactor'),
    wireframe: (selection, options) =>
      addRep(selection, 'ball-and-stick', options, 'sizeFactor'),
    cartoon: (selection, options) => addRep(selection, 'cartoon', options),
    ribbon: (selection, options) => addRep(selection, 'cartoon', options),
    surface: (selection, options) =>
      addRep(selection, 'molecular-surface', options),
    dots: (selection, options) =>
      addRep(selection, 'gaussian-surface', options),

    selectionHalos: async (on) => {
      plugin.canvas3d?.setProps({ renderer: { selectStrength: on ? 0.3 : 0 } });
    },

    focus: async (selection) => {
      const loci = await selectionToLoci(selection);
      if (!loci) return;
      plugin.managers.structure.selection.fromLoci('set', loci);
      plugin.managers.camera.focusLoci(loci);
    },
    resetCamera: async () => {
      plugin.managers.structure.selection.clear();
      plugin.managers.camera.reset();
    },
    spin: async (axis, speedRpm = 1) => {
      const animate =
        axis === 'off'
          ? { name: 'off', params: {} }
          : {
              name: 'spin',
              params: {
                speed: speedRpm,
                axis: axisVector(axis),
              },
            };
      plugin.canvas3d?.setProps({ trackball: { animate } });
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

    distance: async (sel1, sel2) => {
      const loci1 = await selectionToLoci(sel1);
      const loci2 = await selectionToLoci(sel2);
      if (!loci1 || !loci2) return;
      await plugin.managers.structure.measurement.addDistance(loci1, loci2);
    },
  };
}

function selectFromString(expression: string): Selection {
  return { __ast: parseSelection(expression), source: expression };
}

function selectionExpression(
  selection: Selection,
): (builder: unknown) => unknown {
  return (builder) => compileSelection(selection.__ast, builder);
}

function getStructureData(plugin: PluginContext): unknown {
  return plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj
    ?.data;
}

function axisVector(axis: 'x' | 'y' | 'z'): [number, number, number] {
  if (axis === 'x') return [1, 0, 0];
  if (axis === 'y') return [0, 1, 0];
  return [0, 0, 1];
}
