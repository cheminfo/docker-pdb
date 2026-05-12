// Long-running cron loop that keeps `data/sqlite/ligands.db` in sync with
// the wwPDB Chemical Component Dictionary. wwPDB publishes CCD updates
// weekly (every Wednesday); this loop refreshes whenever the cached
// archive is older than 7 days, and otherwise sleeps until the next
// refresh window.
//
// Wired into compose as the `pdb-api-cron` service. This is the sole
// owner of the CCD seed/refresh — `pdb-api` no longer runs `seed-ccd`
// at boot, because doing so blocked the API server for 5–30 min on first
// deploy and made nginx return 502 the whole time. On a fresh deploy
// this loop starts seeding within seconds (`ageMs` is `+Infinity`, which
// trips the "stale or missing → refresh now" branch below).
//
// Like the rsync loop, this cron polls `data/control/ccd-trigger` so the
// Settings page can request an immediate refresh without waiting up to a
// week for the next natural cycle.

import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { pino } from 'pino';

import { getLigandsDB } from '../db/getDB.js';
import {
  finalizeCcdHistory,
  heartbeatCcdHistory,
  recordCcdHistory,
  startCcdHistory,
} from '../db/upsertPdbEntry.js';
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

/** Minimum sleep between iterations to avoid a tight loop on bugs. */
const MIN_SLEEP_MS = 60 * 1000;

/** How often to check the trigger marker while sleeping. */
const TRIGGER_POLL_MS = 5 * 1000;

/** Cron kind, used for the matching trigger / running marker filenames. */
const KIND = 'ccd';

/**
 * JSON-lines log of every CCD refresh failure. Lives next to the sqlite
 * file so operators can `tail -f data/sqlite/ccd-failures.log` without
 * scraping pino output. Mirrors `data/pymol/failures.log`.
 */
const dataDir = process.env.DATA_DIR
  ? process.env.DATA_DIR.replace(/\/$/, '')
  : '/app/data';
const ccdFailuresLogPath = join(dataDir, 'sqlite', 'ccd-failures.log');

/**
 * Append a CCD refresh failure to the on-disk JSON-lines log. Failures of
 * the log write itself (full disk, permissions) are swallowed so a bad
 * log never crashes the cron loop and triggers a tight restart.
 * @param {{ historyId: number | null, startedAt: string, durationMs: number, importedCount: number, skippedCount: number, error: string }} entry - Failure record.
 */
function logCcdFailure(entry) {
  try {
    const dir = join(dataDir, 'sqlite');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    appendFileSync(
      ccdFailuresLogPath,
      `${JSON.stringify({ timestamp: new Date().toISOString(), ...entry })}\n`,
    );
  } catch {
    // ignore
  }
}

await runForever();

/**
 * Forever loop: check cache age, refresh if stale, sleep until the next
 * refresh window. A periodic-task body wrapped in try/catch so a single
 * network blip never crashes the process and triggers a restart loop.
 *
 * The age-based "is the gz stale?" check is not enough on its own: a
 * crashed earlier run leaves a fresh-mtime gz on disk with an empty
 * `ligands` table, and the cron would then sleep for the full 7-day TTL
 * before retrying. So we also force a refresh whenever the table itself
 * looks empty — a self-healing path that recovers from any crashed
 * predecessor on the next container restart.
 */
