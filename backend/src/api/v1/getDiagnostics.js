import { existsSync, readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';

import { ccdGzPath } from '../../ccd/seedCCD.js';
import getConfig from '../../config.js';
import { SYNC_KINDS, readRunning, readTrigger } from '../../syncControl.js';
import { pymolImagePath } from '../../util/pymol.js';

import { ccdHistoryRowToDoc } from './getCcdHistory.js';

const SAMPLE_PDB_IDS = ['100D', '1CRN', '4HHB', '8ZXR', '8XYZ'];

const SAMPLE_PYMOL_SIZES = [
  { width: 100, height: 100 },
  { width: 200, height: 200 },
  { width: 400, height: 400 },
];

/**
 * Register `GET /v1/diagnostics` — single JSON snapshot covering process
 * runtime, database row counts, sync cron state, and full assembly thumbnail
 * coverage. Designed for triaging deployments that have no shell access.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetDiagnosticsRoute(fastify, db) {
  fastify.get('/v1/diagnostics', async (_request, reply) => {
    const config = getConfig();

    const databaseTotals = db.pdbDatabaseTotals.get();
    const ligandCount = db.countLigands.get()?.n ?? 0;
    const pdbCount = databaseTotals?.pdb_count ?? 0;
    const emptyTitleCount = db.countEmptyTitleEntries.get()?.n ?? 0;
    const ftsTitleCount = db.countFtsTitleEntries.get()?.n ?? 0;

    const lastCcd = db.selectLastCcdRefresh.get();
    const lastRsyncAsym = db.selectLastRsyncRun.get('asymUnit');
    const lastRsyncBio = db.selectLastRsyncRun.get('bioAssembly');

    // Scan all assembly entries for missing 200×200 thumbnails. existsSync
    // is fast enough on local/Docker filesystems that this completes in well
    // under a second even for 100k+ entries.
    const assemblyRows = db.selectAllAssemblyIds.all();
    const assemblyTotal = assemblyRows.length;
    let assemblyMissing = 0;
    for (const { id } of assemblyRows) {
      if (!existsSync(pymolImagePath(config.pymolDir, id, 200, 200))) {
        assemblyMissing++;
      }
    }

    const [pymolSamples, ccdGz] = await Promise.all([
      probePymolSamples(config.pymolDir),
      probeFile(ccdGzPath),
    ]);

    const memory = process.memoryUsage();
    return reply.send({
      process: {
        pid: process.pid,
        uptimeSeconds: Math.round(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        rssMb: Math.round(memory.rss / 1024 / 1024),
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      },
      database: {
        ligandCount,
        pdbCount,
        assemblyTotal,
        assemblyMissing,
        ligandsLooksEmpty: ligandCount === 0,
        emptyTitleCount,
        ftsTitleCount,
      },
      sync: {
        kinds: SYNC_KINDS,
        rsyncRunning: readRunning('rsync'),
        rsyncTrigger: readTrigger('rsync'),
        ccdRunning: readRunning('ccd'),
        ccdTrigger: readTrigger('ccd'),
        lastCcdRefresh: lastCcd ? ccdHistoryRowToDoc(lastCcd) : null,
        lastRsync: {
          asymUnit: rsyncRowToDoc(lastRsyncAsym),
          bioAssembly: rsyncRowToDoc(lastRsyncBio),
        },
      },
      data: {
        dataDir: config.dataDir,
        pymolDir: config.pymolDir,
        ccdGzPath,
        ccdGzFile: ccdGz,
        pymolSamples,
      },
    });
  });
}

function rsyncRowToDoc(row) {
  if (!row) return null;
  return {
    type: row.type,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    durationMs: row.duration_ms,
    updatedCount: row.updated_count,
    deletedCount: row.deleted_count,
    lastEntryId: row.last_entry_id,
    bytesOnDisk: row.bytes_on_disk,
  };
}

async function probeFile(path) {
  try {
    const stats = await stat(path);
    return {
      exists: true,
      sizeBytes: stats.size,
      mtime: new Date(stats.mtimeMs).toISOString(),
    };
  } catch {
    return { exists: false, sizeBytes: null, mtime: null };
  }
}

async function probePymolSamples(pymolDir) {
  const pymolDirExists = existsSync(pymolDir);
  const samples = SAMPLE_PDB_IDS.map((id) => {
    const lower = id.toLowerCase();
    const bucket = lower.slice(1, 3);
    const bucketDir = join(pymolDir, bucket);
    const bucketExists = existsSync(bucketDir);
    const sizes = {};
    for (const size of SAMPLE_PYMOL_SIZES) {
      const path = pymolImagePath(pymolDir, id, size.width, size.height);
      sizes[`${size.width}x${size.height}`] = existsSync(path);
    }
    return { id, bucketDir, bucketExists, sizes };
  });
  let bucketCount = null;
  if (pymolDirExists) {
    try {
      bucketCount = readdirSync(pymolDir).length;
    } catch {
      bucketCount = null;
    }
  }
  return { pymolDirExists, bucketCount, samples };
}
