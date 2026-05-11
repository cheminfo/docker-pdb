-- Recreate the composite covering index dropped by 002.do.sql.
-- See that file for why we no longer keep this in production.

CREATE INDEX IF NOT EXISTS idx_ligand_ss_index ON ligand_ss_index(
  ss_index0, ss_index1, ss_index2, ss_index3,
  ss_index4, ss_index5, ss_index6, ss_index7
);
