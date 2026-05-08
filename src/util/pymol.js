import { exec } from 'node:child_process';
import { unlinkSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

import createDebug from 'debug';
import gm from 'gm';

const debug = createDebug('pdb-sync:pymol');

export default async function pymol(id, pdb, options) {
  if (Array.isArray(options)) {
    return Promise.all(options.map((option) => pymol(id, pdb, option)));
  }

  const { width = 200, height = 200 } = options ?? {};
  debug(`pymol ${width} x ${height}`);

  const pdbFile = `/tmp/${id}${width}x${height}.pdb`;
  const pngFile = `/tmp/${id}${width}x${height}.png`;
  debug(`Write pdbFile: ${pdbFile}`);
  await writeFile(pdbFile, pdb);

  const cmd = `pymol -c ${pdbFile} -d "as ribbon;spectrum count;set seq_view; set all_states; set opaque_background, off;" -g ${pngFile}`;
  debug(cmd);

  return new Promise((resolve, reject) => {
    exec(cmd, (error) => {
      debug('Execute pymol command', id);
      unlinkSync(pdbFile);
      if (error) {
        debug('error executing pymol command', error);
        reject(error);
        return;
      }
      gm(pngFile)
        .resize(width, height)
        .toBuffer('png', (err, buffer) => {
          debug('resize image');
          unlinkSync(pngFile);
          if (err) {
            debug(`ERROR for ${id}: ${err.toString()}`);
            reject(err);
            return;
          }
          resolve(buffer);
        });
    });
  });
}
