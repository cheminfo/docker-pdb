import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import fastifyStatic from '@fastify/static';

import { injectTrackingScript } from './injectTrackingScript.js';
import { injectPageMeta } from './pageMeta.js';
import { buildSitemap } from './sitemap.js';

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
 * Where the site is being served from, as the canonical addresses and the
 * sitemap write it.
 * @param {import('fastify').FastifyRequest} request - The request being answered.
 * @returns {string} The origin, e.g. `https://pdb.cheminfo.org`.
 */
function originOf(request) {
  return `${request.protocol}://${request.host}`;
}

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
    index: false,
    wildcard: false,
    // The page itself is never served as a file: it is answered below, with the
    // head of the route that asked for it.
    allowedPath: (pathName) => pathName !== '/index.html',
  });

  // Read once and rewritten per request: every address the frontend routes
  // itself is a page of its own, and must be titled and canonicalised as one.
  // The analytics snippet goes in at startup, so it is in the page whichever
  // address the visitor arrived at.
  const index = injectTrackingScript(
    readFileSync(join(staticDir, 'index.html'), 'utf8'),
    process.env.TRACKING_SCRIPT,
  );
  const sendIndex = (request, reply) =>
    reply
      .type('text/html; charset=utf-8')
      .send(
        injectPageMeta(index, { url: request.url, origin: originOf(request) }),
      );

  fastify.get('/', sendIndex);
  fastify.get('/sitemap.xml', (request, reply) =>
    reply
      .type('application/xml; charset=utf-8')
      .send(buildSitemap(originOf(request))),
  );

  fastify.setNotFoundHandler((request, reply) => {
    const isApi = API_PREFIXES.some((prefix) => request.url.startsWith(prefix));
    const wantsHtml = request.headers.accept?.includes('text/html') ?? false;

    if (request.method !== 'GET' || isApi || !wantsHtml) {
      reply.code(404).send({ error: 'Not Found' });
      return;
    }
    return sendIndex(request, reply);
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
