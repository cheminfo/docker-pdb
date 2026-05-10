import OCL from 'openchemlib';

import { computeSSIndex } from '../../util/computeSSIndex.js';

/**
 * Two-phase substructure search over the `ligands` table.
 *
 * Phase 1 (bitwise screen): a query fragment's 512-bit fingerprint is
 * computed and split into 8 BigInt64 values. We ask SQLite for ligands
 * whose `ss_index0..7` columns satisfy `(stored & query) = query` for
 * every column — i.e. every bit set in the fragment's fingerprint must
 * also be set in the candidate's. This eliminates the bulk of the table
 * with index-only reads and no chemistry.
 *
 * Phase 2 (verification): each surviving candidate's idCode is materialized
 * back into an OCL `Molecule`, and OCL's `SSSearcher` confirms the fragment
 * actually appears (false positives from the screen are common — the
 * fingerprint is a probabilistic filter).
 *
 * Returns at most `maxResults` ligands (default 200), ordered by descending
 * `nb_pdbs` so the most relevant ligand types come first.
 * @param {{
 *   db: import('../db/getDB.js').LigandsDB,
 *   queryIdCode: string,
 *   maxResults?: number,
 * }} params - Search parameters.
 * @returns {{
 *   ligands: Array<{ code: string, name: string, mf: string, mw: number, idCode: string, coordinates: string, nbPdbs: number }>,
 *   stats: { screened: number, verified: number, screeningMs: number, verificationMs: number, overLimit: boolean },
 * }} Matching ligand codes and timing stats.
 */
export function substructureSearch({ db, queryIdCode, maxResults = 200 }) {
  const fragment = OCL.Molecule.fromIDCode(queryIdCode);
  fragment.setFragment(true);
  const queryIndex = computeSSIndex(fragment);

  const screenStart = performance.now();
  const candidates = db
    .statement(
      `SELECT l.code, l.name, l.mf, l.mw, l.id_code, l.coordinates,
              COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nb_pdbs
       FROM ligands l
       JOIN ligand_ss_index x ON x.code = l.code
       WHERE (x.ss_index0 & ?) = ?
         AND (x.ss_index1 & ?) = ?
         AND (x.ss_index2 & ?) = ?
         AND (x.ss_index3 & ?) = ?
         AND (x.ss_index4 & ?) = ?
         AND (x.ss_index5 & ?) = ?
         AND (x.ss_index6 & ?) = ?
         AND (x.ss_index7 & ?) = ?`,
    )
    .all(
      queryIndex.ss_index0,
      queryIndex.ss_index0,
      queryIndex.ss_index1,
      queryIndex.ss_index1,
      queryIndex.ss_index2,
      queryIndex.ss_index2,
      queryIndex.ss_index3,
      queryIndex.ss_index3,
      queryIndex.ss_index4,
      queryIndex.ss_index4,
      queryIndex.ss_index5,
      queryIndex.ss_index5,
      queryIndex.ss_index6,
      queryIndex.ss_index6,
      queryIndex.ss_index7,
      queryIndex.ss_index7,
    );
  const screeningMs = Math.round(performance.now() - screenStart);

  const searcher = new OCL.SSSearcher();
  searcher.setFragment(fragment);

  const verifyStart = performance.now();
  const matches = [];
  let verified = 0;
  let overLimit = false;
  for (const candidate of candidates) {
    let molecule;
    try {
      molecule = OCL.Molecule.fromIDCode(candidate.id_code);
    } catch {
      continue;
    }
    searcher.setMolecule(molecule);
    verified++;
    if (!searcher.isFragmentInMolecule()) continue;
    if (matches.length >= maxResults) {
      overLimit = true;
      break;
    }
    matches.push({
      code: candidate.code,
      name: candidate.name,
      mf: candidate.mf,
      mw: candidate.mw,
      idCode: candidate.id_code,
      coordinates: candidate.coordinates,
      nbPdbs: candidate.nb_pdbs,
    });
  }
  const verificationMs = Math.round(performance.now() - verifyStart);

  matches.sort((a, b) => b.nbPdbs - a.nbPdbs);

  return {
    ligands: matches,
    stats: {
      screened: candidates.length,
      verified,
      screeningMs,
      verificationMs,
      overLimit,
    },
  };
}
