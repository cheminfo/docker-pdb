import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { open, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';

import { moleculeFromCif } from 'cif-to-json';
import OCL from 'openchemlib';
import { pino } from 'pino';

import { getLigandsDB } from '../db/getDB.js';

import { splitCifBlocks } from './splitCifBlocks.js';

const logger = pino({ name: 'seed-ccd' });

const CCD_URL =
  'https://files.wwpdb.org/pub/pdb/data/monomers/components.cif.gz';

// `DATA_DIR` env wins so tests can isolate to a tmp dir. The default —
// three `..` from `backend/src/ccd/` — lands at the repo root, where the
// bind-mounted `data/` directory lives. Two `..` would write the cache
// to `backend/data/` inside the image (lost on every container restart).
const dataDir = process.env.DATA_DIR
  ? process.env.DATA_DIR.replace(/\/$/, '')
  : join(import.meta.dirname, '..', '..', '..', 'data');
const ccdDir = join(dataDir, 'ccd');

/** Path to the cached compressed CCD archive on the data volume. */
export const ccdGzPath = join(ccdDir, 'components.cif.gz');

/**
 * Seed (or refresh) the `ligands` table and its companion `ocl_ss_index`
 * fingerprint table (managed by openchemlib-sqlite) from the wwPDB
 * Chemical Component Dictionary.
 *
 * Steps:
 * 1. Download `components.cif.gz` to `data/ccd/` if it does not exist
 * (or always, when `force = true`).
 * 2. Stream-gunzip the file line by line, accumulating each `data_XXX`
 * block into a string and calling `moleculeFromCif` (cif-to-json)
 * once per block.
 * 3. For each block, derive idCode + coordinates + MF + MW, UPSERT into
 * `ligands`, and let `db.molecules.insert(id, molecule)` compute and
 * persist the 512-bit fingerprint into `ocl_ss_index`.
 *
 * Single-atom entries (ions like NA, CL, ZN) and entries OCL cannot
 * encode (unknown elements, malformed bonds) are skipped — they cannot
 * be the target of a substructure search anyway.
 * @param {{ force?: boolean, onProgress?: (counts: { imported: number, skipped: number }) => void | Promise<void> }} [options]
 *   Pass `force: true` to re-download the CCD archive AND re-run the import even if the table already looks populated.
 *   `onProgress` is invoked after every BATCH_SIZE rows so the caller can heartbeat external observers (ccd_history).
 * @returns {Promise<{ imported: number, skipped: number }>} Counts of successfully imported and skipped CCD entries.
 */
export async function seedCCD({ force = false, onProgress } = {}) {
  const db = await getLigandsDB();

  // Fast path: when not forced, skip the multi-minute re-import if the
  // table is already populated. Container restarts and the per-startup
  // `npm run seed-ccd` in compose would otherwise re-import ~30k rows
  // every boot. The weekly cron-ccd container always passes force=true
  // so the periodic refresh still runs.
  if (!force) {
    const row = db.countLigands.get();
    if ((row?.n ?? 0) >= 1000) {
      logger.info(
        { ligandCount: row.n },
        'Ligands table already populated — skipping CCD seed (pass --force to re-import)',
      );
      return { imported: 0, skipped: 0 };
    }
  }

  if (force || !existsSync(ccdGzPath)) {
    await downloadCcd();
  } else {
    logger.info({ path: ccdGzPath }, 'Reusing cached CCD archive');
  }

  let imported = 0;
  let skipped = 0;
  let inBatch = 0;
  const { Molecule } = OCL;
  db.db.exec('BEGIN');
  try {
    const fileHandle = await open(ccdGzPath, 'r');
    const stream = fileHandle.createReadStream().pipe(createGunzip());
    const lines = createInterface({ input: stream, crlfDelay: Infinity });

    for await (const cifText of splitCifBlocks(lines)) {
      ({ imported, skipped, inBatch } = await processBlock(
        cifText,
        db,
        Molecule,
        { imported, skipped, inBatch, onProgress },
      ));
    }

    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  logger.info({ imported, skipped }, 'CCD import complete');
  return { imported, skipped };
}

/**
 * Process one accumulated CDD CIF block: build the molecule, upsert into
 * SQLite, commit a batch if needed, and yield to the event loop periodically.
 * @param {string} cifText - Raw CIF text for one `data_XXX` block.
 * @param {import('../db/getDB.js').LigandsDB} db
 * @param {Function} Molecule - OCL Molecule class.
 * @param {{ imported: number, skipped: number, inBatch: number, onProgress?: Function }} counters
 * @returns {Promise<{ imported: number, skipped: number, inBatch: number }>}
 */
async function processBlock(cifText, db, Molecule, counters) {
  let { imported, skipped, inBatch } = counters;
  const { onProgress } = counters;
  const BATCH_SIZE = 200;
  const YIELD_EVERY = 50;

  const outcome = importBlock(cifText, db, Molecule);
  if (outcome === 'imported') imported++;
  else skipped++;
  inBatch++;

  if ((imported + skipped) % YIELD_EVERY === 0) {
    await new Promise((resolve) => {
      setImmediate(resolve);
    });
  }

  if (inBatch >= BATCH_SIZE) {
    db.db.exec('COMMIT');
    logger.info(
      { imported, skipped, total: imported + skipped },
      'CCD import progress',
    );
    // Heartbeat after each commit, when the write lock is briefly free,
    // so concurrent `pdb_ligands` writers in the rsync container are not
    // stalled by a long held BEGIN…COMMIT envelope.
    try {
      await onProgress?.({ imported, skipped });
    } catch (heartbeatError) {
      logger.warn({ error: String(heartbeatError) }, 'CCD heartbeat failed');
    }
    db.db.exec('BEGIN');
    inBatch = 0;
  }

  return { imported, skipped, inBatch };
}

/**
 * Download `components.cif.gz` from the wwPDB to the local cache. The
 * archive is streamed to a process-private temp file and only renamed
 * over the canonical path when the download completes — so a concurrent
 * reader (or the periodic refresh container racing with `pdb-api`'s
 * initial seed) never sees a half-written file.
 * @returns {Promise<void>} Resolves once the file is fully written to disk.
 */
async function downloadCcd() {
  if (!existsSync(ccdDir)) {
    mkdirSync(ccdDir, { recursive: true });
  }
  const tempPath = `${ccdGzPath}.tmp.${process.pid}`;
  logger.info({ url: CCD_URL, target: ccdGzPath }, 'Downloading CCD archive');
  const response = await fetch(CCD_URL);
  if (!response.ok) {
    throw new Error(`Failed to download CCD: HTTP ${response.status}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(tempPath));
  await rename(tempPath, ccdGzPath);
  logger.info('CCD archive downloaded');
}

/**
 * Build a molecule from one CCD CIF block string and UPSERT into SQLite.
 * Returns `'imported'` on success or `'skipped'` for blocks that cannot
 * be represented as a small molecule (single-atom ions, unknown elements,
 * OCL encoding failure).
 * @param {string} cifText - Raw CIF text for one `data_XXX` block.
 * @param {import('../db/getDB.js').LigandsDB} db - Open ligands database.
 * @param {Function} Molecule - OCL Molecule class.
 * @returns {'imported' | 'skipped'} Whether the block produced a row.
 */
function importBlock(cifText, db, Molecule) {
  const parsed = moleculeFromCif(cifText, Molecule);
  if (!parsed) return 'skipped';
  const { molecule, code, name, formula, type, nbAtoms } = parsed;
  let idCode;
  let coordinates;
  let mf;
  let mw;
  try {
    ({ idCode, coordinates } = molecule.getIDCodeAndCoordinates());
    const molFormula = molecule.getMolecularFormula();
    mf = molFormula.formula;
    mw = molFormula.relativeWeight;
  } catch {
    return 'skipped';
  }
  if (!idCode) return 'skipped';

  const row = db.upsertLigand.get(
    code,
    name,
    formula,
    type,
    idCode,
    coordinates,
    mf,
    mw,
    nbAtoms,
  );
  // openchemlib-sqlite computes the 512-bit fingerprint and writes the
  // matching row to the runtime-managed `ocl_ss_index` table.
  db.molecules.insert(row.id, molecule);
  return 'imported';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const force = process.argv.includes('--force');
  try {
    await seedCCD({ force });
  } catch (error) {
    logger.error({ error }, 'CCD seed failed');
    // eslint-disable-next-line unicorn/no-process-exit -- CLI entry point.
    process.exit(1);
  }
}
