import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { pino } from 'pino';
import Postgrator from 'postgrator';

const logger = pino({ name: 'ligands-db' });

/** Log a warning for queries taking longer than this (in milliseconds). */
const SLOW_QUERY_THRESHOLD_MS = 10;

const dataDir = join(import.meta.dirname, '..', '..', 'data');
const sqliteDir = join(dataDir, 'sqlite');
const dbPath = join(sqliteDir, 'ligands.db');
const slowQueryLogPath = join(sqliteDir, 'slow-queries.log');

/**
 * Append a slow-query record to the on-disk JSON-lines log. Failures
 * (full disk, permissions) are swallowed so they never crash the caller.
 * @param {{ sql: string, duration: number, rowCount?: number }} entry - The slow-query record to persist.
 */
function logSlowQuery(entry) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  });
  try {
    appendFileSync(slowQueryLogPath, `${line}\n`);
  } catch {
    // ignore
  }
}

/**
 * Apply performance PRAGMAs to a database connection. Mirrors the
 * settings used in cheminfo/pipeline.
 * @param {DatabaseSync} db - Database connection to configure.
 */
function applyPragmas(db) {
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA synchronous = NORMAL');
  db.exec('PRAGMA temp_store = MEMORY');
  db.exec('PRAGMA busy_timeout = 5000');
}

let instance;
let initPromise;

/**
 * Returns a singleton ligands-database instance. The first call applies
 * pending migrations from `backend/src/db/migrations/`; subsequent calls reuse
 * the open connection.
 * @returns {Promise<LigandsDB>} The shared ligands-database instance.
 */
export function getLigandsDB() {
  if (instance?.db.isOpen) return Promise.resolve(instance);
  if (initPromise) return initPromise;
  initPromise = initDB();
  return initPromise;
}

/**
 * Opens an in-memory database with migrations applied — handy for tests
 * and for one-shot scripts that don't need to touch disk.
 * @returns {Promise<LigandsDB>} A fresh in-memory database with migrations applied.
 */
export async function getInMemoryLigandsDB() {
  const db = new DatabaseSync(':memory:');
  applyPragmas(db);
  await applyMigrations(db);
  return new LigandsDB(db);
}

async function initDB() {
  if (!existsSync(sqliteDir)) {
    mkdirSync(sqliteDir, { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  applyPragmas(db);
  await applyMigrations(db);
  instance = new LigandsDB(db);
  return instance;
}

/**
 * Apply pending migrations from `backend/src/db/migrations/*.sql` using Postgrator.
 * Migrations are tracked via the `schemaversion` table that Postgrator
 * creates automatically.
 * @param {DatabaseSync} db - Database to migrate.
 */
async function applyMigrations(db) {
  const postgrator = new Postgrator({
    migrationPattern: join(import.meta.dirname, 'migrations', '*'),
    driver: 'sqlite3',
    execQuery: async (query) => {
      const statement = db.prepare(query);
      const rows = statement.all();
      return { rows };
    },
    execSqlScript: async (sqlScript) => {
      db.exec(sqlScript);
    },
  });

  postgrator.on('migration-started', ({ filename }) => {
    logger.info({ filename }, 'Applying migration');
  });
  postgrator.on('migration-finished', ({ filename }) => {
    logger.info({ filename }, 'Migration applied');
  });

  await postgrator.migrate();
}

/**
 * Thin wrapper around a `DatabaseSync` connection that wraps every prepared
 * statement with timing instrumentation. Slow queries (over 10 ms) are
 * emitted to pino at WARN level and appended to the on-disk log.
 */
export class LigandsDB {
  /**
   * Wrap an open database connection.
   * @param {DatabaseSync} db - Open database connection to wrap.
   */
  constructor(db) {
    this.db = db;
    this.cache = new Map();
  }

  /**
   * Returns a cached prepared-statement wrapper for the given SQL. Each
   * call to `.get()`, `.all()`, or `.run()` is timed and reports slow
   * queries to pino + the on-disk log.
   * @param {string} sql - SQL to prepare.
   * @returns {{ get: Function, all: Function, run: Function }} Timed prepared-statement wrapper.
   */
  statement(sql) {
    let wrapped = this.cache.get(sql);
    if (wrapped) return wrapped;
    const statement = this.db.prepare(sql);
    wrapped = {
      get: (...args) => {
        const start = performance.now();
        const row = statement.get(...args);
        const duration = Math.round(performance.now() - start);
        if (duration > SLOW_QUERY_THRESHOLD_MS) {
          logger.warn({ sql, duration }, 'Slow query');
          logSlowQuery({ sql, duration });
        }
        return row;
      },
      all: (...args) => {
        const start = performance.now();
        const rows = statement.all(...args);
        const duration = Math.round(performance.now() - start);
        if (duration > SLOW_QUERY_THRESHOLD_MS) {
          logger.warn({ sql, duration, rowCount: rows.length }, 'Slow query');
          logSlowQuery({ sql, duration, rowCount: rows.length });
        }
        return rows;
      },
      run: (...args) => {
        const start = performance.now();
        const result = statement.run(...args);
        const duration = Math.round(performance.now() - start);
        if (duration > SLOW_QUERY_THRESHOLD_MS) {
          logger.warn({ sql, duration }, 'Slow query');
          logSlowQuery({ sql, duration });
        }
        return result;
      },
    };
    this.cache.set(sql, wrapped);
    return wrapped;
  }

  /** Close the underlying connection. */
  close() {
    this.db.close();
  }
}
