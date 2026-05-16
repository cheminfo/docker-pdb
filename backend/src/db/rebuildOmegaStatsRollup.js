import createDebug from 'debug';

const debug = createDebug('pdb-sync:rollup');

/**
 * Regenerate the omega-stats rollup tables (`stats_omega_by_year`,
 * `stats_omega_pairs_by_year`) from the per-PDB source-of-truth tables.
 *
 * Runs as two separate transactions with an event-loop yield between them
 * so concurrent writers (rsync container) are never locked out for the full
 * duration of both rebuilds. Readers using WAL mode are never blocked.
 *
 * Called after the first-boot rebuild-from-disk seed and at the end of
 * every rsync cycle — the rollup is a regenerated derived view, not an
 * incremental aggregate maintained per upsert.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands DB.
 * @returns {Promise<void>}
 */
export async function rebuildOmegaStatsRollup(db) {
  const startedAt = performance.now();

  // Transaction 1: fast aggregate over pdb_entries columns only.
  db.db.exec('BEGIN IMMEDIATE');
  try {
    db.db.exec(`
      DELETE FROM stats_omega_by_year;

      INSERT INTO stats_omega_by_year
        (year, cis_count, trans_count, twisted_count, peptide_bonds_count)
      SELECT
        COALESCE(NULLIF(year, 0), 0)              AS year,
        SUM(omega_nb_cis)                         AS cis_count,
        SUM(omega_nb_trans)                       AS trans_count,
        SUM(omega_nb_twisted)                     AS twisted_count,
        SUM(omega_nb_peptide_bonds)               AS peptide_bonds_count
      FROM pdb_entries
      WHERE omega_nb_peptide_bonds > 0
      GROUP BY COALESCE(NULLIF(year, 0), 0);
    `);
    db.db.exec('COMMIT');
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }

  // Yield between transactions so concurrent writers can slip through.
  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  // Transaction 2: heavier JOIN + GROUP BY over pdb_omega_pairs.
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

  const durationMs = Math.round(performance.now() - startedAt);
  debug(`omega-stats rollup rebuilt in ${durationMs} ms`);
}
