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
    await delay(5000);
    debug(`Waiting for couchdb: ${Math.floor(Date.now() - waiting) / 1000}s`);
    try {
      // eslint-disable-next-line new-cap -- nano factory is invoked as Nano(...)
      couch = Nano(config.couch.fullUrl);
      databases = await couch.db.list();
      if (databases.error) {
        debug(`Connection problem: ${databases.error} ${databases.reason}`);
        couch = null;
      }
      debug('Existing databases:', databases);
    } catch (error) {
      debug(`Connection problem: ${error.toString()}`);
      couch = null;
    }
  }
  /* eslint-enable no-await-in-loop */
  // We succeeded to retrieve the list of databases. Wait a bit longer to be sure
  // the starting databases are created.
  await delay(5000);
  databases = await couch.db.list();

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

  if (!databases.includes('pdb-bio-assembly')) {
    debug("Creating 'pdb-bio-assembly' database");
    await couch.db.create('pdb-bio-assembly');
    created.pdbBioAssembly = true;
  }
  await checkViews(couch, 'pdb-bio-assembly', 'couch/pdbBioAssemblyViews.json');

  return created;
}

async function checkViews(couch, dbName, filename) {
  const views = JSON.parse(
    readFileSync(join(import.meta.dirname, filename), 'utf8'),
  );
  const database = couch.use(dbName);
  try {
    await database.get(views._id);
    debug(`Found document: ${views._id}`);
  } catch {
    await database.insert(views);
    debug(`Document: ${views._id} created`);
  }
}
