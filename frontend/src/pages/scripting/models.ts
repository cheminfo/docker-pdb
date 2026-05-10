/**
 * Named-model registry for the scripting API. A `Model` bundles a
 * PDB text and an ordered op log; switching tears down current Mol*
 * representations, reloads the structure when the PDB differs, then replays
 * the op log against the channel system. The replay path bypasses the
 * recording wrappers in `helpers.ts`, so ops are not double-recorded.
 *
 * Every model swap kicks a CSS-driven blink on the viewer container via
 * `setSwapping(true/false)`, masking the brief moment Mol* is in an
 * inconsistent state.
 */

import { applyScriptingLoadDefaults } from './applyLoadDefaults.ts';
import type {
  AtomsPatch,
  BondsPatch,
  ChannelKey,
  Channels,
  RibbonPatch,
  SurfacePatch,
} from './channels.ts';
import type { SelectionToken } from './helpers.ts';
import type { PluginContext } from './molstarTypes.ts';

/** A single recordable mutation. Camera / overlay ops are not recorded. */
export type Op =
  | { kind: 'setAtoms'; selection: SelectionToken; patch: AtomsPatch }
  | { kind: 'setBonds'; selection: SelectionToken; patch: BondsPatch }
  | { kind: 'setRibbon'; selection: SelectionToken; patch: RibbonPatch }
  | { kind: 'setSurface'; selection: SelectionToken; patch: SurfacePatch }
  | { kind: 'label'; selection: SelectionToken; template: string }
  | {
      kind: 'channelVisibility';
      selection: SelectionToken;
      channel: ChannelKey;
      visible: boolean;
    }
  | {
      kind: 'selectionVisibility';
      selection: SelectionToken;
      visible: boolean;
    }
  | {
      kind: 'distance';
      selection1: SelectionToken;
      selection2: SelectionToken;
    }
  | {
      /**
       * One shape primitive added via `ms.arrow(...)` / `ms.cylinder(...)` /
       * `ms.sphere(...)`. The full primitive (already resolved to a Mol*
       * `ShapePrimitive` with hex color etc.) is captured so replay can
       * reconstruct the shape verbatim.
       */
      kind: 'shape';
      primitive: unknown;
    };

/** Mol* camera projection — `'orthographic'` removes perspective foreshortening. */
export type CameraMode = 'perspective' | 'orthographic';

interface Model {
  pdb: string;
  ops: Op[];
  /** Camera projection re-applied every time this model becomes active. */
  cameraMode: CameraMode;
}

export interface ModelDeps {
  plugin: PluginContext;
  channels: Channels;
  /** Mutable handle to the PDB text currently loaded in Mol*. */
  loadedPdbRef: { current: string };
  /** Toggle the viewer-blink CSS class around a swap. */
  setSwapping: (swapping: boolean) => void;
  /** Reset measurements / selections / overlays on a structural reload. */
  resetTransients: () => Promise<void>;
  /**
   * Distance helper that calls Mol* directly (no op recording). Used during
   * replay so previously-recorded `distance` ops don't loop back through the
   * recording wrapper in `helpers.ts`.
   */
  rawDistance: (sel1: SelectionToken, sel2: SelectionToken) => Promise<void>;
  /**
   * Shape helper that calls Mol* directly (no op recording). Receives the
   * already-resolved `ShapePrimitive` (hex color, numeric radius, etc.) so
   * replay can reconstruct the shape verbatim from the op log.
   */
  rawAddShape: (primitive: unknown) => Promise<void>;
}

/** Options accepted by `createModel`. */
export interface CreateModelOptions {
  /** Override the PDB text Mol* loads for this model. */
  pdb?: string;
  /**
   * Camera projection used while this model is active. `'orthographic'`
   * gives parallel projection — atoms render at the same on-screen size
   * regardless of depth, which is the natural mode for the Ramachandran
   * dihedral cube. Defaults to `'perspective'` (Mol*'s standard).
   */
  camera?: CameraMode;
}

export interface ModelRegistry {
  ensureInitial: (text: string) => void;
  createModel: (name: string, options?: CreateModelOptions) => Promise<void>;
  switchModel: (name: string) => Promise<void>;
  currentModel: () => string;
  deleteModel: (name: string) => void;
  listModels: () => string[];
  recordOp: (op: Op) => void;
  /** Clear the active model's ops + Mol* representations (leaves PDB loaded). */
  clearActive: () => Promise<void>;
  /**
   * Ensure Mol* is showing the original PDB text — used at the start of every
   * Run to undo a leftover swap from a previous run.
   */
  resetToOriginal: (originalPdb: string) => Promise<void>;
}

const INITIAL = 'initial';
const BLINK_HOLD_MS = 240;

/**
 * Build a model registry that records, replays, and switches models.
 * @param deps - Mol* plugin, channel facade, and side-effect callbacks.
 * @returns The registry object exposed to scripts via `helpers.ts`.
 */
