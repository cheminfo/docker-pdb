/**
 * Per-Selection script-facing channel factories.
 *
 * Each channel (`atoms`, `bonds`, `ribbon`, `surface`) is built as a
 * **chainable thenable**:
 *
 *   - Mutator methods (`color`, `radius`, `diameter`, `dots`) push the real
 *     `Promise<void>` work onto a per-channel queue and return the channel
 *     synchronously, so calls compose:
 *     `cys.bonds.diameter(0.4).color({ model: 'atoms' });`
 *   - The channel itself is a `PromiseLike<void>` — it has a `then` method
 *     that resolves once the queue drains. That makes `await chain` Just
 *     Work (the auto-await rewrite produces exactly this shape on user
 *     scripts). The resolved value is intentionally `undefined` rather than
 *     the channel itself: resolving with the channel would feed a thenable
 *     back into Promise resolution and the engine would recursively unwrap
 *     it forever, hanging the script and exhausting memory.
 *
 * `show()` / `hide()` are synchronous in the underlying API and don't queue
 * anything — they still return the channel so visibility toggles fit into a
 * chain.
 *
 * The queue starts empty per Run because `wrap(...)` in `MolStar.ts` builds
 * a fresh channel per Selection per Run. Failures in one queued op reject
 * the queue and propagate out of the next `await`, which halts the script
 * — the same behavior as a plain `await` of a rejecting Promise.
 */
import type {
  AtomsChannel,
  BondsChannel,
  DistancesChannel,
  HbondsChannel,
  RibbonChannel,
  Selection,
  SizeOptions,
  SurfaceChannel,
} from './MolStar.ts';
import type { ColorSpec } from './colorTheme.ts';
import type { ScriptApi, SelectionToken } from './helpers.ts';
import type { DistanceToOptions } from './measurements.ts';

/**
 * Build the `atoms` channel for `selection`. See file header for the
 * chainable-thenable contract.
 * @param api - Internal renderer.
 * @param selection - Selection this channel belongs to.
 * @returns A fresh chainable `AtomsChannel`.
 */
export function makeAtomsChannel(
  api: ScriptApi,
  selection: SelectionToken,
): AtomsChannel {
  let queue: Promise<void> = Promise.resolve();
  const channel = {} as AtomsChannel;
  const enqueue = (task: () => Promise<void>): AtomsChannel => {
    queue = queue.then(task);
    return channel;
  };
  Object.assign(channel, {
    color: (spec: ColorSpec) =>
      enqueue(() => api.setAtoms(selection, { color: spec })),
    radius: (options: SizeOptions) =>
      enqueue(() => api.setAtoms(selection, { radius: options.value })),
    show: () => {
      api.setChannelVisibility(selection, 'atoms', true);
      return channel;
    },
    hide: () => {
      api.setChannelVisibility(selection, 'atoms', false);
      return channel;
    },
    // eslint-disable-next-line unicorn/no-thenable -- chainable thenable channel; await drains the queue
    then: (
      onfulfilled?: ((value: void) => unknown) | null,
      onrejected?: ((reason: unknown) => unknown) | null,
    ) => queue.then(() => onfulfilled?.(), onrejected),
  });
  return channel;
}

/**
 * Build the `bonds` channel for `selection`. See file header for the
 * chainable-thenable contract.
 * @param api - Internal renderer.
 * @param selection - Selection this channel belongs to.
 * @returns A fresh chainable `BondsChannel`.
 */
export function makeBondsChannel(
  api: ScriptApi,
  selection: SelectionToken,
): BondsChannel {
  let queue: Promise<void> = Promise.resolve();
  const channel = {} as BondsChannel;
  const enqueue = (task: () => Promise<void>): BondsChannel => {
    queue = queue.then(task);
    return channel;
  };
  Object.assign(channel, {
    color: (spec: ColorSpec) =>
      enqueue(() => api.setBonds(selection, { color: spec })),
    diameter: (value: number) =>
      enqueue(() => api.setBonds(selection, { diameter: value })),
    show: () => {
      api.setChannelVisibility(selection, 'bonds', true);
      return channel;
    },
    hide: () => {
      api.setChannelVisibility(selection, 'bonds', false);
      return channel;
    },
    // eslint-disable-next-line unicorn/no-thenable -- chainable thenable channel; await drains the queue
    then: (
      onfulfilled?: ((value: void) => unknown) | null,
      onrejected?: ((reason: unknown) => unknown) | null,
    ) => queue.then(() => onfulfilled?.(), onrejected),
  });
  return channel;
}

/**
 * Build the `ribbon` channel for `selection`. See file header for the
 * chainable-thenable contract.
 * @param api - Internal renderer.
 * @param selection - Selection this channel belongs to.
 * @returns A fresh chainable `RibbonChannel`.
 */
