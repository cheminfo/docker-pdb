import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';

import createDebug from 'debug';

import getConfig from './config.js';
import { getLigandsDB } from './db/getDB.js';
import { replacePdbLigandInstancesSync } from './db/insertPdbLigandInstances.js';
import { markAssemblySync, upsertPdbEntrySync } from './db/upsertPdbEntry.js';
import { parse as parsePdb } from './util/pdbParser.js';
import pymol, { pymolImagePath } from './util/pymol.js';

const ungzip = promisify(gunzip);
const MAX_BUFFER_LENGTH = 150 * 1024 * 1024;

const debug = createDebug('pdb-sync:common');
const config = getConfig();

/**
 * Extract the 4-character PDB id from a `pdb<id>.ent.gz` or `<id>.pdb1.gz`
 * filename. Always lowercased; callers uppercase as needed.
 * @param {string} filename - Path or basename containing the PDB id.
 * @returns {string} Lowercased PDB id (or empty string if it cannot be parsed).
 */
export function getIdFromFileName(filename) {
  return filename
    .replace(/^.*\/pdb([^.]*)\.ent\.gz/, '$1')
    .replace(/^.*\/([^.]*)\.pdb1.gz/, '$1');
}

/**
 * Parse a single asymmetrical-unit `.ent.gz` file and persist its parsed
 * metadata to sqlite. The original gzipped file stays on disk and is the
 * single source of truth for the PDB binary; the API server streams it
 * back on demand.
 * @param {string} filename - Path to the gzipped `.ent` file.
 * @param {object} [options] - Tuning options.
 * @param {boolean} [options.skipTransaction] - When true, the inner sqlite
 *   writes assume the caller has already opened an outer transaction. Used
 *   by the batched rebuild path so 100 files share a single fsync.
 * @returns {Promise<void>}
 */
export async function processPdb(filename, options = {}) {
  debug(`Process: ${filename}`);
  const id = getIdFromFileName(filename).toUpperCase();
  if (id.length !== 4) {
    debug(`Skipping ${filename}: cannot extract PDB id`);
    return;
  }
  const data = await readFile(filename);
  const buffer = await ungzip(data);
  const parsed = parsePdb(buffer.toString());

  const skipTransaction = Boolean(options.skipTransaction);
  const db = await getLigandsDB();
  upsertPdbEntrySync(db, id, parsed, {
    rawSize: buffer.length,
    skipTransaction,
  });
  replacePdbLigandInstancesSync(db, id, parsed.ligandInstances || [], {
    skipTransaction,
  });
  debug('Entry saved:', id);
}

/**
 * Process a list of asymmetrical-unit files sequentially. Errors on one file
 * do not stop processing of the remaining files.
 * @param {string[]} files - Paths to gzipped `.ent.gz` files.
 * @returns {Promise<void>}
 */
export async function processPdbs(files) {
  /* eslint-disable no-await-in-loop -- intentional sequential sqlite writes */
  for (const file of files) {
    try {
      await processPdb(file);
    } catch (error) {
      debug('Exception for file:', file, error);
    }
  }
  /* eslint-enable no-await-in-loop */
}

/**
 * Render and persist PyMol bio-assembly thumbnails for `filename`. The
 * decompressed `.pdb1` file is not stored anywhere — the API server gunzips
 * the `.gz` archive on the fly. Pre-existing PNGs at the same size are kept,
 * which keeps `npm run rebuild-db` fast to re-run.
 * @param {string} filename - Path to the gzipped `.pdb1` bio-assembly file.
 * @returns {Promise<void>}
 */
export async function processPdbAssembly(filename) {
  const id = getIdFromFileName(filename).toUpperCase();
  if (id.length !== 4) {
    debug(`Skipping ${filename}: cannot extract PDB id`);
    return;
  }
  debug('Process pdb assembly:', id);

  const data = await readFile(filename);
  const buffer = await ungzip(data);

  if (buffer.length >= MAX_BUFFER_LENGTH) {
    debug(`Skipping ${id}: assembly too large (${buffer.length} bytes)`);
    return;
  }

  const sizes = config.pymol ?? [];
  /* eslint-disable no-await-in-loop -- pymol is heavy; render sequentially */
  for (const size of sizes) {
    const target = pymolImagePath(config.pymolDir, id, size.width, size.height);
    try {
      await pymol(id, buffer, target, size);
    } catch (error) {
      debug(
        `pymol render failed for ${id} ${size.width}x${size.height}:`,
        error.toString(),
      );
    }
  }
  /* eslint-enable no-await-in-loop */

  const db = await getLigandsDB();
  markAssemblySync(db, id, buffer.length);
}

/**
 * Process a list of bio-assembly files sequentially. Errors on one file do
 * not stop the remaining files.
 * @param {string[]} files - Paths to `.pdb1.gz` files.
 * @returns {Promise<void>}
 */
export async function processPdbAssemblies(files) {
  /* eslint-disable no-await-in-loop -- pymol is heavy; render sequentially */
  for (const file of files) {
    try {
      await processPdbAssembly(file);
    } catch (error) {
      debug('Exception for file:', file, error);
    }
  }
  /* eslint-enable no-await-in-loop */
}

/**
 * Build the canonical on-disk path of the gzipped asymmetrical-unit file
 * (`<root>/<bb>/pdb<id>.ent.gz`) for a given PDB id, mirroring the wwPDB
 * `pub/pdb/data/structures/divided/pdb` layout. Pure path arithmetic — does
 * not check for existence.
 * @param {string} root - Local root of the asymmetrical-unit tree.
 * @param {string} pdbId - PDB id (any case).
 * @returns {string} Absolute path to the would-be file.
 */
export function asymUnitPath(root, pdbId) {
  const lower = pdbId.toLowerCase();
  return join(root, lower.slice(1, 3), `pdb${lower}.ent.gz`);
}

/**
 * Build the canonical on-disk path of the gzipped bio-assembly file
 * (`<root>/<bb>/<id>.pdb1.gz`). Pure path arithmetic — does not check for
 * existence.
 * @param {string} root - Local root of the bio-assembly tree.
 * @param {string} pdbId - PDB id (any case).
 * @returns {string} Absolute path to the would-be file.
 */
export function bioAssemblyPath(root, pdbId) {
  const lower = pdbId.toLowerCase();
  return join(root, lower.slice(1, 3), `${lower}.pdb1.gz`);
}

/**
 * Resolve the canonical on-disk path for the gzipped asymmetrical-unit file
 * of a given PDB id. Returns `null` when the file is not present.
 * @param {string} pdbId - PDB id (any case).
 * @returns {{ path: string, size: number } | null} Resolved path + size, or null.
 */
export function findAsymUnitFile(pdbId) {
  const path = asymUnitPath(config.asymetrical.rsync.destination, pdbId);
  if (!existsSync(path)) return null;
  return { path, size: statSync(path).size };
}

/**
 * Resolve the canonical on-disk path for the gzipped bio-assembly file of a
 * given PDB id. Returns `null` when the file is not present.
 * @param {string} pdbId - PDB id (any case).
 * @returns {{ path: string, size: number } | null} Resolved path + size, or null.
 */
export function findAssemblyFile(pdbId) {
  const path = bioAssemblyPath(config.bioAssembly.rsync.destination, pdbId);
  if (!existsSync(path)) return null;
  return { path, size: statSync(path).size };
}
