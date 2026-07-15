-- Migration 005: composite indexes backing server-side sorting of the ligand
-- browser (`GET /v1/ligands?sort=…&direction=…`).
--
-- Every index pairs the sorted column with `code`, which is the tie-break of
-- every ORDER BY the route emits. That lets SQLite satisfy the whole ORDER BY
-- with an index scan and stop after LIMIT rows, instead of scanning all
-- ~45 k ligands into a temp B-tree on each page.
--
-- The route tie-breaks in the SAME direction as the sorted column
-- (`mw DESC, code DESC`), so one ascending index serves both directions: a
-- forward scan for ASC, a backward scan for DESC.
--
-- `idx_ligands_rank` is declared `nb_pdbs DESC, code ASC` because the default
-- ranking (most-referenced first, ties alphabetical) mixes directions and can
-- only be scanned forward from an index that matches it exactly.
-- `ligands.code` is already covered by the UNIQUE constraint's autoindex.

CREATE INDEX IF NOT EXISTS idx_ligands_rank    ON ligands(nb_pdbs DESC, code ASC);
CREATE INDEX IF NOT EXISTS idx_ligands_nb_pdbs ON ligands(nb_pdbs, code);
CREATE INDEX IF NOT EXISTS idx_ligands_name    ON ligands(name, code);
CREATE INDEX IF NOT EXISTS idx_ligands_mf      ON ligands(mf, code);
CREATE INDEX IF NOT EXISTS idx_ligands_mw      ON ligands(mw, code);
