import { stat } from 'node:fs/promises';

import { ccdGzPath } from '../../ccd/seedCCD.js';
import { SYNC_KINDS, readRunning, readTrigger } from '../../syncControl.js';

import { ccdHistoryRowToDoc } from './getCcdHistory.js';

/** wwPDB rsync cron sleeps 24 h between passes. */
const RSYNC_INTERVAL_MS = 24 * 60 * 60 * 1000;
/** wwPDB CCD cron refreshes weekly. */
const CCD_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Register `GET /v1/sync/status` — live state of the rsync and CCD crons:
 * whether each is currently running, whether a manual trigger is queued,
 * the most recent run timestamp (from sqlite for rsync, from the cached
 * archive's mtime for CCD), and the configured cadence so the Settings
 * page can render a "next refresh" estimate without a second round-trip.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetSyncStatusRoute(fastify, db) {
  fastify.get('/v1/sync/status', async (_request, reply) => {
    const rsync = await getRsyncStatus(db);
    const ccd = await getCcdStatus(db);
    return reply.send({ rsync, ccd, kinds: SYNC_KINDS });
  });
}

async function getRsyncStatus(db) {
  const lastByType = {};
  for (const type of ['asymUnit', 'bioAssembly']) {
    const row = db.selectLastRsyncRun.get(type);
    lastByType[type] = row
      ? {
          type: row.type,
          startedAt: row.started_at,
          finishedAt: row.finished_at,
          durationMs: row.duration_ms,
          updatedCount: row.updated_count,
          deletedCount: row.deleted_count,
          lastEntryId: row.last_entry_id,
          bytesOnDisk: row.bytes_on_disk,
        }
      : null;
  }
  return {
    kind: 'rsync',
    label: 'wwPDB rsync',
    intervalMs: RSYNC_INTERVAL_MS,
    running: readRunning('rsync'),
    triggerQueued: readTrigger('rsync'),
    lastAsymUnit: lastByType.asymUnit,
    lastBioAssembly: lastByType.bioAssembly,
  };
}

async function getCcdStatus(db) {
  // Prefer the database row written at the start of each cron pass — it
  // carries the full success/failure/running outcome and the import
  // counts (heartbeated every batch). Fall back to the cached archive's
  // mtime ONLY when no ccd_history row exists at all (e.g. cron-ccd
  // never managed to insert even the start row — a sign that the
  // container is not running, or that the first invocation crashed
  // before the sqlite handle was opened).
  const lastRow = db.selectLastCcdRefresh.get();
  const lastRefresh = lastRow ? ccdHistoryRowToDoc(lastRow) : null;

  // For a row still in 'running' status, finishedAt is NULL — surface
  // `startedAt` instead so the UI shows *something* recent rather than
  // "never refreshed".
  let lastRefreshedAt = lastRefresh
    ? (lastRefresh.finishedAt ?? lastRefresh.startedAt)
    : null;
  let bytesOnDisk = lastRefresh ? lastRefresh.bytesOnDisk : null;
  if (!lastRefreshedAt || bytesOnDisk === null) {
    try {
      const stats = await stat(ccdGzPath);
      if (!lastRefreshedAt) {
        lastRefreshedAt = new Date(stats.mtimeMs).toISOString();
      }
      if (bytesOnDisk === null) {
        bytesOnDisk = stats.size;
      }
    } catch {
      // No CCD archive yet — cron-ccd has not even downloaded it.
    }
  }
  return {
    kind: 'ccd',
    label: 'Chemical Component Dictionary',
    intervalMs: CCD_INTERVAL_MS,
    running: readRunning('ccd'),
    triggerQueued: readTrigger('ccd'),
    lastRefreshedAt,
    bytesOnDisk,
    lastRefresh,
  };
}
