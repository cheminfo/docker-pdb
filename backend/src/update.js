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
 * @typedef {'connecting' | 'scanning' | 'transferring' | 'post-rsync'} RsyncSubPhase
 * Fine-grained state of the rsync child process.
 * - `connecting`: rsync was spawned, nothing has been received on stdout yet.
 * - `scanning`: rsync is walking the remote tree (no `.gz` file received yet).
 * - `transferring`: at least one `.gz` file has been received (or rsync has
 *   emitted a `--info=progress2` byte-progress line).
 * - `post-rsync`: rsync has exited; the chokidar watcher is still draining
 *   the awaitWriteFinish grace period before we close it.
 */

/**
 * @typedef {object} RsyncByteProgress
 * @property {number} percent - Rsync's own global progress percentage (0-100).
 * @property {number} bytesTransferred - Bytes received so far in this run.
 * @property {string} rate - Human-readable transfer rate (e.g. "1.23MB/s").
 * @property {number | undefined} filesRemaining - Files left to check, as
 *   reported by rsync's `to-chk=` / `ir-chk=` summary. Undefined while rsync
 *   has not yet emitted a per-file progress line.
 * @property {number | undefined} filesTotal - Total files known to rsync at
 *   the moment of the last progress line.
 */

/**
 * @typedef {object} RsyncProgress
 * @property {'rsync-asym' | 'rsync-assembly'} phase - Which archive is active.
 * @property {number} processed - Files ingested so far in this phase.
 * @property {string | undefined} lastEntryId - PDB id of the most recently
 *   ingested file (uppercased), surfaced for live UI display.
 */

/**
 * @typedef {object} RsyncActivity
 * @property {'rsync-asym' | 'rsync-assembly'} phase - Which archive is active.
 * @property {RsyncSubPhase} subPhase - Current fine-grained state of the
 *   rsync child process.
 * @property {RsyncByteProgress | undefined} rsyncProgress - Byte-level
 *   progress parsed from rsync's `--info=progress2` output, when available.
 */

/**
 * Run an rsync pass against the wwPDB asymmetrical-unit and/or
 * biological-assembly archives, ingesting each file into sqlite as soon as
 * it has been fully written. Without CLI flags both archives are synced.
 * @param {object} [options] - Tuning options.
 * @param {(progress: { phase: 'rsync-asym' | 'rsync-assembly' }) => void | Promise<void>} [options.onPhase]
 *   Called once at the start of each archive phase.
 * @param {(progress: RsyncProgress) => void | Promise<void>} [options.onProgress]
 *   Called after each file is ingested. Consumers should throttle if they
 *   need to bound write amplification (e.g. only persist every Ns).
 * @param {(activity: RsyncActivity) => void | Promise<void>} [options.onActivity]
 *   Called when the rsync sub-phase transitions (e.g. scanning → transferring)
 *   or when rsync emits a new byte-level progress line. Sub-phase changes are
 *   rare and should not be throttled by callers — the UI needs them to flip
 *   the running banner from "Scanning…" to "Transferring…" immediately.
 */
export default async function update(options = {}) {
  let asymUnit = argv['pdb-asym-unit'];
  let bioAssembly = argv['pdb-bio-assembly'];
  if (!asymUnit && !bioAssembly) {
    asymUnit = true;
    bioAssembly = true;
  }
  if (asymUnit) {
    debug('Updating asymmetrical units...');
    await options.onPhase?.({ phase: 'rsync-asym' });
    await doRsync(
      config.asymetrical.rsync.source,
      config.asymetrical.rsync.destination,
      config.asymetrical.rsync.port || 873,
      common.processPdb,
      config.asymetrical.rsync.historyDir,
      'asymUnit',
      options.onProgress
        ? (entry) => options.onProgress({ phase: 'rsync-asym', ...entry })
        : undefined,
      options.onActivity
        ? (entry) => options.onActivity({ phase: 'rsync-asym', ...entry })
        : undefined,
    );
    debug('Done updating asymmetrical units...');
  }

  if (bioAssembly) {
    debug('Updating biological assemblies...');
    await options.onPhase?.({ phase: 'rsync-assembly' });
    await doRsync(
      config.bioAssembly.rsync.source,
      config.bioAssembly.rsync.destination,
      config.bioAssembly.rsync.port || 873,
      // Rsync hands us a freshly-written `.pdb1.gz` — pass `forceRender` so
      // stale PNGs from a previous deposit are unlinked and re-rendered
      // instead of being kept by the already-exists fast-path in pymol().
      (file) => common.processPdbAssembly(file, { forceRender: true }),
      config.bioAssembly.rsync.historyDir,
      'bioAssembly',
      options.onProgress
        ? (entry) => options.onProgress({ phase: 'rsync-assembly', ...entry })
        : undefined,
      options.onActivity
        ? (entry) => options.onActivity({ phase: 'rsync-assembly', ...entry })
        : undefined,
    );
    debug('Done updating biological assemblies...');
  }
}

