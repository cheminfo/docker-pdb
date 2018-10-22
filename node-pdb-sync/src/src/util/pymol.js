'use strict';

const fs = require('fs-extra');

const exec = require('child_process').exec;

const debug = require('debug')('pdb-sync:pymol');
const gm = require('gm');

async function pymol(id, pdb, options) {
  if (options instanceof Array) {
    var prom = [];
    for (let option of options) {
      debug('Processing', option);
      prom.push(pymol(id, pdb, option));
    }
    return Promise.all(prom);
  }

  var defaultOptions = {
    width: 200,
    height: 200
  };
  options = Object.assign({}, defaultOptions, options);
  debug(`pymol ${options.width} x ${options.height}`);
  return new Promise(async function (resolve, reject) {
    var pdbFile = `/tmp/${id}${options.width}x${options.height}.pdb`;
    var pngFile = `/tmp/${id}${options.width}x${options.height}.png`;
    debug(`Write pdbFile: ${pdbFile}`);
    await fs.writeFile(pdbFile, pdb).catch(() => {
      debug.log('Error writing pdb file');
      reject('could not write file');
    });

    let cmd = `pymol -c ${pdbFile} -d "as ribbon;spectrum count;set seq_view; set all_states; set opaque_background, off;" -g ${pngFile}`;

    debug(cmd);

    exec(cmd, function (error) {
      debug('Execute pymol command', id);
      fs.unlinkSync(pdbFile);
      if (error !== null) {
        debug('error executing pymol command', error);
        return reject(error);
      }
      gm(pngFile)
        .resize(options.width, options.height)
        .toBuffer('png', function (err, buffer) {
          debug('resize image');
          fs.unlinkSync(pngFile);
          if (err) {
            debug(`ERROR for ${id}: ${err.toString()}`);
            return reject(err);
          }

          return resolve(buffer);
        });
    });
  });
}

module.exports = pymol;
