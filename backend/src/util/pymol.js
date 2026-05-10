import { exec } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import createDebug from 'debug';
import gm from 'gm';

const debug = createDebug('pdb-sync:pymol');

/**
 * Render a PyMol PNG of `pdb` and persist it to disk at `outputPath`.
 * Returns the absolute output path. Skipped silently when the target file
 * already exists, which keeps `npm run rebuild-db` cheap to re-run.
 * @param {string} id - PDB identifier (uppercased).
 * @param {Buffer | string} pdb - Decompressed PDB content.
 * @param {string} outputPath - Absolute path of the .png file to write.
 * @param {{ width: number, height: number }} options - Image dimensions.
 * @returns {Promise<string>} The output path.
 */
export default async function pymol(id, pdb, outputPath, options) {
  if (existsSync(outputPath)) {
    debug(`pymol skip (exists): ${outputPath}`);
    return outputPath;
  }
  const { width = 200, height = 200 } = options ?? {};
  debug(`pymol ${width} x ${height} -> ${outputPath}`);

  const tmpPdb = `/tmp/${id}${width}x${height}.pdb`;
  const tmpPng = `/tmp/${id}${width}x${height}.png`;
  await writeFile(tmpPdb, pdb);

  const cmd = `pymol -c ${tmpPdb} -d "as ribbon;spectrum count;set seq_view; set all_states; set opaque_background, off;" -g ${tmpPng}`;
  debug(cmd);

  await mkdir(dirname(outputPath), { recursive: true });

  return new Promise((resolve, reject) => {
    exec(cmd, (error) => {
      tryUnlink(tmpPdb);
      if (error) {
        debug('error executing pymol command', error);
        reject(error);
        return;
      }
      gm(tmpPng)
        .resize(width, height)
        .write(outputPath, (err) => {
          tryUnlink(tmpPng);
          if (err) {
            debug(`ERROR for ${id}: ${err.toString()}`);
            reject(err);
            return;
          }
          resolve(outputPath);
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
