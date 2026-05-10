import { STATS_HANDLERS } from '../util/statsQueries.js';

/**
 * Register `GET /v1/stats/:view` — dispatches to one of the named statistics
 * handlers. The legacy `/stats/:view` alias is preserved so frontend code and
 * external callers continue to work.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetStatsByViewRoute(fastify, db) {
  const handler = async (request, reply) => {
    const handlerFn = STATS_HANDLERS[String(request.params.view)];
    if (!handlerFn) return reply.code(404).send({ error: 'unknown_view' });
    return reply.send(handlerFn(db));
  };
  fastify.get('/v1/stats/:view', handler);
  fastify.get('/stats/:view', handler);
}
