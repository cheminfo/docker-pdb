import { stat } from 'node:fs/promises';

import { ccdGzPath } from '../../ccd/seedCCD.js';
import { SYNC_KINDS, readRunning, readTrigger } from '../../syncControl.js';

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
    const ccd = await getCcdStatus();
    return reply.send({ rsync, ccd, kinds: SYNC_KINDS });
  });
}

async function getRsyncStatus(db) {
  const lastByType = {};
  for (const type of ['asymUnit', 'bioAssembly']) {
    const row = db
      .statement(
        `SELECT type, started_at, finished_at, duration_ms, updated_count,
                deleted_count, last_entry_id, bytes_on_disk
         FROM rsync_history
         WHERE type = ?
         ORDER BY finished_at DESC
         LIMIT 1`,
      )
      .get(type);
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

async function getCcdStatus() {
  let lastRefreshedAt = null;
  let bytesOnDisk = null;
  try {
    const stats = await stat(ccdGzPath);
    lastRefreshedAt = new Date(stats.mtimeMs).toISOString();
    bytesOnDisk = stats.size;
  } catch {
    // No CCD archive yet — pdb-api hasn't seeded the initial copy.
  }
  return {
    kind: 'ccd',
    label: 'Chemical Component Dictionary',
    intervalMs: CCD_INTERVAL_MS,
    running: readRunning('ccd'),
    triggerQueued: readTrigger('ccd'),
    lastRefreshedAt,
    bytesOnDisk,
  };
}
