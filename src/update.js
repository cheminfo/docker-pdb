// Synchronizes the rsynced PDB directory tree and ingests each file into
// sqlite as soon as it lands on disk (rather than at the end of rsync).
// Local files are never deleted, even when removed upstream.
// Requires `rsync` to be installed.

import { execFile } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { parseArgs, promisify } from 'node:util';

import { watch } from 'chokidar';
import createDebug from 'debug';
import Rsync from 'rsync';

import * as common from './common.js';
import getConfig from './config.js';
import { recordRsyncHistory } from './db/upsertPdbEntry.js';

const execFileAsync = promisify(execFile);

const debug = createDebug('update');
const config = getConfig();

// Time chokidar waits with no size change before considering a file fully
// written. rsync writes via temp+rename, so 2s is comfortably safe.
const STABILITY_THRESHOLD_MS = 2000;
// Extra grace period after rsync exits before closing the watcher, so the
// last file's `awaitWriteFinish` event can fire.
const POST_RSYNC_GRACE_MS = STABILITY_THRESHOLD_MS + 1000;

const { values: argv } = parseArgs({
  options: {
    'pdb-asym-unit': { type: 'boolean' },
    'pdb-bio-assembly': { type: 'boolean' },
  },
  strict: false,
});

/**
 * Run an rsync pass against the wwPDB asymmetrical-unit and/or
 * biological-assembly archives, ingesting each file into sqlite as soon as
 * it has been fully written. Without CLI flags both archives are synced.
 */
export default async function update() {
  let asymUnit = argv['pdb-asym-unit'];
  let bioAssembly = argv['pdb-bio-assembly'];
  if (!asymUnit && !bioAssembly) {
    asymUnit = true;
    bioAssembly = true;
  }
  if (asymUnit) {
    debug('Updating asymmetrical units...');
    await doRsync(
      config.asymetrical.rsync.source,
      config.asymetrical.rsync.destination,
      config.asymetrical.rsync.port || 873,
      common.processPdb,
      config.asymetrical.rsync.historyDir,
      'asymUnit',
    );
    debug('Done updating asymmetrical units...');
  }

  if (bioAssembly) {
    debug('Updating biological assemblies...');
    await doRsync(
      config.bioAssembly.rsync.source,
      config.bioAssembly.rsync.destination,
      config.bioAssembly.rsync.port || 873,
      common.processPdbAssembly,
      config.bioAssembly.rsync.historyDir,
      'bioAssembly',
    );
    debug('Done updating biological assemblies...');
  }
}

/**
 * Run rsync against `source -> destination` and ingest each `.gz` file into
 * sqlite as soon as it has finished being written. Files removed upstream
 * are left untouched on disk (we do not pass `--delete` to rsync).
 * @param {string} source - rsync source spec (e.g. `host::module/path/`).
 * @param {string} destination - Local directory to sync into.
 * @param {number} port - rsync daemon port.
 * @param {(file: string) => Promise<void>} processFile - Per-file ingestion handler.
 * @param {string | undefined} historyDir - Optional directory to write a JSON
 *   summary of changes (`{deleted, updated}`) for this rsync run.
 * @param {'asymUnit' | 'bioAssembly'} type - Archive label used when recording
 *   the run in the `rsync_history` sqlite table.
 */
