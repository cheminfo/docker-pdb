/**
 * Default worker count for the PyMol render pool. Each PDB worker drives a
 * single PyMol child process at a time (one process per size, sequentially
 * within the same PDB), so peak concurrent PyMol processes ≈ pool size.
 * Override at deploy time via the `PYMOL_CONCURRENCY` env var; tune the
 * host's RAM (`PYMOL_MEMORY_LIMIT` in compose) accordingly.
 */
const DEFAULT_PYMOL_CONCURRENCY = 32;

/**
 * Resolve the PyMol render pool size from the environment. Falls back to
 * {@link DEFAULT_PYMOL_CONCURRENCY} when `PYMOL_CONCURRENCY` is unset, empty,
 * or not a positive integer.
 * @returns {number} A positive integer concurrency.
 */
export function getPymolConcurrency() {
  const raw = process.env.PYMOL_CONCURRENCY;
  if (!raw) return DEFAULT_PYMOL_CONCURRENCY;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return DEFAULT_PYMOL_CONCURRENCY;
  }
  return parsed;
}

/**
 * Run `worker(item, index)` over `items` with at most `concurrency` calls in
 * flight at any time. Worker exceptions are reported via `onError`
 * (defaulting to a console warning) and do not abort the remaining items —
 * matches the existing sequential loops which swallow per-file errors so a
 * single bad PDB never stops a rebuild.
 * @template T
 * @param {T[]} items - Items to dispatch.
 * @param {(item: T, index: number) => Promise<void> | void} worker
 *   Per-item handler.
 * @param {object} [options] - Tuning options.
 * @param {number} [options.concurrency] - Maximum in-flight workers.
 *   Defaults to {@link getPymolConcurrency}.
 * @param {(error: unknown, item: T, index: number) => void} [options.onError]
 *   Called when a worker throws. Defaults to logging via `console.warn`.
 * @returns {Promise<void>} Resolves once every item has been processed.
 */
export async function runWithConcurrency(items, worker, options = {}) {
  const concurrency = options.concurrency ?? getPymolConcurrency();
  const onError =
    options.onError ??
    ((error, _item, index) => {
      // eslint-disable-next-line no-console
      console.warn(`Worker ${index} failed:`, error);
    });

  const list = Array.from(items);
  if (list.length === 0) return;

  let cursor = 0;
  const next = async () => {
    /* eslint-disable no-await-in-loop -- worker pulls items one at a time */
    while (cursor < list.length) {
      const index = cursor++;
      const item = list[index];
      try {
        await worker(item, index);
      } catch (error) {
        onError(error, item, index);
      }
    }
    /* eslint-enable no-await-in-loop */
  };

  const workerCount = Math.min(concurrency, list.length);
  const runners = Array.from({ length: workerCount }, () => next());
  await Promise.all(runners);
}
