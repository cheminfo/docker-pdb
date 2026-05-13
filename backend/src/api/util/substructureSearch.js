/**
 * Substructure search over the `ligands` table, powered by
 * `openchemlib-sqlite`. The library runs a 512-bit fingerprint prefilter
 * over `ocl_ss_index` and then verifies survivors with OCL's `SSSearcher`;
 * we only need to join the surviving `entryId` list back to `ligands` for
 * display columns and the per-ligand PDB count.
 *
 * Returns at most `maxResults` ligands (default 200), ordered by descending
 * `nbPdbs` so the most cited ligand types come first.
 * @param {{
 *   db: import('../../db/getDB.js').LigandsDB,
 *   queryIdCode: string,
 *   maxResults?: number,
 * }} params - Search parameters.
 * @returns {{
 *   ligands: Array<{ code: string, name: string, mf: string, mw: number, idCode: string, coordinates: string, nbPdbs: number }>,
 *   stats: { screened: number, verified: number, screeningMs: number, verificationMs: number, overLimit: boolean },
 * }} Matching ligands and timing stats.
 */
export function substructureSearch({ db, queryIdCode, maxResults = 200 }) {
  const start = performance.now();
  const response = db.molecules.search(queryIdCode, {
    mode: 'substructure',
    format: 'idCode',
    limit: maxResults,
  });
  const elapsedMs = Math.round(performance.now() - start);

  const ids = response.results.map((result) => result.entryId);
  if (ids.length === 0) {
    return {
      ligands: [],
      stats: {
        screened: response.screened ?? 0,
        verified: 0,
        screeningMs: elapsedMs,
        verificationMs: 0,
        overLimit: false,
      },
    };
  }

  const placeholders = ids.map(() => '?').join(',');
  const ligands = db
    .statement(
      `SELECT l.code, l.name, l.mf, l.mw, l.id_code AS idCode, l.coordinates,
              COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
       FROM ligands l WHERE l.id IN (${placeholders})`,
    )
    .all(...ids)
    .map((row) => ({ ...row }))
    .toSorted((a, b) => b.nbPdbs - a.nbPdbs);

  return {
    ligands,
    stats: {
      screened: response.screened ?? 0,
      verified: ligands.length,
      screeningMs: elapsedMs,
      verificationMs: 0,
      overLimit: response.total > ligands.length,
    },
  };
}