export function createModelRegistry(deps: ModelDeps): ModelRegistry {
  const models = new Map<string, Model>();
  let active: string | null = null;

  function requireModel(name: string): Model {
    const model = models.get(name);
    if (!model) throw new Error(`Unknown model: '${name}'`);
    return model;
  }

  async function dispatch(op: Op): Promise<void> {
    switch (op.kind) {
      case 'setAtoms':
        await deps.channels.setAtoms(op.selection, op.patch);
        return;
      case 'setBonds':
        await deps.channels.setBonds(op.selection, op.patch);
        return;
      case 'setRibbon':
        await deps.channels.setRibbon(op.selection, op.patch);
        return;
      case 'setSurface':
        await deps.channels.setSurface(op.selection, op.patch);
        return;
      case 'label':
        await deps.channels.label(op.selection, op.template);
        return;
      case 'channelVisibility':
        deps.channels.setChannelVisibility(
          op.selection,
          op.channel,
          op.visible,
        );
        return;
      case 'selectionVisibility':
        deps.channels.setSelectionVisibility(op.selection, op.visible);
        return;
      case 'distance':
        await deps.rawDistance(op.selection1, op.selection2);
        return;
      case 'shape':
        await deps.rawAddShape(op.primitive);
        return;
      default: {
        const exhaustive: never = op;
        throw new Error(
          `Unknown op kind: ${(exhaustive as { kind: string }).kind}`,
        );
      }
    }
  }

  async function teardownScripting(): Promise<void> {
    const structureRef =
      deps.plugin.managers.structure.hierarchy.current.structures[0];
    if (structureRef) {
      const components = structureRef.components.filter((component) =>
        component.cell.transform.tags?.includes('scripting'),
      );
      if (components.length > 0) {
        await deps.plugin.managers.structure.hierarchy.remove(components);
      }
    }
    deps.channels.resetState();
  }

  async function loadInMolstar(
    pdbText: string,
    options: { withDefaults?: boolean } = {},
  ): Promise<void> {
    await deps.plugin.clear();
    const data = await deps.plugin.builders.data.rawData({ data: pdbText });
    const trajectory = await deps.plugin.builders.structure.parseTrajectory(
      data,
      'pdb',
    );
    if (options.withDefaults) {
      // Original-PDB load: keep `applyPreset('auto')` + `applyScriptingLoadDefaults`
      // so the user sees the same baseline as on first mount.
      await deps.plugin.builders.structure.hierarchy.applyPreset(
        trajectory,
        'default',
        {
          representationPreset: 'auto',
          representationPresetParams: { theme: { globalName: 'chain-id' } },
        },
      );
      await applyScriptingLoadDefaults(deps.plugin);
    } else {
      // Synthetic-PDB load (model swap): skip `applyPreset` entirely —
      // create only the model + structure nodes so the canvas starts
      // truly empty. Mol*'s `'auto'` preset will otherwise infer
      // distance-based covalent bonds on a Cα-only structure (many
      // residues cluster within 1 Å in dihedral coordinates) and render
      // hundreds of phantom dashes that survive component teardown.
      const model =
        await deps.plugin.builders.structure.createModel(trajectory);
      await deps.plugin.builders.structure.createStructure(model);
    }
    deps.loadedPdbRef.current = pdbText;
    deps.channels.resetState();
  }

  async function applyModel(name: string): Promise<void> {
    const model = requireModel(name);
    const needsStructureReload = deps.loadedPdbRef.current !== model.pdb;
    deps.setSwapping(true);
    try {
      await deps.resetTransients();
      if (needsStructureReload) {
        await loadInMolstar(model.pdb);
      } else {
        await teardownScripting();
      }
      for (const op of model.ops) {
        // eslint-disable-next-line no-await-in-loop -- replay must be sequential
        await dispatch(op);
      }
      // Apply the model's camera projection. `'orthographic'` removes
      // perspective foreshortening — atoms render at the same on-screen
      // size regardless of depth.
      deps.plugin.canvas3d?.setProps({
        camera: { mode: model.cameraMode },
      });
      active = name;
    } finally {
      setTimeout(() => deps.setSwapping(false), BLINK_HOLD_MS);
    }
  }

  return {
    ensureInitial(text) {
      if (!models.has(INITIAL)) {
        models.set(INITIAL, { pdb: text, ops: [], cameraMode: 'perspective' });
      }
      if (active === null) active = INITIAL;
    },
    async createModel(name, options) {
      if (active === null) {
        throw new Error('createModel called before loadPDB');
      }
      if (models.has(name)) {
        throw new Error(`Model already exists: '${name}'`);
      }
      // A new model always starts with an empty op log. The parent's PDB is
      // inherited unless `options.pdb` overrides it, but inheriting ops is
      // intentionally NOT the default: ops were recorded against the
      // parent's structure and rarely make sense on a fresh PDB. Scripts
      // re-paint the new model explicitly — that's also what makes the
      // intent of each model self-evident from the script.
      const parent = requireModel(active);
      models.set(name, {
        pdb: options?.pdb ?? parent.pdb,
        ops: [],
        cameraMode: options?.camera ?? parent.cameraMode,
      });
      await applyModel(name);
    },
    async switchModel(name) {
      if (!models.has(name)) {
        throw new Error(`Unknown model: '${name}'`);
      }
      if (name === active) return;
      await applyModel(name);
    },
    currentModel() {
      return active ?? INITIAL;
    },
    deleteModel(name) {
      if (name === INITIAL) {
        throw new Error("Cannot delete the 'initial' model");
      }
      if (!models.has(name)) {
        throw new Error(`Unknown model: '${name}'`);
      }
      if (name === active) {
        throw new Error(
          `Cannot delete the active model '${name}' — switch first`,
        );
      }
      models.delete(name);
    },
    listModels() {
      return [...models.keys()];
    },
    recordOp(op) {
      if (active === null) return;
      const model = models.get(active);
      if (model) model.ops.push(op);
    },
    async clearActive() {
      await teardownScripting();
      if (active !== null) {
        const model = models.get(active);
        if (model) model.ops = [];
      }
    },
    async resetToOriginal(originalPdb) {
      if (deps.loadedPdbRef.current === originalPdb) return;
      deps.setSwapping(true);
      try {
        await loadInMolstar(originalPdb, { withDefaults: true });
      } finally {
        setTimeout(() => deps.setSwapping(false), BLINK_HOLD_MS);
      }
    },
  };
}
