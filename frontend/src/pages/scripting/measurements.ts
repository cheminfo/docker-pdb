/**
 * Per-Selection registry for measurement-style overlays (`distances`,
 * `hbonds`, `contacts`). These don't fit the structure-component channel
 * model in `channels.ts` because Mol* renders them through dedicated
 * state-transformer pipelines:
 *
 *   - `distances`: Mol*'s built-in measurement manager (lines + Å labels)
 *   - `hbonds`: Mol*'s chemistry-aware `computeInteractions` is called on a
 *     sub-`Structure` derived from the selection's loci with
 *     `skipIntraContacts: false`; the resulting H-bond pairs are translated
 *     into `CustomInteractions` schemas and rendered by `InteractionsShape`
 *     → `ShapeRepresentation3D` as dashed cylinders. Reusing Mol*'s detector
 *     gives donor/acceptor typing, geometric constraints (Kabsch-Sander
 *     style scoring), and side-chain donors/acceptors for free.
 *   - `contacts`: chemistry-aware Mol* `ComputeContacts` between two
 *     selections → same shape pipeline; multi-kind (H-bond, hydrophobic,
 *     π-stacking, …)
 *
 * Channel state is keyed by `${selection.source}::<channel>`. Refs to the
 * Mol* cells are tracked so `hide()` / `show()` can toggle visibility and
 * `clearAll()` can drop everything.
 */

import type { ColorSpec } from './colorTheme.ts';
import { parseCssColorToHex } from './colorTheme.ts';
import type { SelectionToken } from './helpers.ts';
import type {
  Interactions,
  InteractionsApi,
  MolScriptApi,
  MolStructure,
  PluginContext,
  StructureElementApi,
} from './molstarTypes.ts';
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

/** Mol* `extensions/interactions` interaction kinds. */
export type InteractionKind =
  | 'hydrogen-bond'
  | 'weak-hydrogen-bond'
  | 'hydrophobic'
  | 'pi-stacking'
  | 'cation-pi'
  | 'halogen-bond'
  | 'ionic'
  | 'metal-coordination'
  | 'covalent'
  | 'unknown';

/**
 * Options for `selection.contactsWith(other, options?)`. The contact
 * detection runs Mol*'s chemistry-aware
 * `extensions/interactions/ComputeContacts` between the two selections.
 */
export interface ContactsOptions {
  /**
   * Which interaction kinds to render. Defaults to every chemistry kind
   * the extension produces. Pass e.g. `['hydrogen-bond']` to filter.
   */
  kinds?: InteractionKind[];
  /**
   * Cylinder radius (Mol* `radius`) used for every rendered interaction.
   * Defaults to the same value as the `hbonds` channel (`0.3`).
   */
  diameter?: number;
}

/** Resources the registry needs (lazy-imported by the page). */
export interface MeasurementsContext {
  plugin: PluginContext;
  molScript: MolScriptApi;
  colorModule: { Color: (hex: number) => unknown };
  /** Lazily-imported `StructureElement` helpers used to build loci/bundles. */
  structureElement: StructureElementApi;
  /** Lazily-imported transformers from the `extensions/interactions` extension. */
  interactions: InteractionsApi;
}