export function makeRibbonChannel(
  api: ScriptApi,
  selection: SelectionToken,
): RibbonChannel {
  let queue: Promise<void> = Promise.resolve();
  const channel = {} as RibbonChannel;
  const enqueue = (task: () => Promise<void>): RibbonChannel => {
    queue = queue.then(task);
    return channel;
  };
  Object.assign(channel, {
    color: (spec: ColorSpec) =>
      enqueue(() => api.setRibbon(selection, { color: spec })),
    show: () => {
      api.setChannelVisibility(selection, 'ribbon', true);
      return channel;
    },
    hide: () => {
      api.setChannelVisibility(selection, 'ribbon', false);
      return channel;
    },
    // eslint-disable-next-line unicorn/no-thenable -- chainable thenable channel; await drains the queue
    then: (
      onfulfilled?: ((value: void) => unknown) | null,
      onrejected?: ((reason: unknown) => unknown) | null,
    ) => queue.then(() => onfulfilled?.(), onrejected),
  });
  return channel;
}

/**
 * Build the `hbonds` channel for `selection`. Computes backbone H-bonds
 * within the selection's residues on the first setter call (or on `show()`)
 * and renders them as Mol*-managed dashed lines (yellow by default).
 * @param api - Internal renderer.
 * @param selection - Selection this channel belongs to.
 * @returns A fresh chainable `HbondsChannel`.
 */
export function makeHbondsChannel(
  api: ScriptApi,
  selection: SelectionToken,
): HbondsChannel {
  let queue: Promise<void> = Promise.resolve();
  const channel = {} as HbondsChannel;
  const enqueue = (task: () => Promise<void>): HbondsChannel => {
    queue = queue.then(task);
    return channel;
  };
  Object.assign(channel, {
    color: (spec: ColorSpec) =>
      enqueue(() => api.setHbonds(selection, { color: spec })),
    diameter: (value: number) =>
      enqueue(() => api.setHbonds(selection, { diameter: value })),
    show: () => enqueue(() => api.setHbonds(selection, {})),
    hide: () => {
      api.setMeasurementVisibility(selection, 'hbonds', false);
      return channel;
    },
    // eslint-disable-next-line unicorn/no-thenable -- chainable thenable channel; await drains the queue
    then: (
      onfulfilled?: ((value: void) => unknown) | null,
      onrejected?: ((reason: unknown) => unknown) | null,
    ) => queue.then(() => onfulfilled?.(), onrejected),
  });
  return channel;
}

/**
 * Build the `distances` channel for `selection`. Distances are added one at
 * a time via `.to(other, options?)` — color/diameter setters mutate the
 * default style for subsequent `.to(...)` calls (existing lines keep their
 * original style). See file header for the chainable-thenable contract.
 * @param api - Internal renderer.
 * @param selection - Selection this channel belongs to.
 * @returns A fresh chainable `DistancesChannel`.
 */
export function makeDistancesChannel(
  api: ScriptApi,
  selection: SelectionToken,
): DistancesChannel {
  let queue: Promise<void> = Promise.resolve();
  const channel = {} as DistancesChannel;
  const enqueue = (task: () => Promise<void>): DistancesChannel => {
    queue = queue.then(task);
    return channel;
  };
  Object.assign(channel, {
    color: (spec: ColorSpec) =>
      enqueue(() => api.setDistances(selection, { color: spec })),
    diameter: (value: number) =>
      enqueue(() => api.setDistances(selection, { diameter: value })),
    to: (other: Selection, options?: DistanceToOptions) =>
      enqueue(() => api.addDistanceTo(selection, other, options)),
    show: () => {
      api.setMeasurementVisibility(selection, 'distances', true);
      return channel;
    },
    hide: () => {
      api.setMeasurementVisibility(selection, 'distances', false);
      return channel;
    },
    // eslint-disable-next-line unicorn/no-thenable -- chainable thenable channel; await drains the queue
    then: (
      onfulfilled?: ((value: void) => unknown) | null,
      onrejected?: ((reason: unknown) => unknown) | null,
    ) => queue.then(() => onfulfilled?.(), onrejected),
  });
  return channel;
}

/**
 * Build the `surface` channel for `selection`. See file header for the
 * chainable-thenable contract.
 * @param api - Internal renderer.
 * @param selection - Selection this channel belongs to.
 * @returns A fresh chainable `SurfaceChannel`.
 */
export function makeSurfaceChannel(
  api: ScriptApi,
  selection: SelectionToken,
): SurfaceChannel {
  let queue: Promise<void> = Promise.resolve();
  const channel = {} as SurfaceChannel;
  const enqueue = (task: () => Promise<void>): SurfaceChannel => {
    queue = queue.then(task);
    return channel;
  };
  Object.assign(channel, {
    color: (spec: ColorSpec) =>
      enqueue(() => api.setSurface(selection, { color: spec })),
    dots: () => enqueue(() => api.setSurface(selection, { dots: true })),
    show: () => {
      api.setChannelVisibility(selection, 'surface', true);
      return channel;
    },
    hide: () => {
      api.setChannelVisibility(selection, 'surface', false);
      return channel;
    },
    // eslint-disable-next-line unicorn/no-thenable -- chainable thenable channel; await drains the queue
    then: (
      onfulfilled?: ((value: void) => unknown) | null,
      onrejected?: ((reason: unknown) => unknown) | null,
    ) => queue.then(() => onfulfilled?.(), onrejected),
  });
  return channel;
}
