/**
 * Loosely-typed Mol* shapes used by the Scripting page helpers. Keeping them
 * in a separate module avoids pulling Mol*'s heavy synchronous types into
 * the helper code path — Mol* itself is dynamically `import()`-ed.
 */

export interface PluginContext {
  builders: {
    data: {
      rawData: (params: { data: string }) => Promise<unknown>;
    };
    structure: {
      tryCreateComponentFromExpression: (
        structureCell: unknown,
        expression: unknown,
        key: string,
        params?: { label?: string; tags?: string[] },
      ) => Promise<ComponentRef | undefined>;
      parseTrajectory: (data: unknown, format: 'pdb') => Promise<unknown>;
      /**
       * Manual model creation — used by the synthetic-PDB swap path so we
       * can skip `applyPreset` entirely (avoiding the auto-preset's
       * distance-based bond inference, which produces spurious dashes on
       * a Cα-only structure where many atoms cluster within 1 Å).
       */
      createModel: (trajectory: unknown) => Promise<unknown>;
      createStructure: (
        model: unknown,
        params?: Record<string, unknown>,
      ) => Promise<unknown>;
      hierarchy: {
        applyPreset: (
          trajectory: unknown,
          preset: 'default',
          params: Record<string, unknown>,
        ) => Promise<unknown>;
      };
      representation: {
        addRepresentation: (
          component: ComponentRef,
          params: Record<string, unknown>,
        ) => Promise<unknown>;
      };
    };
  };
  /** Reset Mol*'s plugin state — drops every loaded structure/representation. */
  clear: () => Promise<void>;
  /** Run a Mol* `Task` to completion and resolve to its result. */
  runTask: <T>(task: unknown) => Promise<T>;
  canvas3d?: { setProps: (props: Record<string, unknown>) => void };
  /**
   * State data tree handle — used by `measurements.ts` to delete or hide
   * measurement cells that the channel system doesn't manage.
   */
  state: {
    data: {
      cells: {
        has: (ref: string) => boolean;
        values: () => Iterable<{
          transform: { ref: string; tags?: readonly string[] };
        }>;
      };
      build: () => StateBuilder;
      updateCellState: (ref: string, partial: { isHidden?: boolean }) => void;
    };
  };
  managers: {
    camera: {
      reset: (snapshot?: unknown, durationMs?: number) => void;
      focusLoci: (
        loci: unknown,
        options?: {
          extraRadius?: number;
          minRadius?: number;
          durationMs?: number;
        },
      ) => void;
    };
    structure: {
      hierarchy: {
        current: { structures: StructureRef[] };
        remove: (components: ComponentRef[]) => Promise<void>;
        toggleVisibility: (
          components: ComponentRef[],
          action?: 'show' | 'hide',
        ) => void;
      };
      component: {
        updateRepresentationsTheme: (
          components: readonly ComponentRef[],
          paramsOrProvider:
            | RepresentationThemeUpdate
            | ((
                component: ComponentRef,
                representation: RepresentationRef,
              ) => RepresentationThemeUpdate),
        ) => Promise<unknown> | undefined;
      };
      selection: {
        fromLoci: (modifier: 'set' | 'add' | 'remove', loci: unknown) => void;
        clear: () => void;
      };
      measurement: {
        addDistance: (
          a: unknown,
          b: unknown,
          options?: {
            customText?: string;
            reprTags?: string | string[];
            visualParams?: Record<string, unknown>;
          },
        ) => Promise<
          | {
              representation?: { ref: string };
              selection?: { ref: string };
            }
          | undefined
        >;
        clear?: () => Promise<void>;
      };
    };
  };
}

/** Subset of Mol*'s `StateBuilder` we lean on for measurement removal. */
export interface StateBuilder {
  delete: (ref: string) => StateBuilder;
  /** Begin a chain at the state-tree root; used for transformer pipelines. */
  toRoot: () => StateBuilderChain;
  commit: () => Promise<void>;
}

/**
 * A node in a `StateBuilder` chain. `apply(transformer, params, options?)`
 * adds a child transform and returns a chain pointing at the new node;
 * `selector` then exposes the resulting cell `ref`.
 */
