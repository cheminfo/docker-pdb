// Scan every document in the CouchDB `pdb` database and populate
// `pdb_ligands` from each entry's stored `formula` array. Idempotent: each
// PDB's link rows are replaced atomically (delete + insert) so re-running
// is safe and fast. Run after the first CCD seed and any time the SQLite
// database needs to catch up to CouchDB.

import createDebug from 'debug';
import Nano from 'nano';
import { pino } from 'pino';

import getConfig from './config.js';
import { replacePdbLigands } from './db/insertPdbLigands.js';

const debug = createDebug('pdb-sync:backfill');
const logger = pino({ name: 'backfill-pdb-ligands' });
const config = getConfig();
// eslint-disable-next-line new-cap -- nano factory is invoked as Nano(...)
const nano = Nano(config.couch.fullUrl);
const pdb = nano.db.use(config.asymetrical.couch.database);

const BATCH_SIZE = 500;

/**
 * Walk every PDB doc in CouchDB and rewrite its `pdb_ligands` rows from
 * the stored `formula` array. Streams CouchDB in batches so memory stays
 * flat even on the full ~250k-entry mirror.
 * @returns {Promise<{ processed: number, withLigands: number, totalLigands: number }>} Summary counts.
 */
export async function backfillPdbLigands() {
  let processed = 0;
  let withLigands = 0;
  let totalLigands = 0;
  let startKey;

  /* eslint-disable no-await-in-loop -- intentional sequential pagination */
  while (true) {
    const result = await pdb.list({
      // eslint-disable-next-line camelcase -- nano forwards CouchDB query params verbatim.
      include_docs: true,
      limit: BATCH_SIZE,
      ...(startKey ? { startkey: startKey, skip: 1 } : {}),
    });
    if (result.rows.length === 0) break;

    for (const row of result.rows) {
      if (!row.id || row.id.startsWith('_design/')) continue;
      const doc = row.doc;
      if (!doc) continue;
      const formula = Array.isArray(doc.formula) ? doc.formula : [];
      try {
        const inserted = await replacePdbLigands(row.id.toUpperCase(), formula);
        processed++;
        if (inserted > 0) withLigands++;
        totalLigands += inserted;
      } catch (error) {
        debug('Failed to backfill', row.id, error);
      }
    }

    if (processed % 5000 === 0) {
      logger.info(
        { processed, withLigands, totalLigands },
        'Backfill progress',
      );
    }

    startKey = result.rows.at(-1)?.id;
    if (result.rows.length < BATCH_SIZE) break;
  }
  /* eslint-enable no-await-in-loop */

  logger.info({ processed, withLigands, totalLigands }, 'Backfill complete');
  return { processed, withLigands, totalLigands };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await backfillPdbLigands();
  } catch (error) {
    logger.error({ error }, 'Backfill failed');
    // eslint-disable-next-line unicorn/no-process-exit -- CLI entry point.
    process.exit(1);
  }
}