async function runForever() {
  // Stale state from a previous crash would lock the UI into "running" forever.
  await clearRunning(KIND);

  /* eslint-disable no-await-in-loop -- intentional sequential cron loop */
  while (true) {
    const ageMs = await getCacheAgeMs();
    const triggered = triggerExists(KIND);
    const ligandsEmpty = await isLigandsTableEmpty();

    if (triggered || ageMs >= REFRESH_INTERVAL_MS || ligandsEmpty) {
      logger.info(
        {
          ageHours:
            ageMs === Number.POSITIVE_INFINITY
              ? null
              : Math.round(ageMs / 3_600_000),
          triggered,
          ligandsEmpty,
        },
        ligandsEmpty
          ? 'Ligands table empty; running CCD seed regardless of gz mtime'
          : triggered
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
 * Cheap check: does the `ligands` table look empty? Used as a second
 * trigger for `runOnce` so the cron self-heals after any crashed
 * predecessor that left a fresh gz on disk but never imported the rows.
 * Errors are swallowed (cron should not crash because the DB is briefly
 * unavailable) and treated as "not empty" — better to sleep than to
 * thrash a half-open database.
 * @returns {Promise<boolean>} True when the table has zero rows.
 */
async function isLigandsTableEmpty() {
  try {
    const db = await getLigandsDB();
    const row = db.countLigands.get();
    return (row?.n ?? 0) === 0;
  } catch (error) {
    logger.warn(
      { error: String(error) },
      'countLigands probe failed; assuming non-empty',
    );
    return false;
  }
}

/**
 * Refresh the CCD once. Lifecycle:
 *
 * 1. Insert a `status='running'` row in `ccd_history` so a SIGKILL/OOM
 *    during the multi-minute parse phase still leaves a breadcrumb.
 * 2. Run `seedCCD`, heartbeating imported/skipped counts on every batch
 *    commit so external observers can tell a live import apart from an
 *    orphaned `running` row left by a crash.
 * 3. Finalise the row to `success` or `failed` with final counts/duration
 *    in a `finally` block — and additionally append failures to
 *    `data/sqlite/ccd-failures.log` for offline triage.
 *
 * Errors are caught here so a single network blip never crashes the
 * process and triggers a restart loop.
 */
async function runOnce() {
  await clearTrigger(KIND);

  const startedAt = new Date().toISOString();
  const startedAtMs = Date.now();
  await markRunning(KIND, {
    startedAt,
    type: KIND,
    pid: process.pid,
  });

  // Persist the 'running' breadcrumb FIRST so a SIGKILL during the multi-
  // minute parse phase still leaves a row behind. We previously wrote the
  // row only in the `finally` block, which silently dropped any crash
  // before that point — the failure mode we hit on test.epfl.ch.
  let historyId = null;
  try {
    historyId = await startCcdHistory({ startedAt, pid: process.pid });
  } catch (error) {
    logger.error(
      { error: String(error) },
      'Failed to insert ccd-history start row; refresh will still proceed',
    );
  }

  let status = 'success';
  let importedCount = 0;
  let skippedCount = 0;
  let errorMessage = null;
  try {
    const result = await seedCCD({
      force: true,
      onProgress: async (counts) => {
        importedCount = counts.imported;
        skippedCount = counts.skipped;
        if (historyId === null) return;
        try {
          await heartbeatCcdHistory({
            id: historyId,
            importedCount,
            skippedCount,
            heartbeatAt: new Date().toISOString(),
          });
        } catch (heartbeatError) {
          logger.warn(
            { error: String(heartbeatError) },
            'Failed to write ccd-history heartbeat',
          );
        }
      },
    });
    importedCount = result.imported;
    skippedCount = result.skipped;
  } catch (error) {
    status = 'failed';
    errorMessage = String(error?.stack ?? error);
    logger.error(
      { error: errorMessage },
      'CCD refresh failed; will retry next cycle',
    );
    logCcdFailure({
      historyId,
      startedAt,
      durationMs: Date.now() - startedAtMs,
      importedCount,
      skippedCount,
      error: errorMessage,
    });
  } finally {
    await clearRunning(KIND);
    const finishedAt = new Date().toISOString();
    const durationMs = Date.now() - startedAtMs;
    const bytesOnDisk = await getArchiveSize();
    try {
      if (historyId === null) {
        // Fallback when the start-row insert itself failed: drop a single
        // legacy-shape row so /v1/ccd-history still records the run.
        await recordCcdHistory({
          startedAt,
          finishedAt,
          durationMs,
          status,
          importedCount,
          skippedCount,
          bytesOnDisk,
          error: errorMessage,
        });
      } else {
        await finalizeCcdHistory({
          id: historyId,
          finishedAt,
          durationMs,
          status,
          importedCount,
          skippedCount,
          bytesOnDisk,
          error: errorMessage,
        });
      }
    } catch (error) {
      logger.error(
        { error: String(error) },
        'Failed to record ccd-history row',
      );
    }
  }
}

/**
 * Best-effort archive size for the `ccd_history` row. Returns `null`
 * if the cache file isn't there (e.g. download failed before rename).
 * @returns {Promise<number | null>} Archive size in bytes, or `null`.
 */
async function getArchiveSize() {
  try {
    const stats = await stat(ccdGzPath);
    return stats.size;
  } catch {
    return null;
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
