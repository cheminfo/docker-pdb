import { setTimeout as delay } from 'node:timers/promises';

import createDebug from 'debug';

import { getLigandsDB } from './db/getDB.js';
import * as rebuild from './rebuild.js';
import {
  clearRunning,
  clearTrigger,
  markRunning,
  triggerExists,
} from './syncControl.js';
import update from './update.js';

const debug = createDebug('pdb-sync:cron');

const SLEEP_HOURS = 24;
const SLEEP_MS = SLEEP_HOURS * 3600 * 1000;
/** How often to check for an instant-trigger marker while sleeping. */
const TRIGGER_POLL_MS = 5 * 1000;
/** Cron kind, used for the matching trigger / running marker filenames. */
const KIND = 'rsync';

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

  // Stale state from a previous crash would lock the UI into "running" forever.
  await clearRunning(KIND);

  /* eslint-disable no-await-in-loop -- intentional sequential cron loop */
  while (true) {
    await runOnce();
    await sleepUntilTrigger(SLEEP_MS);
  }
  /* eslint-enable no-await-in-loop */
}

/**
 * Execute one rsync pass, wrapped with the running marker so the API can
 * report live state. Errors are caught here so a single failed run never
 * crashes the loop and triggers a tight docker restart cycle.
 */
async function runOnce() {
  // Claim any pending trigger before starting — once we begin, we don't
  // want a second click to leave a stale marker that re-runs immediately.
  await clearTrigger(KIND);

  const startedAt = new Date().toISOString();
  await markRunning(KIND, {
    startedAt,
    type: KIND,
    pid: process.pid,
    scope: ['asymUnit', 'bioAssembly'],
  });
  try {
    await update();
  } catch (error) {
    debug('update failed, will retry next cycle:', error);
  } finally {
    await clearRunning(KIND);
  }
}

/**
 * Sleep up to `maxMs`, returning early as soon as a trigger marker appears.
 * Polls every `TRIGGER_POLL_MS` so the worst-case latency for an
 * instant-sync click is a few seconds rather than the full 24 h cycle.
 * @param {number} maxMs - Maximum time to sleep, in milliseconds.
 * @returns {Promise<'triggered' | 'timeout'>} How the wait ended.
 */
async function sleepUntilTrigger(maxMs) {
  const start = Date.now();
  let lastLoggedHour = -1;
  /* eslint-disable no-await-in-loop -- intentional poll loop */
  /* eslint-disable no-console -- legacy log format consumed by ops dashboards */
  while (Date.now() - start < maxMs) {
    if (triggerExists(KIND)) return 'triggered';
    const remainingMs = maxMs - (Date.now() - start);
    const remainingHours = Math.ceil(remainingMs / 3_600_000);
    if (remainingHours !== lastLoggedHour && remainingHours > 0) {
      console.log(
        `${new Date().toISOString()} - Still waiting ${remainingHours}h`,
      );
      lastLoggedHour = remainingHours;
    }
    await delay(Math.min(TRIGGER_POLL_MS, remainingMs));
  }
  /* eslint-enable no-await-in-loop, no-console */
  return 'timeout';
}
