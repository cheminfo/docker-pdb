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
