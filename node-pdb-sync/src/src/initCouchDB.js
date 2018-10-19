'use strict';

const debug = require('debug')('couchdb-init');
const Nano = require('nano');
const delay = require('delay');

const fs = require('fs');
const path = require('path');

const config = require('./config')();

initDatabase();

async function initDatabase() {
  let couch;
  let databases;
  let waiting = Date.now();
  while (!couch) {
    await delay(500);
    debug(`Waiting for couchdb: ${Math.floor(Date.now() - waiting) / 1000}s`);
    try {
      couch = Nano(config.couch.fullUrl);
      databases = await couch.db.list();
      if (databases.error) {
        debug(`Connection problem: ${databases.error} ${databases.reason}`);
        couch = null;
      }
      debug('Existing databases:', databases);
    } catch (exception) {
      debug(`Connection problem: ${exception.toString()}`);
      couch = null;
    }
  }
  // we succeeded to retrieve the list of databases

  if (!databases.includes('_users')) {
    debug("Creating '_users' database");
    await couch.db.create('_users');
  }

  if (!databases.includes('_replicator')) {
    debug("Creating '_replicator' database");
    await couch.db.create('_replicator');
  }

  if (!databases.includes('_global_changes')) {
    debug("Creating '_global_changes' database");
    await couch.db.create('_global_changes');
  }

  if (!databases.includes('pdb')) {
    debug("Creating 'pdb' database");
    await couch.db.create('pdb');
  }
  checkViews(couch, 'pdb', 'couch/pdbViews.json');

  if (!databases.includes('pdb-bio-assembly')) {
    debug("Creating 'pdb-bio-assembly' database");
    await couch.db.create('pdb-bio-assembly');
  }
  checkViews(couch, 'pdb-bio-assembly', 'couch/pdbBioAssemblyViews.json');
}

module.exports = initDatabase;

async function checkViews(couch, dbName, filename) {
  let views = JSON.parse(
    fs.readFileSync(path.join(__dirname, filename), 'utf8')
  );
  let database = couch.use(dbName);
  try {
    await database.get(views._id);
    debug(`Found document: ${views._id}`);
  } catch (exception) {
    // need to create the document

    await database.insert(views);
    debug(`Document: ${views._id} created`);
  }
}
