/**
 * Channel-based renderer for the Animate scripting API. Each Selection has
 * four representation channels (`atoms`, `bonds`, `ribbon`, `surface`) plus
 * a `label` overlay. Each channel keeps its own merged-params state, so
 * successive calls — `bonds.diameter(0.4)` then `bonds.color({...})` — build
 * up a single Mol* representation rather than stacking duplicates.
 *
 * State is keyed by `${selection.source}::${channel}`. Re-using the same
 * source string (typical: storing `pdb.select('PLP')` once and calling its
 * channels multiple times) updates the existing component in place.
 */

import type { ColorSpec } from './colorTheme.ts';
import { buildColorParams } from './colorTheme.ts';
import type { SelectionToken } from './helpers.ts';
import type {
  ComponentRef,
  MolScriptApi,
  PluginContext,
} from './molstarTypes.ts';
import { compileSelection } from './selectionCompiler.ts';

export interface AtomsPatch {
  color?: ColorSpec;
  /** Sphere size factor — multiplier on Van der Waals radii. */
  radius?: number;
}

export interface BondsPatch {
  color?: ColorSpec;
  /** Bond cylinder size factor. */
  diameter?: number;
}

export interface RibbonPatch {
  color?: ColorSpec;
}

export interface SurfacePatch {
  color?: ColorSpec;
  /** Switch to dotted Gaussian surface (falsy = solid molecular surface). */
  dots?: boolean;
}

/**
 * Renderer dependencies shared across channel ops. Lazy-loaded by the page.
 */
export interface ChannelContext {
  plugin: PluginContext;
  molScript: MolScriptApi;
  colorModule: { Color: (hex: number) => unknown };
}

/** All channel-like keys (channels + label) used for whole-selection ops. */
export type ChannelKey = 'atoms' | 'bonds' | 'ribbon' | 'surface' | 'label';

/**
 * Channel facade returned by {@link createChannels}. The `set*` calls merge
 * `patch` into existing per-(selection, channel) state and recreate the Mol*
 * representation; `resetState` is called by the script-api `clear()`.
 */
export interface Channels {
  setAtoms: (selection: SelectionToken, patch: AtomsPatch) => Promise<void>;
  setBonds: (selection: SelectionToken, patch: BondsPatch) => Promise<void>;
  setRibbon: (selection: SelectionToken, patch: RibbonPatch) => Promise<void>;
  setSurface: (selection: SelectionToken, patch: SurfacePatch) => Promise<void>;
  label: (selection: SelectionToken, template: string) => Promise<void>;
  /**
   * Toggle visibility of a single channel for `selection`. No-op if the
   * channel hasn't been created yet (call `.color()` / `.radius()` / etc.
   * first).
   */
  setChannelVisibility: (
    selection: SelectionToken,
    channel: ChannelKey,
    visible: boolean,
  ) => void;
  /** Toggle visibility of every channel that has been created for `selection`. */
  setSelectionVisibility: (selection: SelectionToken, visible: boolean) => void;
  resetState: () => void;
}

interface ChannelState {
  reprType: string;
  componentRef?: ComponentRef;
  color?: ColorSpec;
  sizeFactor?: number;
  /** Surface-only: dotted vs solid. */
  dotted?: boolean;
}

/**
 * Build the channel facade against a Mol* plugin + MolScript + color module.
 * @param context - Renderer dependencies.
 * @returns A {@link Channels} object suitable for wiring into `ScriptApi`.
 */