export interface StateBuilderChain {
  apply: (
    transformer: unknown,
    params?: Record<string, unknown>,
    options?: { dependsOn?: string[]; tags?: string | string[] },
  ) => StateBuilderChain;
  selector: { ref: string };
}

export interface StructureRef {
  cell: {
    obj?: { data: unknown };
    transform: { ref: string };
  };
  components: ComponentRef[];
}

export interface ComponentRef {
  cell: { transform: { tags?: string[] } };
  representations?: RepresentationRef[];
}

/** Subset of Mol*'s `StructureRepresentationRef` used by load-default themes. */
export interface RepresentationRef {
  cell: { transform: { tags?: string[] } };
}

/**
 * Subset of Mol*'s `StructureComponentManager.UpdateThemeParams` we need —
 * only the color side, since the load defaults never touch sizes. Pass
 * `'default'` to revert to Mol*'s built-in pick for the representation type.
 */
export interface RepresentationThemeUpdate {
  color?: string | 'default';
  colorParams?: Record<string, unknown>;
}

/** Subset of `molstar/lib/mol-model/loci` used by `selection.zoom(...)`. */
export interface LociHelpers {
  getBoundingSphere: (
    loci: unknown,
  ) => { radius: number; center: [number, number, number] } | undefined;
}

/**
 * Subset of `molstar/lib/mol-model/structure` `StructureElement` we lean on
 * to validate loci, build `Bundle` objects for the interactions extension,
 * derive sub-`Structure`s from a loci so we can run the chemistry-aware
 * H-bond detector against just the selected atoms, and resolve atom
 * positions back into mmCIF identifiers.
 */
export interface StructureElementApi {
  Loci: {
    isEmpty: (loci: unknown) => boolean;
    /**
     * Build a fresh `Structure` containing only the atoms covered by `loci`.
     * Used so `computeInteractions` runs on the selection's atoms instead
     * of the whole loaded PDB.
     */
    toStructure: (loci: unknown) => unknown;
  };
  Bundle: {
    fromLoci: (loci: unknown) => unknown;
  };
  Location: {
    /** Create a reusable `StructureElement.Location` for property reads. */
    create: (structure: unknown, unit: unknown, element: number) => unknown;
  };
}

/**
 * Subset of `StructureProperties` accessors used to read mmCIF fields.
 * Method names mirror the mmCIF tokens, hence the lint suppression.
 */
