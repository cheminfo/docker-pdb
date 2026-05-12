import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { open, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';

import { pino } from 'pino';

import { getLigandsDB } from '../db/getDB.js';
import { computeSSIndex } from '../util/computeSSIndex.js';

import { buildMoleculeFromCcdBlock } from './buildMolecule.js';
import { parseCcdMmcif } from './parseCcdMmcif.js';

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
 * Seed (or refresh) the `ligands` and `ligand_ss_index` tables from the
 * wwPDB Chemical Component Dictionary.
 *
 * Steps:
 * 1. Download `components.cif.gz` to `data/ccd/` if it does not exist
 * (or always, when `force = true`).
 * 2. Stream-gunzip + line-parse the file, yielding one chem_comp block
 * at a time.
 * 3. For each block, build an OCL Molecule from the atoms+bonds, derive
 * idCode + coordinates + MF + MW + SS index, and INSERT-OR-REPLACE
 * into SQLite.
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

  const insertLigand = db.upsertLigand;
  const insertSSIndex = db.upsertLigandSSIndex;

  // Insert in small transactions (1000 rows each). One big transaction
  // gave better raw throughput, but it holds an exclusive write lock for
  // the full 5–30 min run, blocking the cron container's writes to
  // `pdb_ligands` for `busy_timeout` (5 s) per PDB. Batching keeps each
  // lock window under ~50 ms so concurrent writers slip through cleanly.
  const BATCH_SIZE = 1000;
  let imported = 0;
  let skipped = 0;
  let inBatch = 0;
  db.db.exec('BEGIN');
  try {
    const fileHandle = await open(ccdGzPath, 'r');
    const stream = fileHandle.createReadStream().pipe(createGunzip());
    const lines = createInterface({ input: stream, crlfDelay: Infinity });

    for await (const block of parseCcdMmcif(lines)) {
      const result = importBlock(block, insertLigand, insertSSIndex);
      if (result === 'imported') imported++;
      else skipped++;
      inBatch++;
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
          logger.warn(
            { error: String(heartbeatError) },
            'CCD heartbeat failed',
          );
        }
        db.db.exec('BEGIN');
        inBatch = 0;
      }
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
 * Build a molecule from one CCD block and INSERT into SQLite. Returns
 * `'imported'` on success or `'skipped'` for blocks we cannot handle
 * (single-atom ions, unknown elements, OCL encoding failure).
 * @param {object} block - One parsed CCD chem_comp block.
 * @param {{ run: (...args: unknown[]) => unknown }} insertLigand - Prepared INSERT for the `ligands` table.
 * @param {{ run: (...args: unknown[]) => unknown }} insertSSIndex - Prepared INSERT for the `ligand_ss_index` table.
 * @returns {'imported' | 'skipped'} Whether the block produced a row.
 */
function importBlock(block, insertLigand, insertSSIndex) {
  const molecule = buildMoleculeFromCcdBlock(block);
  if (!molecule) return 'skipped';
  let idCode;
  let coordinates;
  let mf;
  let mw;
  try {
    ({ idCode, coordinates } = molecule.getIDCodeAndCoordinates());
    const formula = molecule.getMolecularFormula();
    mf = formula.formula;
    mw = formula.relativeWeight;
  } catch {
    return 'skipped';
  }
  if (!idCode) return 'skipped';

  insertLigand.run(
    block.code,
    block.name,
    block.formula,
    block.type,
    idCode,
    coordinates,
    mf,
    mw,
    block.atoms.length,
  );
  const ssIndex = computeSSIndex(molecule);
  insertSSIndex.run(
    block.code,
    ssIndex.ss_index0,
    ssIndex.ss_index1,
    ssIndex.ss_index2,
    ssIndex.ss_index3,
    ssIndex.ss_index4,
    ssIndex.ss_index5,
    ssIndex.ss_index6,
    ssIndex.ss_index7,
  );
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
