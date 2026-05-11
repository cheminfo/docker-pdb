-- Pre-rolled omega-stats tables.
--
-- The /v1/stats/omega* endpoints used to GROUP BY the full pdb_entries
-- and pdb_omega_pairs tables on every request. At PDB-scale (~600k
-- entries, tens of millions of peptide-bond rows) the global SUM is
-- still sub-second on indexed columns, but the 20x20 amino-acid pair
-- heatmap with a year-range filter joins pdb_omega_pairs back to
-- pdb_entries and degrades as the data grows — and the year-range
-- slider on the omega page re-fires that query on every drag.
--
-- These two rollup tables are the materialized "reduce" step: one row
-- per year for the summary cards / per-year bar chart, one row per
-- (year, residue1, residue2) triple for the pair heatmap. They are
-- regenerated at the end of every rsync cycle (and after the first-
-- boot rebuild-from-disk seed) from a single transaction:
--   DELETE FROM stats_*; INSERT … SELECT … GROUP BY …
-- mirroring the rsync-then-derive pattern used elsewhere in the
-- project rather than maintaining incremental deltas at every upsert.
--
-- Entries with NULL or non-positive `year` are bucketed under
-- `year = 0`, so the global summary still picks them up while the
-- per-year and range queries can filter them out with `WHERE year > 0`.

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
