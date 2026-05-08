import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';

import createDebug from 'debug';
import Nano from 'nano';

import getConfig from './config.js';
import { parse as parsePdb } from './util/pdbParser.js';
import pymol from './util/pymol.js';

const ungzip = promisify(gunzip);
const MAX_BUFFER_LENGTH = 150 * 1024 * 1024;

const debug = createDebug('pdb-sync:common');
const config = getConfig();
// eslint-disable-next-line new-cap -- nano factory is invoked as Nano(...)
const nano = Nano(config.couch.fullUrl);

export function getIdFromFileName(filename) {
  return filename
    .replace(/^.*\/pdb([^.]*)\.ent\.gz/, '$1')
    .replace(/^.*\/([^.]*)\.pdb1.gz/, '$1');
}

export async function processPdb(filename) {
  debug(`Process: ${filename}`);
  const id = getIdFromFileName(filename).toUpperCase();
  const data = await readFile(filename);
  const buffer = await ungzip(data);

  const pdbEntry = parsePdb(buffer.toString());
  pdbEntry._id = id;
  pdbEntry._attachments = {
    [`${id}.pdb`]: {
      // eslint-disable-next-line camelcase -- CouchDB attachment field
      content_type: 'chemical/x-pdb',
      data: buffer.toString('Base64'),
    },
  };
  await saveToCouchDB(pdbEntry, nano.db.use(config.asymetrical.couch.database));
}

export async function processPdbs(files) {
  /* eslint-disable no-await-in-loop -- intentional sequential CouchDB writes */
  for (const file of files) {
    try {
      await processPdb(file);
    } catch (error) {
      debug('Exception for file:', file, error);
    }
  }
  /* eslint-enable no-await-in-loop */
}

export async function processPdbAssemblies(files) {
  /* eslint-disable no-await-in-loop -- intentional sequential pymol invocations */
  for (const file of files) {
    await processPdbAssembly(file);
  }
  /* eslint-enable no-await-in-loop */
}

export async function processPdbAssembly(filename) {
  const id = getIdFromFileName(filename).toUpperCase();
  debug('Process pdb assembly: ', id);
  const idLowerCase = id.toLowerCase();
  const code = idLowerCase.slice(1, 3);

  const bioFilename = join(
    config.bioAssembly.rsync.destination,
    code,
    `${idLowerCase}.pdb1.gz`,
  );
  const pdbEntry = { _id: id, _attachments: {} };
  debug('generate pymol subunits', bioFilename);
  try {
    await doPymol(bioFilename, pdbEntry, {
      pdb: nano.db.use(config.bioAssembly.couch.database),
    });
  } catch (error) {
    debug(
      `An error occurred while processing biological assembly ${id}`,
      error.toString(),
    );
  }
}

async function saveToCouchDB(entry, pdb) {
  try {
    const header = await pdb.head(entry._id);
    entry._rev = header.etag.replaceAll('"', '');
  } catch (error) {
    if (error.statusCode === 404) {
      debug('Entry not found in database: ', entry._id);
    } else {
      throw new Error(`saveToCouchDB error: ${error.message}`);
    }
  }

  await pdb.insert(entry);
  debug('Entry saved:', entry._id);
  return entry._id;
}

async function doPymol(filename, pdbEntry, options = {}) {
  debug('Unzip file:', filename);
  const data = await readFile(filename);
  const buffer = await ungzip(data);

  let buffers = await pymol(pdbEntry._id, buffer, config.pymol);
  debug('Add image(s) and pdb as inline attachment');
  if (!Array.isArray(buffers)) {
    buffers = [buffers];
  }
  for (let i = 0; i < buffers.length; i++) {
    pdbEntry._attachments[
      `${config.pymol[i].width}x${config.pymol[i].height}.png`
    ] = {
      // eslint-disable-next-line camelcase -- CouchDB attachment field
      content_type: 'image/png',
      data: buffers[i].toString('Base64'),
    };
  }
  if (buffer.length < MAX_BUFFER_LENGTH) {
    pdbEntry._attachments[`${pdbEntry._id}.pdb1`] = {
      // eslint-disable-next-line camelcase -- CouchDB attachment field
      content_type: 'chemical/x-pdb',
      data: buffer.toString('Base64'),
    };
  } else {
    debug(`Not adding ${pdbEntry._id}.pdb1 to database (file is too big)`);
  }
  return saveToCouchDB(pdbEntry, options.pdb);
}
