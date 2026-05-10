// Local-development entrypoint: ensures the sqlite database is initialized
// and seeds a small batch of asymmetric-unit documents from already-rsynced
// files under `data/pdb/`, so the API can be exercised immediately. Skips
// the multi-day rsync from rsync.wwpdb.org and skips pymol-rendered
// biological assemblies (which require a local pymol/graphicsmagick install).
//
// Started by `npm run dev`, which points this script at the local data/
// directory via DATA_DIR=./data.
//
// Tweak how many files are ingested with DEV_SEED_LIMIT (default 20).

import createDebug from 'debug';
import { glob } from 'glob';

import * as common from './common.js';
import getConfig from './config.js';
import { getLigandsDB } from './db/getDB.js';

const debug = createDebug('pdb-sync:dev');
const config = getConfig();
const SEED_LIMIT = Number(process.env.DEV_SEED_LIMIT) || 20;

await getLigandsDB();

const pattern = `${config.asymetrical.rsync.destination}**/*.ent.gz`;
const allFiles = await glob(pattern);
const files = allFiles.slice(0, SEED_LIMIT);
debug(
  `Found ${allFiles.length} local PDB files; ingesting ${files.length} into sqlite.`,
);

if (files.length === 0) {
  debug(
    `No .ent.gz files under ${config.asymetrical.rsync.destination}. ` +
      'Run the rsync (or drop a few .ent.gz files there) before re-running `npm run dev`.',
  );
} else {
  await common.processPdbs(files);
}

debug(`Dev seed complete. Try GET /v1/pdbs/<id>.`);
