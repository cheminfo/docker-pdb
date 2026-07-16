import { buildLigandOrderBy, usesSearchRanking } from './ligandSort.js';

const LIGAND_COLUMNS = `l.code, l.name, l.mf, l.mw, l.id_code AS idCode,
     l.coordinates, l.nb_pdbs AS nbPdbs`;

/**
 * Confirmed matches a substructure scan collects before it stops.
 *
 * Verifying a candidate means parsing it and running a subgraph isomorphism,
 * which on real CCD ligands costs ~1 ms each — so an unbounded scan of a common
 * fragment burns seconds of CPU and, measured against the production database,
 * a bare benzene query never finished at all: it ran into the library's timeout
 * and returned a partial total anyway, after 8 s.
 *
 * Stopping at a cap makes the cost predictable, and costs nothing in relevance:
 * `ocl_ss_index` is clustered by molecular weight, so the matches collected
 * first are the lightest — the ones closest to the query. When the cap (or the
 * timeout) cuts a scan short the response says so via `stats.overLimit`, and
 * `total` counts what was actually found, so every page the pager offers holds
 * rows. A scan that finishes under the cap reports an exact total.
 */
const MAX_SCAN_RESULTS = 1000;

/**
 * Wall-clock budget for one structure scan. Below the library's 5 s default:
 * this endpoint is called on every keystroke of the structure editor, and a
 * request that outlives the reverse proxy is worse than a capped answer.
 */
const SCAN_TIMEOUT_MS = 3000;

/**
 * One page of ligands matching an attribute filter and/or a structure query,
 * plus the number of matches.
 *
 * An attribute-only listing always counts exactly. A structure scan counts
 * exactly when it runs to completion; when a common fragment sends it past
 * {@link MAX_SCAN_RESULTS} (or the timeout) it stops and reports what it found
 * with `stats.overLimit` set, which the UI renders as "1,000+".
 *
 * The attribute filter always runs **first**: it is handed to the structure
 * searcher as a candidates subquery, so molecules the filter excludes are never
 * parsed or graph-matched. That ordering is the whole performance story here —
 * the filter costs a few milliseconds while the structure scan costs ~30 µs per
 * candidate, so every ligand the filter removes is work the scan never does.
 * @param {{
 *   db: import('../../db/getDB.js').LigandsDB,
 *   queryIdCode: string | null,
 *   mode?: 'substructure' | 'similarity' | 'exact',
 *   minSimilarity?: number,
 *   filter: { where: string, values: Record<string, unknown> },
 *   sort: { column: string, direction: 'asc' | 'desc' } | null,
 *   limit: number,
 *   offset: number,
 * }} params - Search parameters. `filter` comes from smart-sqlite3-filter's
 *   `buildWhere`; an empty `where` means no attribute filter. `queryIdCode`
 *   `null` lists ligands by attribute filter alone.
 * @returns {Promise<{
 *   ligands: Array<{ code: string, name: string, mf: string, mw: number, idCode: string, coordinates: string, nbPdbs: number, similarity?: number }>,
 *   total: number,
 *   stats: { screened: number, verified: number, screeningMs: number, verificationMs: number, overLimit: boolean },
 * }>} The requested page, the exact total, and search stats.
 */
export async function ligandSearch({
  db,
  queryIdCode,
  mode = 'substructure',
  minSimilarity = 0,
  filter,
  sort,
  limit,
  offset,
}) {
  if (queryIdCode === null) {
    return listLigands({ db, filter, sort, limit, offset });
  }

  const start = performance.now();
  const candidates = filter.where
    ? {
        sql: `SELECT id AS entry_id FROM ligands WHERE ${filter.where}`,
        params: filter.values,
      }
    : undefined;

  // With the searcher's own ranking, let it paginate: only the page's rows are
  // hydrated. With an explicit sort, every hit is needed before they can be
  // ordered, so ask for all of them and sort in SQL.
  const paginateInSearch = usesSearchRanking(sort);
  const response = await db.molecules.search(queryIdCode, {
    mode,
    format: 'idCode',
    timeoutMs: SCAN_TIMEOUT_MS,
    // `limit` only slices the finished result set; `maxResults` is what stops
    // the scan, so it is the one that bounds the work.
    maxResults: MAX_SCAN_RESULTS,
    ...(candidates ? { candidates } : {}),
    ...(mode === 'similarity' ? { similarityThreshold: minSimilarity } : {}),
    ...(paginateInSearch ? { from: offset, limit } : {}),
  });
  const screeningMs = Math.round(performance.now() - start);

  const hydrationStart = performance.now();
  const ligands = paginateInSearch
    ? hydrateRanked(db, response.results)
    : hydrateSorted(db, response.results, sort, limit, offset);
  const verificationMs = Math.round(performance.now() - hydrationStart);

  return {
    ligands,
    total: response.total,
    stats: {
      screened: response.screened ?? 0,
      verified: response.total,
      screeningMs,
      verificationMs,
      // `partial` means the scan stopped early (timeout / maxCandidates), so
      // `total` is a floor rather than the exact count.
      overLimit: response.partial ?? false,
    },
  };
}

