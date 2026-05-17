import createDebug from 'debug';

const debug = createDebug('pdb-sync:rollup');

const STANDARD_AA = [
  'ALA',
  'ARG',
  'ASN',
  'ASP',
  'CYS',
  'GLU',
  'GLN',
  'GLY',
  'HIS',
  'ILE',
  'LEU',
  'LYS',
  'MET',
  'PHE',
  'PRO',
  'SER',
  'THR',
  'TRP',
  'TYR',
  'VAL',
];
const NUCLEIC_BASES = ['DA', 'DC', 'DG', 'DT', 'DU', 'A', 'C', 'G', 'U', 'T'];

const AA_SQL_LIST = STANDARD_AA.map((s) => `'${s}'`).join(',');
const NB_SQL_LIST = NUCLEIC_BASES.map((s) => `'${s}'`).join(',');

/**
 * Regenerate all pre-computed stats rollup tables from the per-PDB
 * source-of-truth tables. Runs as separate transactions with an event-loop
 * yield between each so concurrent writers (rsync container) are never locked
 * out for the full duration. Readers using WAL mode are never blocked.
 *
 * Called after the first-boot rebuild-from-disk seed and at the end of every
 * rsync cycle — the rollups are regenerated derived views, not incremental
 * aggregates maintained per upsert.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands DB.
 * @returns {Promise<void>}
 */
