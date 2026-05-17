import createDebug from 'debug';

import { getLigandsDB } from './db/getDB.js';
import { rebuildStatsRollup } from './db/rebuildStatsRollup.js';
import { recordRsyncHistory } from './db/upsertPdbEntry.js';
import * as rebuild from './rebuild.js';
import {
  clearRunning,
  clearTrigger,
  markRunning,
  sleepUntilTrigger,
  throttle,
  updateRunning,
} from './syncControl.js';
import update from './update.js';

const debug = createDebug('pdb-sync:cron');

const SLEEP_HOURS = 24;
const SLEEP_MS = SLEEP_HOURS * 3600 * 1000;
/** Cron kind, used for the matching trigger / running marker filenames. */
const KIND = 'rsync';
/** Throttle live-marker writes: at most one update every 2 s per phase. */
const MARKER_UPDATE_INTERVAL_MS = 2000;

await cron();

async function cron() {
  // Apply migrations and warm up the connection.
  const db = await getLigandsDB();

  // First-boot recovery: if the rsync directories already contain files
  // (e.g. carried over from a previous deployment) but `pdb_entries` is
  // empty, rebuild metadata from disk before resuming the periodic rsync
  // — this is the "rebuild from local files without re-downloading" path.
  const count = db.countPdbEntries.get();
  if ((count?.n ?? 0) === 0) {
    debug(
      'pdb_entries is empty — running rebuild-from-disk before first rsync',
    );
    await runRebuild();
  }

  // Stale state from a previous crash would lock the UI into "running" forever.
  await clearRunning(KIND);

  /* eslint-disable no-await-in-loop -- intentional sequential cron loop */
  while (true) {
    await sleepUntilTrigger(SLEEP_MS, KIND, { logProgress: true });
    await runOnce();
  }
  /* eslint-enable no-await-in-loop */
}

/**
 * Run the first-boot rebuild from local files, wrapped with a running marker
 * that the API surfaces via `/v1/sync/status`. The frontend reads the
 * `phase`, `processed`, `total`, and `lastEntryId` fields to render a live
 * "Seeding from on-disk archive" banner. Errors are caught so a partial
 * rebuild never crashes the cron container and triggers a tight restart.
 */
async function runRebuild() {
  const startedAt = new Date().toISOString();
  await markRunning(KIND, {
    startedAt,
    type: KIND,
    pid: process.pid,
    scope: ['asymUnit', 'bioAssembly'],
    phase: 'rebuild-asym',
    processed: 0,
    total: 0,
  });
  let asymFinal;
  let assemblyFinal;
  try {
    /* eslint-disable no-await-in-loop -- two phases, run sequentially */
    for (const phase of ['rebuild-asym', 'rebuild-assembly']) {
      const onStart = async ({ total, renderStats }) => {
        await updateRunning(KIND, {
          phase,
          processed: 0,
          total,
          renderStats,
        });
      };
      const onProgress = throttle(
        async ({ processed, total, lastEntryId, renderStats }) => {
          await updateRunning(KIND, {
            phase,
            processed,
            total,
            lastEntryId,
            renderStats,
          });
        },
        MARKER_UPDATE_INTERVAL_MS,
      );
      const fn = phase === 'rebuild-asym' ? rebuild.pdb : rebuild.assembly;
      const final = await fn({ onStart, onProgress });
      if (phase === 'rebuild-asym') asymFinal = final;
      else assemblyFinal = final;
      // Flush the final state so the UI shows 100% even if the last
      // onProgress fired within the throttle window.
      await updateRunning(KIND, {
        phase,
        processed: final.processed,
        total: final.total,
        lastEntryId: final.lastEntryId,
        renderStats: final.renderStats,
      });
    }
    /* eslint-enable no-await-in-loop */
    await refreshStatsRollup(await getLigandsDB());
    // Record synthetic rsync_history rows so the home-page "Last imported
    // entry" panel has a lastEntryId to display after a first-boot rebuild.
    // The weekly rsync path records these automatically; the rebuild path
    // did not, leaving the panel permanently blank on fresh deployments.
    const finishedAt = new Date().toISOString();
    const durationMs = Date.parse(finishedAt) - Date.parse(startedAt);
    if (asymFinal?.lastEntryId) {
      try {
        await recordRsyncHistory({
          type: 'asymUnit',
          startedAt,
          finishedAt,
          durationMs,
          updatedCount: asymFinal.processed,
          deletedCount: 0,
          lastEntryId: asymFinal.lastEntryId,
          bytesOnDisk: null,
        });
      } catch (error) {
        debug('Failed to record rebuild rsync-history row (asymUnit):', error);
      }
    }
    if (assemblyFinal?.lastEntryId) {
      try {
        await recordRsyncHistory({
          type: 'bioAssembly',
          startedAt,
          finishedAt,
          durationMs,
          updatedCount: assemblyFinal.processed,
          deletedCount: 0,
          lastEntryId: assemblyFinal.lastEntryId,
          bytesOnDisk: null,
        });
      } catch (error) {
        debug(
          'Failed to record rebuild rsync-history row (bioAssembly):',
          error,
        );
      }
    }
  } catch (error) {
    debug('rebuild-from-disk failed; continuing into rsync loop:', error);
  } finally {
    await clearRunning(KIND);
  }
}

