/**
 * Named-model registry for the Animate scripting API. A `Model` bundles a
 * PDB text and an ordered op log; switching tears down current Mol*
 * representations, reloads the structure when the PDB differs, then replays
 * the op log against the channel system. The replay path bypasses the
 * recording wrappers in `helpers.ts`, so ops are not double-recorded.
 *
 * Every model swap kicks a CSS-driven blink on the viewer container via
 * `setSwapping(true/false)`, masking the brief moment Mol* is in an
 * inconsistent state.
 */

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
    };

interface Model {
  pdb: string;
  ops: Op[];
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
}

export interface ModelRegistry {
  ensureInitial: (text: string) => void;
  createModel: (name: string, options?: { pdb?: string }) => Promise<void>;
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
      default: {
        const exhaustive: never = op;
        throw new Error(
          `Unknown op kind: ${(exhaustive as { kind: string }).kind}`,
        );
      }
    }
  }

  async function teardownAnimate(): Promise<void> {
    const structureRef =
      deps.plugin.managers.structure.hierarchy.current.structures[0];
    if (structureRef) {
      const components = structureRef.components.filter((component) =>
        component.cell.transform.tags?.includes('animate'),
      );
      if (components.length > 0) {
        await deps.plugin.managers.structure.hierarchy.remove(components);
      }
    }
    deps.channels.resetState();
  }

  async function loadInMolstar(pdbText: string): Promise<void> {
    await deps.plugin.clear();
    const data = await deps.plugin.builders.data.rawData({ data: pdbText });
    const trajectory = await deps.plugin.builders.structure.parseTrajectory(
      data,
      'pdb',
    );
    await deps.plugin.builders.structure.hierarchy.applyPreset(
      trajectory,
      'default',
      {
        representationPreset: 'auto',
        representationPresetParams: { theme: { globalName: 'chain-id' } },
      },
    );
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
        await teardownAnimate();
      }
      for (const op of model.ops) {
        // eslint-disable-next-line no-await-in-loop -- replay must be sequential
        await dispatch(op);
      }
      active = name;
    } finally {
      setTimeout(() => deps.setSwapping(false), BLINK_HOLD_MS);
    }
  }

  return {
    ensureInitial(text) {
      if (!models.has(INITIAL)) {
        models.set(INITIAL, { pdb: text, ops: [] });
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
      const parent = requireModel(active);
      models.set(name, {
        pdb: options?.pdb ?? parent.pdb,
        ops: parent.ops.slice(),
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
      await teardownAnimate();
      if (active !== null) {
        const model = models.get(active);
        if (model) model.ops = [];
      }
    },
    async resetToOriginal(originalPdb) {
      if (deps.loadedPdbRef.current === originalPdb) return;
      deps.setSwapping(true);
      try {
        await loadInMolstar(originalPdb);
      } finally {
        setTimeout(() => deps.setSwapping(false), BLINK_HOLD_MS);
      }
    },
  };
}