/** Rsync `--info=progress2` line: e.g. `163,840  35%  12.34MB/s    0:00:08 (xfr#5, to-chk=45/50)`. */
const RSYNC_PROGRESS2_REGEX =
  /^\s*(?<bytes>[\d,.]+[KMGTP]?)\s+(?<percent>\d+)%\s+(?<rate>[\d.]+\s*[KMGTP]?B\/s)\s+\d+:\d+:\d+(?:\s+\(xfr#\d+,\s*(?:ir|to)-chk=(?<remaining>\d+)\/(?<total>\d+)\))?/;

/**
 * Parse the numeric prefix of an rsync byte count. Rsync emits either a
 * locale-formatted integer with commas (`163,840`) or a compact suffix-style
 * number (`163.84K`, `1.23M`). Returns the value in bytes, or `undefined` if
 * the input is not parseable.
 * @param {string} text - Raw byte count as it appears in rsync output.
 * @returns {number | undefined} Bytes, or `undefined`.
 */
function parseRsyncBytes(text) {
  const trimmed = text.trim();
  const suffixMatch = trimmed.match(/^(?<value>[\d.]+)(?<suffix>[KMGTP])$/);
  if (suffixMatch?.groups) {
    const multipliers = { K: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15 };
    return (
      Number(suffixMatch.groups.value) *
      multipliers[
        /** @type {keyof typeof multipliers} */ (suffixMatch.groups.suffix)
      ]
    );
  }
  const plain = Number(trimmed.replaceAll(',', ''));
  return Number.isFinite(plain) ? plain : undefined;
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
 * @param {((progress: { processed: number, lastEntryId: string | undefined }) => void | Promise<void>) | undefined} [onProgress]
 *   Optional callback fired after each file is ingested.
 * @param {((activity: { subPhase: RsyncSubPhase, rsyncProgress: RsyncByteProgress | undefined }) => void | Promise<void>) | undefined} [onActivity]
 *   Optional callback fired on sub-phase transitions and after each rsync
 *   `--info=progress2` line. Sub-phase transitions should propagate to the
 *   running marker immediately (do not throttle them away).
 */
async function doRsync(
  source,
  destination,
  port,
  processFile,
  historyDir,
  type,
  onProgress,
  onActivity,
) {
  await mkdir(destination, { recursive: true });
  const startedAt = new Date().toISOString();

  let subPhase = 'connecting';
  let rsyncProgress;
  await onActivity?.({ subPhase, rsyncProgress });
  const transitionTo = async (next) => {
    if (subPhase === next) return;
    subPhase = next;
    await onActivity?.({ subPhase, rsyncProgress });
  };

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

  let processed = 0;
  const renderStats = { rendered: 0, skipped: 0, failed: 0 };
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
        const result = await processFile(file);
        if (result && typeof result === 'object') {
          renderStats.rendered += result.rendered ?? 0;
          renderStats.skipped += result.skipped ?? 0;
          renderStats.failed += result.failed ?? 0;
        }
        processed++;
        if (onProgress) {
          await onProgress({
            processed,
            lastEntryId: common.getIdFromFileName(file).toUpperCase(),
            renderStats,
          });
        }
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
    // `--info=progress2` adds a global byte-level progress line on stdout
    // (overwritten with `\r`); combined with `-v` it preserves per-file
    // names so we can still detect freshly-arrived `.gz` files.
    rsync.set('info', 'progress2');

    rsync.output(
      (data) => {
        const lines = data
          .toString()
          .split(/[\r\n]+/)
          .filter(Boolean);
        for (const line of lines) {
          debug(`Processing: ${line}`);

          const progressMatch = line.match(RSYNC_PROGRESS2_REGEX);
          if (progressMatch?.groups) {
            const { bytes, percent, rate, remaining, total } =
              progressMatch.groups;
            rsyncProgress = {
              percent: Number(percent),
              bytesTransferred: parseRsyncBytes(bytes) ?? 0,
              rate: rate.replaceAll(/\s+/g, ''),
              filesRemaining: remaining ? Number(remaining) : undefined,
              filesTotal: total ? Number(total) : undefined,
            };
            // First byte-progress line implies rsync is past the file-list
            // scan; flip the sub-phase even if no `.gz` line arrived yet
            // (e.g. a single large file dominates the transfer).
            void transitionTo('transferring');
            continue;
          }

          // Any non-progress line proves rsync is connected and talking, so
          // we leave the silent `connecting` state. Filename and `deleting`
          // lines additionally imply we're actively transferring.
          if (subPhase === 'connecting') {
            void transitionTo('scanning');
          }

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
            void transitionTo('transferring');
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

  await transitionTo('post-rsync');

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