/**
 * Execute one rsync pass, wrapped with the running marker so the API can
 * report live state. Errors are caught here so a single failed run never
 * crashes the loop and triggers a tight docker restart cycle.
 */
async function runOnce() {
  // Claim any pending trigger before starting — once we begin, we don't
  // want a second click to leave a stale marker that re-runs immediately.
  await clearTrigger(KIND);

  const startedAt = new Date().toISOString();
  await markRunning(KIND, {
    startedAt,
    type: KIND,
    pid: process.pid,
    scope: ['asymUnit', 'bioAssembly'],
    phase: 'rsync-asym',
    subPhase: 'connecting',
    processed: 0,
  });
  try {
    const onProgress = throttle(
      async ({ phase, processed, lastEntryId, renderStats }) => {
        await updateRunning(KIND, {
          phase,
          processed,
          lastEntryId,
          renderStats,
        });
      },
      MARKER_UPDATE_INTERVAL_MS,
    );
    // Sub-phase transitions ("scanning" → "transferring", etc.) are rare and
    // user-visible — bypass the throttle whenever the sub-phase changes so
    // the UI flips its banner immediately. Byte-progress updates within the
    // same sub-phase are throttled to one write per MARKER_UPDATE_INTERVAL_MS.
    let lastSubPhase;
    let lastActivityWrite = 0;
    const onActivity = async ({ phase, subPhase, rsyncProgress }) => {
      const now = Date.now();
      const forced = subPhase !== lastSubPhase;
      if (!forced && now - lastActivityWrite < MARKER_UPDATE_INTERVAL_MS) {
        return;
      }
      lastSubPhase = subPhase;
      lastActivityWrite = now;
      await updateRunning(KIND, { phase, subPhase, rsyncProgress });
    };
    await update({
      onPhase: async ({ phase }) => {
        // Reset per-phase counters AND the rsync sub-state so the UI does
        // not show stale asym-phase byte progress while bio-assembly is
        // still in its connecting / scanning window.
        lastSubPhase = undefined;
        lastActivityWrite = 0;
        await updateRunning(KIND, {
          phase,
          subPhase: 'connecting',
          rsyncProgress: undefined,
          processed: 0,
          renderStats: undefined,
        });
      },
      onProgress,
      onActivity,
    });
    await refreshStatsRollup(await getLigandsDB());
  } catch (error) {
    debug('update failed, will retry next cycle:', error);
  } finally {
    await clearRunning(KIND);
  }
}

/**
 * Regenerate the omega-stats rollup tables after a sync / rebuild
 * cycle completes. Wrapped in try/catch so a rollup failure (e.g. a
 * SQLite busy timeout) is logged but does not crash the cron loop —
 * the next cycle will rebuild from the same source-of-truth tables.
 * @param {import('./db/getDB.js').LigandsDB} db - Open ligands DB.
 * @returns {Promise<void>}
 */
async function refreshStatsRollup(db) {
  try {
    await rebuildStatsRollup(db);
  } catch (error) {
    debug('stats rollup rebuild failed:', error);
  }
}
