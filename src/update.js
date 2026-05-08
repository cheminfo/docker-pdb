// Synchronizes the rsynced PDB directory tree, then rebuilds the database
// for the changed entries. Requires `rsync` to be installed.

import { appendFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { parseArgs } from 'node:util';

import createDebug from 'debug';
import Rsync from 'rsync';

import * as common from './common.js';
import getConfig from './config.js';

const debug = createDebug('update');
const config = getConfig();

const { values: argv } = parseArgs({
  options: {
    'pdb-asym-unit': { type: 'boolean' },
    'pdb-bio-assembly': { type: 'boolean' },
  },
  strict: false,
});

export default async function update() {
  let asymUnit = argv['pdb-asym-unit'];
  let bioAssembly = argv['pdb-bio-assembly'];
  if (!asymUnit && !bioAssembly) {
    asymUnit = true;
    bioAssembly = true;
  }
  if (asymUnit) {
    debug('Updating asymmetrical units...');
    await doRsync(
      config.asymetrical.rsync.source,
      config.asymetrical.rsync.destination,
      config.asymetrical.rsync.port || 873,
      common.processPdbs,
      async (changed) => {
        debug('Writing rsync changes of pdb');
        const dir = config.asymetrical.rsync.historyDir;
        if (!dir) return;
        const targetFile = join(dir, `${new Date().toISOString()}.json`);
        await mkdir(dirname(targetFile), { recursive: true });
        await writeFile(targetFile, JSON.stringify(changed, undefined, 2));
      },
    );
    debug('Done updating asymmetrical units...');
  }

  if (bioAssembly) {
    debug('Updating biological assemblies...');
    await doRsync(
      config.bioAssembly.rsync.source,
      config.bioAssembly.rsync.destination,
      config.asymetrical.rsync.port || 873,
      common.processPdbAssemblies,
      async (changed) => {
        debug('Writing rsync changes of bioAssembly');
        const dir = config.bioAssembly.rsync.historyDir;
        if (!dir) return;
        const targetFile = join(dir, `${new Date().toISOString()}.json`);
        await mkdir(dirname(targetFile), { recursive: true });
        await writeFile(targetFile, JSON.stringify(changed, undefined, 2));
      },
    );
    debug('Done updating biological assemblies...');
  }
}

function doRsync(
  source,
  destination,
  port,
  saveCallback,
  modificationCallback,
) {
  return new Promise((resolve, reject) => {
    const changed = { deleted: [], updated: [] };
    const newFiles = [];

    const rsync = new Rsync();
    rsync.source(source);
    rsync.destination(destination);
    rsync.flags('rlptvz');
    rsync.set('delete');
    rsync.set('port', port);

    debug('Rsync ready');
    debug('Rsync from', source, 'to', destination);
    rsync.output(
      (data) => {
        const line = data.toString().replaceAll(/[\r\n].*/g, '');
        debug(`Processing: ${line}`);
        if (line.startsWith('deleting ')) {
          const pdbId = common.getIdFromFileName(line).toUpperCase();
          if (pdbId.length === 4) {
            changed.deleted.push(pdbId);
          }
          return;
        }
        if (line.match(/\.gz$/)) {
          appendFileSync(
            './rsyncChanges',
            `${config.asymetrical.rsync.destination + line}\n`,
          );
          const pdbId = common.getIdFromFileName(line).toUpperCase();
          if (pdbId.length === 4) {
            changed.updated.push(pdbId);
            newFiles.push(config.asymetrical.rsync.destination + line);
          }
        }
      },
      () => {
        // ignore stderr
      },
    );

    rsync.execute((error, code, cmd) => {
      if (modificationCallback) {
        modificationCallback(changed);
      }
      debug('Rsync executed, now building database');
      if (error) {
        debug('RSYNC ERROR, did not build database');
        debug(error);
        debug(code);
        debug(cmd);
        reject(error);
        return;
      }
      debug('update new files: ', newFiles);
      saveCallback(newFiles).then(resolve, reject);
    });
  });
}
