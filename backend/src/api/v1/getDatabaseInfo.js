/**
 * Register `GET /v1/database/info` — totals for the asym-unit and bio-assembly
 * archives, formatted to match the legacy CouchDB `/pdb/`, `/assembly/`
 * envelope so the frontend's stats page keeps working unchanged.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetDatabaseInfoRoute(fastify, db) {
  fastify.get('/v1/database/info', async (_request, reply) => {
    const totals = db
      .statement(
        `SELECT COUNT(*)                                      AS pdb_count,
                COALESCE(SUM(raw_size), 0)                    AS pdb_bytes,
                SUM(CASE WHEN has_assembly = 1 THEN 1 ELSE 0 END) AS assembly_count,
                COALESCE(SUM(CASE WHEN has_assembly = 1 THEN assembly_size ELSE 0 END), 0) AS assembly_bytes
         FROM pdb_entries`,
      )
      .get();
    return reply.send({
      pdb: {
        // eslint-disable-next-line camelcase -- legacy CouchDB-shaped key
        doc_count: totals?.pdb_count ?? 0,
        sizes: { file: totals?.pdb_bytes ?? 0 },
      },
      assembly: {
        // eslint-disable-next-line camelcase -- legacy CouchDB-shaped key
        doc_count: totals?.assembly_count ?? 0,
        sizes: { file: totals?.assembly_bytes ?? 0 },
      },
    });
  });
}
