'use strict';

const delay = require('delay');

const initCouchDB = require('./initCouchDB');
const rebuild = require('./rebuild');
const update = require('./update');

const debug = require('debug')('pdb-sync:cron');

let sleepTime = 24; // in hours

cron();

async function cron() {
  let created = await initCouchDB();

  if (true || created.pdb) {
    debug('Rebuilding pdb');
    await rebuild.pdb();
  }
  if (true || created.pdbBioAssembly) {
    debug('Rebuilding assembly');
    await rebuild.assembly();
  }

  while (true) {
    await update();
    for (let i = sleepTime; i > 0; i--) {
      console.log(`${new Date().toISOString()} - Still wating ${i}h`);
      await delay(3600 * 1000);
    }
  }
}
