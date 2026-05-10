/**
 * Per-Selection registry for measurement-style overlays (`distances`,
 * `hbonds`). These don't fit the structure-component channel model in
 * `channels.ts` because Mol* renders them through its measurement manager
 * (line + label shape representations) instead of through structure
 * components — so this module owns the parallel state.
 *
 * Channel state is keyed by `${selection.source}::distances` /
 * `${selection.source}::hbonds`, mirroring `channels.ts`. Refs to the Mol*
 * `StructureSelectionsDistance3D` cells are tracked so `hide()` /
 * `show()` can toggle visibility and `clear()` can drop everything.
 */

import type { ColorSpec } from './colorTheme.ts';
import { parseCssColorToHex } from './colorTheme.ts';
import { computeBackboneHBonds, selectionResidueKeys } from './hbondCompute.ts';
import type { SelectionToken } from './helpers.ts';
import type {
  MolScriptApi,
  PluginContext,
  StructureElementApi,
} from './molstarTypes.ts';
import type { MolStarAtom, ParsedPdb } from './parsePdb.ts';
import { compileSelection } from './selectionCompiler.ts';
import type { Selection as SelectionAst } from './selectionParser.ts';

/** Mutable state mutators for the `hbonds` channel. */
export interface HbondsPatch {
  color?: ColorSpec;
  /** Line size factor (Mol* `linesSize`). */
  diameter?: number;
}

/** Mutable state mutators for the `distances` channel. */
export interface DistancesPatch {
  color?: ColorSpec;
  /** Line size factor (Mol* `linesSize`). */
  diameter?: number;
}

/**
 * Options the script can pass when adding a single distance line via
 * `selection.distances.to(other, options?)`. Mirrors {@link DistancesPatch}.
 */
export interface DistanceToOptions {
  color?: ColorSpec;
  diameter?: number;
  /** Override the auto-generated distance text. Pass `''` to hide the label. */
  customText?: string;
}

/** Resources the registry needs (lazy-imported by the page). */
export interface MeasurementsContext {
  plugin: PluginContext;
  molScript: MolScriptApi;
  colorModule: { Color: (hex: number) => unknown };
  /** Lazily-imported `StructureElement` helpers used to build atom loci. */
  structureElement: StructureElementApi;
}

/** What the registry exposes to `createScriptApi` in `helpers.ts`. */
export interface Measurements {
  /**
   * Apply an `hbonds` patch. First call computes backbone H-bonds within the
   * selection's residues; subsequent calls re-render with the merged style.
   */
  setHbonds: (
    selection: SelectionToken,
    pdb: ParsedPdb,
    patch: HbondsPatch,
  ) => Promise<void>;
  /** Apply a `distances` style patch (no new line — call `addDistanceTo`). */
  setDistances: (
    selection: SelectionToken,
    patch: DistancesPatch,
  ) => Promise<void>;
  /**
   * Add one distance line from `selection` to `other`. Style defaults to
   * the selection's current `distances` state (or sensible defaults).
   */
  addDistanceTo: (
    selection: SelectionToken,
    other: SelectionToken,
    options?: DistanceToOptions,
  ) => Promise<void>;
  /** Toggle visibility of every distance/hbond cell tied to `selection`. */
  setVisibility: (
    selection: SelectionToken,
    channel: 'distances' | 'hbonds',
    visible: boolean,
  ) => void;
  /** Drop every measurement this registry has added. */
  clearAll: () => Promise<void>;
}

interface ChannelState {
  color?: ColorSpec;
  diameter?: number;
  /** Refs to the StructureSelectionsDistance3D cells we created. */
  refs: string[];
}

const DEFAULT_HBOND_COLOR: ColorSpec = { value: 'yellow' };
const DEFAULT_HBOND_DIAMETER = 0.3;
const DEFAULT_DISTANCE_DIAMETER = 0.05;
const DEFAULT_HBOND_FALLBACK_HEX = 0xff_ff_00;

function channelKey(
  selection: SelectionToken,
  channel: 'distances' | 'hbonds',
): string {
  return `${selection.source}::${channel}`;
}

function atomToAst(atom: MolStarAtom): SelectionAst {
  return {
    kind: 'and',
    left: {
      kind: 'and',
      left: { kind: 'chain', chain: atom.chainId },
      right: { kind: 'residue', chain: atom.chainId, index: atom.resNum },
    },
    right: { kind: 'atomName', name: atom.name },
  };
}

function colorSpecToHex(spec: ColorSpec | undefined): number {
  if (!spec) return DEFAULT_HBOND_FALLBACK_HEX;
  if (typeof spec === 'string') {
    return parseCssColorToHex(spec) ?? DEFAULT_HBOND_FALLBACK_HEX;
  }
  if ('value' in spec) {
    return parseCssColorToHex(spec.value) ?? DEFAULT_HBOND_FALLBACK_HEX;
  }
  if ('color' in spec) return colorSpecToHex(spec.color);
  return DEFAULT_HBOND_FALLBACK_HEX;
}