/** What the registry exposes to `createScriptApi` in `helpers.ts`. */
export interface Measurements {
  /**
   * Apply an `hbonds` patch. First call runs Mol*'s chemistry-aware
   * `computeInteractions` against a sub-`Structure` derived from the
   * selection (with `skipIntraContacts: false` so intra-chain H-bonds
   * are kept), translates the donor/acceptor pairs to Mol* schemas, and
   * renders them through `CustomInteractions` → `InteractionsShape` →
   * `ShapeRepresentation3D` as dashed cylinders. Subsequent calls
   * re-render with the merged style.
   */
  setHbonds: (selection: SelectionToken, patch: HbondsPatch) => Promise<void>;
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
  /**
   * Compute and render contacts between two selections using Mol*'s
   * chemistry-aware `extensions/interactions` pipeline (`ComputeContacts`
   * → `InteractionsShape` → `ShapeRepresentation3D`). Intended for
   * inter-molecular cases (e.g. ligand binding sites) where the two
   * selections cover disjoint atoms — the same workflow Mol*'s own
   * `interactions` example uses for receptor + ligand.
   */
  addContacts: (
    selection: SelectionToken,
    other: SelectionToken,
    options?: ContactsOptions,
  ) => Promise<void>;
  /** Toggle visibility of every cell tied to `selection` for a channel. */
  setVisibility: (
    selection: SelectionToken,
    channel: 'distances' | 'hbonds' | 'contacts',
    visible: boolean,
  ) => void;
  /**
   * Toggle visibility of every cell of the given kind across every
   * selection — used by the `ms.distances` / `ms.hbonds` / `ms.contacts`
   * aggregators.
   */
  setKindVisibility: (
    kind: 'distances' | 'hbonds' | 'contacts',
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
  channel: 'distances' | 'hbonds' | 'contacts',
): string {
  return `${selection.source}::${channel}`;
}

const ALL_INTERACTION_KINDS = [
  'hydrogen-bond',
  'weak-hydrogen-bond',
  'hydrophobic',
  'pi-stacking',
  'cation-pi',
  'halogen-bond',
  'ionic',
  'metal-coordination',
  'covalent',
  'unknown',
] as const;

/**
 * Walk Mol*'s `Interactions` result, pick out hydrogen-bond edges (both
 * inter-unit `contacts.edges` and intra-unit `unitsContacts.get(uId)`),
 * and translate each donor/acceptor pair into a
 * `CustomInteractions` schema keyed on the original loaded structure's
 * cell ref. Donor / acceptor are oriented by `FeatureType` so the
 * cylinder's "donor → acceptor" semantic is consistent.
 * @param subStructure - Mol* sub-structure that detection ran against.
 * @param interactions - Result of `computeInteractions`.
 * @param api - Lazy-imported Mol* helpers.
 * @param structureElement - Lazy-imported `StructureElement` helpers.
 * @param structureCellRef - Cell ref of the loaded full structure.
 * @returns Array of `CustomInteractions` schemas (one per H-bond pair).
 */
function collectHbondPairs(
  subStructure: MolStructure,
  interactions: Interactions,
  api: InteractionsApi,
  structureElement: StructureElementApi,
  structureCellRef: string,
): unknown[] {
  const pairs: unknown[] = [];

  function pushPair(
    donorUnitId: number,
    donorIndex: number,
    acceptorUnitId: number,
    acceptorIndex: number,
  ): void {
    const donorAtom = featureFirstAtom(
      subStructure,
      interactions,
      api,
      structureElement,
      donorUnitId,
      donorIndex,
    );
    const acceptorAtom = featureFirstAtom(
      subStructure,
      interactions,
      api,
      structureElement,
      acceptorUnitId,
      acceptorIndex,
    );
    if (!donorAtom || !acceptorAtom) return;
    pairs.push({
      kind: 'hydrogen-bond',
      aStructureRef: structureCellRef,
      a: donorAtom,
      bStructureRef: structureCellRef,
      b: acceptorAtom,
    });
  }

  function isDonor(featureType: number): boolean {
    return (
      featureType === api.FeatureType.HydrogenDonor ||
      featureType === api.FeatureType.WeakHydrogenDonor
    );
  }

  function featureType(unitId: number, featureIndex: number): number {
    const features = interactions.unitsFeatures.get(unitId);
    if (!features) return 0;
    return features.types[features.offsets[featureIndex] as number] as number;
  }

  function isHbondType(type: number): boolean {
    return (
      type === api.InteractionType.HydrogenBond ||
      type === api.InteractionType.WeakHydrogenBond
    );
  }

  for (const edge of interactions.contacts.edges) {
    if (edge.unitA > edge.unitB) continue;
    if (!isHbondType(edge.props.type)) continue;
    if (edge.props.flag !== 0) continue;
    const aDonor = isDonor(featureType(edge.unitA, edge.indexA));
    if (aDonor) {
      pushPair(edge.unitA, edge.indexA, edge.unitB, edge.indexB);
    } else {
      pushPair(edge.unitB, edge.indexB, edge.unitA, edge.indexA);
    }
  }

  for (const [unitId, intra] of interactions.unitsContacts) {
    for (let i = 0; i < intra.edgeCount; i++) {
      const aIdx = intra.a[i] as number;
      const bIdx = intra.b[i] as number;
      if (aIdx >= bIdx) continue;
      const type = intra.edgeProps.type[i] as number;
      const flag = intra.edgeProps.flag[i] as number;
      if (!isHbondType(type)) continue;
      if (flag !== 0) continue;
      const aDonor = isDonor(featureType(unitId, aIdx));
      if (aDonor) {
        pushPair(unitId, aIdx, unitId, bIdx);
      } else {
        pushPair(unitId, bIdx, unitId, aIdx);
      }
    }
  }

  return pairs;
}

/**
 * Resolve the first member atom of a Mol* `Feature` to an mmCIF schema
 * (`auth_asym_id`, `auth_seq_id`, `auth_atom_id`) we can pass to
 * `CustomInteractions`. Most H-bond donor/acceptor features cover one
 * atom (backbone N or O, side-chain Asn ND2, …); the few that span
 * several share a residue, so the first member is a fine pick.
 * @param structure - Mol* sub-`Structure` we ran detection on.
 * @param interactions - Result of `computeInteractions`.
 * @param api - Lazy-imported Mol* helpers.
 * @param structureElement - Lazy-imported `StructureElement` helpers.
 * @param unitId - Mol* unit id of the feature.
 * @param featureIndex - Feature index within the unit.
 * @returns mmCIF schema for the first atom in the feature, or `undefined`
 *   if the unit/feature can't be resolved (defensive).
 */
/* eslint-disable camelcase, @typescript-eslint/naming-convention -- Mol* mmCIF schema fields */
function featureFirstAtom(
  structure: MolStructure,
  interactions: Interactions,
  api: InteractionsApi,
  structureElement: StructureElementApi,
  unitId: number,
  featureIndex: number,
):
  | {
      auth_asym_id: string;
      auth_seq_id: number;
      auth_atom_id: string;
    }
  | undefined {
  const features = interactions.unitsFeatures.get(unitId);
  if (!features) return undefined;
  const memberIndex = features.members[
    features.offsets[featureIndex] as number
  ] as number;
  const unit = structure.unitMap.get(unitId);
  if (!unit) return undefined;
  const elementIndex = unit.elements[memberIndex] as number;
  const location = structureElement.Location.create(
    structure,
    unit,
    elementIndex,
  );
  return {
    auth_asym_id: api.StructureProperties.chain.auth_asym_id(location),
    auth_seq_id: api.StructureProperties.residue.auth_seq_id(location),
    auth_atom_id: api.StructureProperties.atom.auth_atom_id(location),
  };
}
/* eslint-enable camelcase, @typescript-eslint/naming-convention */

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
          reprTags: ['scripting-measurement'],
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

