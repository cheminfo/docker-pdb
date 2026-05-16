import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';

import createDebug from 'debug';

import { findAssemblyFile } from '../../common.js';
import getConfig from '../../config.js';
import pymol from '../../util/pymol.js';
import { sendRawPdbFile } from '../util/sendRawPdbFile.js';

const ungzip = promisify(gunzip);
const debug = createDebug('pdb-api:assembly-image');

/**
 * In-flight render promises keyed by the target PNG path. Collapses
 * concurrent requests for the same image into a single pymol invocation.
 * @type {Map<string, Promise<void>>}
 */
const renderQueue = new Map();

/**
 * Render the assembly PNG at `path` on demand, using the `.pdb1.gz` file on
 * disk. Concurrent requests for the same path share one render promise.
 * Returns false when the assembly file is missing.
 * @param {string} id - PDB id (uppercased).
 * @param {string} path - Absolute target PNG path.
 * @param {number} width - Render width in pixels.
 * @param {number} height - Render height in pixels.
 * @returns {Promise<boolean>} True when the PNG was successfully written.
 */
async function renderOnDemand(id, path, width, height) {
  const assemblyFile = findAssemblyFile(id);
  if (!assemblyFile) return false;

  if (renderQueue.has(path)) {
    await renderQueue.get(path);
    return existsSync(path);
  }

  const promise = (async () => {
    try {
      const buffer = await ungzip(await readFile(assemblyFile.path));
      await pymol(id, buffer, path, { width, height });
    } catch (error) {
      debug('on-demand render failed for %s: %o', id, error);
    }
  })();

  renderQueue.set(path, promise);
  try {
    await promise;
  } finally {
    renderQueue.delete(path);
  }

  return existsSync(path);
}

/**
 * Register `GET /v1/assemblies/:id/image/:size` — PyMol-rendered PNG
 * thumbnail of the biological assembly. Also exposes the legacy
 * `/assembly/:id/:size` alias used by older third-party callers.
 *
 * When the `:size` segment looks like a PDB filename (ends with `.pdb` or
 * `.pdb<N>`, e.g. `1JSI.pdb1`), the route serves the raw gunzipped assembly
 * file instead — this handles the legacy `/assembly/:id/:filename` pattern.
 *
 * If the PNG has not been pre-rendered (e.g. the assembly was synced before
 * PyMol was configured, or the render failed during the sync), it is
 * generated on demand and cached to disk for subsequent requests.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 */
export function registerGetAssemblyImageRoute(fastify) {
  const config = getConfig();
  const handler = async (request, reply) => {
    const id = String(request.params.id).toUpperCase();
    const size = String(request.params.size);
    // Legacy callers may request the raw assembly file via /assembly/:id/:filename
    // (e.g. /assembly/1JSI/1JSI.pdb1). Detect by the .pdb suffix and serve it.
    if (/\.pdb\d*$/i.test(size)) {
      return sendRawPdbFile(reply, findAssemblyFile(id));
    }
    if (!/^\d+x\d+\.png$/.test(size) && !/^\d+x\d+$/.test(size)) {
      return reply.code(400).send({ error: 'invalid_size' });
    }
    const filename = size.endsWith('.png') ? size : `${size}.png`;
    const lower = id.toLowerCase();
    const path = join(config.pymolDir, lower.slice(1, 3), lower, filename);

    if (!existsSync(path)) {
      const match = filename.replace('.png', '').match(/^(\d+)x(\d+)$/);
      const width = match ? Number(match[1]) : 200;
      const height = match ? Number(match[2]) : 200;
      const rendered = await renderOnDemand(id, path, width, height);
      if (!rendered) return reply.code(404).send({ error: 'not_found' });
    }

    const buffer = await readFile(path);
    return reply.header('content-type', 'image/png').send(buffer);
  };
  fastify.get('/v1/assemblies/:id/image/:size', handler);
  fastify.get('/assembly/:id/:size', handler);
}
