import { clampLimit } from '../util/clampLimit.js';

/**
 * Register `GET /v1/rsync-history` — recent rsync runs (asym-unit by default,
 * or `?type=bioAssembly`) with size and timing stats.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetRsyncHistoryRoute(fastify, db) {
  fastify.get('/v1/rsync-history', async (request, reply) => {
    const query = request.query ?? {};
    const type = query.type === 'bioAssembly' ? 'bioAssembly' : 'asymUnit';
    const limit = clampLimit(query.limit, 20, 1, 200);
    const rows = db
      .statement(
        `SELECT type, started_at, finished_at, duration_ms, updated_count,
                deleted_count, last_entry_id, bytes_on_disk
         FROM rsync_history
         WHERE type = ?
         ORDER BY finished_at DESC
         LIMIT ?`,
      )
      .all(type, limit)
      .map((row) => ({
        type: row.type,
        startedAt: row.started_at,
        finishedAt: row.finished_at,
        durationMs: row.duration_ms,
        updatedCount: row.updated_count,
        deletedCount: row.deleted_count,
        lastEntryId: row.last_entry_id,
        bytesOnDisk: row.bytes_on_disk,
      }));
    return reply.send({ rows });
  });
}
