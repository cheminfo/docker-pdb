import { getLigandsDB } from './getDB.js';

/**
 * Replace the `pdb_ligands` rows for a single PDB id with the FORMUL records
 * extracted by `pdbParser.js`. Water (`HOH`) is excluded — it is by far the
 * most common ligand and matching it adds noise to substructure queries.
 *
 * Wrapped in a transaction so the per-PDB rewrite is atomic: a parser
 * failure halfway through never leaves the link table in a half-updated
 * state.
 * @param {string} pdbId - 4-character PDB identifier (uppercased by callers).
 * @param {Array<{ label: string, number?: number }>} formulaEntries - The `formula` array produced by `parsePdb`.
 * @returns {Promise<number>} Number of rows inserted (excludes water).
 */
export async function replacePdbLigands(pdbId, formulaEntries) {
  const db = await getLigandsDB();
  return replacePdbLigandsSync(db, pdbId, formulaEntries);
}

/**
 * Synchronous variant that takes a `LigandsDB` instance directly. Used by
 * tests that operate on an in-memory database, and by callers that already
 * hold a database instance.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands database.
 * @param {string} pdbId - 4-character PDB identifier.
 * @param {Array<{ label: string, number?: number }>} formulaEntries - The `formula` array produced by `parsePdb`.
 * @returns {number} Number of rows inserted (excludes water).
 */
export function replacePdbLigandsSync(db, pdbId, formulaEntries) {
  db.db.exec('BEGIN');
  try {
    db.deletePdbLigands.run(pdbId);
    let inserted = 0;
    for (const entry of formulaEntries) {
      if (!entry.label || entry.label === 'HOH') continue;
      db.upsertPdbLigand.run(pdbId, entry.label, entry.number || 1);
      inserted++;
    }
    db.db.exec('COMMIT');
    return inserted;
  } catch (error) {
    db.db.exec('ROLLBACK');
    throw error;
  }
}
