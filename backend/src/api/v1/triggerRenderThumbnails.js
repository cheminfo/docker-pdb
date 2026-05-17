import { findAssemblyFile, processPdbAssembly } from '../../common.js';
import {
  getPymolConcurrency,
  runWithConcurrency,
} from '../../util/concurrencyPool.js';

/**
 * @typedef {object} RenderThumbnailsState
 * @property {boolean} running - True while the job is in flight.
 * @property {number} processed - Entries processed so far.
 * @property {number} total - Total entries with `has_assembly = 1`.
 * @property {number} rendered - PNG sizes successfully written.
 * @property {number} skipped - PNG sizes that already existed.
 * @property {number} failed - PNG sizes (or assembly files) that could not be rendered.
 * @property {string} startedAt - ISO timestamp when the job started.
 * @property {string | null} finishedAt - ISO timestamp when the job finished, or null.
 */

/**
 * In-flight and most-recent thumbnail render job state. `null` until the
 * first POST trigger is received.
 * @type {RenderThumbnailsState | null}
 */
let renderState = null;

/**
 * Register `POST /v1/fix/render-thumbnails` and
 * `GET /v1/fix/render-thumbnails/status`.
 *
 * The POST endpoint launches a background job that calls
 * `processPdbAssembly` (without `forceRender`) for every entry with
 * `has_assembly = 1`. Pre-existing PNGs are kept — only missing sizes are
 * rendered, so the job is safe to re-run and is idempotent.
 *
 * The GET endpoint returns the current state of the most-recent job, or
 * `{ state: null }` if none has been started yet. Poll every few seconds
 * while `state.running === true`.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerRenderThumbnailsRoutes(fastify, db) {
  fastify.post('/v1/fix/render-thumbnails', async (_request, reply) => {
    if (renderState?.running) {
      return reply.send({ status: 'already-running', state: renderState });
    }
    renderState = {
      running: true,
      processed: 0,
      total: 0,
      rendered: 0,
      skipped: 0,
      failed: 0,
      startedAt: new Date().toISOString(),
      finishedAt: null,
    };
    setImmediate(() => {
      void runRenderJob(db);
    });
    return reply.send({ status: 'started', state: renderState });
  });

  fastify.get('/v1/fix/render-thumbnails/status', async (_request, reply) => {
    return reply.send({ state: renderState });
  });
}

/**
 * Background worker: render missing PyMol thumbnail sizes for every assembly
 * entry in the database. Uses bounded concurrency via
 * `PYMOL_CONCURRENCY`. Updates `renderState` in-place; the GET status
 * endpoint reads it directly (single-threaded event loop, no locking needed).
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 * @returns {Promise<void>}
 */
async function runRenderJob(db) {
  const rows = db.selectAllAssemblyIds.all();
  renderState.total = rows.length;

  await runWithConcurrency(
    rows,
    async ({ id }) => {
      const assemblyFile = findAssemblyFile(id);
      if (!assemblyFile) {
        renderState.processed++;
        renderState.failed++;
        return;
      }
      const fileStats = await processPdbAssembly(assemblyFile.path);
      renderState.processed++;
      renderState.rendered += fileStats.rendered;
      renderState.skipped += fileStats.skipped;
      renderState.failed += fileStats.failed;
    },
    {
      concurrency: getPymolConcurrency(),
      onError: () => {
        renderState.processed++;
        renderState.failed++;
      },
    },
  );

  renderState.running = false;
  renderState.finishedAt = new Date().toISOString();
}
