import { existsSync } from 'node:fs';

import fastifyStatic from '@fastify/static';

// URL prefixes that belong to the JSON API. A 404 inside any of these must
// stay a JSON 404 instead of falling through to the SPA index. Includes
// `/v1/...` and the four legacy aliases registered alongside it.
const API_PREFIXES = [
  '/v1/',
  '/pdb/',
  '/pdbs',
  '/assembly/',
  '/assemblies/',
  '/stats/',
  '/view/',
  '/rsync-history',
  '/find/',
];

/**
 * Serve a built React/Vite bundle from `staticDir` and add a SPA fallback
 * (any non-API GET that misses → `index.html`) so client-side routes like
 * `/browse` reload correctly. Anything inside `API_PREFIXES` keeps its JSON
 * 404 behavior.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {{ staticDir: string }} options - Absolute path to the bundle.
 */
export async function registerStatic(fastify, { staticDir }) {
  await fastify.register(fastifyStatic, {
    root: staticDir,
    wildcard: false,
  });

  fastify.setNotFoundHandler((request, reply) => {
    const isApi = API_PREFIXES.some((prefix) => request.url.startsWith(prefix));
    const wantsHtml = request.headers.accept?.includes('text/html') ?? false;

    if (request.method !== 'GET' || isApi || !wantsHtml) {
      reply.code(404).send({ error: 'Not Found' });
      return;
    }
    return reply.sendFile('index.html');
  });
}

/**
 * Resolve the directory containing the built React/Vite bundle. Honors
 * `STATIC_DIR` if set; otherwise points at `backend/public/`, where the
 * Docker build copies the Vite output.
 * @returns {string | undefined} Absolute path, or undefined if no bundle exists.
 */
export function resolveStaticDir() {
  const fromEnv = process.env.STATIC_DIR;
  const candidate =
    fromEnv ?? new URL('../../public', import.meta.url).pathname;

  return existsSync(candidate) ? candidate : undefined;
}