/* eslint-disable @typescript-eslint/naming-convention -- Mol* mmCIF accessor names */
export interface StructurePropertiesApi {
  chain: { auth_asym_id: (location: unknown) => string };
  residue: { auth_seq_id: (location: unknown) => number };
  atom: { auth_atom_id: (location: unknown) => string };
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Mol* H-bond donor/acceptor feature types used to direct the
 * `CustomInteractions` schema (donor → acceptor) consistently.
 */
export interface FeatureTypeEnum {
  HydrogenDonor: number;
  HydrogenAcceptor: number;
  WeakHydrogenDonor: number;
}

/** Mol* interaction-type enum values used to filter contact edges. */
export interface InteractionTypeEnum {
  HydrogenBond: number;
  WeakHydrogenBond: number;
}

/** Subset of Mol*'s `Task` namespace we use to call `computeInteractions`. */
export interface TaskApi {
  create: <T>(name: string, fn: (ctx: unknown) => Promise<T>) => unknown;
}

/** Constructor type for Mol*'s `AssetManager` (passed to `computeInteractions`). */
export type AssetManagerConstructor = new () => unknown;

/**
 * Loose shape of Mol*'s `Interactions` object returned by
 * `computeInteractions`. We walk `contacts.edges` (inter-unit) and
 * `unitsContacts.get(unitId)` (intra-unit) and map features to atoms via
 * `unitsFeatures.get(unitId)`.
 */
export interface Interactions {
  unitsFeatures: {
    get: (unitId: number) =>
      | {
          offsets: ArrayLike<number>;
          members: ArrayLike<number>;
          types: ArrayLike<number>;
        }
      | undefined;
  };
  unitsContacts: Iterable<
    [
      number,
      {
        edgeCount: number;
        a: ArrayLike<number>;
        b: ArrayLike<number>;
        edgeProps: {
          type: ArrayLike<number>;
          flag: ArrayLike<number>;
        };
      },
    ]
  >;
  contacts: {
    edges: ReadonlyArray<{
      unitA: number;
      unitB: number;
      indexA: number;
      indexB: number;
      props: { type: number; flag: number };
    }>;
  };
}

/**
 * Mol* `Structure` with the helpers we need (`unitMap` to resolve a unit
 * id to its `Unit` object, which carries the `elements` array).
 */
export interface MolStructure {
  unitMap: { get: (unitId: number) => MolUnit | undefined };
}

/** Subset of Mol*'s `Unit` we touch — the per-element atom-index lookup. */
export interface MolUnit {
  elements: ArrayLike<number>;
}

/**
 * State transformers from `mol-plugin-state` and the
 * `extensions/interactions` extension. Lazy-imported by the page so the
 * bundle doesn't pay the cost on first paint.
 *
 * Two pipelines are exposed:
 *
 *   - `CustomInteractions` → `InteractionsShape` → `ShapeRepresentation3D`:
 *     render a user-supplied list of donor/acceptor pairs as Mol*-styled
 *     cylinders (used by `selection.hbonds` for intra-molecular H-bonds
 *     where the JS heuristic detects the pairs and Mol* draws them).
 *   - `MultiStructureSelectionFromBundle` → `ComputeContacts` →
 *     `InteractionsShape` → `ShapeRepresentation3D`: chemistry-aware
 *     inter-group contact detection (used by `selection.contactsWith(other)`
 *     for ligand/binding-site interactions).
 *
 * Values are opaque transformer objects we only ever hand to
 * `plugin.state.data.build().apply(transformer, params)` — typing them
 * loosely keeps this module from pulling Mol*'s state-tree types.
 */
export interface InteractionsApi {
  MultiStructureSelectionFromBundle: unknown;
  ComputeContacts: unknown;
  CustomInteractions: unknown;
  InteractionsShape: unknown;
  ShapeRepresentation3D: unknown;

  /**
   * Mol*'s low-level chemistry-aware contact detector — the engine
   * underneath `ComputeContacts`. We call it with `skipIntraContacts:
   * false` so it sees H-bonds inside a single chain (the wrapper
   * transformer hardcodes `true`).
   */
  computeInteractions: (
    ctx: { runtime: unknown; assetManager: unknown },
    structure: unknown,
    props: Record<string, unknown>,
    options?: { skipIntraContacts?: boolean },
  ) => Promise<Interactions>;
  AssetManager: AssetManagerConstructor;
  Task: TaskApi;
  InteractionType: InteractionTypeEnum;
  FeatureType: FeatureTypeEnum;
  StructureProperties: StructurePropertiesApi;
}

/**
 * Lazily-loaded entry points from `shapes.ts` and `textShape.ts`. The
 * modules are dynamically imported by `ScriptingPage.tsx` so their Mol*
 * deps stay out of the main bundle. The fields are typed loosely:
 * `addShape` / `addTextShape` are the functions as exported, and the
 * rest are forwarded as `unknown` since we only hand them to
 * `state.data.build().apply(...)`.
 */
export interface ShapesApi {
  /**
   * Add a list of shape primitives (cylinder / arrow / sphere) to the
   * plugin state tree. Returns the ref of the resulting representation
   * cell. See `shapes.ts`.
   */
  addShape: (
    plugin: unknown,
    primitives: unknown[],
    shapeRepresentation3D: unknown,
    options?: { label?: string; tags?: string[] },
  ) => Promise<string>;
  /**
   * Add a list of free-floating text labels to the plugin state tree
   * via Mol*'s `Text` geometry pipeline. See `textShape.ts`.
   */
  addTextShape: (
    plugin: unknown,
    primitives: unknown[],
    shapeRepresentation3D: unknown,
    options?: { label?: string; tags?: string[] },
  ) => Promise<string>;
}

export interface MolScriptApi {
  Script: {
    getStructureSelection: (
      build: (builder: unknown) => unknown,
      structure: unknown,
    ) => unknown;
  };
  StructureSelection: {
    toLociWithSourceUnits: (selection: unknown) => unknown;
  };
  /** Mol*'s `MolScriptBuilder` instance. Pass to `compileSelection`. */
  builder: unknown;
}
