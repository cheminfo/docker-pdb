// Long-running cron loop that keeps `data/sqlite3/ligands.db` in sync with
// the wwPDB Chemical Component Dictionary. wwPDB publishes CCD updates
// weekly (every Wednesday); this loop refreshes whenever the cached
// archive is older than 7 days, and otherwise sleeps until the next
// refresh window.
//
// Wired into compose as the `pdb-api-cron` service. Independent of
// `pdb-api`'s startup seed: on a fresh deploy `pdb-api` writes the
// initial copy of `components.cif.gz`, and this cron sees a fresh cache
// on its first iteration and goes straight to sleep — no race.

import { stat } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

import { pino } from 'pino';

import { ccdGzPath, seedCCD } from './seedCCD.js';

const logger = pino({ name: 'ccd-refresh-cron' });

/** wwPDB publishes CCD updates weekly. */
const REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

/** Backoff when the cache is missing entirely (pdb-api hasn't seeded yet). */
const SLEEP_WHEN_NO_CACHE_MS = 60 * 60 * 1000;

/** Minimum sleep between iterations to avoid a tight loop on bugs. */
const MIN_SLEEP_MS = 60 * 1000;

await runForever();

/**
 * Forever loop: check cache age, refresh if stale, sleep until the next
 * refresh window. A periodic-task body wrapped in try/catch so a single
 * network blip never crashes the process and triggers a restart loop.
 */
async function runForever() {
  /* eslint-disable no-await-in-loop -- intentional sequential cron loop */
  while (true) {
    const ageMs = await getCacheAgeMs();

    if (ageMs === Number.POSITIVE_INFINITY) {
      logger.info(
        { sleepHours: SLEEP_WHEN_NO_CACHE_MS / 3_600_000 },
        'No CCD cache yet; pdb-api will seed first. Sleeping.',
      );
      await delay(SLEEP_WHEN_NO_CACHE_MS);
      continue;
    }

    if (ageMs >= REFRESH_INTERVAL_MS) {
      logger.info(
        { ageHours: Math.round(ageMs / 3_600_000) },
        'CCD cache stale; refreshing',
      );
      try {
        await seedCCD({ force: true });
      } catch (error) {
        logger.error(
          { error: String(error) },
          'CCD refresh failed; will retry next cycle',
        );
      }
      await delay(REFRESH_INTERVAL_MS);
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
    await delay(sleepMs);
  }
  /* eslint-enable no-await-in-loop */
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
