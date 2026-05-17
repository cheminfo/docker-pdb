DROP TABLE IF EXISTS stats_residue_freq;
DROP TABLE IF EXISTS stats_sheet_length_hist;
DROP TABLE IF EXISTS stats_helix_kind_hist;
DROP TABLE IF EXISTS stats_helix_length_hist;
DROP INDEX IF EXISTS idx_pdb_entries_helices_sheets;
DROP INDEX IF EXISTS idx_pdb_entries_molecule_type;
ALTER TABLE pdb_entries DROP COLUMN molecule_type;
