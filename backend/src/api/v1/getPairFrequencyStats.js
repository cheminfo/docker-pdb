import { pairFrequency } from '../util/statsQueries.js';

/**
 * Register `GET /v1/stats/pairFrequency` — residue-pair co-occurrence counts,
 * optionally restricted to an `[fromYear, toYear]` window. Mirrors the
 * legacy CouchDB `pairFrequencyByYear` view via the `/stats/pairFrequency`
 * alias.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetPairFrequencyStatsRoute(fastify, db) {
  const handler = async (request, reply) => {
    const query = request.query ?? {};
    const fromYear = Number.parseInt(query.fromYear, 10);
    const toYear = Number.parseInt(query.toYear, 10);
    const range =
      Number.isFinite(fromYear) && Number.isFinite(toYear)
        ? [fromYear, toYear]
        : null;
    return reply.send(pairFrequency(db, range));
  };
  fastify.get('/v1/stats/pairFrequency', handler);
  fastify.get('/stats/pairFrequency', handler);
}