export async function rebuildStatsRollup(db) {
  const startedAt = performance.now();

  // Transaction 1: omega summary from pdb_entries columns only (fast).
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_omega_by_year;

      INSERT INTO stats_omega_by_year
        (year, cis_count, trans_count, twisted_count, peptide_bonds_count)
      SELECT
        COALESCE(NULLIF(year, 0), 0)             AS year,
        SUM(omega_nb_cis)                        AS cis_count,
        SUM(omega_nb_trans)                      AS trans_count,
        SUM(omega_nb_twisted)                    AS twisted_count,
        SUM(omega_nb_peptide_bonds)              AS peptide_bonds_count
      FROM pdb_entries
      WHERE omega_nb_peptide_bonds > 0
      GROUP BY COALESCE(NULLIF(year, 0), 0);
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 2: omega pair stats (heavy JOIN over pdb_omega_pairs).
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_omega_pairs_by_year;

      INSERT INTO stats_omega_pairs_by_year
        (year, residue1, residue2, cis_count, twisted_count, total_count)
      SELECT
        COALESCE(NULLIF(e.year, 0), 0) AS year,
        op.residue1,
        op.residue2,
        SUM(op.cis_count)              AS cis_count,
        SUM(op.twisted_count)          AS twisted_count,
        SUM(op.total_count)            AS total_count
      FROM pdb_omega_pairs op
      JOIN pdb_entries e ON e.id = op.pdb_id
      GROUP BY COALESCE(NULLIF(e.year, 0), 0), op.residue1, op.residue2;
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 3: helix / sheet length and kind histograms.
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_helix_length_hist;
      INSERT INTO stats_helix_length_hist (length, count)
      SELECT (res_to - res_from + 1), COUNT(*)
      FROM pdb_helices
      WHERE res_to >= res_from
        AND (res_to - res_from + 1) BETWEEN 1 AND 200
      GROUP BY (res_to - res_from + 1);

      DELETE FROM stats_helix_kind_hist;
      INSERT INTO stats_helix_kind_hist (kind, count)
      SELECT kind, COUNT(*)
      FROM pdb_helices
      WHERE kind IS NOT NULL
      GROUP BY kind;

      DELETE FROM stats_sheet_length_hist;
      INSERT INTO stats_sheet_length_hist (length, count)
      SELECT (res_to - res_from + 1), COUNT(*)
      FROM pdb_sheets
      WHERE res_to >= res_from
        AND (res_to - res_from + 1) BETWEEN 1 AND 200
      GROUP BY (res_to - res_from + 1);
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 4: residue frequency aggregates and molecule_type back-fill.
  // The back-fill only touches entries where molecule_type is still NULL
  // (i.e. rows that existed before migration 003 and have not been re-upserted
  // since). Entries written by upsertPdbEntrySync already carry the value.
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_residue_freq;
      INSERT INTO stats_residue_freq (residue, total_count)
      SELECT residue, SUM(count) FROM pdb_residue_counts GROUP BY residue;

      UPDATE pdb_entries
      SET molecule_type = (
        SELECT CASE
          WHEN MAX(CASE WHEN rc.residue IN (${AA_SQL_LIST}) THEN 1 ELSE 0 END) = 1
           AND MAX(CASE WHEN rc.residue IN (${NB_SQL_LIST}) THEN 1 ELSE 0 END) = 1
          THEN 'hybrid'
          WHEN MAX(CASE WHEN rc.residue IN (${AA_SQL_LIST}) THEN 1 ELSE 0 END) = 1
          THEN 'protein'
          WHEN MAX(CASE WHEN rc.residue IN (${NB_SQL_LIST}) THEN 1 ELSE 0 END) = 1
          THEN 'nucleic'
          ELSE 'other'
        END
        FROM pdb_residue_counts rc WHERE rc.pdb_id = pdb_entries.id
      )
      WHERE pdb_entries.molecule_type IS NULL;
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 5: pdb_formulas aggregations (ligand frequency + MW histogram).
  // These are the two heaviest queries (701 ms + 265 ms) — a full scan of the
  // large pdb_formulas table each time they're read. Pre-computing here cuts
  // read latency to <5 ms.
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_ligand_freq;
      INSERT INTO stats_ligand_freq (label, value)
      SELECT label, SUM(count)
      FROM pdb_formulas
      WHERE label <> 'HOH'
      GROUP BY label;

      DELETE FROM stats_ligand_mw_hist;
      INSERT INTO stats_ligand_mw_hist (key, value)
      SELECT
        CASE
          WHEN mw <  100 THEN 0
          WHEN mw <  250 THEN 100
          WHEN mw <  500 THEN 250
          WHEN mw < 1000 THEN 500
          WHEN mw < 2000 THEN 1000
          WHEN mw < 5000 THEN 2000
          ELSE 5000
        END AS key,
        COUNT(*) AS value
      FROM pdb_formulas
      WHERE label <> 'HOH' AND mw IS NOT NULL AND mw > 0
      GROUP BY key;
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 6: EC class distribution (pdb_chains COUNT DISTINCT, 198 ms).
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_ec_classes;
      INSERT INTO stats_ec_classes (head, value)
      SELECT head, COUNT(DISTINCT pdb_id) AS value
      FROM (
        SELECT pdb_id, substr(ec, 1, 1) AS head
        FROM pdb_chains
        WHERE ec IS NOT NULL
          AND length(ec) > 0
          AND substr(ec, 1, 1) BETWEEN '1' AND '7'
      )
      GROUP BY head;
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 7: residues histogram (replaces 239 k-row fetch to JS).
  // Buckets match RESIDUES_HISTOGRAM_BINS = [50,100,200,500,1000,2000,5000,10000].
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_residues_histogram;
      INSERT INTO stats_residues_histogram (key, value)
      SELECT
        CASE
          WHEN nb_residues <    50 THEN 0
          WHEN nb_residues <   100 THEN 50
          WHEN nb_residues <   200 THEN 100
          WHEN nb_residues <   500 THEN 200
          WHEN nb_residues <  1000 THEN 500
          WHEN nb_residues <  2000 THEN 1000
          WHEN nb_residues <  5000 THEN 2000
          WHEN nb_residues < 10000 THEN 5000
          ELSE 10000
        END AS key,
        COUNT(*) AS value
      FROM pdb_entries
      WHERE nb_residues > 0
      GROUP BY key;
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 8: refresh ligands.nb_pdbs (cached count replaces correlated
  // subquery on every ligand-browse request).
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      UPDATE ligands
      SET nb_pdbs = (
        SELECT COUNT(*) FROM pdb_ligands WHERE pdb_ligands.ligand_code = ligands.code
      );
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  const durationMs = Math.round(performance.now() - startedAt);
  debug(`stats rollup rebuilt in ${durationMs} ms`);
}
