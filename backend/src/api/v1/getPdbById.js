import { readPdbDoc } from '../../db/readPdbEntry.js';

/**
 * Register `GET /v1/pdbs/:id` — fetch a parsed PDB document. Also exposes the
 * legacy `/pdb/:id` alias preserved for third-party callers.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetPdbByIdRoute(fastify, db) {
  const handler = async (request, reply) => {
    const id = String(request.params.id).toUpperCase();
    const doc = readPdbDoc(db, id);
    if (!doc) return reply.code(404).send({ error: 'not_found' });
    return reply.send(doc);
  };
  fastify.get('/v1/pdbs/:id', handler);
  fastify.get('/pdb/:id', handler);
}
