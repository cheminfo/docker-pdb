-- Unique chemical components from the wwPDB Chemical Component Dictionary (CCD).
-- One row per 3-letter ligand code (ATP, HEM, NAD, …). The id_code +
-- coordinates pair is the OpenChemLib canonical identifier.
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
