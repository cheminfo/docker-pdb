/**
 * Register `GET /v1/database/info` — totals for the asym-unit and bio-assembly
 * archives, formatted to match the legacy `/pdb/` and `/assembly/` envelope
 * so the frontend's stats page and third-party callers keep working unchanged.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetDatabaseInfoRoute(fastify, db) {
  fastify.get('/v1/database/info', async (_request, reply) => {
    const totals = db.pdbDatabaseTotals.get();
    return reply.send({
      pdb: {
        // eslint-disable-next-line camelcase -- legacy snake_case key preserved for backward compatibility
        doc_count: totals?.pdb_count ?? 0,
        sizes: { file: totals?.pdb_bytes ?? 0 },
      },
      assembly: {
        // eslint-disable-next-line camelcase -- legacy snake_case key preserved for backward compatibility
        doc_count: totals?.assembly_count ?? 0,
        sizes: { file: totals?.assembly_bytes ?? 0 },
      },
    });
  });
}
