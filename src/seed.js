// Reset the local CouchDB to a small, deterministic set of PDB entries —
// useful for development and as test fixtures. Drops the `pdb` and
// `pdb-bio-assembly` databases, recreates them via `initCouchDB` (which
// reinstalls views, Mango indexes, and security), then re-ingests every
// entry in `SEED_IDS` from the rsynced files already on disk.
//
// Run inside the `node-pdb-sync` container so the rsync tree, the
// pymol/graphicsmagick binaries, and `config.json` are all available:
//
//   docker compose exec node-pdb-sync npm run seed

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import createDebug from 'debug';
import Nano from 'nano';

import * as common from './common.js';
import getConfig from './config.js';
import initDatabase from './initCouchDB.js';

const debug = createDebug('pdb-sync:seed');

/**
 * Hand-picked PDB ids covering different experimental methods, sizes,
 * eras, and ligand profiles — small enough to seed in a few seconds, big
 * enough to exercise filters / charts / 3D viewer.
 */
const SEED_IDS = [
  '101D', // 1995 X-ray DNA dodecamer
  '1AZ8', // 1998 X-ray trypsin + bis-phenamidine inhibitor
  '1B66', // 1999 X-ray pyruvoyl tetrahydropterin synthase
  '1BG2', // 1998 X-ray kinesin motor domain
  '1BIB', // 1998 X-ray E. coli biotin holoenzyme synthetase
  '1BTW', // 1998 X-ray novel KI nanomolar inhibitors
  '1CRN', // 1981 X-ray crambin (small classic)
  '4HHB', // 1984 X-ray hemoglobin (textbook)
  '5ABY', // 2015 X-ray DPP4 in complex with inhibitor
  '1A3N', // 1998 X-ray hemoglobin variant
  '2LYZ', // 1985 NMR lysozyme
  '1HHO', // 1984 X-ray oxy-hemoglobin
  '1BNA', // 1981 X-ray B-DNA dodecamer
  '4YYR', // 2015 X-ray ficin B
  '1HVL', // 1991 X-ray HIV protease
  '1UBQ', // 1987 X-ray ubiquitin (small)
  '2INS', // 1969 X-ray insulin
  '6LYZ', // 1981 X-ray lysozyme
  '1IGT', // 1996 X-ray immunoglobulin
  '3PGM', // 1993 X-ray phosphoglycerate mutase
];

async function dropDatabases() {
  const config = getConfig();
  // eslint-disable-next-line new-cap -- nano factory is invoked as Nano(...)
  const couch = Nano(config.couch.fullUrl);
  for (const dbName of ['pdb', 'pdb-bio-assembly']) {
    try {
      // eslint-disable-next-line no-await-in-loop -- two sequential drops
      await couch.db.destroy(dbName);
      debug(`Dropped database: ${dbName}`);
    } catch (error) {
      if (error.statusCode !== 404) throw error;
      debug(`Database ${dbName} did not exist, nothing to drop`);
    }
  }
}

function existingFiles(ids, root, fileFor) {
  const files = [];
  for (const id of ids) {
    const path = fileFor(root, id);
    if (existsSync(path)) {
      files.push(path);
    } else {
      debug(`Skipping ${id} — file not found at ${path}`);
    }
  }
  return files;
}

function asymUnitPath(root, id) {
  const lower = id.toLowerCase();
  return join(root, lower.slice(1, 3), `pdb${lower}.ent.gz`);
}

function bioAssemblyPath(root, id) {
  const lower = id.toLowerCase();
  return join(root, lower.slice(1, 3), `${lower}.pdb1.gz`);
}

async function main() {
  debug(`Dropping pdb / pdb-bio-assembly databases`);
  await dropDatabases();

  debug(`Re-running initCouchDB (recreate DBs + views + indexes)`);
  await initDatabase();

  const config = getConfig();

  const asymFiles = existingFiles(
    SEED_IDS,
    config.asymetrical.rsync.destination,
    asymUnitPath,
  );
  debug(`Re-ingesting ${asymFiles.length} asymmetric-unit entries`);
  await common.processPdbs(asymFiles);

  const bioFiles = existingFiles(
    SEED_IDS,
    config.bioAssembly.rsync.destination,
    bioAssemblyPath,
  );
  debug(`Re-ingesting ${bioFiles.length} biological-assembly entries`);
  await common.processPdbAssemblies(bioFiles);

  debug(`Seed complete.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
