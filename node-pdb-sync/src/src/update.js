'use strict';

// requires rsync

const path = require('path');

const fs = require('fs-extra');
const debug = require('debug')('update');
const Rsync = require('rsync');
const argv = require('minimist')(process.argv.slice(2));

const common = require('./common');
const config = require('./config.js')();

module.exports = update;

async function update() {
  if (!argv['pdb-asym-unit'] && !argv['pdb-bio-assembly']) {
    argv['pdb-asym-unit'] = argv['pdb-bio-assembly'] = true;
  }
  if (argv['pdb-asym-unit']) {
    debug('Updating asymmetrical units...');
    await doRsync(
      config.asymetrical.rsync.source,
      config.asymetrical.rsync.destination,
      config.asymetrical.rsync.port || 873,
      common.processPdbs,
      async function (changed) {
        debug('Writing rsync changes of pdb');
        var dir = config.asymetrical.rsync.historyDir;
        if (!dir) return;
        let targetFile = path.join(dir, `${new Date().toISOString()}.json`);
        await fs.outputFile(targetFile, JSON.stringify(changed, undefined, 2));
      }
    );
    debug('Done updating asymmetrical units...');
  }

  if (argv['pdb-bio-assembly']) {
    debug('Updating biological assemblies...');
    await doRsync(
      config.bioAssembly.rsync.source,
      config.bioAssembly.rsync.destination,
      config.asymetrical.rsync.port || 873,
      common.processPdbAssemblies,
      async function (changed) {
        debug('Writing rsync changes of bioAssembly');
        var dir = config.bioAssembly.rsync.historyDir;
        if (!dir) return;
        let targetFile = path.join(dir, `${new Date().toISOString()}.json`);
        await fs.outputFile(targetFile, JSON.stringify(changed, undefined, 2));
      }
    );
    debug('Done updating biological assemblies...');
  }
}

function doRsync(
  source,
  destination,
  port,
  saveCallback,
  modificationCallback
) {
  return new Promise(function (resolve, reject) {
    var changed = {
      deleted: [],
      updated: []
    };

    var newFiles = [];
    var rsync = new Rsync();
    rsync.source(source);
    rsync.destination(destination);
    rsync.flags('rlptvz');
    rsync.set('delete');
    rsync.set('port', port);

    debug('Rsync ready');
    debug('Rsync from', source, 'to', destination);
    rsync.output(
      function (data) {
        // do things like parse progress
        var line = data.toString().replace(/[\r\n].*/g, '');
        debug(`Processing: ${line}`);
        if (line.startsWith('deleting ')) {
          let pdbId = common.getIdFromFileName(line).toUpperCase();
          if (pdbId.length === 4) {
            changed.deleted.push(pdbId);
          }
          return;
        }
        if (line.match(/\.gz$/)) {
          fs.appendFileSync(
            './rsyncChanges',
            `${config.asymetrical.rsync.destination + line}\n`
          );
          let pdbId = common.getIdFromFileName(line).toUpperCase();
          if (pdbId.length === 4) {
            changed.updated.push(pdbId);
            newFiles.push(config.asymetrical.rsync.destination + line);
          }
        }
      },
      function (data) {
        // do things like parse error output
      }
    );

    rsync.execute(function (error, code, cmd) {
      if (modificationCallback) {
        modificationCallback(changed);
      }
      debug('Rysnc executed, now building database');
      if (error) {
        debug('RSYNC ERROR, did not build database');
        debug(error);
        debug(code);
        debug(cmd);
        throw new Error(error);
      }
      debug('update new files: ', newFiles);
      return saveCallback(newFiles).then(resolve, reject);
    });
  });
}
