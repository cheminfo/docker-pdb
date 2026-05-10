/**
 * Register `GET /v1/ligands/:code` — fetch a single ligand row by code.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetLigandByCodeRoute(fastify, db) {
  fastify.get('/v1/ligands/:code', async (request, reply) => {
    const code = String(request.params.code).toUpperCase();
    const ligand = db
      .statement(
        `SELECT l.code, l.name, l.formula, l.type, l.mf, l.mw, l.nb_atoms AS nbAtoms,
                l.id_code AS idCode, l.coordinates,
                COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
         FROM ligands l WHERE l.code = ?`,
      )
      .get(code);
    if (!ligand) return reply.code(404).send({ error: 'not_found' });
    return reply.send({ ligand: { ...ligand } });
  });
}
