import { readPdbDoc } from '../../db/readPdbEntry.js';

/**
 * Register `GET /v1/pdbs/jsmol` — entries matching the JSmol-friendly filter:
 *  - 100 ≤ nbResidues ≤ 500
 *  - nbModifiedResidues = 0
 *  - nbSheets > 5  AND max sheet length ≥ 10
 *  - max helix length ≥ 10
 *  - 150 ≤ max formula MW ≤ 500
 *
 * Also exposes the legacy `/view/jsmol` alias used by older third-party
 * callers.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetJsmolPdbsRoute(fastify, db) {
  const handler = async (_request, reply) => {
    const candidates = db.selectJsmolPdbCandidates.all().map((row) => row.id);

    const rows = [];
    for (const id of candidates) {
      const doc = readPdbDoc(db, id);
      if (doc) {
        rows.push({ id, key: null, value: null, doc });
      }
    }
    return reply.send({
      // eslint-disable-next-line camelcase -- legacy snake_case response shape preserved for backward compatibility
      total_rows: rows.length,
      offset: 0,
      rows,
    });
  };
  fastify.get('/v1/pdbs/jsmol', handler);
  fastify.get('/view/jsmol', handler);
}
