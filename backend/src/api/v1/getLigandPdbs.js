import { clampLimit } from '../util/clampLimit.js';

const DEFAULT_MAX_PDBS_PER_PAGE = 100;

/**
 * Register `GET /v1/ligands/:code/pdbs` — paginated list of PDB ids that
 * contain the given ligand code.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetLigandPdbsRoute(fastify, db) {
  fastify.get('/v1/ligands/:code/pdbs', async (request, reply) => {
    const code = String(request.params.code).toUpperCase();
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, DEFAULT_MAX_PDBS_PER_PAGE, 1, 1000);
    const offset = clampLimit(query.offset, 0, 0, 1_000_000);

    const total = db
      .statement(`SELECT COUNT(*) AS n FROM pdb_ligands WHERE ligand_code = ?`)
      .get(code).n;
    const pdbs = db
      .statement(
        `SELECT pdb_id AS pdbId, count
         FROM pdb_ligands
         WHERE ligand_code = ?
         ORDER BY pdb_id
         LIMIT ? OFFSET ?`,
      )
      .all(code, limit, offset)
      .map((row) => ({ ...row }));
    return reply.send({ total, limit, offset, pdbs });
  });
}
