-- Initial sqlite schema for pdb-quickview. Replaces every CouchDB design-doc
-- view and Mango query the previous CouchDB-backed deployment relied on, plus
-- ligand-substructure and per-instance ligand pose tables.
--
-- Tables broadly group into three areas:
--   * pdb_entries + child tables  → parsed PDB metadata (one row per entry)
--   * ligands + ligand_ss_index   → CCD reference + 8 × 64-bit OCL fingerprint
--   * pdb_ligands + …_instances   → links between PDB entries and ligands
--
-- Plus rsync_history (run log) and pdb_title_fts (FTS5 title search).

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

-- ---- ligands (CCD reference table + 8 × 64-bit OCL fingerprint) ------------

CREATE TABLE IF NOT EXISTS ligands
(
  code        TEXT    NOT NULL PRIMARY KEY,
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

-- 8 × 64-bit substructure-search fingerprint per ligand.
-- Computed from OCL's 16 × Uint32 molecule index reinterpreted as BigInt64.
CREATE TABLE IF NOT EXISTS ligand_ss_index
(
  code      TEXT    NOT NULL PRIMARY KEY,
  ss_index0 INTEGER NOT NULL DEFAULT 0,
  ss_index1 INTEGER NOT NULL DEFAULT 0,
  ss_index2 INTEGER NOT NULL DEFAULT 0,
  ss_index3 INTEGER NOT NULL DEFAULT 0,
  ss_index4 INTEGER NOT NULL DEFAULT 0,
  ss_index5 INTEGER NOT NULL DEFAULT 0,
  ss_index6 INTEGER NOT NULL DEFAULT 0,
  ss_index7 INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (code) REFERENCES ligands(code) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ligand_ss_index ON ligand_ss_index(
  ss_index0, ss_index1, ss_index2, ss_index3,
  ss_index4, ss_index5, ss_index6, ss_index7
);

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

-- ---- pdb_title_fts (FTS5 title keyword search; replaces /find Mango) -------

CREATE VIRTUAL TABLE IF NOT EXISTS pdb_title_fts USING fts5(
  pdb_id UNINDEXED,
  title,
  tokenize = 'porter unicode61'
);
