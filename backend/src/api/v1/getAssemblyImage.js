import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import getConfig from '../../config.js';

/**
 * Register `GET /v1/assemblies/:id/image/:size` — PyMol-rendered PNG
 * thumbnail of the biological assembly. Also exposes the legacy
 * `/assembly/:id/:size` alias used by older third-party callers.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 */
export function registerGetAssemblyImageRoute(fastify) {
  const config = getConfig();
  const handler = async (request, reply) => {
    const id = String(request.params.id).toUpperCase();
    const size = String(request.params.size);
    if (!/^\d+x\d+\.png$/.test(size) && !/^\d+x\d+$/.test(size)) {
      return reply.code(400).send({ error: 'invalid_size' });
    }
    const filename = size.endsWith('.png') ? size : `${size}.png`;
    const lower = id.toLowerCase();
    const path = join(config.pymolDir, lower.slice(1, 3), lower, filename);
    if (!existsSync(path)) return reply.code(404).send({ error: 'not_found' });
    const stream = await readFile(path);
    return reply.header('content-type', 'image/png').send(stream);
  };
  fastify.get('/v1/assemblies/:id/image/:size', handler);
  fastify.get('/assembly/:id/:size', handler);
}
