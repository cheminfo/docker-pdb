/**
 * Register `GET /v1/ligands/:code` — fetch a single ligand row by code.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetLigandByCodeRoute(fastify, db) {
  fastify.get('/v1/ligands/:code', async (request, reply) => {
    const code = String(request.params.code).toUpperCase();
    const ligand = db.selectLigandByCode.get(code);
    if (!ligand) return reply.code(404).send({ error: 'not_found' });
    return reply.send({ ligand: { ...ligand } });
  });
}
