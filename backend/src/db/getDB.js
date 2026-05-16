import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import OCL from 'openchemlib';
import { MoleculesDBSQLite } from 'openchemlib-sqlite';
import { pino } from 'pino';
import Postgrator from 'postgrator';

const logger = pino({ name: 'ligands-db' });

/** Log a warning for queries taking longer than this (in milliseconds). */
const SLOW_QUERY_THRESHOLD_MS = 10;

// `DATA_DIR` env wins so tests can isolate to a tmp dir. The default —
// three `..` from `backend/src/db/` — lands at the repo root, where the
// `data/` directory lives (and is bind-mounted to `/app/data` in Docker).
// Two `..` (the pre-workspace-refactor layout) would write the DB to
// `backend/data/`, which is *inside* the image instead of on the volume —
// every container would then read and write its own throwaway sqlite file.
const dataDir = process.env.DATA_DIR
  ? process.env.DATA_DIR.replace(/\/$/, '')
  : join(import.meta.dirname, '..', '..', '..', 'data');
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
 * Execute a sqlite statement call and report it as a slow query if it
 * exceeds {@link SLOW_QUERY_THRESHOLD_MS}. Both pino and the on-disk JSON-lines
 * log are notified. The result is returned unchanged.
 * @template TResult
 * @param {string} sql - SQL of the statement being timed (used for logging).
 * @param {() => TResult} run - Thunk that executes the prepared statement call.
 * @param {(result: TResult) => object} [extras] - Optional extras (e.g. `{ rowCount }`)
 *   to attach to the log entry. Receives the call's result.
 * @returns {TResult} The result of `run()`, unchanged.
 */
function timed(sql, run, extras) {
  const start = performance.now();
  const result = run();
  const duration = Math.round(performance.now() - start);
  if (duration > SLOW_QUERY_THRESHOLD_MS) {
    const entry = { sql, duration, ...(extras ? extras(result) : {}) };
    logger.warn(entry, 'Slow query');
    logSlowQuery(entry);
  }
  return result;
}

/**
 * Apply the standard performance PRAGMAs to a disk-based database connection.
 * Must not be called on in-memory (`:memory:`) databases.
 * @param {DatabaseSync} db - Database connection to configure.
 */
function _applyPragmas(db) {
  db.exec('PRAGMA busy_timeout = 30000');
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA synchronous = OFF');
  db.exec('PRAGMA cache_size = -131072');
  db.exec('PRAGMA temp_store = MEMORY');
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
  await applyMigrations(db);
  return new LigandsDB(db, buildMoleculesDB(db));
}

