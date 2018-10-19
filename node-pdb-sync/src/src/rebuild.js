'use strict';

// Rebuilds the database based on the rsynced directory
// Resends attachments
// Resends values computed by the parser

const debug = require('debug')('pdb-sync:rebuild');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));

const path = require('path');

const config = require('./config.js')();
const common = require('./common');

var pattern;

var limit = argv.limit;

var file = argv.file;

var fromFile = argv.fromFile;

var toFile = argv.toFile;

var fromDir = argv.fromDir;

var toDir = argv.toDir;

if (argv.file) {
  file = argv.file.toLowerCase();
}
if (isNaN(limit)) limit = undefined;

if (file) {
  pattern = `**/*${file}+(.ent|.pdb1).gz`;
} else {
  pattern = '**/*+(.ent|.pdb1).gz';
}

function getFiles(pattern) {
  debug('pattern', pattern);
  return new Promise(function (resolve, reject) {
    glob(pattern, {}, function (err, files) {
      if (err) return reject(err);
      if (fromFile) {
        files = files.filter(function (f) {
          var code = common.getIdFromFileName(f);
          return code >= fromFile;
        });
      }

      if (toFile) {
        files = files.filter(function (f) {
          var code = common.getIdFromFileName(f);
          return code <= toFile;
        });
      }

      if (fromDir) {
        files = files.filter(function (f) {
          var code = common.getIdFromFileName(f);
          return code.substr(1, 2) >= fromDir;
        });
      }

      if (toDir) {
        files = files.filter(function (f) {
          var code = common.getIdFromFileName(f);
          return code.substr(1, 2) <= toDir;
        });
      }
      if (limit) {
        files = files.slice(0, limit);
      }
      return resolve(files);
    });
  });
}

function processPdbFiles(files) {
  debug(`Pdb database: about to process ${files.length} files.`);
  return common.processPdbs(files);
}

function processAssemblyFiles(files) {
  debug(`Pdb bio assembly database: about to process ${files.length} files.`);
  return common.processPdbAssemblies(files);
}

function getPdbFiles() {
  if (file) {
    return [
      path.join(
        config.asymetrical.rsync.destination,
        file.substr(1, 2),
        `pdb${file}.ent.gz`
      )
    ];
  }
  return getFiles(config.asymetrical.rsync.destination + pattern);
}

function getAssemblyFiles() {
  if (file) {
    return [
      path.join(
        config.bioAssembly.rsync.destination,
        file.substr(1, 2),
        `${file}.pdb1.gz`
      )
    ];
  }
  return getFiles(config.bioAssembly.rsync.destination + pattern);
}

async function rebuildPdb() {
  let files = await getPdbFiles();
  await processPdbFiles(files);
}

async function rebuildAssembly() {
  let files = await getAssemblyFiles();
  await processAssemblyFiles(files);
}

module.exports = {
  pdb: rebuildPdb,
  assembly: rebuildAssembly
};
