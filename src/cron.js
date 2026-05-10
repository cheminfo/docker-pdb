import { setTimeout as delay } from 'node:timers/promises';

import createDebug from 'debug';

import { getLigandsDB } from './db/getDB.js';
import * as rebuild from './rebuild.js';
import update from './update.js';

const debug = createDebug('pdb-sync:cron');

const SLEEP_HOURS = 24;

await cron();

async function cron() {
  // Apply migrations and warm up the connection.
  const db = await getLigandsDB();

  // First-boot recovery: if the rsync directories already contain files
  // (e.g. carried over from a previous deployment) but `pdb_entries` is
  // empty, rebuild metadata from disk before resuming the periodic rsync
  // — this is the "rebuild from local files without re-downloading" path.
  const count = db.statement(`SELECT COUNT(*) AS n FROM pdb_entries`).get();
  if ((count?.n ?? 0) === 0) {
    debug(
      'pdb_entries is empty — running rebuild-from-disk before first rsync',
    );
    try {
      await rebuild.pdb();
      await rebuild.assembly();
    } catch (error) {
      debug('rebuild-from-disk failed; continuing into rsync loop:', error);
    }
  }

  /* eslint-disable no-await-in-loop, no-console -- intentional sequential cron loop */
  while (true) {
    try {
      await update();
    } catch (error) {
      debug('update failed, will retry next cycle:', error);
    }
    for (let i = SLEEP_HOURS; i > 0; i--) {
      console.log(`${new Date().toISOString()} - Still waiting ${i}h`);
      await delay(3600 * 1000);
    }
  }
  /* eslint-enable no-await-in-loop, no-console */
}
