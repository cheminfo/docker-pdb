// File-based control plane shared across the API and the two cron containers.
//
// The API (`pdb-api`) and the cron loops (`node-pdb-sync`, `pdb-api-cron`)
// run in separate Docker containers but share the `/app/data` bind mount.
// To trigger an instant rsync / CCD refresh from the UI we drop a marker
// file into `data/control/` from the API; the cron loop polls for it on
// every sleep cycle and runs immediately when it appears. While a run is in
// flight the cron loop writes a `*-running.json` marker so the API can
// report live state without coupling the two containers.

import { existsSync, readFileSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const dataDir = process.env.DATA_DIR
  ? process.env.DATA_DIR.replace(/\/$/, '')
  : '/app/data';

/** Directory holding the trigger / running marker files. */
export const controlDir = join(dataDir, 'control');

/** Supported sync kinds. `rsync` covers both wwPDB archives in one pass. */
export const SYNC_KINDS = ['rsync', 'ccd'];

/**
 * Resolve the trigger marker path for a sync kind. The presence of the file
 * tells the cron loop "wake up now and run immediately".
 * @param {'rsync' | 'ccd'} kind - Which cron to wake.
 * @returns {string} Absolute path under `data/control/`.
 */
export function getTriggerPath(kind) {
  return join(controlDir, `${kind}-trigger`);
}

/**
 * Resolve the running marker path for a sync kind. The presence of the file
 * means a cron iteration is currently executing; it carries a JSON payload
 * with the start timestamp so the API can report progress.
 * @param {'rsync' | 'ccd'} kind - Which cron to inspect.
 * @returns {string} Absolute path under `data/control/`.
 */
export function getRunningPath(kind) {
  return join(controlDir, `${kind}-running.json`);
}

/**
 * Ensure the control directory exists. The Docker entrypoint pre-creates it
 * with the right ownership; this helper covers local-development runs and
 * any race where the entrypoint hasn't yet provisioned the folder.
 */
export async function ensureControlDir() {
  await mkdir(controlDir, { recursive: true });
}

/**
 * Drop a trigger marker so the matching cron loop wakes on its next poll.
 * Idempotent: writing twice is the same as once. The body is a short JSON
 * note so it's easy to inspect with `cat data/control/...-trigger`.
 * @param {'rsync' | 'ccd'} kind - Which cron to wake.
 * @param {{ source?: string }} [meta] - Optional metadata, surfaced in logs.
 */
export async function setTrigger(kind, meta = {}) {
  await ensureControlDir();
  const payload = {
    requestedAt: new Date().toISOString(),
    source: meta.source ?? 'api',
  };
  await writeFile(getTriggerPath(kind), JSON.stringify(payload));
}

/**
 * Synchronously check whether a trigger is queued for the given kind.
 * @param {'rsync' | 'ccd'} kind - Which cron to inspect.
 * @returns {boolean} `true` if the marker file exists.
 */
export function triggerExists(kind) {
  return existsSync(getTriggerPath(kind));
}

/**
 * Delete the trigger marker. Called by the cron loop right before starting
 * a run, so a second trigger arriving during the run is preserved.
 * @param {'rsync' | 'ccd'} kind - Which cron consumed the trigger.
 */
export async function clearTrigger(kind) {
  await rm(getTriggerPath(kind), { force: true });
}

/**
 * Read the trigger marker payload, if any. Used by the API to expose the
 * "queued at" timestamp in /v1/sync/status.
 * @param {'rsync' | 'ccd'} kind - Which cron to inspect.
 * @returns {{ requestedAt: string, source: string } | null} Payload or null.
 */
export function readTrigger(kind) {
  return readJson(getTriggerPath(kind));
}

/**
 * Write the running marker, signaling that a cron iteration is in flight.
 * @param {'rsync' | 'ccd'} kind - Which cron is starting work.
 * @param {object} payload - JSON-serializable run metadata.
 */
export async function markRunning(kind, payload) {
  await ensureControlDir();
  await writeFile(getRunningPath(kind), JSON.stringify(payload));
}

/**
 * Merge `partial` into the existing running marker so the API can report live
 * progress (`phase`, `processed`, `total`, `lastEntryId`, …) without losing the
 * fields written by `markRunning`. Silently returns when no marker exists —
 * progress callbacks fired after `clearRunning` should not resurrect it.
 * @param {'rsync' | 'ccd'} kind - Which cron is reporting progress.
 * @param {object} partial - Fields to merge into the marker payload.
 */
export async function updateRunning(kind, partial) {
  const current = readRunning(kind);
  if (!current) return;
  await writeFile(
    getRunningPath(kind),
    JSON.stringify({ ...current, ...partial }),
  );
}

/**
 * Delete the running marker once the cron iteration finishes (success or
 * failure). Wrap the cron body in try/finally so this always fires.
 * @param {'rsync' | 'ccd'} kind - Which cron just finished.
 */
export async function clearRunning(kind) {
  await rm(getRunningPath(kind), { force: true });
}

/**
 * Read the running marker payload, if a run is in flight.
 * @param {'rsync' | 'ccd'} kind - Which cron to inspect.
 * @returns {object | null} The run payload, or `null` if the cron is idle.
 */
export function readRunning(kind) {
  return readJson(getRunningPath(kind));
}

function readJson(path) {
  try {
    const text = readFileSync(path, 'utf8');
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** How often to poll for a trigger marker while sleeping. */
const TRIGGER_POLL_MS = 5 * 1000;

/**
 * Sleep up to `maxMs`, returning early as soon as a trigger marker appears.
 * Polls every 5 s so the worst-case latency for a manual trigger is a few
 * seconds rather than the full sleep interval.
 * @param {number} maxMs - Maximum time to sleep, in milliseconds.
 * @param {'rsync' | 'ccd'} kind - Which trigger file to watch.
 * @param {{ logProgress?: boolean }} [options] - When `logProgress` is true,
 *   logs remaining hours each time the hour count decreases (ops-dashboard
 *   format consumed by the rsync cron). Defaults to `false`.
 * @returns {Promise<'triggered' | 'timeout'>} How the wait ended.
 */
export async function sleepUntilTrigger(maxMs, kind, options = {}) {
  const logProgress = options.logProgress ?? false;
  const start = Date.now();
  let lastLoggedHour = -1;
  /* eslint-disable no-await-in-loop -- intentional poll loop */
  /* eslint-disable no-console -- legacy log format consumed by ops dashboards */
  while (Date.now() - start < maxMs) {
    if (triggerExists(kind)) return 'triggered';
    const remainingMs = maxMs - (Date.now() - start);
    if (logProgress) {
      const remainingHours = Math.ceil(remainingMs / 3_600_000);
      if (remainingHours !== lastLoggedHour && remainingHours > 0) {
        console.log(
          `${new Date().toISOString()} - Still waiting ${remainingHours}h`,
        );
        lastLoggedHour = remainingHours;
      }
    }
    await delay(Math.min(TRIGGER_POLL_MS, remainingMs));
  }
  /* eslint-enable no-await-in-loop, no-console */
  return 'timeout';
}

/**
 * Wrap an async callback so it fires at most once every `intervalMs`. Calls
 * within the window are dropped — callers are expected to issue an explicit
 * final call (or clear the marker) once the underlying work finishes, since
 * this throttle is "leading-edge only". Bounds the number of marker-file
 * writes during long rebuilds.
 * @param {(value: unknown) => Promise<void>} fn - Underlying callback.
 * @param {number} intervalMs - Minimum gap between consecutive invocations.
 * @returns {(value: unknown) => Promise<void>} Throttled wrapper.
 */
export function throttle(fn, intervalMs) {
  let last = 0;
  return async (value) => {
    const now = Date.now();
    if (now - last < intervalMs) return;
    last = now;
    await fn(value);
  };
}
