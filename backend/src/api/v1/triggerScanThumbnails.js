import { existsSync } from 'node:fs';

import getConfig from '../../config.js';
import { pymolImagePath } from '../../util/pymol.js';

// Check the 200×200 size as a proxy for "entry has at least one PNG".
const PROBE_WIDTH = 200;
const PROBE_HEIGHT = 200;

/**
 * @typedef {object} ScanThumbnailsState
 * @property {boolean} running - True while the job is in flight.
 * @property {number} scanned - Entries checked so far.
 * @property {number} total - Total assembly entries in the database.
 * @property {number} missing - Entries with no 200×200 PNG on disk.
 * @property {string} startedAt - ISO timestamp when the job started.
 * @property {string | null} finishedAt - ISO timestamp when done, or null.
 */

/**
 * In-flight and most-recent thumbnail scan job state. `null` until the
 * first POST trigger is received.
 * @type {ScanThumbnailsState | null}
 */
let scanState = null;

/**
 * Register `POST /v1/fix/scan-thumbnails` and
 * `GET /v1/fix/scan-thumbnails/status`.
 *
 * The POST endpoint launches a background job that checks on-disk PNG
 * existence for every assembly entry in the database and reports how many
 * are missing. It yields to the event loop every 1 000 entries so the GET
 * status endpoint stays responsive during the scan.
 *
 * The GET endpoint returns the current state of the most-recent scan, or
 * `{ state: null }` if none has been started yet. Poll every few seconds
 * while `state.running === true`.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerScanThumbnailsRoutes(fastify, db) {
  fastify.post('/v1/fix/scan-thumbnails', async (_request, reply) => {
    if (scanState?.running) {
      return reply.send({ status: 'already-running', state: scanState });
    }
    scanState = {
      running: true,
      scanned: 0,
      total: 0,
      missing: 0,
      startedAt: new Date().toISOString(),
      finishedAt: null,
    };
    setImmediate(() => {
      void runScanJob(db);
    });
    return reply.send({ status: 'started', state: scanState });
  });

  fastify.get('/v1/fix/scan-thumbnails/status', async (_request, reply) => {
    return reply.send({ state: scanState });
  });
}

/**
 * Background worker: check every assembly entry's 200×200 PNG and count
 * how many are missing. Yields to the event loop every 1 000 entries so
 * status polls are not blocked.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 * @returns {Promise<void>}
 */
async function runScanJob(db) {
  const { pymolDir } = getConfig();
  const rows = db.selectAllAssemblyIds.all();
  scanState.total = rows.length;

  for (let i = 0; i < rows.length; i++) {
    const path = pymolImagePath(
      pymolDir,
      rows[i].id,
      PROBE_WIDTH,
      PROBE_HEIGHT,
    );
    if (!existsSync(path)) {
      scanState.missing++;
    }
    scanState.scanned++;

    if (i % 1000 === 0) {
      // eslint-disable-next-line no-await-in-loop -- intentional: yield to event loop between batches
      await new Promise((r) => {
        setImmediate(r);
      });
    }
  }

  scanState.running = false;
  scanState.finishedAt = new Date().toISOString();
}