/**
 * Build the measurements registry. Holds per-selection state across
 * channel calls and lets `helpers.ts` wipe everything from `clearAll`.
 * @param context - Plugin + Mol* helpers.
 * @returns The {@link Measurements} interface.
 */
export function createMeasurements(context: MeasurementsContext): Measurements {
  const states = new Map<string, ChannelState>();

  function ensureState(key: string): ChannelState {
    let state = states.get(key);
    if (!state) {
      state = { refs: [] };
      states.set(key, state);
    }
    return state;
  }

  async function selectionToLoci(ast: SelectionAst): Promise<unknown> {
    const structure =
      context.plugin.managers.structure.hierarchy.current.structures[0]?.cell
        .obj?.data;
    if (!structure) return null;
    const queryResult = context.molScript.Script.getStructureSelection(
      (builder) => compileSelection(ast, builder),
      structure,
    );
    return context.molScript.StructureSelection.toLociWithSourceUnits(
      queryResult,
    );
  }

  async function deleteRefs(refs: string[]): Promise<void> {
    if (refs.length === 0) return;
    const update = context.plugin.state.data.build();
    for (const ref of refs) {
      if (context.plugin.state.data.cells.has(ref)) {
        update.delete(ref);
      }
    }
    await update.commit();
  }

  async function addDistanceLine(
    a: SelectionAst,
    b: SelectionAst,
    style: { colorHex: number; diameter: number; customText: string },
  ): Promise<string | null> {
    const lociA = await selectionToLoci(a);
    const lociB = await selectionToLoci(b);
    if (!lociA || !lociB) return null;
    if (
      context.structureElement.Loci.isEmpty(lociA) ||
      context.structureElement.Loci.isEmpty(lociB)
    ) {
      return null;
    }
    const result =
      await context.plugin.managers.structure.measurement.addDistance(
        lociA,
        lociB,
        {
          customText: style.customText,
          reprTags: ['animate-measurement'],
          visualParams: {
            // eslint-disable-next-line new-cap -- Mol* `Color` factory
            linesColor: context.colorModule.Color(style.colorHex),
            linesSize: style.diameter,
            dashLength: 0.3,
          },
        },
      );
    return result?.representation?.ref ?? null;
  }

  async function setHbonds(
    selection: SelectionToken,
    pdb: ParsedPdb,
    patch: HbondsPatch,
  ): Promise<void> {
    const key = channelKey(selection, 'hbonds');
    const state = ensureState(key);
    if (patch.color !== undefined) state.color = patch.color;
    if (patch.diameter !== undefined) state.diameter = patch.diameter;

    const colorHex = colorSpecToHex(state.color ?? DEFAULT_HBOND_COLOR);
    const diameter = state.diameter ?? DEFAULT_HBOND_DIAMETER;

    await deleteRefs(state.refs);
    state.refs = [];

    const residueKeys = selectionResidueKeys(selection.__ast, pdb);
    const pairs = computeBackboneHBonds(pdb, residueKeys);
    for (const pair of pairs) {
      // eslint-disable-next-line no-await-in-loop -- sequential measurement state updates
      const ref = await addDistanceLine(
        atomToAst(pair.donor),
        atomToAst(pair.acceptor),
        { colorHex, diameter, customText: '' },
      );
      if (ref) state.refs.push(ref);
    }
  }

  async function setDistances(
    selection: SelectionToken,
    patch: DistancesPatch,
  ): Promise<void> {
    const key = channelKey(selection, 'distances');
    const state = ensureState(key);
    if (patch.color !== undefined) state.color = patch.color;
    if (patch.diameter !== undefined) state.diameter = patch.diameter;
  }

  async function addDistanceTo(
    selection: SelectionToken,
    other: SelectionToken,
    options?: DistanceToOptions,
  ): Promise<void> {
    const key = channelKey(selection, 'distances');
    const state = ensureState(key);
    const colorHex = colorSpecToHex(options?.color ?? state.color);
    const diameter =
      options?.diameter ?? state.diameter ?? DEFAULT_DISTANCE_DIAMETER;
    const customText = options?.customText ?? '';
    const ref = await addDistanceLine(selection.__ast, other.__ast, {
      colorHex,
      diameter,
      customText,
    });
    if (ref) state.refs.push(ref);
  }

  function setVisibility(
    selection: SelectionToken,
    channel: 'distances' | 'hbonds',
    visible: boolean,
  ): void {
    const state = states.get(channelKey(selection, channel));
    if (!state || state.refs.length === 0) return;
    for (const ref of state.refs) {
      if (!context.plugin.state.data.cells.has(ref)) continue;
      context.plugin.state.data.updateCellState(ref, { isHidden: !visible });
    }
  }

  async function clearAll(): Promise<void> {
    const refs: string[] = [];
    for (const state of states.values()) {
      refs.push(...state.refs);
    }
    states.clear();
    await deleteRefs(refs);
  }

  return {
    setHbonds,
    setDistances,
    addDistanceTo,
    setVisibility,
    clearAll,
  };
}