async function initDB() {
  if (!existsSync(sqliteDir)) {
    mkdirSync(sqliteDir, { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  _applyPragmas(db);
  await applyMigrations(db);
  instance = new LigandsDB(db, buildMoleculesDB(db));
  return instance;
}

/**
 * Instantiate the openchemlib-sqlite molecules wrapper against the `ligands`
 * table and apply its `migrate()` so the runtime-managed `ocl_ss_index`
 * fingerprint table exists. Called once per `DatabaseSync` connection.
 * @param {DatabaseSync} db - Open database connection to wrap.
 * @returns {MoleculesDBSQLite} The configured molecules-db instance.
 */
function buildMoleculesDB(db) {
  const molecules = new MoleculesDBSQLite(db, OCL, {
    entriesTable: 'ligands',
    pkColumn: 'id',
    idCodeColumn: 'id_code',
  });
  molecules.migrate();
  return molecules;
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
 * Wrapper class around a `DatabaseSync` connection that caches prepared
 * statements and times every call. All static SQL used by the project is
 * exposed as a named getter on this class (the cheminfo/pipeline pattern):
 * each getter calls `this.statement(sql)` once, the resulting prepared
 * statement is cached, and call sites use `db.upsertPdbEntry.run(...)`
 * rather than re-typing SQL strings.
 *
 * Truly dynamic SQL (e.g. /v1/pdbs search builds WHERE clauses from query
 * params) still uses `db.statement(sql)` directly.
 */
export class LigandsDB {
  /**
   * Wrap an open database connection.
   * @param {DatabaseSync} db - Open database connection to wrap.
   * @param {MoleculesDBSQLite} molecules - openchemlib-sqlite wrapper used
   *   for substructure / exact / similarity searches and for indexing each
   *   newly-inserted ligand into the `ocl_ss_index` fingerprint table.
   */
  constructor(db, molecules) {
    this.db = db;
    this.cache = new Map();
    this.molecules = molecules;
  }

  /**
   * Returns a cached prepared-statement wrapper for the given SQL. Each
   * call to `.get()`, `.all()`, or `.run()` is timed and reports slow
   * queries to pino + the on-disk log.
   * @param {string} sql - SQL to prepare.
   * @returns {{ get: (...args: unknown[]) => unknown, all: (...args: unknown[]) => unknown[], run: (...args: unknown[]) => unknown }} Timed prepared-statement wrapper.
   */
  statement(sql) {
    let wrapped = this.cache.get(sql);
    if (wrapped) return wrapped;
    const statement = this.db.prepare(sql);
    wrapped = {
      get: (...args) => timed(sql, () => statement.get(...args)),
      all: (...args) =>
        timed(
          sql,
          () => statement.all(...args),
          (rows) => ({
            rowCount: rows.length,
          }),
        ),
      run: (...args) => timed(sql, () => statement.run(...args)),
    };
    this.cache.set(sql, wrapped);
    return wrapped;
  }

  /** Close the underlying connection. */
  close() {
    this.db.close();
  }

  // -- pdb_entries --

  get upsertPdbEntry() {
    return this.statement(
      `INSERT INTO pdb_entries (
         id, title, experiment, year, nb_residues, nb_modified_residues,
         nb_chains, nb_helices, nb_sheets, nb_ligands, iep,
         raw_size, has_assembly, assembly_size, parsed_at,
         omega_nb_cis, omega_nb_trans, omega_nb_twisted, omega_nb_peptide_bonds,
         residue_stats_json, percentage_aa_json
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         experiment = excluded.experiment,
         year = excluded.year,
         nb_residues = excluded.nb_residues,
         nb_modified_residues = excluded.nb_modified_residues,
         nb_chains = excluded.nb_chains,
         nb_helices = excluded.nb_helices,
         nb_sheets = excluded.nb_sheets,
         nb_ligands = excluded.nb_ligands,
         iep = excluded.iep,
         raw_size = excluded.raw_size,
         has_assembly = excluded.has_assembly,
         assembly_size = excluded.assembly_size,
         parsed_at = excluded.parsed_at,
         omega_nb_cis = excluded.omega_nb_cis,
         omega_nb_trans = excluded.omega_nb_trans,
         omega_nb_twisted = excluded.omega_nb_twisted,
         omega_nb_peptide_bonds = excluded.omega_nb_peptide_bonds,
         residue_stats_json = excluded.residue_stats_json,
         percentage_aa_json = excluded.percentage_aa_json`,
    );
  }

  get markPdbAssembly() {
    return this.statement(
      `INSERT INTO pdb_entries (id, has_assembly, assembly_size, parsed_at)
       VALUES (?, 1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         has_assembly = 1,
         assembly_size = excluded.assembly_size`,
    );
  }

  get selectPdbEntry() {
    return this.statement(
      `SELECT id, title, experiment, year, nb_residues, nb_modified_residues,
              nb_chains, nb_helices, nb_sheets, nb_ligands, iep,
              omega_nb_cis, omega_nb_trans, omega_nb_twisted, omega_nb_peptide_bonds,
              residue_stats_json, percentage_aa_json,
              has_assembly, assembly_size, raw_size
       FROM pdb_entries WHERE id = ?`,
    );
  }

  get countPdbEntries() {
    return this.statement(`SELECT COUNT(*) AS n FROM pdb_entries`);
  }

  get pdbDatabaseTotals() {
    return this.statement(
      `SELECT COUNT(*)                                      AS pdb_count,
              COALESCE(SUM(raw_size), 0)                    AS pdb_bytes,
              SUM(CASE WHEN has_assembly = 1 THEN 1 ELSE 0 END) AS assembly_count,
              COALESCE(SUM(CASE WHEN has_assembly = 1 THEN assembly_size ELSE 0 END), 0) AS assembly_bytes
       FROM pdb_entries`,
    );
  }

  get selectJsmolPdbCandidates() {
    return this.statement(
      `SELECT e.id
       FROM pdb_entries e
       WHERE e.nb_residues BETWEEN 100 AND 500
         AND e.nb_modified_residues = 0
         AND e.nb_sheets > 5
         AND EXISTS (SELECT 1 FROM pdb_helices h
                     WHERE h.pdb_id = e.id AND (h.res_to - h.res_from) >= 10)
         AND EXISTS (SELECT 1 FROM pdb_sheets s
                     WHERE s.pdb_id = e.id AND (s.res_to - s.res_from) >= 10)
         AND EXISTS (SELECT 1 FROM pdb_formulas f
                     WHERE f.pdb_id = e.id AND f.label <> 'HOH'
                       AND f.mw >= 150 AND f.mw <= 500)`,
    );
  }

  // -- pdb_chains --

  get deletePdbChains() {
    return this.statement(`DELETE FROM pdb_chains WHERE pdb_id = ?`);
  }

  get insertPdbChain() {
    return this.statement(
      `INSERT INTO pdb_chains (pdb_id, chain_id, molecule, synonym, ec, nb_residues, iep)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
  }

  get selectPdbChains() {
    return this.statement(
      `SELECT chain_id, molecule, synonym, ec, nb_residues, iep
       FROM pdb_chains WHERE pdb_id = ? ORDER BY chain_id`,
    );
  }

  // -- pdb_residue_counts --

  get deletePdbResidueCounts() {
    return this.statement(`DELETE FROM pdb_residue_counts WHERE pdb_id = ?`);
  }

  get insertPdbResidueCount() {
    return this.statement(
      `INSERT INTO pdb_residue_counts (pdb_id, residue, count) VALUES (?, ?, ?)`,
    );
  }

  // -- pdb_helices --

  get deletePdbHelices() {
    return this.statement(`DELETE FROM pdb_helices WHERE pdb_id = ?`);
  }

  get insertPdbHelix() {
    return this.statement(
      `INSERT INTO pdb_helices (pdb_id, idx, chain, res_from, res_to, kind)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
  }

  get selectPdbHelices() {
    return this.statement(
      `SELECT chain, res_from, res_to, kind
       FROM pdb_helices WHERE pdb_id = ? ORDER BY idx`,
    );
  }

  // -- pdb_sheets --

  get deletePdbSheets() {
    return this.statement(`DELETE FROM pdb_sheets WHERE pdb_id = ?`);
  }

  get insertPdbSheet() {
    return this.statement(
      `INSERT INTO pdb_sheets (pdb_id, idx, chain, res_from, res_to)
       VALUES (?, ?, ?, ?, ?)`,
    );
  }

  get selectPdbSheets() {
    return this.statement(
      `SELECT chain, res_from, res_to
       FROM pdb_sheets WHERE pdb_id = ? ORDER BY idx`,
    );
  }

  // -- pdb_formulas --

  get deletePdbFormulas() {
    return this.statement(`DELETE FROM pdb_formulas WHERE pdb_id = ?`);
  }

  get insertPdbFormula() {
    return this.statement(
      `INSERT INTO pdb_formulas (pdb_id, label, mf, mw, count, name)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
  }

  get selectPdbFormulas() {
    return this.statement(
      `SELECT label, mf, mw, count, name
       FROM pdb_formulas WHERE pdb_id = ? ORDER BY label`,
    );
  }

  // -- pdb_omega_pairs --

  get deletePdbOmegaPairs() {
    return this.statement(`DELETE FROM pdb_omega_pairs WHERE pdb_id = ?`);
  }

  get insertPdbOmegaPair() {
    return this.statement(
      `INSERT INTO pdb_omega_pairs (pdb_id, residue1, residue2, total_count, cis_count, twisted_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
  }

  // -- pdb_ligands --

  get deletePdbLigands() {
    return this.statement(`DELETE FROM pdb_ligands WHERE pdb_id = ?`);
  }

  get insertPdbLigand() {
    return this.statement(
      `INSERT INTO pdb_ligands (pdb_id, ligand_code, count) VALUES (?, ?, ?)`,
    );
  }

  get upsertPdbLigand() {
    return this.statement(
      `INSERT OR REPLACE INTO pdb_ligands (pdb_id, ligand_code, count)
       VALUES (?, ?, ?)`,
    );
  }

  get countPdbsByLigandCode() {
    return this.statement(
      `SELECT COUNT(*) AS n FROM pdb_ligands WHERE ligand_code = ?`,
    );
  }

  get selectPdbsByLigandCode() {
    return this.statement(
      `SELECT pdb_id AS pdbId, count
       FROM pdb_ligands
       WHERE ligand_code = ?
       ORDER BY pdb_id
       LIMIT ? OFFSET ?`,
    );
  }

  // -- pdb_ligand_instances --

  get deletePdbLigandInstances() {
    return this.statement(`DELETE FROM pdb_ligand_instances WHERE pdb_id = ?`);
  }

  get insertPdbLigandInstance() {
    return this.statement(
      `INSERT OR REPLACE INTO pdb_ligand_instances
         (pdb_id, ligand_code, chain, res_seq, i_code, atoms)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
  }

  // -- pdb_title_fts --

  get deletePdbTitleFts() {
    return this.statement(`DELETE FROM pdb_title_fts WHERE pdb_id = ?`);
  }

  get insertPdbTitleFts() {
    return this.statement(
      `INSERT INTO pdb_title_fts (pdb_id, title) VALUES (?, ?)`,
    );
  }

  // -- ligands --

  get countLigands() {
    return this.statement(`SELECT COUNT(*) AS n FROM ligands`);
  }

  get upsertLigand() {
    // UPSERT (rather than INSERT OR REPLACE) so the row's `id` survives a
    // refresh — the runtime-managed `ocl_ss_index.entry_id` foreign key
    // would otherwise be orphaned on every CCD reseed. RETURNING id lets
    // the caller pass that id to `db.molecules.insert(id, molecule)`.
    return this.statement(
      `INSERT INTO ligands (code, name, formula, type, id_code, coordinates, mf, mw, nb_atoms, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, cast(unixepoch('subsec') * 1000 as integer))
       ON CONFLICT(code) DO UPDATE SET
         name = excluded.name,
         formula = excluded.formula,
         type = excluded.type,
         id_code = excluded.id_code,
         coordinates = excluded.coordinates,
         mf = excluded.mf,
         mw = excluded.mw,
         nb_atoms = excluded.nb_atoms,
         updated_at = excluded.updated_at
       RETURNING id`,
    );
  }

  get selectLigandByCode() {
    return this.statement(
      `SELECT l.code, l.name, l.formula, l.type, l.mf, l.mw, l.nb_atoms AS nbAtoms,
              l.id_code AS idCode, l.coordinates,
              COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
       FROM ligands l WHERE l.code = ?`,
    );
  }

  get selectLigandsByDefaultRanking() {
    return this.statement(
      `SELECT l.code, l.name, l.mf, l.mw, l.id_code AS idCode, l.coordinates,
              COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
       FROM ligands l
       ORDER BY nbPdbs DESC
       LIMIT ?`,
    );
  }

  // -- rsync_history --

  get insertRsyncHistory() {
    return this.statement(
      `INSERT INTO rsync_history
         (type, started_at, finished_at, duration_ms,
          updated_count, deleted_count, last_entry_id, bytes_on_disk)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
  }

  get selectRsyncHistory() {
    return this.statement(
      `SELECT type, started_at, finished_at, duration_ms, updated_count,
              deleted_count, last_entry_id, bytes_on_disk
       FROM rsync_history
       WHERE type = ?
       ORDER BY finished_at DESC
       LIMIT ?`,
    );
  }

  get selectLastRsyncRun() {
    return this.statement(
      `SELECT type, started_at, finished_at, duration_ms, updated_count,
              deleted_count, last_entry_id, bytes_on_disk
       FROM rsync_history
       WHERE type = ?
       ORDER BY finished_at DESC
       LIMIT 1`,
    );
  }

  // -- ccd_history --

  get insertCcdHistoryStart() {
    return this.statement(
      `INSERT INTO ccd_history
         (started_at, status, pid, last_heartbeat_at)
       VALUES (?, 'running', ?, ?)`,
    );
  }

  get updateCcdHistoryHeartbeat() {
    return this.statement(
      `UPDATE ccd_history
         SET imported_count = ?, skipped_count = ?, last_heartbeat_at = ?
       WHERE id = ?`,
    );
  }

  get finalizeCcdHistory() {
    return this.statement(
      `UPDATE ccd_history
         SET finished_at = ?, duration_ms = ?, status = ?,
             imported_count = ?, skipped_count = ?,
             bytes_on_disk = ?, error = ?, last_heartbeat_at = ?
       WHERE id = ?`,
    );
  }

  get insertCcdHistory() {
    return this.statement(
      `INSERT INTO ccd_history
         (started_at, finished_at, duration_ms, status,
          imported_count, skipped_count, bytes_on_disk, error)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
  }

  get selectCcdHistory() {
    return this.statement(
      `SELECT id, started_at, finished_at, duration_ms, status,
              imported_count, skipped_count, bytes_on_disk, error,
              pid, last_heartbeat_at
       FROM ccd_history
       ORDER BY id DESC
       LIMIT ?`,
    );
  }

  get selectLastCcdRefresh() {
    return this.statement(
      `SELECT id, started_at, finished_at, duration_ms, status,
              imported_count, skipped_count, bytes_on_disk, error,
              pid, last_heartbeat_at
       FROM ccd_history
       ORDER BY id DESC
       LIMIT 1`,
    );
  }

  // -- credentials --

  get countCredentials() {
    return this.statement(`SELECT COUNT(*) AS n FROM credentials`);
  }

  get getCredentialByUsername() {
    return this.statement(
      `SELECT username, password_hash AS passwordHash FROM credentials WHERE username = ?`,
    );
  }

  get getFirstCredential() {
    return this.statement(
      `SELECT username, password_hash AS passwordHash FROM credentials LIMIT 1`,
    );
  }

  get insertCredential() {
    return this.statement(
      `INSERT INTO credentials (username, password_hash) VALUES (?, ?)`,
    );
  }

  get updateCredentialPassword() {
    return this.statement(
      `UPDATE credentials SET password_hash = ? WHERE username = ?`,
    );
  }

  // -- stats: pdb_entries --

  get statsByYear() {
    return this.statement(
      `SELECT year AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
       GROUP BY year
       ORDER BY year`,
    );
  }

  get statsByExperiment() {
    return this.statement(
      `SELECT experiment AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE experiment IS NOT NULL AND experiment <> ''
       GROUP BY experiment
       ORDER BY value DESC`,
    );
  }

  get statsModifiedResiduesHist() {
    return this.statement(
      `SELECT nb_modified_residues AS key, COUNT(*) AS value
       FROM pdb_entries
       GROUP BY nb_modified_residues
       ORDER BY nb_modified_residues`,
    );
  }

  get statsHelicesVsSheets() {
    return this.statement(
      `SELECT nb_helices AS h, nb_sheets AS s, COUNT(*) AS value
       FROM pdb_entries
       GROUP BY nb_helices, nb_sheets`,
    );
  }

  get statsSecondaryStructurePresence() {
    return this.statement(
      `SELECT label AS key, COUNT(*) AS value FROM (
         SELECT CASE
           WHEN nb_helices = 0 AND nb_sheets = 0 THEN 'none'
           WHEN nb_helices > 0 AND nb_sheets = 0 THEN 'helices-only'
           WHEN nb_helices = 0 AND nb_sheets > 0 THEN 'sheets-only'
           ELSE 'mixed'
         END AS label
         FROM pdb_entries
       )
       GROUP BY label`,
    );
  }

  get selectResidueCountsForHistogram() {
    return this.statement(
      `SELECT nb_residues FROM pdb_entries WHERE nb_residues > 0`,
    );
  }

  get statsChainsHistogram() {
    return this.statement(
      `SELECT nb_chains AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE nb_chains > 0
       GROUP BY nb_chains
       ORDER BY nb_chains`,
    );
  }

  get statsIepHistogram() {
    return this.statement(
      `SELECT (CAST(iep * 2 AS INTEGER) / 2.0) AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE iep IS NOT NULL
       GROUP BY key
       ORDER BY key`,
    );
  }

  get statsLigandsByYear() {
    return this.statement(
      `SELECT year                          AS key,
              COALESCE(SUM(nb_ligands), 0)  AS sum,
              COUNT(*)                      AS count,
              COALESCE(MIN(nb_ligands), 0)  AS min,
              COALESCE(MAX(nb_ligands), 0)  AS max,
              COALESCE(SUM(nb_ligands*nb_ligands), 0) AS sumsqr
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
       GROUP BY year
       ORDER BY year`,
    );
  }

  get statsResiduesByYear() {
    return this.statement(
      `SELECT year                            AS key,
              COALESCE(SUM(nb_residues), 0)   AS sum,
              COUNT(*)                        AS count,
              COALESCE(MIN(nb_residues), 0)   AS min,
              COALESCE(MAX(nb_residues), 0)   AS max,
              COALESCE(SUM(nb_residues*nb_residues), 0) AS sumsqr
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
       GROUP BY year
       ORDER BY year`,
    );
  }

  get statsMethodByYear() {
    return this.statement(
      `SELECT year, experiment, COUNT(*) AS value
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
         AND experiment IS NOT NULL AND experiment <> ''
       GROUP BY year, experiment
       ORDER BY year`,
    );
  }

  // The four omega rollup-backed statements below read from
  // `stats_omega_by_year` / `stats_omega_pairs_by_year`, both regenerated
  // at the end of every rsync cycle by `rebuildOmegaStatsRollup`. The
  // raw source-of-truth columns (`pdb_entries.omega_nb_*`,
  // `pdb_omega_pairs.*`) remain populated per upsert and are still
  // available for ad-hoc queries / per-PDB endpoints — only the global
  // stats fan-out is served from the rollup.
  //
  // Entries with NULL / non-positive `year` are bucketed under year=0
  // in the rollup, so the summary picks them up while per-year /
  // range queries can filter them out with `WHERE year > 0` /
  // `WHERE year BETWEEN ? AND ?`.

  get statsOmegaSummary() {
    return this.statement(
      `SELECT
         COALESCE(SUM(cis_count), 0)            AS cis,
         COALESCE(SUM(trans_count), 0)          AS trans,
         COALESCE(SUM(twisted_count), 0)        AS twisted,
         COALESCE(SUM(peptide_bonds_count), 0)  AS total
       FROM stats_omega_by_year`,
    );
  }

  get statsOmegaByYear() {
    return this.statement(
      `SELECT year                AS key,
              cis_count            AS cis,
              trans_count          AS trans,
              twisted_count        AS twisted,
              peptide_bonds_count  AS total
       FROM stats_omega_by_year
       WHERE year > 0
       ORDER BY year`,
    );
  }

  get statsCisCountHistogram() {
    return this.statement(
      `SELECT omega_nb_cis AS key, COUNT(*) AS value
       FROM pdb_entries
       GROUP BY omega_nb_cis
       ORDER BY omega_nb_cis`,
    );
  }

  get statsResiduesPerChain() {
    return this.statement(
      `SELECT (CAST(nb_residues AS REAL) / nb_chains) AS v
       FROM pdb_entries WHERE nb_chains > 0`,
    );
  }

  // -- stats: pdb_helices / pdb_sheets --

  get statsHelixKindHist() {
    return this.statement(
      `SELECT kind AS key, COUNT(*) AS value
       FROM pdb_helices
       WHERE kind IS NOT NULL
       GROUP BY kind
       ORDER BY kind`,
    );
  }

  get statsHelixLengthHist() {
    return this.statement(
      `SELECT (res_to - res_from + 1) AS key, COUNT(*) AS value
       FROM pdb_helices
       WHERE res_to >= res_from
         AND (res_to - res_from + 1) > 0
         AND (res_to - res_from + 1) < ?
       GROUP BY key
       ORDER BY key`,
    );
  }

  get statsSheetLengthHist() {
    return this.statement(
      `SELECT (res_to - res_from + 1) AS key, COUNT(*) AS value
       FROM pdb_sheets
       WHERE res_to >= res_from
         AND (res_to - res_from + 1) > 0
         AND (res_to - res_from + 1) < ?
       GROUP BY key
       ORDER BY key`,
    );
  }

  // -- stats: pdb_chains / pdb_formulas --

  get statsEcClasses() {
    return this.statement(
      `SELECT head AS key, COUNT(DISTINCT pdb_id) AS value FROM (
         SELECT pdb_id, substr(ec, 1, 1) AS head
         FROM pdb_chains
         WHERE ec IS NOT NULL
           AND length(ec) > 0
           AND substr(ec, 1, 1) BETWEEN '1' AND '7'
       )
       GROUP BY head
       ORDER BY head`,
    );
  }

  get statsLigandFrequency() {
    return this.statement(
      `SELECT label AS key, SUM(count) AS value
       FROM pdb_formulas
       WHERE label <> 'HOH'
       GROUP BY label
       ORDER BY value DESC`,
    );
  }

  get selectLigandMwForHistogram() {
    return this.statement(
      `SELECT mw FROM pdb_formulas WHERE label <> 'HOH' AND mw IS NOT NULL AND mw > 0`,
    );
  }

  // -- stats: pdb_omega_pairs --

  get statsPairFrequencyAllYears() {
    return this.statement(
      `SELECT residue1, residue2,
              SUM(cis_count)   AS cis,
              SUM(total_count) AS total
       FROM stats_omega_pairs_by_year
       GROUP BY residue1, residue2`,
    );
  }

  get statsPairFrequencyByYearRange() {
    return this.statement(
      `SELECT residue1, residue2,
              SUM(cis_count)   AS cis,
              SUM(total_count) AS total
       FROM stats_omega_pairs_by_year
       WHERE year BETWEEN ? AND ?
       GROUP BY residue1, residue2`,
    );
  }

  get statsTwistedPairFrequency() {
    return this.statement(
      `SELECT residue1, residue2, SUM(twisted_count) AS value
       FROM stats_omega_pairs_by_year
       GROUP BY residue1, residue2
       HAVING SUM(twisted_count) > 0
       ORDER BY value DESC`,
    );
  }

  get statsPairFrequencyByYear() {
    return this.statement(
      `SELECT year,
              residue1,
              residue2,
              cis_count   AS cis,
              total_count AS total
       FROM stats_omega_pairs_by_year
       WHERE year > 0
       ORDER BY year, residue1, residue2`,
    );
  }
}
