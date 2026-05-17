import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';

import { findAsymUnitFile } from '../../common.js';
import { parse as parsePdb } from '../../util/pdbParser.js';

const ungzip = promisify(gunzip);

/**
 * @typedef {object} RebuildTitlesState
 * @property {boolean} running - True while the job is in flight.
 * @property {number} processed - Entries processed so far.
 * @property {number} total - Total entries with an empty title.
 * @property {number} fixed - Entries whose title was successfully populated.
 * @property {number} skipped - Entries with no raw file or still-empty title after parse.
 * @property {string} startedAt - ISO timestamp when the job started.
 * @property {string | null} finishedAt - ISO timestamp when the job finished, or null.
 */

/**
 * In-flight and most-recent rebuild-titles job state.
 * @type {RebuildTitlesState | null}
 */
let rebuildState = null;

/**
 * Register `POST /v1/fix/rebuild-titles` and
 * `GET /v1/fix/rebuild-titles/status`.
 *
 * The POST endpoint launches a background job that re-parses every entry
 * whose `title` column is empty. For each such entry the raw `.ent.gz` file
 * is read from disk, parsed, and — if the parser returns a non-empty title —
 * the `pdb_entries` and `pdb_title_fts` tables are updated.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerRebuildTitlesRoutes(fastify, db) {
  fastify.post('/v1/fix/rebuild-titles', async (_request, reply) => {
    if (rebuildState?.running) {
      return reply.send({ status: 'already-running', state: rebuildState });
    }
    rebuildState = {
      running: true,
      processed: 0,
      total: 0,
      fixed: 0,
      skipped: 0,
      startedAt: new Date().toISOString(),
      finishedAt: null,
    };
    setImmediate(() => {
      void runRebuildTitlesJob(db);
    });
    return reply.send({ status: 'started', state: rebuildState });
  });

  fastify.get('/v1/fix/rebuild-titles/status', async (_request, reply) => {
    return reply.send({ state: rebuildState });
  });
}

/**
 * Background worker: for each entry with an empty title, read and re-parse the
 * on-disk raw file, then update the DB if the parser finds a title. Yields
 * between entries via `setImmediate` so the HTTP server remains responsive.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 * @returns {Promise<void>}
 */
async function runRebuildTitlesJob(db) {
  const rows = db.selectEmptyTitleIds.all();
  rebuildState.total = rows.length;

  /* eslint-disable no-await-in-loop -- intentional sequential sqlite writes */
  for (const { id } of rows) {
    const file = findAsymUnitFile(id);
    if (!file) {
      rebuildState.skipped++;
      rebuildState.processed++;
      // Yield after every entry so the event loop can serve HTTP requests.
      await new Promise((resolve) => {
        setImmediate(resolve);
      });
      continue;
    }

    try {
      const data = await readFile(file.path);
      const buffer = await ungzip(data);
      const parsed = parsePdb(buffer.toString());

      if (parsed.title) {
        db.db.exec('BEGIN');
        try {
          db.updatePdbTitle.run(parsed.title, id);
          db.deletePdbTitleFts.run(id);
          db.insertPdbTitleFts.run(id, parsed.title);
          db.db.exec('COMMIT');
        } catch (error) {
          db.db.exec('ROLLBACK');
          throw error;
        }
        rebuildState.fixed++;
      } else {
        rebuildState.skipped++;
      }
    } catch {
      rebuildState.skipped++;
    }

    rebuildState.processed++;
    // Yield after every entry so the event loop can serve HTTP requests.
    await new Promise((resolve) => {
      setImmediate(resolve);
    });
  }
  /* eslint-enable no-await-in-loop */

  rebuildState.running = false;
  rebuildState.finishedAt = new Date().toISOString();
}
