'use strict';

var MAX_BUFFER_LENGTH = 150 * 1024 * 1024; // max buffer size 150M

var path = require('path');

const { ungzip } = require('node-gzip');
var fs = require('fs-extra');
var debug = require('debug')('pdb-sync:common');

var config = require('./config')();
var pymol = require('./util/pymol');
var pdbParser = require('./util/pdbParser');

var nano = require('nano')(config.couch.fullUrl);

async function processPdb(filename) {
  debug(`Process: ${filename}`);
  var id = module.exports.getIdFromFileName(filename).toUpperCase();
  let data = await fs.readFile(filename);
  let buffer = await ungzip(data);

  var pdbEntry = pdbParser.parse(buffer.toString());
  pdbEntry._id = id;
  pdbEntry._attachments = {};
  pdbEntry._attachments[`${id}.pdb`] = {
    content_type: 'chemical/x-pdb',
    data: buffer.toString('Base64')
  };
  await saveToCouchDB(pdbEntry, nano.db.use(config.asymetrical.couch.database));
}

async function processPdbs(files) {
  for (let file of files) {
    try {
      await processPdb(file);
    } catch (e) {
      debug('Exception for file:', file, e);
    }
  }
}

async function processPdbAssemblies(files) {
  for (let file of files) {
    await processPdbAssembly(file);
  }
}

async function processPdbAssembly(filename) {
  var id = module.exports.getIdFromFileName(filename).toUpperCase();
  debug('Process pdb assembly: ', id);
  var idLowerCse = id.toLowerCase();
  var code = idLowerCse.substr(1, 2);

  var bioFilename = path.join(
    config.bioAssembly.rsync.destination,
    code,
    `${idLowerCse}.pdb1.gz`
  );
  var pdbEntry = { _id: id, _attachments: {} };
  // File does not exist
  debug('generate pymol subunits', bioFilename);
  try {
    await doPymol(bioFilename, pdbEntry, {
      pdb: nano.db.use(config.bioAssembly.couch.database)
    });
  } catch (exception) {
    debug(
      `An error occured while processing biological assembly ${id}`,
      exception.toString()
    );
  }
}

function getIdFromFileName(filename) {
  return filename
    .replace(/^.*\/pdb([^.]*)\.ent\.gz/, '$1')
    .replace(/^.*\/([^.]*)\.pdb1.gz/, '$1');
}

module.exports = {
  processPdb,
  processPdbs,
  processPdbAssemblies,
  processPdbAssembly,
  getIdFromFileName
};

async function saveToCouchDB(entry, pdb) {
  try {
    let header = await pdb.head(entry._id);
    entry._rev = header.etag.replace(/"/g, ''); // strange code ?!!!!
  } catch (err) {
    if (err.statusCode === 404) {
      debug('Entry not found in databasse: ', entry._id);
    } else {
      throw new Error(`saveToCouchDB error: ${message}`);
    }
  }

  await pdb.insert(entry);
  debug('Entry saved:', entry._id);
  return entry._id;
}

async function doPymol(filename, pdbEntry, options = {}) {
  debug('Unzip file:', filename);
  let data = await fs.readFile(filename);
  let buffer = await ungzip(data);

  return pymol(pdbEntry._id, buffer, config.pymol).then(function (buff) {
    debug('Add image(s) and pdb as inline attachment');
    if (!(buff instanceof Array)) {
      buff = [buff];
    }
    for (var i = 0; i < buff.length; i++) {
      pdbEntry._attachments[
        `${config.pymol[i].width}x${config.pymol[i].height}.png`
      ] = {
        content_type: 'image/png',
        data: buff[i].toString('Base64')
      };
    }
    if (buffer.length < MAX_BUFFER_LENGTH) {
      pdbEntry._attachments[`${pdbEntry._id}.pdb1`] = {
        content_type: 'chemical/x-pdb',
        data: buffer.toString('Base64')
      };
    } else {
      debug(`Not adding ${pdbEntry._id}.pdb1 to database (file is too big)`);
    }
    return saveToCouchDB(pdbEntry, options.pdb);
  });
}
