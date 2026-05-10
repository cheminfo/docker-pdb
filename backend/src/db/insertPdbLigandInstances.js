import { getLigandsDB } from './getDB.js';

/**
 * Replace the `pdb_ligand_instances` rows for a single PDB id with the
 * HETATM-derived ligand instances extracted by `pdbParser.js`. Each
 * instance carries its (chain, resSeq, iCode) location plus a JSON array
 * of `{ name, element, x, y, z }` atom records — enough to compute a
 * Kabsch transform onto the canonical CCD reference downstream.
 *
 * Wrapped in a transaction so a failure halfway through never leaves the
 * coordinates table in a half-updated state.
 * @param {string} pdbId - 4-character PDB identifier (uppercased by callers).
 * @param {Array<{ code: string, chain: string, resSeq: number, iCode?: string, atoms: Array<{ name: string, element: string, x: number, y: number, z: number }> }>} instances - The `ligandInstances` array produced by `parsePdb`.
 * @returns {Promise<number>} Number of rows inserted.
 */
export async function replacePdbLigandInstances(pdbId, instances) {
  const db = await getLigandsDB();
  return replacePdbLigandInstancesSync(db, pdbId, instances);
}

/**
 * Synchronous variant that takes a `LigandsDB` instance directly. Used by
 * tests that operate on an in-memory database.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands database.
 * @param {string} pdbId - 4-character PDB identifier.
 * @param {Array<{ code: string, chain: string, resSeq: number, iCode?: string, atoms: Array<{ name: string, element: string, x: number, y: number, z: number }> }>} instances - The `ligandInstances` array produced by `parsePdb`.
 * @param {object} [options] - Tuning options.
 * @param {boolean} [options.skipTransaction] - When true, the function does not
 *   wrap the writes in its own BEGIN/COMMIT — the caller has already opened
 *   an outer transaction (used by the batched rebuild path).
 * @returns {number} Number of rows inserted.
 */
export function replacePdbLigandInstancesSync(
  db,
  pdbId,
  instances,
  options = {},
) {
  const skipTransaction = Boolean(options.skipTransaction);
  const deleteAll = db.statement(
    `DELETE FROM pdb_ligand_instances WHERE pdb_id = ?`,
  );
  const insert = db.statement(
    `INSERT OR REPLACE INTO pdb_ligand_instances
     (pdb_id, ligand_code, chain, res_seq, i_code, atoms)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  if (!skipTransaction) db.db.exec('BEGIN');
  try {
    deleteAll.run(pdbId);
    let inserted = 0;
    for (const instance of instances) {
      if (!instance.code || instance.code === 'HOH') continue;
      if (!instance.atoms || instance.atoms.length === 0) continue;
      insert.run(
        pdbId,
        instance.code,
        instance.chain,
        instance.resSeq,
        instance.iCode || '',
        JSON.stringify(instance.atoms),
      );
      inserted++;
    }
    if (!skipTransaction) db.db.exec('COMMIT');
    return inserted;
  } catch (error) {
    if (!skipTransaction) db.db.exec('ROLLBACK');
    throw error;
  }
}
