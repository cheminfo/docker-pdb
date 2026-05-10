-- Drop everything 001.do.sql created. Order goes child → parent so foreign
-- keys do not block the drops, and indexes go before their tables.

DROP TABLE IF EXISTS pdb_title_fts;

DROP INDEX IF EXISTS idx_rsync_history_type_finished;
DROP TABLE IF EXISTS rsync_history;

DROP INDEX IF EXISTS idx_pdb_ligand_instances_pdb;
DROP INDEX IF EXISTS idx_pdb_ligand_instances_code;
DROP TABLE IF EXISTS pdb_ligand_instances;

DROP INDEX IF EXISTS idx_pdb_ligands_pdb;
DROP INDEX IF EXISTS idx_pdb_ligands_code;
DROP TABLE IF EXISTS pdb_ligands;

DROP INDEX IF EXISTS idx_ligand_ss_index;
DROP TABLE IF EXISTS ligand_ss_index;

DROP INDEX IF EXISTS idx_ligands_id_code;
DROP TABLE IF EXISTS ligands;

DROP INDEX IF EXISTS idx_pdb_omega_pairs_residues;
DROP TABLE IF EXISTS pdb_omega_pairs;

DROP INDEX IF EXISTS idx_pdb_formulas_label;
DROP TABLE IF EXISTS pdb_formulas;

DROP TABLE IF EXISTS pdb_sheets;

DROP INDEX IF EXISTS idx_pdb_helices_kind;
DROP TABLE IF EXISTS pdb_helices;

DROP INDEX IF EXISTS idx_pdb_residue_counts_residue;
DROP TABLE IF EXISTS pdb_residue_counts;

DROP INDEX IF EXISTS idx_pdb_chains_ec;
DROP TABLE IF EXISTS pdb_chains;

DROP INDEX IF EXISTS idx_pdb_entries_ligands;
DROP INDEX IF EXISTS idx_pdb_entries_sheets;
DROP INDEX IF EXISTS idx_pdb_entries_helices;
DROP INDEX IF EXISTS idx_pdb_entries_residues;
DROP INDEX IF EXISTS idx_pdb_entries_experiment;
DROP INDEX IF EXISTS idx_pdb_entries_year;
DROP TABLE IF EXISTS pdb_entries;
