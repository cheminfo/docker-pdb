import { exec } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { cpus } from 'node:os';
import { dirname, join } from 'node:path';

import createDebug from 'debug';
import gm from 'gm';

const debug = createDebug('pdb-sync:pymol');

// Simple counting semaphore — resolves immediately when a slot is free,
// otherwise queues the caller until a slot is released.
class Semaphore {
  constructor(max) {
    this._max = max;
    this._count = 0;
    this._queue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      if (this._count < this._max) {
        this._count++;
        resolve();
      } else {
        this._queue.push(resolve);
      }
    });
  }

  release() {
    const next = this._queue.shift();
    if (next) {
      next();
    } else {
      this._count--;
    }
  }
}

// Global hard limit on simultaneous `exec('pymol …')` calls across ALL
// callers (rsync path + on-demand repair endpoint combined). Each PyMol child
// is ~500 MB RSS and spawns several Python/OpenMP threads; more than ~8
// concurrent processes routinely causes libgomp thread exhaustion or
// segfaults inside PyMol itself.
//
// Default formula: min(8, max(1, floor(cpus / 2))).
// Override at deploy time via the PYMOL_CONCURRENCY env var (still hard-
// capped at 8 to protect the container regardless of the configured value).
const DEFAULT_EXEC_LIMIT = Math.min(
  8,
  Math.max(1, Math.floor(cpus().length / 2)),
);

function getExecLimit() {
  const raw = process.env.PYMOL_CONCURRENCY;
  if (!raw) return DEFAULT_EXEC_LIMIT;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_EXEC_LIMIT;
  // Hard cap — protect the container even when PYMOL_CONCURRENCY is set high.
  return Math.min(parsed, 8);
}

// Initialized once at module load so all callers share a single semaphore.
const execSemaphore = new Semaphore(getExecLimit());

// Retry once on transient failures (segfault, OOM spike). A second attempt
// succeeds once the semaphore drains and memory pressure drops.
const MAX_RETRIES = 1;

/**
 * Render a PyMol PNG of `pdb` and persist it to disk at `outputPath`.
 * Returns `{ outputPath, status }` so the caller can aggregate per-run
 * statistics. Skipped silently when the target file already exists, which
 * keeps `npm run rebuild-db` cheap to re-run — pass `force: true` to
 * regenerate (used by the rsync path when an entry is replaced upstream).
 * @param {string} id - PDB identifier (uppercased).
 * @param {Buffer | string} pdb - Decompressed PDB content.
 * @param {string} outputPath - Absolute path of the .png file to write.
 * @param {{ width: number, height: number, force?: boolean }} options - Image
 *   dimensions and an optional `force` flag that bypasses the
 *   already-exists fast-path and unlinks the stale file before rendering.
 * @returns {Promise<{ outputPath: string, status: 'rendered' | 'skipped' }>} -
 *   The result; `status: 'skipped'` means the existing file was reused.
 */
export default async function pymol(id, pdb, outputPath, options) {
  const force = Boolean(options?.force);
  if (!force && existsSync(outputPath)) {
    debug(`pymol skip (exists): ${outputPath}`);
    return { outputPath, status: 'skipped' };
  }
  if (force) {
    // Drop the stale PNG before re-rendering so a failed render leaves no
    // ambiguous half-state on disk.
    tryUnlink(outputPath);
  }
  const { width = 200, height = 200 } = options ?? {};
  debug(`pymol ${width} x ${height} -> ${outputPath}`);

  // Per-call random suffix so parallel renders never collide on /tmp even
  // when the same (id, width, height) is in flight more than once.
  const tag = `${id}-${width}x${height}-${process.pid}-${crypto.randomUUID()}`;
  const tmpPdb = `/tmp/${tag}.pdb`;
  const tmpPng = `/tmp/${tag}.png`;
  await writeFile(tmpPdb, pdb);

  const cmd = `pymol -c ${tmpPdb} -d "as ribbon;spectrum count;set seq_view; set all_states; set opaque_background, off;" -g ${tmpPng}`;
  debug(cmd);

  await mkdir(dirname(outputPath), { recursive: true });

  // OMP_NUM_THREADS=1 prevents each PyMol process from spawning OpenMP worker
  // threads on top of the semaphore-enforced process limit.
  const execEnv = { ...process.env, OMP_NUM_THREADS: '1' };

  let lastError;
  try {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        debug(`pymol retry ${attempt} for ${id}`);
        // eslint-disable-next-line no-await-in-loop -- intentional: back off before retry
        await new Promise((r) => {
          setTimeout(r, 1000);
        });
      }
      // eslint-disable-next-line no-await-in-loop -- intentional: sequential semaphore acquire
      await execSemaphore.acquire();
      try {
        // eslint-disable-next-line no-await-in-loop -- intentional: one exec at a time per slot
        await execAndResize(
          cmd,
          tmpPng,
          outputPath,
          width,
          height,
          id,
          execEnv,
        );
        return { outputPath, status: 'rendered' };
      } catch (error) {
        lastError = error;
        debug(
          `pymol attempt ${attempt + 1}/${MAX_RETRIES + 1} failed for ${id}: ${error.message}`,
        );
      } finally {
        execSemaphore.release();
      }
    }
  } finally {
    tryUnlink(tmpPdb);
  }
  throw lastError;
}

function execAndResize(cmd, tmpPng, outputPath, width, height, id, execEnv) {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      { maxBuffer: 10 * 1024 * 1024, env: execEnv },
      (error, stdout, stderr) => {
        if (error) {
          debug('error executing pymol command', error);
          error.stdout = stdout;
          error.stderr = stderr;
          error.cmd = cmd;
          reject(error);
          return;
        }
        gm(tmpPng)
          .resize(width, height)
          .write(outputPath, (err) => {
            tryUnlink(tmpPng);
            if (err) {
              debug(`ERROR for ${id}: ${err.toString()}`);
              err.stage = 'graphicsmagick';
              reject(err);
              return;
            }
            resolve();
          });
      },
    );
  });
}

function tryUnlink(path) {
  try {
    unlinkSync(path);
  } catch {
    // ignore
  }
}

/**
 * Build the on-disk output path for a PyMol render of a bio-assembly.
 * Mirrors the wwPDB layout: `data/pymol/<sub>/<id>/<width>x<height>.png`.
 * @param {string} root - Pymol output directory (typically `data/pymol`).
 * @param {string} id - PDB identifier (uppercased).
 * @param {number} width - Image width in pixels.
 * @param {number} height - Image height in pixels.
 * @returns {string} Absolute target path for the PNG.
 */
export function pymolImagePath(root, id, width, height) {
  const lower = id.toLowerCase();
  const sub = lower.slice(1, 3);
  return join(root, sub, lower, `${width}x${height}.png`);
}
