import { findAssemblyFile } from '../../common.js';
import { sendRawPdbFile } from '../util/sendRawPdbFile.js';

/**
 * Register `GET /v1/assemblies/:id/raw` — gunzipped biological-assembly
 * `.pdb1.gz` payload.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 */
export function registerGetAssemblyRawRoute(fastify) {
  fastify.get('/v1/assemblies/:id/raw', (request, reply) =>
    sendRawPdbFile(reply, findAssemblyFile(String(request.params.id))),
  );
}
