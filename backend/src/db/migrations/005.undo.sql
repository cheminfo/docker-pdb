-- Undo migration 005: drop the composite indexes backing server-side sorting
-- of the ligand browser. `ligands.code` keeps its own index from the UNIQUE
-- constraint's autoindex, which this migration never created and must not drop.

DROP INDEX IF EXISTS idx_ligands_rank;
DROP INDEX IF EXISTS idx_ligands_nb_pdbs;
DROP INDEX IF EXISTS idx_ligands_name;
DROP INDEX IF EXISTS idx_ligands_mf;
DROP INDEX IF EXISTS idx_ligands_mw;
