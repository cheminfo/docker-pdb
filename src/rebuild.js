// Rebuilds the database based on the rsynced directory.
// Resends attachments and values computed by the parser.

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import createDebug from 'debug';
import { glob } from 'glob';

import * as common from './common.js';
import getConfig from './config.js';

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
    return [
      join(
        config.asymetrical.rsync.destination,
        file.slice(1, 3),
        `pdb${file}.ent.gz`,
      ),
    ];
  }
  return getFiles(config.asymetrical.rsync.destination + pattern);
}

function getAssemblyFiles() {
  if (file) {
    return [
      join(
        config.bioAssembly.rsync.destination,
        file.slice(1, 3),
        `${file}.pdb1.gz`,
      ),
    ];
  }
  return getFiles(config.bioAssembly.rsync.destination + pattern);
}

export async function pdb() {
  const files = await getPdbFiles();
  debug(`Pdb database: about to process ${files.length} files.`);
  await common.processPdbs(files);
}

export async function assembly() {
  const files = await getAssemblyFiles();
  debug(`Pdb bio assembly database: about to process ${files.length} files.`);
  await common.processPdbAssemblies(files);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let asymUnit = argv['pdb-asym-unit'];
  let bioAssembly = argv['pdb-bio-assembly'];
  if (!asymUnit && !bioAssembly) {
    asymUnit = true;
    bioAssembly = true;
  }
  if (asymUnit) await pdb();
  if (bioAssembly) await assembly();
}