/**
 * List ligands by attribute filter alone — no structure query. One indexed
 * statement for the page, one for the exact total.
 * @param {{ db: import('../../db/getDB.js').LigandsDB, filter: object, sort: object | null, limit: number, offset: number }} params - Listing parameters.
 * @returns {Promise<object>} The page, the exact total, and zeroed search stats.
 */
function listLigands({ db, filter, sort, limit, offset }) {
  const where = filter.where || '1 = 1';
  const { n: total } = db
    .statement(`SELECT COUNT(*) AS n FROM ligands l WHERE ${where}`)
    .get(filter.values);
  const ligands = db
    .statement(
      `SELECT ${LIGAND_COLUMNS} FROM ligands l WHERE ${where}
       ORDER BY ${buildLigandOrderBy(sort)} LIMIT :limit OFFSET :offset`,
    )
    .all({ ...filter.values, limit, offset });
  return Promise.resolve({
    ligands,
    total,
    stats: {
      screened: 0,
      verified: total,
      screeningMs: 0,
      verificationMs: 0,
      overLimit: false,
    },
  });
}

/**
 * Hydrate one page of structure hits, preserving the searcher's own ranking
 * (mass proximity for substructure, score for similarity).
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 * @param {Array<{ entryId: number, similarity?: number }>} results - The page's hits, in order.
 * @returns {object[]} Hydrated ligand rows, in the same order.
 */
function hydrateRanked(db, results) {
  if (results.length === 0) return [];
  const ids = new Array(results.length);
  for (let i = 0; i < results.length; i++) ids[i] = results[i].entryId;

  const rows = db
    .statement(
      `SELECT l.id, ${LIGAND_COLUMNS}
       FROM json_each(:ids) hit JOIN ligands l ON l.id = hit.value`,
    )
    .all({ ids: JSON.stringify(ids) });

  const byId = new Map();
  for (const row of rows) byId.set(row.id, row);
  const ligands = [];
  for (const result of results) {
    const row = byId.get(result.entryId);
    if (row === undefined) continue;
    ligands.push(withSimilarity(row, result.similarity));
  }
  return ligands;
}

/**
 * Sort every structure hit by a ligand column and return one page of it.
 * The hit ids are handed to SQLite as a JSON array, so the statement text is
 * fixed — and stays cached — however many hits there are.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 * @param {Array<{ entryId: number, similarity?: number }>} results - Every hit.
 * @param {{ column: string, direction: 'asc' | 'desc' }} sort - The requested sort.
 * @param {number} limit - Page size.
 * @param {number} offset - Rows to skip.
 * @returns {object[]} Hydrated ligand rows for the requested page.
 */
function hydrateSorted(db, results, sort, limit, offset) {
  if (results.length === 0) return [];
  const similarityById = new Map();
  const ids = new Array(results.length);
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    ids[i] = result.entryId;
    if (result.similarity != null) {
      similarityById.set(result.entryId, result.similarity);
    }
  }

  const rows = db
    .statement(
      `SELECT l.id, ${LIGAND_COLUMNS}
       FROM json_each(:ids) hit JOIN ligands l ON l.id = hit.value
       ORDER BY ${buildLigandOrderBy(sort)} LIMIT :limit OFFSET :offset`,
    )
    .all({ ids: JSON.stringify(ids), limit, offset });

  const ligands = new Array(rows.length);
  for (let i = 0; i < rows.length; i++) {
    ligands[i] = withSimilarity(rows[i], similarityById.get(rows[i].id));
  }
  return ligands;
}

/**
 * Drop the internal `id` — it is only needed to join the searcher's hits back
 * to their rows — and attach a similarity score when there is one.
 * @param {object} row - A hydrated ligand row including its `id`.
 * @param {number | undefined} similarity - Tanimoto score, in similarity mode.
 * @returns {object} The API-shaped ligand row.
 */
function withSimilarity(row, similarity) {
  const ligand = { ...row };
  delete ligand.id;
  if (similarity != null) ligand.similarity = similarity;
  return ligand;
}
