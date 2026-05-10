/**
 * Loosely-typed Mol* shapes used by the Animate page helpers. Keeping them
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
  canvas3d?: { setProps: (props: Record<string, unknown>) => void };
  /**
   * State data tree handle — used by `measurements.ts` to delete or hide
   * measurement cells that the channel system doesn't manage.
   */
  state: {
    data: {
      cells: { has: (ref: string) => boolean };
      build: () => StateBuilder;
      updateCellState: (ref: string, partial: { isHidden?: boolean }) => void;
    };
  };
  managers: {
    camera: {
      reset: () => void;
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
  commit: () => Promise<void>;
}

export interface StructureRef {
  cell: { obj?: { data: unknown } };
  components: ComponentRef[];
}

export interface ComponentRef {
  cell: { transform: { tags?: string[] } };
}

/** Subset of `molstar/lib/mol-model/loci` used by `selection.zoom(...)`. */
export interface LociHelpers {
  getBoundingSphere: (
    loci: unknown,
  ) => { radius: number; center: [number, number, number] } | undefined;
}

/**
 * Subset of `molstar/lib/mol-model/structure` `StructureElement` we lean on
 * to validate that a generated atom selection actually matched anything
 * before handing the loci to `measurement.addDistance`.
 */
export interface StructureElementApi {
  Loci: {
    isEmpty: (loci: unknown) => boolean;
  };
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
