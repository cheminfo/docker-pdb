/**
 * Unified chemical-structure search over the `ligands` table, powered by
 * `openchemlib-sqlite`. Three modes are supported:
 *
 * - `substructure`: 512-bit fingerprint prefilter + OCL SSSearcher verification.
 *   Results are sorted by ascending MW so the smallest matching fragments come first.
 * - `similarity`: Tanimoto fingerprint similarity. Results carry a `similarity` field
 *   (0–1) and are sorted by descending similarity score, then by ascending MW for
 *   equal scores. No threshold is applied by default, so the query always returns a
 *   ranked list rather than an empty one.
 * - `exact`: Exact structural match (ignoring H-count but not stereo). Results are
 *   sorted by descending PDB occurrence count.
 * @param {{
 *   db: import('../../db/getDB.js').LigandsDB,
 *   queryIdCode: string,
 *   mode?: 'substructure' | 'similarity' | 'exact',
 *   maxResults?: number,
 *   minSimilarity?: number,
 *   filter?: { clause: string, params: Array<string | number> },
 * }} params - Search parameters. `minSimilarity` defaults to 0 (no threshold).
 *   `filter` is the attribute filter built by `buildLigandFilterWhere`; it is
 *   applied while hydrating the structural hits, so filtered-out ligands never
 *   reach the caller.
 * @returns {Promise<{
 *   ligands: Array<{ code: string, name: string, mf: string, mw: number, idCode: string, coordinates: string, nbPdbs: number, similarity?: number }>,
 *   stats: { screened: number, verified: number, screeningMs: number, verificationMs: number, overLimit: boolean },
 * }>} Matching ligands and timing stats.
 */
export async function ligandSearch({
  db,
  queryIdCode,
  mode = 'substructure',
  maxResults = 200,
  minSimilarity = 0,
  filter = { clause: '', params: [] },
}) {
  const start = performance.now();
  const response = await db.molecules.search(queryIdCode, {
    mode,
    format: 'idCode',
    // `limit` only slices the finished result set; `maxResults` is what stops
    // the substructure scan early. Without it a common fragment (benzene)
    // verifies all ~32k matches before slicing — 1.4s instead of 0.2s.
    limit: maxResults,
    maxResults,
    ...(mode === 'similarity' ? { similarityThreshold: minSimilarity } : {}),
  });
  const elapsedMs = Math.round(performance.now() - start);

  // entryId is BigInt from openchemlib-sqlite; convert to Number for SQL.
  const ids = response.results.map((result) => Number(result.entryId));
  // True when the structural search itself was truncated to `maxResults` —
  // computed before the attribute filter so it reports the search, not the
  // filtered subset.
  const overLimit = response.total > response.results.length;
  if (ids.length === 0) {
    return {
      ligands: [],
      stats: {
        screened: response.screened ?? 0,
        verified: 0,
        screeningMs: elapsedMs,
        verificationMs: 0,
        overLimit,
      },
    };
  }

  // Map entryId → similarity score (only populated for similarity mode).
  // entryId is a BigInt from openchemlib-sqlite; convert to Number so it
  // matches the regular integer returned by node:sqlite for l.id.
  const similarityById = new Map(
    response.results
      .filter((r) => r.similarity != null)
      .map((r) => [Number(r.entryId), r.similarity]),
  );

  const placeholders = ids.map(() => '?').join(',');
  const rows = db
    .statement(
      `SELECT l.id, l.code, l.name, l.mf, l.mw, l.id_code AS idCode, l.coordinates,
              COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
       FROM ligands l WHERE l.id IN (${placeholders})${filter.clause}`,
    )
    .all(...ids, ...filter.params)
    .map(({ id, ...rest }) => {
      const sim = similarityById.get(id);
      return sim != null ? { ...rest, similarity: sim } : rest;
    });

  let ligands;
  if (mode === 'similarity') {
    ligands = rows.toSorted(
      (a, b) => (b.similarity ?? 0) - (a.similarity ?? 0) || a.mw - b.mw,
    );
  } else if (mode === 'substructure') {
    ligands = rows.toSorted((a, b) => a.mw - b.mw);
  } else {
    ligands = rows.toSorted((a, b) => b.nbPdbs - a.nbPdbs);
  }

  return {
    ligands,
    stats: {
      screened: response.screened ?? 0,
      verified: ligands.length,
      screeningMs: elapsedMs,
      verificationMs: 0,
      overLimit,
    },
  };
}
