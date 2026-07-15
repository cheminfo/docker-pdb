/* eslint-disable no-console -- dev entry point; stdout is the user-facing UX */
// Development server entry point.
//
// Unlike the production `server.js`, this file:
//   1. Creates a fresh in-memory SQLite database (no disk writes).
//   2. Seeds ligands from the 20-entry fixture at fixtures/ligands.json.
//   3. Seeds PDB entries from the 21 committed fixture files under `backend/fixtures/pdb/`.
//   4. Falls back to the local rsync tree (`data/pdb/`) when a fixture is absent.
//   5. Starts the Fastify API on port 31015 with the seeded in-memory DB.
//
// `node --watch` re-runs the whole file on each source change, producing a
// clean, reproducible database on every restart — no stale rows, no leftover
// renders, no manual `rm -rf data/sqlite`.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { resolveStaticDir } from './api/registerStatic.js';
import { buildApp } from './api/server.js';
import * as common from './common.js';
import getConfig from './config.js';
import { getInMemoryLigandsDB, setLigandsDB } from './db/getDB.js';
import { SEED_IDS } from './seed.js';

const config = /** @type {any} */ (getConfig());
const FIXTURES_DIR = join(import.meta.dirname, '../fixtures/pdb');
const LIGANDS_FIXTURE = join(
  import.meta.dirname,
  'api/util/__tests__/fixtures/ligands.json',
);

console.log('dev — initializing in-memory SQLite…');
const db = await getInMemoryLigandsDB();
// Make the singleton return this instance so that route handlers and
// common.processPdbs() all share the same in-memory DB.
setLigandsDB(db);

const ligands =
  /** @type {Array<{code:string,name:string,idCode:string,coordinates:string,mf:string,mw:number}>} */ (
    JSON.parse(readFileSync(LIGANDS_FIXTURE, 'utf8'))
  );
db.db.exec('BEGIN');
for (const ligand of ligands) {
  const row = db.upsertLigand.get(
    ligand.code,
    ligand.name,
    '',
    '',
    ligand.idCode,
    ligand.coordinates,
    ligand.mf,
    ligand.mw,
    0,
  );
  db.molecules.insert(row.id, ligand.idCode);
}
db.db.exec('COMMIT');
console.log(`dev — seeded ${ligands.length} ligands from fixture…`);

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
    `dev — missing fixtures for ${missing.length} id(s): ${missing.join(', ')}`,
  );
}

if (files.length > 0) {
  console.log(`dev — seeding ${files.length} entries from fixtures…`);
  await common.processPdbs(files);
}

const { n } = /** @type {{ n: number }} */ (db.countPdbEntries.get());
console.log(`dev — pdb_entries has ${n} row(s); starting API…`);

// Insert a synthetic rsync-history row so the home page "Last imported entry"
// panel has a lastEntryId to display. Use the last fixture as the entry id.
if (files.length > 0) {
  const lastFile = files.at(-1) ?? '';
  // Extract the PDB id from a path like `.../pdbXXXX.ent.gz`
  const match = /pdb([a-z0-9]{4})\.ent\.gz$/i.exec(lastFile);
  if (match) {
    const now = new Date().toISOString();
    db.insertRsyncHistory.run(
      'asymUnit',
      now,
      now,
      0,
      files.length,
      0,
      match[1].toUpperCase(),
      0,
    );
  }
}

const port = Number(process.env.PORT) || 31015;
const host = process.env.HOST || '127.0.0.1';
const staticDir = resolveStaticDir();
const app = await buildApp({ db, logger: true, staticDir });

if (!staticDir) {
  app.log.warn(
    'No frontend bundle found — Vite dev server will proxy to this port.',
  );
}

try {
  await app.listen({ host, port });
} catch (error) {
  app.log.error({ error }, 'API server failed to start');
  // eslint-disable-next-line unicorn/no-process-exit -- CLI entry point.
  process.exit(1);
}
