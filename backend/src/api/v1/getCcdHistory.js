import { clampLimit } from '../util/clampLimit.js';

/**
 * Register `GET /v1/ccd-history` — recent CCD refresh runs (each row is one
 * full pass of the weekly cron, or a manually-triggered refresh) with
 * success/failure status, import counters, archive size and timing.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetCcdHistoryRoute(fastify, db) {
  fastify.get('/v1/ccd-history', async (request, reply) => {
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, 20, 1, 200);
    const rows = db.selectCcdHistory.all(limit).map(rowToDoc);
    return reply.send({ rows });
  });
}

/**
 * Convert a `ccd_history` row to the camel-cased shape the frontend
 * consumes. Exported so `/v1/sync/status` can reuse the same mapping
 * for its `lastRefresh` field.
 * @param {object} row - A row returned by `selectCcdHistory` / `selectLastCcdRefresh`.
 * @returns {object} Camel-cased CCD-history record.
 */
export function ccdHistoryRowToDoc(row) {
  return rowToDoc(row);
}

function rowToDoc(row) {
  return {
    id: row.id,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    durationMs: row.duration_ms,
    status: row.status,
    importedCount: row.imported_count,
    skippedCount: row.skipped_count,
    bytesOnDisk: row.bytes_on_disk,
    error: row.error,
    pid: row.pid,
    lastHeartbeatAt: row.last_heartbeat_at,
  };
}
