import { exec } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import createDebug from 'debug';
import gm from 'gm';

const debug = createDebug('pdb-sync:pymol');

/**
 * Render a PyMol PNG of `pdb` and persist it to disk at `outputPath`.
 * Returns `{ outputPath, status }` so the caller can aggregate per-run
 * statistics. Skipped silently when the target file already exists, which
 * keeps `npm run rebuild-db` cheap to re-run — pass `force: true` to
 * regenerate (used by the rsync path when an entry is replaced upstream).
 * @param {string} id - PDB identifier (uppercased).
 * @param {Buffer | string} pdb - Decompressed PDB content.
 * @param {string} outputPath - Absolute path of the .png file to write.
 * @param {{ width: number, height: number, force?: boolean }} options - Image
 *   dimensions and an optional `force` flag that bypasses the
 *   already-exists fast-path and unlinks the stale file before rendering.
 * @returns {Promise<{ outputPath: string, status: 'rendered' | 'skipped' }>} -
 *   The result; `status: 'skipped'` means the existing file was reused.
 */
export default async function pymol(id, pdb, outputPath, options) {
  const force = Boolean(options?.force);
  if (!force && existsSync(outputPath)) {
    debug(`pymol skip (exists): ${outputPath}`);
    return { outputPath, status: 'skipped' };
  }
  if (force) {
    // Drop the stale PNG before re-rendering so a failed render leaves no
    // ambiguous half-state on disk.
    tryUnlink(outputPath);
  }
  const { width = 200, height = 200 } = options ?? {};
  debug(`pymol ${width} x ${height} -> ${outputPath}`);

  // Per-call random suffix so 32 parallel renders (different PDBs or
  // re-renders of the same PDB at different sizes) never collide on the
  // shared /tmp dir even when the same (id, width, height) is in flight
  // more than once.
  const tag = `${id}-${width}x${height}-${process.pid}-${crypto.randomUUID()}`;
  const tmpPdb = `/tmp/${tag}.pdb`;
  const tmpPng = `/tmp/${tag}.png`;
  await writeFile(tmpPdb, pdb);

  const cmd = `pymol -c ${tmpPdb} -d "as ribbon;spectrum count;set seq_view; set all_states; set opaque_background, off;" -g ${tmpPng}`;
  debug(cmd);

  await mkdir(dirname(outputPath), { recursive: true });

  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      tryUnlink(tmpPdb);
      if (error) {
        debug('error executing pymol command', error);
        error.stdout = stdout;
        error.stderr = stderr;
        error.cmd = cmd;
        reject(error);
        return;
      }
      gm(tmpPng)
        .resize(width, height)
        .write(outputPath, (err) => {
          tryUnlink(tmpPng);
          if (err) {
            debug(`ERROR for ${id}: ${err.toString()}`);
            err.stage = 'graphicsmagick';
            reject(err);
            return;
          }
          resolve({ outputPath, status: 'rendered' });
        });
    });
  });
}

function tryUnlink(path) {
  try {
    unlinkSync(path);
  } catch {
    // ignore
  }
}

/**
 * Build the on-disk output path for a PyMol render of a bio-assembly.
 * Mirrors the wwPDB layout: `data/pymol/<sub>/<id>/<width>x<height>.png`.
 * @param {string} root - Pymol output directory (typically `data/pymol`).
 * @param {string} id - PDB identifier (uppercased).
 * @param {number} width - Image width in pixels.
 * @param {number} height - Image height in pixels.
 * @returns {string} Absolute target path for the PNG.
 */
export function pymolImagePath(root, id, width, height) {
  const lower = id.toLowerCase();
  const sub = lower.slice(1, 3);
  return join(root, sub, lower, `${width}x${height}.png`);
}