export function createChannels(context: ChannelContext): Channels {
  const states = new Map<string, ChannelState>();

  async function applyChannel<P extends object>(
    selection: SelectionToken,
    channel: 'atoms' | 'bonds' | 'ribbon' | 'surface',
    patch: P,
    update: (state: ChannelState, patch: P) => void,
  ): Promise<void> {
    const key = `${selection.source}::${channel}`;
    const previous: ChannelState = states.get(key) ?? {
      reprType: defaultReprType(channel),
    };
    update(previous, patch);
    if (channel === 'surface') {
      previous.reprType = previous.dotted
        ? 'gaussian-surface'
        : 'molecular-surface';
    }
    await replaceComponent(context, selection, channel, key, previous);
    states.set(key, previous);
  }

  async function applyLabel(
    selection: SelectionToken,
    template: string,
  ): Promise<void> {
    const key = `${selection.source}::label`;
    const previous = states.get(key);
    if (previous?.componentRef) {
      await context.plugin.managers.structure.hierarchy.remove([
        previous.componentRef,
      ]);
    }
    const component = await createComponent(context, selection, key);
    if (!component) {
      states.delete(key);
      return;
    }
    const params = {
      type: 'label',
      typeParams: { level: detectLabelLevel(template) },
    };
    await context.plugin.builders.structure.representation.addRepresentation(
      component,
      params,
    );
    states.set(key, { reprType: 'label', componentRef: component });
  }

  return {
    setAtoms: (selection, patch) =>
      applyChannel(selection, 'atoms', patch, (state, p) => {
        if (p.color !== undefined) state.color = p.color;
        if (p.radius !== undefined) state.sizeFactor = p.radius;
      }),
    setBonds: (selection, patch) =>
      applyChannel(selection, 'bonds', patch, (state, p) => {
        if (p.color !== undefined) state.color = p.color;
        if (p.diameter !== undefined) state.sizeFactor = p.diameter;
      }),
    setRibbon: (selection, patch) =>
      applyChannel(selection, 'ribbon', patch, (state, p) => {
        if (p.color !== undefined) state.color = p.color;
      }),
    setSurface: (selection, patch) =>
      applyChannel(selection, 'surface', patch, (state, p) => {
        if (p.color !== undefined) state.color = p.color;
        if (p.dots !== undefined) state.dotted = p.dots;
      }),
    label: applyLabel,
    setChannelVisibility(selection, channel, visible) {
      const state = states.get(`${selection.source}::${channel}`);
      if (!state?.componentRef) return;
      context.plugin.managers.structure.hierarchy.toggleVisibility(
        [state.componentRef],
        visible ? 'show' : 'hide',
      );
    },
    setSelectionVisibility(selection, visible) {
      const refs = (
        ['atoms', 'bonds', 'ribbon', 'surface', 'label'] as const
      ).flatMap((channel) => {
        const ref = states.get(`${selection.source}::${channel}`)?.componentRef;
        return ref ? [ref] : [];
      });
      if (refs.length === 0) return;
      context.plugin.managers.structure.hierarchy.toggleVisibility(
        refs,
        visible ? 'show' : 'hide',
      );
    },
    resetState: () => states.clear(),
  };
}

function defaultReprType(
  channel: 'atoms' | 'bonds' | 'ribbon' | 'surface',
): string {
  switch (channel) {
    case 'atoms':
      return 'spacefill';
    case 'bonds':
      return 'ball-and-stick';
    case 'ribbon':
      return 'cartoon';
    case 'surface':
      return 'molecular-surface';
    default:
      throw new Error(`Unknown channel: ${channel as string}`);
  }
}

async function replaceComponent(
  context: ChannelContext,
  selection: SelectionToken,
  channel: 'atoms' | 'bonds' | 'ribbon' | 'surface',
  key: string,
  state: ChannelState,
): Promise<void> {
  if (state.componentRef) {
    await context.plugin.managers.structure.hierarchy.remove([
      state.componentRef,
    ]);
    state.componentRef = undefined;
  }
  const component = await createComponent(context, selection, key);
  if (!component) return;
  const params = buildColorParams(
    state.reprType,
    state.color,
    context.colorModule,
  );
  const typeParams: Record<string, unknown> = { ...params.typeParams };
  if (state.sizeFactor !== undefined) typeParams.sizeFactor = state.sizeFactor;
  if (channel === 'bonds') typeParams.visuals = ['intra-bond', 'inter-bond'];
  if (Object.keys(typeParams).length > 0) params.typeParams = typeParams;
  await context.plugin.builders.structure.representation.addRepresentation(
    component,
    params as unknown as Record<string, unknown>,
  );
  state.componentRef = component;
}

async function createComponent(
  context: ChannelContext,
  selection: SelectionToken,
  key: string,
): Promise<ComponentRef | undefined> {
  const structureRef =
    context.plugin.managers.structure.hierarchy.current.structures[0];
  if (!structureRef) return undefined;
  const expression = compileSelection(
    selection.__ast,
    context.molScript.builder,
  );
  return context.plugin.builders.structure.tryCreateComponentFromExpression(
    structureRef.cell,
    expression,
    key,
    { label: key, tags: ['animate'] },
  );
}

/**
 * Choose a Mol* label level based on which fields the template references.
 * Mol*'s built-in label rep produces fixed text per level (chain id; "${comp}
 * ${seq}"; atom id) — we can't fully honour custom templates yet, but we can
 * pick the closest granularity. Default: residue.
 * @param template - Caller-provided template string.
 * @returns Level passed to Mol*'s label rep.
 */
function detectLabelLevel(template: string): 'chain' | 'residue' | 'element' {
  if (/\batom\b/.test(template)) return 'element';
  if (/\bchain\b/.test(template) && !/\bresidue\b/.test(template)) {
    return 'chain';
  }
  return 'residue';
}