    const structureRef =
      context.plugin.managers.structure.hierarchy.current.structures[0];
    if (!structureRef) return;
    const structureCellRef = structureRef.cell.transform.ref;

    const loci = await selectionToLoci(selection.__ast);
    if (!loci || context.structureElement.Loci.isEmpty(loci)) return;
    // Sub-`Structure` from the selection's atoms — `computeInteractions`
    // runs on this so it sees H-bond pairs that live within the selection
    // (intra- and inter-unit), with `skipIntraContacts: false` flipping
    // the `ComputeContacts` wrapper's hardcoded restriction.
    const subStructure = context.structureElement.Loci.toStructure(
      loci,
    ) as MolStructure;

    const interactionsApi = context.interactions;
    const interactions = await context.plugin.runTask<Interactions>(
      interactionsApi.Task.create('Detect H-bonds', (ctx) =>
        interactionsApi.computeInteractions(
          { runtime: ctx, assetManager: new interactionsApi.AssetManager() },
          subStructure,
          {},
          { skipIntraContacts: false },
        ),
      ),
    );

    const customInteractions = collectHbondPairs(
      subStructure,
      interactions,
      interactionsApi,
      context.structureElement,
      structureCellRef,
    );
    if (customInteractions.length === 0) return;

    const update = context.plugin.state.data.build();
    const repr = update
      .toRoot()
      .apply(
        context.interactions.CustomInteractions,
        { interactions: customInteractions },
        {
          dependsOn: [structureCellRef],
          tags: ['scripting-measurement'],
        },
      )
      .apply(context.interactions.InteractionsShape, {
        kinds: ['hydrogen-bond'],
        styles: {
          'hydrogen-bond': {
            // eslint-disable-next-line new-cap -- Mol* `Color` factory
            color: context.colorModule.Color(colorHex),
            style: 'dashed',
            radius: diameter,
            showArrow: false,
            arrowOffset: 0,
          },
        },
      })
      .apply(context.interactions.ShapeRepresentation3D);

