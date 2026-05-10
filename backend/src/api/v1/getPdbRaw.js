import { findAsymUnitFile } from '../../common.js';
import { sendRawPdbFile } from '../util/sendRawPdbFile.js';

/**
 * Register `GET /v1/pdbs/:id/raw` — gunzipped asym-unit `.ent.gz` payload.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 */
export function registerGetPdbRawRoute(fastify) {
  fastify.get('/v1/pdbs/:id/raw', (request, reply) =>
    sendRawPdbFile(reply, findAsymUnitFile(String(request.params.id))),
  );
}
