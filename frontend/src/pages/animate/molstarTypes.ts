/**
 * Loosely-typed Mol* shapes used by the Animate page helpers. Keeping them
 * in a separate module avoids pulling Mol*'s heavy synchronous types into
 * the helper code path — Mol* itself is dynamically `import()`-ed.
 */

export interface PluginContext {
  builders: {
    structure: {
      tryCreateComponentFromExpression: (
        structureCell: unknown,
        expression: unknown,
        key: string,
        params?: { label?: string; tags?: string[] },
      ) => Promise<ComponentRef | undefined>;
      representation: {
        addRepresentation: (
          component: ComponentRef,
          params: Record<string, unknown>,
        ) => Promise<unknown>;
      };
    };
  };
  canvas3d?: { setProps: (props: Record<string, unknown>) => void };
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
        addDistance: (a: unknown, b: unknown) => Promise<void>;
        clear?: () => Promise<void>;
      };
    };
  };
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
