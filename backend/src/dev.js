/* eslint-disable no-console -- one-shot CLI script; plain stdout is the user-facing UX */
// Local-development seed: ensures the sqlite database is initialized and
// seeds the exact same deterministic set of PDB entries every time, so
// `npm run dev` always produces the same database for every developer.
//
// Each id in SEED_IDS is resolved against (1) the optional local rsync tree
// under `data/pdb/` (full mirror, if you have one) and (2) the in-repo
// fallback under `backend/fixtures/pdb/` (committed to git, see seed.js).
// The fixture copy guarantees a working `npm run dev` on a fresh checkout
// without any rsync — and pins the data so the database is reproducible.
//
// Run once via `npm run dev:seed` (invoked by the root `npm run dev`
// before it starts the Fastify API + Vite dev server).
//
// Skips the multi-day rsync from rsync.wwpdb.org and skips pymol-rendered
// biological assemblies (which require a local pymol/graphicsmagick install).

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import * as common from './common.js';
import getConfig from './config.js';
import { getLigandsDB } from './db/getDB.js';
import { SEED_IDS } from './seed.js';

const config = getConfig();

const FIXTURES_DIR = join(import.meta.dirname, '../fixtures/pdb');

const db = await getLigandsDB();

const files = [];
const missing = [];
for (const pdbId of SEED_IDS) {
  const rsyncPath = common.asymUnitPath(
    config.asymetrical.rsync.destination,
    pdbId,
  );
  const fixturePath = common.asymUnitPath(FIXTURES_DIR, pdbId);
  if (existsSync(rsyncPath)) {
    files.push(rsyncPath);
  } else if (existsSync(fixturePath)) {
    files.push(fixturePath);
  } else {
    missing.push(pdbId);
  }
}

if (missing.length > 0) {
  console.warn(
    `dev:seed — missing fixtures for ${missing.length} id(s): ${missing.join(', ')}`,
  );
}

if (files.length === 0) {
  console.warn(
    `dev:seed — no SEED_IDS files found under ${config.asymetrical.rsync.destination} or ${FIXTURES_DIR}; database left untouched.`,
  );
} else {
  console.log(`dev:seed — ingesting ${files.length} SEED_IDS entries…`);
  await common.processPdbs(files);
}

const { n } = db.countPdbEntries.get();
console.log(`dev:seed — done; pdb_entries now has ${n} row(s).`);
