-- Consolidated initial sqlite schema for pdb-quickview. This single migration
-- replaces the previous 001..005 chain — the database is rebuilt from scratch
-- whenever this file changes.
--
-- Tables broadly group into four areas:
--   * pdb_entries + child tables     → parsed PDB metadata (one row per entry)
--   * ligands                        → CCD reference; surrogate INTEGER id
--                                       used as the foreign key for the
--                                       openchemlib-sqlite `ocl_ss_index`
--                                       table that is created at runtime by
--                                       MoleculesDBSQLite.migrate()
--   * pdb_ligands + …_instances      → links between PDB entries and ligands
--   * stats_omega_*, ccd_history,    → derived/operational tables
--     rsync_history, pdb_title_fts

-- ---- pdb_entries (one row per PDB entry, drives the read API and stats) ----

CREATE TABLE IF NOT EXISTS pdb_entries (
  id                       TEXT NOT NULL PRIMARY KEY,
  title                    TEXT NOT NULL DEFAULT '',
  experiment               TEXT,
  year                     INTEGER,
  nb_residues              INTEGER NOT NULL DEFAULT 0,
  nb_modified_residues     INTEGER NOT NULL DEFAULT 0,
  nb_chains                INTEGER NOT NULL DEFAULT 0,
  nb_helices               INTEGER NOT NULL DEFAULT 0,
  nb_sheets                INTEGER NOT NULL DEFAULT 0,
  nb_ligands               INTEGER NOT NULL DEFAULT 0,
  iep                      REAL,
  raw_size                 INTEGER,
  has_assembly             INTEGER NOT NULL DEFAULT 0,
  assembly_size            INTEGER,
  parsed_at                INTEGER NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  -- Cached omega aggregates (full per-residue table is overkill; only the
  -- summary tuple and per-pair counts are queried).
  omega_nb_cis             INTEGER NOT NULL DEFAULT 0,
  omega_nb_trans           INTEGER NOT NULL DEFAULT 0,
  omega_nb_twisted         INTEGER NOT NULL DEFAULT 0,
  omega_nb_peptide_bonds   INTEGER NOT NULL DEFAULT 0,
  -- JSON copy of `residueStats` so the per-entry document can be reconstructed
  -- without re-querying the chain/composition tables.
  residue_stats_json       TEXT NOT NULL DEFAULT '{}',
  -- JSON copy of `percentageAA` for the same reason.
  percentage_aa_json       TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_pdb_entries_year       ON pdb_entries(year);
CREATE INDEX IF NOT EXISTS idx_pdb_entries_experiment ON pdb_entries(experiment);
CREATE INDEX IF NOT EXISTS idx_pdb_entries_residues   ON pdb_entries(nb_residues);
CREATE INDEX IF NOT EXISTS idx_pdb_entries_helices    ON pdb_entries(nb_helices);
CREATE INDEX IF NOT EXISTS idx_pdb_entries_sheets     ON pdb_entries(nb_sheets);
CREATE INDEX IF NOT EXISTS idx_pdb_entries_ligands    ON pdb_entries(nb_ligands);

-- Per-chain rows. EC class lives here for the ecClasses chart; molecule and
-- synonym are surfaced in the entry-detail view.
CREATE TABLE IF NOT EXISTS pdb_chains (
  pdb_id        TEXT NOT NULL,
  chain_id      TEXT NOT NULL,
  molecule      TEXT,
  synonym       TEXT,
  ec            TEXT,
  nb_residues   INTEGER NOT NULL DEFAULT 0,
  iep           REAL,
  PRIMARY KEY (pdb_id, chain_id),
  FOREIGN KEY (pdb_id) REFERENCES pdb_entries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pdb_chains_ec ON pdb_chains(ec);

-- Aggregated residue counts for amino-acid / nucleic-base / molecule-type charts.
CREATE TABLE IF NOT EXISTS pdb_residue_counts (
  pdb_id    TEXT NOT NULL,
  residue   TEXT NOT NULL,
  count     INTEGER NOT NULL,
  PRIMARY KEY (pdb_id, residue),
  FOREIGN KEY (pdb_id) REFERENCES pdb_entries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pdb_residue_counts_residue ON pdb_residue_counts(residue);

-- Helix / sheet annotations. `idx` preserves source order so the entry-detail
-- API can rebuild the original `helices` / `sheets` arrays in a stable order.
CREATE TABLE IF NOT EXISTS pdb_helices (
  pdb_id    TEXT NOT NULL,
  idx       INTEGER NOT NULL,
  chain     TEXT,
  res_from  INTEGER NOT NULL,
  res_to    INTEGER NOT NULL,
  kind      INTEGER,
  PRIMARY KEY (pdb_id, idx),
  FOREIGN KEY (pdb_id) REFERENCES pdb_entries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pdb_helices_kind ON pdb_helices(kind);

CREATE TABLE IF NOT EXISTS pdb_sheets (
  pdb_id    TEXT NOT NULL,
  idx       INTEGER NOT NULL,
  chain     TEXT,
  res_from  INTEGER NOT NULL,
  res_to    INTEGER NOT NULL,
  PRIMARY KEY (pdb_id, idx),
  FOREIGN KEY (pdb_id) REFERENCES pdb_entries(id) ON DELETE CASCADE
);

-- Per-PDB FORMUL records (mw / mf / count / name). Distinct from pdb_ligands,
-- which is a normalized link table; this preserves the parser-derived data
-- needed to rebuild the original `formula` array.
CREATE TABLE IF NOT EXISTS pdb_formulas (
  pdb_id  TEXT NOT NULL,
  label   TEXT NOT NULL,
  mf      TEXT,
  mw      REAL,
  count   INTEGER NOT NULL DEFAULT 1,
  name    TEXT,
  PRIMARY KEY (pdb_id, label),
  FOREIGN KEY (pdb_id) REFERENCES pdb_entries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pdb_formulas_label ON pdb_formulas(label);

-- Per-pair omega counts: total backbone occurrences plus the cis / twisted
-- subsets. Replaces the omega.pairCounts and twistedPairFrequency views.
CREATE TABLE IF NOT EXISTS pdb_omega_pairs (
  pdb_id        TEXT    NOT NULL,
  residue1      TEXT    NOT NULL,
  residue2      TEXT    NOT NULL,
  total_count   INTEGER NOT NULL,
  cis_count     INTEGER NOT NULL DEFAULT 0,
  twisted_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (pdb_id, residue1, residue2),
  FOREIGN KEY (pdb_id) REFERENCES pdb_entries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pdb_omega_pairs_residues ON pdb_omega_pairs(residue1, residue2);

-- ---- ligands (CCD reference table) -----------------------------------------
--
-- `id` is a surrogate INTEGER primary key — required because the
-- substructure-search index table (`ocl_ss_index`) created at runtime by
-- openchemlib-sqlite's `MoleculesDBSQLite.migrate()` references this table
-- via an INTEGER foreign key (`entry_id INTEGER PRIMARY KEY REFERENCES
-- ligands(id)`). `code` keeps its UNIQUE constraint so all existing
-- `pdb_ligands.ligand_code` / `pdb_ligand_instances.ligand_code` link rows
-- continue to point at the human-readable CCD three-letter code.
CREATE TABLE IF NOT EXISTS ligands
(
  id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  code        TEXT    NOT NULL UNIQUE,
  name        TEXT    NOT NULL DEFAULT '',
  formula     TEXT    NOT NULL DEFAULT '',
  type        TEXT    NOT NULL DEFAULT '',
  id_code     TEXT    NOT NULL,
  coordinates TEXT    NOT NULL,
  mf          TEXT    NOT NULL,
  mw          REAL    NOT NULL,
  nb_atoms    INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);

CREATE INDEX IF NOT EXISTS idx_ligands_id_code ON ligands(id_code);

-- Note: the substructure-search fingerprint table `ocl_ss_index` is not
-- declared here. It is created (and kept up to date) at runtime by
-- `openchemlib-sqlite`'s `MoleculesDBSQLite.migrate()` — see
-- `backend/src/db/getDB.js`.

-- Link table: which PDB entries contain which ligand. Populated incrementally
-- by the rsync update pipeline as each PDB is parsed.
CREATE TABLE IF NOT EXISTS pdb_ligands
(
  pdb_id      TEXT    NOT NULL,
  ligand_code TEXT    NOT NULL,
  count       INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (pdb_id, ligand_code)
);

CREATE INDEX IF NOT EXISTS idx_pdb_ligands_code ON pdb_ligands(ligand_code);
CREATE INDEX IF NOT EXISTS idx_pdb_ligands_pdb  ON pdb_ligands(pdb_id);

-- Per-instance ligand coordinates extracted from HETATM records.
-- Used for binding-pocket alignment: for a given ligand_code, every
-- (pdb, chain, res_seq, i_code) instance can be superimposed onto the
-- canonical CCD reference via Kabsch, and the same transform applied
-- to the parent protein chain so binding pockets line up.
CREATE TABLE IF NOT EXISTS pdb_ligand_instances
(
  pdb_id      TEXT    NOT NULL,
  ligand_code TEXT    NOT NULL,
  chain       TEXT    NOT NULL,
  res_seq     INTEGER NOT NULL,
  i_code      TEXT    NOT NULL DEFAULT '',
  atoms       TEXT    NOT NULL,
  PRIMARY KEY (pdb_id, ligand_code, chain, res_seq, i_code)
);

CREATE INDEX IF NOT EXISTS idx_pdb_ligand_instances_code
  ON pdb_ligand_instances(ligand_code);
CREATE INDEX IF NOT EXISTS idx_pdb_ligand_instances_pdb
  ON pdb_ligand_instances(pdb_id);

-- ---- rsync_history (one row per rsync run; replaces couchdb log) -----------

CREATE TABLE IF NOT EXISTS rsync_history (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  type            TEXT    NOT NULL CHECK (type IN ('asymUnit', 'bioAssembly')),
  started_at      TEXT    NOT NULL,
  finished_at     TEXT    NOT NULL,
  duration_ms     INTEGER NOT NULL,
  updated_count   INTEGER NOT NULL DEFAULT 0,
  deleted_count   INTEGER NOT NULL DEFAULT 0,
  last_entry_id   TEXT,
  bytes_on_disk   INTEGER
);

CREATE INDEX IF NOT EXISTS idx_rsync_history_type_finished ON rsync_history(type, finished_at DESC);

-- ---- ccd_history (one row per CCD refresh run) -----------------------------
--
-- Mirrors `rsync_history`. Status 'running' covers in-flight imports so that
-- a SIGKILL/OOM during the multi-minute parse phase still leaves a row to
-- inspect in /v1/diagnostics. `pid` and `last_heartbeat_at` let the
-- diagnostics view distinguish a live run from an orphaned crash-leftover.

CREATE TABLE IF NOT EXISTS ccd_history (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at        TEXT    NOT NULL,
  finished_at       TEXT,
  duration_ms       INTEGER,
  status            TEXT    NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  imported_count    INTEGER NOT NULL DEFAULT 0,
  skipped_count     INTEGER NOT NULL DEFAULT 0,
  bytes_on_disk     INTEGER,
  error             TEXT,
  pid               INTEGER,
  last_heartbeat_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_ccd_history_started
  ON ccd_history(started_at DESC);

-- ---- pre-rolled omega stats ------------------------------------------------
--
-- One row per year for the summary cards / per-year bar chart; one row per
-- (year, residue1, residue2) triple for the pair heatmap. Regenerated at the
-- end of every rsync cycle (and after the first-boot rebuild-from-disk seed)
-- from a single transaction: DELETE FROM stats_*; INSERT … SELECT … GROUP BY.
-- Entries with NULL or non-positive `year` are bucketed under `year = 0`,
-- so the global summary still picks them up while the per-year and range
-- queries can filter them out with `WHERE year > 0`.

CREATE TABLE IF NOT EXISTS stats_omega_by_year (
  year                INTEGER NOT NULL PRIMARY KEY,
  cis_count           INTEGER NOT NULL DEFAULT 0,
  trans_count         INTEGER NOT NULL DEFAULT 0,
  twisted_count       INTEGER NOT NULL DEFAULT 0,
  peptide_bonds_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stats_omega_pairs_by_year (
  year          INTEGER NOT NULL,
  residue1      TEXT    NOT NULL,
  residue2      TEXT    NOT NULL,
  cis_count     INTEGER NOT NULL DEFAULT 0,
  twisted_count INTEGER NOT NULL DEFAULT 0,
  total_count   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (year, residue1, residue2)
);

CREATE INDEX IF NOT EXISTS idx_stats_omega_pairs_by_year_residues
  ON stats_omega_pairs_by_year(residue1, residue2);

-- ---- pdb_title_fts (FTS5 title keyword search; replaces /find Mango) -------

CREATE VIRTUAL TABLE IF NOT EXISTS pdb_title_fts USING fts5(
  pdb_id UNINDEXED,
  title,
  tokenize = 'porter unicode61'
);