    await update.commit();
    state.refs = [repr.selector.ref];
  }

  async function addContacts(
    selection: SelectionToken,
    other: SelectionToken,
    options?: ContactsOptions,
  ): Promise<void> {
    const key = channelKey(selection, 'contacts');
    const state = ensureState(key);

    const lociA = await selectionToLoci(selection.__ast);
    const lociB = await selectionToLoci(other.__ast);
    if (!lociA || !lociB) return;
    if (
      context.structureElement.Loci.isEmpty(lociA) ||
      context.structureElement.Loci.isEmpty(lociB)
    ) {
      return;
    }

    const structureRef =
      context.plugin.managers.structure.hierarchy.current.structures[0];
    if (!structureRef) return;
    const structureCellRef = structureRef.cell.transform.ref;

    const bundleA = context.structureElement.Bundle.fromLoci(lociA);
    const bundleB = context.structureElement.Bundle.fromLoci(lociB);

    const kinds = options?.kinds ?? [...ALL_INTERACTION_KINDS];
    const radius = options?.diameter ?? DEFAULT_HBOND_DIAMETER;

    // Force a uniform "yellow dashed cylinder, no arrow" style for every
    // requested kind — matches `setHbonds` and matches what the scripting
    // API documents ("hbonds in yellow hash cylinders"). Without an
    // explicit `styles` map, `InteractionsShape` falls back to Mol*'s
    // built-in defaults, which include grey-ish donor→acceptor arrows
    // (showArrow: true) that read as out-of-place black wedges over a
    // faded protein cartoon.
    const styles: Record<string, unknown> = {};
    for (const kind of kinds) {
      styles[kind] = {
        // eslint-disable-next-line new-cap -- Mol* `Color` factory
        color: context.colorModule.Color(DEFAULT_HBOND_FALLBACK_HEX),
        style: 'dashed',
        radius,
        showArrow: false,
        arrowOffset: 0,
      };
    }

    const update = context.plugin.state.data.build();
    const repr = update
      .toRoot()
      .apply(
        context.interactions.MultiStructureSelectionFromBundle,
        {
          selections: [
            { key: 'a', groupId: 'a', ref: structureCellRef, bundle: bundleA },
            { key: 'b', groupId: 'b', ref: structureCellRef, bundle: bundleB },
          ],
          isTransitive: true,
          label: `contacts:${selection.source}-${other.source}`,
        },
        {
          dependsOn: [structureCellRef],
          tags: ['scripting-measurement'],
        },
      )
      .apply(context.interactions.ComputeContacts)
      .apply(context.interactions.InteractionsShape, { kinds, styles })
      .apply(context.interactions.ShapeRepresentation3D);

    await update.commit();
    state.refs.push(repr.selector.ref);
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
    channel: 'distances' | 'hbonds' | 'contacts',
    visible: boolean,
  ): void {
    const state = states.get(channelKey(selection, channel));
    if (!state || state.refs.length === 0) return;
    for (const ref of state.refs) {
      if (!context.plugin.state.data.cells.has(ref)) continue;
      context.plugin.state.data.updateCellState(ref, { isHidden: !visible });
    }
  }

  function setKindVisibility(
    kind: 'distances' | 'hbonds' | 'contacts',
    visible: boolean,
  ): void {
    const suffix = `::${kind}`;
    for (const [key, state] of states) {
      if (!key.endsWith(suffix)) continue;
      for (const ref of state.refs) {
        if (!context.plugin.state.data.cells.has(ref)) continue;
        context.plugin.state.data.updateCellState(ref, { isHidden: !visible });
      }
    }
  }

  async function clearAll(): Promise<void> {
    // Each Run instantiates a fresh measurements registry, so refs created
    // by a previous Run aren't in `states`. Scan the live state tree by tag
    // so the H-bond / contacts / distance cylinders from the previous Run
    // get deleted too, not just the ones this registry has tracked.
    const refs = new Set<string>();
    for (const state of states.values()) {
      for (const ref of state.refs) refs.add(ref);
    }
    for (const cell of context.plugin.state.data.cells.values()) {
      if (cell.transform.tags?.includes('scripting-measurement')) {
        refs.add(cell.transform.ref);
      }
    }
    states.clear();
    await deleteRefs([...refs]);
  }

  return {
    setHbonds,
    setDistances,
    addDistanceTo,
    addContacts,
    setVisibility,
    setKindVisibility,
    clearAll,
  };
}
