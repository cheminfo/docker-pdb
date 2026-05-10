import { readPdbDoc } from '../../db/readPdbEntry.js';

/**
 * Register `GET /v1/pdbs/jsmol` — entries that match the legacy CouchDB
 * `_design/query/jsmol` filter:
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
    const candidates = db
      .statement(
        `SELECT e.id
         FROM pdb_entries e
         WHERE e.nb_residues BETWEEN 100 AND 500
           AND e.nb_modified_residues = 0
           AND e.nb_sheets > 5
           AND EXISTS (SELECT 1 FROM pdb_helices h
                       WHERE h.pdb_id = e.id AND (h.res_to - h.res_from) >= 10)
           AND EXISTS (SELECT 1 FROM pdb_sheets s
                       WHERE s.pdb_id = e.id AND (s.res_to - s.res_from) >= 10)
           AND EXISTS (SELECT 1 FROM pdb_formulas f
                       WHERE f.pdb_id = e.id AND f.label <> 'HOH'
                         AND f.mw >= 150 AND f.mw <= 500)`,
      )
      .all()
      .map((row) => row.id);

    const rows = [];
    for (const id of candidates) {
      const doc = readPdbDoc(db, id);
      if (doc) {
        rows.push({ id, key: null, value: null, doc });
      }
    }
    return reply.send({
      // eslint-disable-next-line camelcase -- legacy CouchDB-shaped key
      total_rows: rows.length,
      offset: 0,
      rows,
    });
  };
  fastify.get('/v1/pdbs/jsmol', handler);
  fastify.get('/view/jsmol', handler);
}
