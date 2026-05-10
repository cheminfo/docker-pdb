// Long-running cron loop that keeps `data/sqlite/ligands.db` in sync with
// the wwPDB Chemical Component Dictionary. wwPDB publishes CCD updates
// weekly (every Wednesday); this loop refreshes whenever the cached
// archive is older than 7 days, and otherwise sleeps until the next
// refresh window.
//
// Wired into compose as the `pdb-api-cron` service. Independent of
// `pdb-api`'s startup seed: on a fresh deploy `pdb-api` writes the
// initial copy of `components.cif.gz`, and this cron sees a fresh cache
// on its first iteration and goes straight to sleep — no race.
//
// Like the rsync loop, this cron polls `data/control/ccd-trigger` so the
// Settings page can request an immediate refresh without waiting up to a
// week for the next natural cycle.

import { stat } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

import { pino } from 'pino';

import {
  clearRunning,
  clearTrigger,
  markRunning,
  triggerExists,
} from '../syncControl.js';

import { ccdGzPath, seedCCD } from './seedCCD.js';

const logger = pino({ name: 'ccd-refresh-cron' });

/** wwPDB publishes CCD updates weekly. */
const REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

/** Backoff when the cache is missing entirely (pdb-api hasn't seeded yet). */
const SLEEP_WHEN_NO_CACHE_MS = 60 * 60 * 1000;

/** Minimum sleep between iterations to avoid a tight loop on bugs. */
const MIN_SLEEP_MS = 60 * 1000;

/** How often to check the trigger marker while sleeping. */
const TRIGGER_POLL_MS = 5 * 1000;

/** Cron kind, used for the matching trigger / running marker filenames. */
const KIND = 'ccd';

await runForever();

/**
 * Forever loop: check cache age, refresh if stale, sleep until the next
 * refresh window. A periodic-task body wrapped in try/catch so a single
 * network blip never crashes the process and triggers a restart loop.
 */
async function runForever() {
  // Stale state from a previous crash would lock the UI into "running" forever.
  await clearRunning(KIND);

  /* eslint-disable no-await-in-loop -- intentional sequential cron loop */
  while (true) {
    const ageMs = await getCacheAgeMs();
    const triggered = triggerExists(KIND);

    if (ageMs === Number.POSITIVE_INFINITY && !triggered) {
      logger.info(
        { sleepHours: SLEEP_WHEN_NO_CACHE_MS / 3_600_000 },
        'No CCD cache yet; pdb-api will seed first. Sleeping.',
      );
      await sleepUntilTrigger(SLEEP_WHEN_NO_CACHE_MS);
      continue;
    }

    if (triggered || ageMs >= REFRESH_INTERVAL_MS) {
      logger.info(
        {
          ageHours:
            ageMs === Number.POSITIVE_INFINITY
              ? null
              : Math.round(ageMs / 3_600_000),
          triggered,
        },
        triggered
          ? 'CCD refresh triggered manually'
          : 'CCD cache stale; refreshing',
      );
      await runOnce();
      continue;
    }

    const sleepMs = Math.max(REFRESH_INTERVAL_MS - ageMs, MIN_SLEEP_MS);
    logger.info(
      {
        ageHours: Math.round(ageMs / 3_600_000),
        sleepHours: Math.round(sleepMs / 3_600_000),
      },
      'CCD cache fresh; sleeping until next refresh window',
    );
    await sleepUntilTrigger(sleepMs);
  }
  /* eslint-enable no-await-in-loop */
}

/**
 * Refresh the CCD once, wrapped with the running marker so the API can
 * report live state. Errors are caught here so a single network blip
 * never crashes the process and triggers a restart loop.
 */
async function runOnce() {
  await clearTrigger(KIND);

  const startedAt = new Date().toISOString();
  await markRunning(KIND, {
    startedAt,
    type: KIND,
    pid: process.pid,
  });
  try {
    await seedCCD({ force: true });
  } catch (error) {
    logger.error(
      { error: String(error) },
      'CCD refresh failed; will retry next cycle',
    );
  } finally {
    await clearRunning(KIND);
  }
}

/**
 * Sleep up to `maxMs`, returning early as soon as a trigger marker appears.
 * Polls every `TRIGGER_POLL_MS` so the worst-case latency for a manual
 * refresh is a few seconds rather than the full 7-day cycle.
 * @param {number} maxMs - Maximum time to sleep, in milliseconds.
 * @returns {Promise<'triggered' | 'timeout'>} How the wait ended.
 */
async function sleepUntilTrigger(maxMs) {
  const start = Date.now();
  /* eslint-disable no-await-in-loop -- intentional poll loop */
  while (Date.now() - start < maxMs) {
    if (triggerExists(KIND)) return 'triggered';
    const remainingMs = maxMs - (Date.now() - start);
    await delay(Math.min(TRIGGER_POLL_MS, remainingMs));
  }
  /* eslint-enable no-await-in-loop */
  return 'timeout';
}

/**
 * Return the age of the cached CCD archive in milliseconds, or
 * `Number.POSITIVE_INFINITY` if no cache file exists yet.
 * @returns {Promise<number>} Age in ms, or `+Infinity` if missing.
 */
async function getCacheAgeMs() {
  try {
    const stats = await stat(ccdGzPath);
    return Date.now() - stats.mtimeMs;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}
