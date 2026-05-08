import { setTimeout as delay } from 'node:timers/promises';

import createDebug from 'debug';

import initCouchDB from './initCouchDB.js';
import * as rebuild from './rebuild.js';
import update from './update.js';

const debug = createDebug('pdb-sync:cron');

const SLEEP_HOURS = 24;

await cron();

async function cron() {
  const created = await initCouchDB();

  debug('Created databases', created);

  if (created.pdb) {
    debug('Rebuilding pdb');
    await rebuild.pdb();
  }
  if (created.pdbBioAssembly) {
    debug('Rebuilding assembly');
    await rebuild.assembly();
  }

  /* eslint-disable no-await-in-loop, no-console -- intentional sequential cron loop */
  while (true) {
    await update();
    for (let i = SLEEP_HOURS; i > 0; i--) {
      console.log(`${new Date().toISOString()} - Still waiting ${i}h`);
      await delay(3600 * 1000);
    }
  }
  /* eslint-enable no-await-in-loop, no-console */
}
