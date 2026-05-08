import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import createDebug from 'debug';
import Nano from 'nano';

import getConfig from './config.js';

const debug = createDebug('couchdb-init');
const config = getConfig();

export default async function initDatabase() {
  let couch;
  let databases;
  const waiting = Date.now();
  /* eslint-disable no-await-in-loop -- retry loop while CouchDB starts up */
  while (!couch) {
    try {
      // eslint-disable-next-line new-cap -- nano factory is invoked as Nano(...)
      couch = Nano(config.couch.fullUrl);
      databases = await couch.db.list();
      if (databases.error) {
        debug(`Connection problem: ${databases.error} ${databases.reason}`);
        couch = null;
      } else {
        debug('Existing databases:', databases);
      }
    } catch (error) {
      debug(`Connection problem: ${error.toString()}`);
      couch = null;
    }
    if (!couch) {
      debug(`Waiting for couchdb: ${Math.floor(Date.now() - waiting) / 1000}s`);
      await delay(5000);
    }
  }
  /* eslint-enable no-await-in-loop */
  // First-boot: CouchDB hasn't created its system DBs yet. Give it a few
  // seconds. Skip on subsequent boots when the system DBs are already there.
  if (
    !databases.includes('_users') ||
    !databases.includes('_replicator') ||
    !databases.includes('_global_changes')
  ) {
    await delay(5000);
    databases = await couch.db.list();
  }

  const created = {};

  if (!databases.includes('_users')) {
    debug("Creating '_users' database");
    await couch.db.create('_users');
    created._users = true;
  }

  if (!databases.includes('_replicator')) {
    debug("Creating '_replicator' database");
    await couch.db.create('_replicator');
    created._replicator = true;
  }

  if (!databases.includes('_global_changes')) {
    debug("Creating '_global_changes' database");
    await couch.db.create('_global_changes');
    // eslint-disable-next-line camelcase -- mirrors the CouchDB system db name
    created._global_changes = true;
  }

  if (!databases.includes('pdb')) {
    debug("Creating 'pdb' database");
    await couch.db.create('pdb');
    created.pdb = true;
  }
  await checkViews(couch, 'pdb', 'couch/pdbViews.json');
  await checkViews(couch, 'pdb', 'couch/pdbStatsViews.json');
  await ensureMangoIndexes(couch, 'pdb', 'couch/pdbMangoIndexes.json');
  await ensurePublicReadSecurity(couch, 'pdb');

  if (!databases.includes('pdb-bio-assembly')) {
    debug("Creating 'pdb-bio-assembly' database");
    await couch.db.create('pdb-bio-assembly');
    created.pdbBioAssembly = true;
  }
  await checkViews(couch, 'pdb-bio-assembly', 'couch/pdbBioAssemblyViews.json');
  await ensurePublicReadSecurity(couch, 'pdb-bio-assembly');

  if (!databases.includes('rsync-history')) {
    debug("Creating 'rsync-history' database");
    await couch.db.create('rsync-history');
    created.rsyncHistory = true;
  }
  await checkViews(couch, 'rsync-history', 'couch/rsyncHistoryViews.json');
  await ensurePublicReadSecurity(couch, 'rsync-history');

  return created;
}

const PUBLIC_READ_SECURITY = {
  admins: { names: [], roles: ['_admin'] },
  members: { names: [], roles: [] },
};

/**
 * Set the database's `_security` document so anyone can read it (writes still
 * require an admin). Idempotent: skips the PUT if the current document already
 * grants anonymous reads.
 * @param {import('nano').ServerScope} couch - Authenticated nano server scope.
 * @param {string} dbName - Database whose `_security` to update.
 */
async function ensurePublicReadSecurity(couch, dbName) {
  const current = await couch.request({ db: dbName, doc: '_security' });
  const members = current.members || {};
  if (
    Array.isArray(members.names) &&
    members.names.length === 0 &&
    Array.isArray(members.roles) &&
    members.roles.length === 0
  ) {
    debug(`Security on '${dbName}' already allows anonymous reads`);
    return;
  }
  debug(`Setting public-read security on '${dbName}'`);
  await couch.request({
    db: dbName,
    doc: '_security',
    method: 'PUT',
    body: PUBLIC_READ_SECURITY,
  });
}

/**
 * Install Mango indexes from a JSON array of index definitions. Each entry
 * is POSTed to `_index`; CouchDB makes the call idempotent — re-posting an
 * index with the same ddoc/name/fields returns `result: "exists"` without
 * re-building.
 * @param {import('nano').ServerScope} couch - Authenticated nano server scope.
 * @param {string} dbName - Target database (e.g. `pdb`).
 * @param {string} filename - Path to the JSON file relative to this module.
 */
async function ensureMangoIndexes(couch, dbName, filename) {
  const indexes = JSON.parse(
    readFileSync(join(import.meta.dirname, filename), 'utf8'),
  );
  /* eslint-disable no-await-in-loop -- sequential install keeps logs readable */
  for (const index of indexes) {
    const response = await couch.request({
      db: dbName,
      path: '_index',
      method: 'POST',
      body: index,
    });
    debug(`Mango index ${index.name}: ${response.result}`);
  }
  /* eslint-enable no-await-in-loop */
}

async function checkViews(couch, dbName, filename) {
  const views = JSON.parse(
    readFileSync(join(import.meta.dirname, filename), 'utf8'),
  );
  const database = couch.use(dbName);
  try {
    const existing = await database.get(views._id);
    if (
      JSON.stringify(existing.views ?? {}) === JSON.stringify(views.views ?? {})
    ) {
      debug(`Found document: ${views._id} (up to date)`);
      return;
    }
    await database.insert({ ...views, _rev: existing._rev });
    debug(`Document: ${views._id} updated`);
  } catch {
    await database.insert(views);
    debug(`Document: ${views._id} created`);
  }
}
