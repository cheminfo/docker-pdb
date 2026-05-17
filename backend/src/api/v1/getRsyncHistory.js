import { clampLimit } from '../util/clampLimit.js';

/**
 * Convert a `rsync_history` row to the camel-cased shape the frontend
 * consumes. Exported so `/v1/sync/status` can reuse the same mapping
 * for its `lastAsymUnit` / `lastBioAssembly` fields.
 * @param {any} row - A row returned by `selectRsyncHistory` / `selectLastRsyncRun`.
 * @returns {object} Camel-cased rsync-history record.
 */
export function rsyncHistoryRowToDoc(row) {
  return {
    type: row.type,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    durationMs: row.duration_ms,
    updatedCount: row.updated_count,
    deletedCount: row.deleted_count,
    lastEntryId: row.last_entry_id,
    bytesOnDisk: row.bytes_on_disk,
  };
}

/**
 * Register `GET /v1/rsync-history` — recent rsync runs (asym-unit by default,
 * or `?type=bioAssembly`) with size and timing stats. Pass `?hasEntry=true` to
 * return only runs that have a non-null `lastEntryId`.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetRsyncHistoryRoute(fastify, db) {
  fastify.get('/v1/rsync-history', async (request, reply) => {
    const query = request.query ?? {};
    const type = query.type === 'bioAssembly' ? 'bioAssembly' : 'asymUnit';
    const limit = clampLimit(query.limit, 20, 1, 200);
    const hasEntry = query.hasEntry === 'true';
    const stmt = hasEntry
      ? db.selectRsyncHistoryWithEntry
      : db.selectRsyncHistory;
    const rows = stmt.all(type, limit).map(rsyncHistoryRowToDoc);
    return reply.send({ rows });
  });
}