async function doRsync(
  source,
  destination,
  port,
  processFile,
  historyDir,
  type,
) {
  await mkdir(destination, { recursive: true });
  const startedAt = new Date().toISOString();

  const changed = { deleted: [], updated: [] };
  const queue = [];
  let wakeWorker = null;
  let inputClosed = false;
  const waitForSignal = () =>
    new Promise((resolve) => {
      wakeWorker = resolve;
    });

  const watcher = watch(destination, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: STABILITY_THRESHOLD_MS,
      pollInterval: 200,
    },
  });

  watcher.on('add', (file) => {
    if (!file.endsWith('.gz')) return;
    queue.push(file);
    if (wakeWorker) {
      wakeWorker();
      wakeWorker = null;
    }
  });

  /* eslint-disable no-await-in-loop -- intentional sequential sqlite writes */
  const workerDone = (async () => {
    while (true) {
      if (queue.length === 0) {
        if (inputClosed) return;
        await waitForSignal();
        continue;
      }
      const file = queue.shift();
      try {
        await processFile(file);
      } catch (error) {
        debug('Process error', file, error);
      }
    }
  })();
  /* eslint-enable no-await-in-loop */

  debug('Rsync from', source, 'to', destination);
  await new Promise((resolve, reject) => {
    const rsync = new Rsync();
    rsync.source(source);
    rsync.destination(destination);
    // `--delete` is intentionally NOT set: we keep local files even when
    // they are removed upstream.
    rsync.flags('rlptvz');
    rsync.set('port', port);

    rsync.output(
      (data) => {
        const lines = data
          .toString()
          .split(/[\r\n]+/)
          .filter(Boolean);
        for (const line of lines) {
          debug(`Processing: ${line}`);
          if (line.startsWith('deleting ')) {
            const pdbId = common.getIdFromFileName(line).toUpperCase();
            if (pdbId.length === 4) {
              changed.deleted.push(pdbId);
            }
            continue;
          }
          if (line.match(/\.gz$/)) {
            appendFileSync('./rsyncChanges', `${destination + line}\n`);
            const pdbId = common.getIdFromFileName(line).toUpperCase();
            if (pdbId.length === 4) {
              changed.updated.push(pdbId);
            }
          }
        }
      },
      () => {
        // ignore stderr
      },
    );

    rsync.execute((error, code, cmd) => {
      if (error) {
        debug('RSYNC ERROR', error, code, cmd);
        reject(error);
        return;
      }
      resolve();
    });
  });

  if (historyDir) {
    debug('Writing rsync change summary');
    const targetFile = join(historyDir, `${new Date().toISOString()}.json`);
    await mkdir(dirname(targetFile), { recursive: true });
    await writeFile(targetFile, JSON.stringify(changed, undefined, 2));
  }

  // Let chokidar's awaitWriteFinish settle on the last few files.
  await delay(POST_RSYNC_GRACE_MS);
  inputClosed = true;
  if (wakeWorker) {
    wakeWorker();
    wakeWorker = null;
  }
  await workerDone;
  await watcher.close();
  debug('All queued files processed');

  const bytesOnDisk = await getDirectorySize(destination);
  const finishedAt = new Date().toISOString();
  const lastEntryId =
    changed.updated.length > 0 ? changed.updated.toSorted().at(-1) : null;

  try {
    await recordRsyncHistory({
      type,
      startedAt,
      finishedAt,
      durationMs: Date.parse(finishedAt) - Date.parse(startedAt),
      updatedCount: changed.updated.length,
      deletedCount: changed.deleted.length,
      lastEntryId,
      bytesOnDisk,
    });
    debug(`Recorded rsync-history row (${type}, ${finishedAt})`);
  } catch (error) {
    debug('Failed to record rsync-history row', error);
  }
}

/**
 * Total apparent size of every file under `directory`, in bytes. Uses `du -sk`
 * (cross-platform between BSD/macOS and GNU/Linux) and multiplies by 1024.
 * Returns `null` if `du` is unavailable or fails — the rsync run is still
 * recorded without a size in that case.
 * @param {string} directory - Directory whose recursive size should be measured.
 * @returns {Promise<number | null>} Total size in bytes, or `null` on failure.
 */
async function getDirectorySize(directory) {
  try {
    const { stdout } = await execFileAsync('du', ['-sk', directory]);
    const blocks = Number(stdout.trim().split(/\s+/)[0]);
    return Number.isFinite(blocks) ? blocks * 1024 : null;
  } catch (error) {
    debug('Failed to compute directory size for', directory, error);
    return null;
  }
}
