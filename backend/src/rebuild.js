// Rebuilds the sqlite database from the already-rsynced directory. The raw
// `.gz` archives under `data/pdb/` and `data/pdb-assembly/` are the only
// source of truth, so a fresh sqlite file (or a wiped one) can be fully
// reconstructed without re-downloading anything from the wwPDB.

import { parseArgs } from 'node:util';

import createDebug from 'debug';
import { glob } from 'glob';

import * as common from './common.js';
import getConfig from './config.js';
import { getLigandsDB } from './db/getDB.js';

const debug = createDebug('pdb-sync:rebuild');
const config = getConfig();

const { values: argv } = parseArgs({
  options: {
    limit: { type: 'string' },
    file: { type: 'string' },
    fromFile: { type: 'string' },
    toFile: { type: 'string' },
    fromDir: { type: 'string' },
    toDir: { type: 'string' },
    'pdb-asym-unit': { type: 'boolean' },
    'pdb-bio-assembly': { type: 'boolean' },
  },
  strict: false,
});

const file = argv.file?.toLowerCase();
const limit = Number.isFinite(Number(argv.limit))
  ? Number(argv.limit)
  : undefined;
const pattern = file ? `**/*${file}+(.ent|.pdb1).gz` : '**/*+(.ent|.pdb1).gz';

async function getFiles(searchPattern) {
  debug('pattern', searchPattern);
  let files = await glob(searchPattern);
  if (argv.fromFile) {
    files = files.filter((f) => common.getIdFromFileName(f) >= argv.fromFile);
  }
  if (argv.toFile) {
    files = files.filter((f) => common.getIdFromFileName(f) <= argv.toFile);
  }
  if (argv.fromDir) {
    files = files.filter(
      (f) => common.getIdFromFileName(f).slice(1, 3) >= argv.fromDir,
    );
  }
  if (argv.toDir) {
    files = files.filter(
      (f) => common.getIdFromFileName(f).slice(1, 3) <= argv.toDir,
    );
  }
  if (limit) {
    files = files.slice(0, limit);
  }
  return files;
}

function getPdbFiles() {
  if (file) {
    return [common.asymUnitPath(config.asymetrical.rsync.destination, file)];
  }
  return getFiles(config.asymetrical.rsync.destination + pattern);
}

function getAssemblyFiles() {
  if (file) {
    return [common.bioAssemblyPath(config.bioAssembly.rsync.destination, file)];
  }
  return getFiles(config.bioAssembly.rsync.destination + pattern);
}

/**
 * @typedef {object} RebuildProgress
 * @property {number} processed - Files processed so far in this phase.
 * @property {number} total - Total files in this phase.
 * @property {string | undefined} lastEntryId - PDB id of the most recently
 *   processed file, surfaced for live UI display.
 */

/**
 * @typedef {object} RebuildOptions
 * @property {(progress: RebuildProgress) => void | Promise<void>} [onStart] -
 *   Called once with `processed: 0` and the discovered total, right before
 *   the first batch starts. Useful for seeding the live progress marker.
 * @property {(progress: RebuildProgress) => void | Promise<void>} [onProgress] -
 *   Called after every batch (and once after the final batch) so the caller
 *   can update the running marker / log progress.
 */

/**
 * Files per outer transaction during the asym-unit rebuild. Sized so each
 *  exclusive-write window stays well under a second, even on slow disks, so
 *  concurrent CCD / API writers slip through within `busy_timeout` (5 s).
 */
const REBUILD_PDB_BATCH_SIZE = 100;

/**
 * Rebuild every asymmetrical-unit row from the local `data/pdb/` tree.
 * Idempotent: replaces existing rows in-place. Files are processed in
 * batches sharing a single outer transaction, which collapses the per-file
 * fsync overhead and turns hours-long first-boot rebuilds into minutes.
 * @param {RebuildOptions} [options] - Progress callbacks.
 * @returns {Promise<RebuildProgress>} Final progress (processed === total
 *   on success). The caller can use this to flush a "100% — done" marker
 *   regardless of any throttling applied to `onProgress`.
 */
export async function pdb(options = {}) {
  const db = await getLigandsDB();
  const files = await getPdbFiles();
  debug(`Pdb database: about to process ${files.length} files.`);
  await options.onStart?.({
    processed: 0,
    total: files.length,
    lastEntryId: undefined,
  });

  let processed = 0;
  let lastEntryId;
  /* eslint-disable no-await-in-loop -- intentional sequential sqlite writes */
  for (let start = 0; start < files.length; start += REBUILD_PDB_BATCH_SIZE) {
    const batch = files.slice(start, start + REBUILD_PDB_BATCH_SIZE);
    db.db.exec('BEGIN');
    try {
      for (const file of batch) {
        try {
          await common.processPdb(file, { skipTransaction: true });
          lastEntryId = common.getIdFromFileName(file).toUpperCase();
        } catch (error) {
          debug('Exception for file:', file, error);
        }
      }
      db.db.exec('COMMIT');
    } catch (error) {
      db.db.exec('ROLLBACK');
      throw error;
    }
    processed += batch.length;
    await options.onProgress?.({
      processed,
      total: files.length,
      lastEntryId,
    });
  }
  /* eslint-enable no-await-in-loop */

  return { processed, total: files.length, lastEntryId };
}

/**
 * Rebuild every biological-assembly row (and re-render PyMol PNGs that are
 * missing on disk) from the local `data/pdb-assembly/` tree. The DB write
 * for each file is a single statement so per-batch transactions add no
 * meaningful speed-up here — PyMol rendering is the bottleneck — but we
 * still emit progress so the UI can show "12 345 / 215 678" while it runs.
 * @param {RebuildOptions} [options] - Progress callbacks.
 * @returns {Promise<RebuildProgress>} Final progress (processed === total
 *   on success).
 */
export async function assembly(options = {}) {
  await getLigandsDB();
  const files = await getAssemblyFiles();
  debug(`Pdb bio assembly database: about to process ${files.length} files.`);
  await options.onStart?.({
    processed: 0,
    total: files.length,
    lastEntryId: undefined,
  });

  let processed = 0;
  let lastEntryId;
  /* eslint-disable no-await-in-loop -- pymol is heavy; render sequentially */
  for (const file of files) {
    try {
      await common.processPdbAssembly(file);
      lastEntryId = common.getIdFromFileName(file).toUpperCase();
    } catch (error) {
      debug('Exception for file:', file, error);
    }
    processed++;
    await options.onProgress?.({
      processed,
      total: files.length,
      lastEntryId,
    });
  }
  /* eslint-enable no-await-in-loop */

  return { processed, total: files.length, lastEntryId };
}

if (process.argv[1] === import.meta.filename) {
  let asymUnit = argv['pdb-asym-unit'];
  let bioAssembly = argv['pdb-bio-assembly'];
  if (!asymUnit && !bioAssembly) {
    asymUnit = true;
    bioAssembly = true;
  }
  if (asymUnit) await pdb();
  if (bioAssembly) await assembly();
}
