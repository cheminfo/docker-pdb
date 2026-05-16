import { findAsymUnitFile } from '../../common.js';
import { sendRawPdbFile } from '../util/sendRawPdbFile.js';

function handleRawPdb(request, reply) {
  return sendRawPdbFile(reply, findAsymUnitFile(String(request.params.id)));
}

/**
 * Register `GET /v1/pdbs/:id/raw` — gunzipped asym-unit `.ent.gz` payload.
 * Also registers the legacy CouchDB-style alias `GET /pdb/:id/:filename`
 * (e.g. `/pdb/3V8N/3V8N.pdb`) so existing third-party callers keep working.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 */
export function registerGetPdbRawRoute(fastify) {
  fastify.get('/v1/pdbs/:id/raw', handleRawPdb);
  fastify.get('/pdb/:id/:filename', handleRawPdb);
}
