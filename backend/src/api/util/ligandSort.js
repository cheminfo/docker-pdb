/**
 * Columns the ligand browser can sort on, mapped to their SQL expression.
 * A whitelist, so a `sort` query param can never inject SQL.
 */
const SORT_COLUMNS = new Map([
  ['code', 'l.code'],
  ['name', 'l.name'],
  ['mf', 'l.mf'],
  ['mw', 'l.mw'],
  ['nbPdbs', 'l.nb_pdbs'],
]);

/**
 * Default ranking: most-referenced ligands first, ties alphabetical. Matches
 * `idx_ligands_rank` exactly, so SQLite reads it straight from the index.
 */
const DEFAULT_ORDER_BY = 'l.nb_pdbs DESC, l.code ASC';

/**
 * Parse the `sort` / `direction` query params.
 * @param {Record<string, unknown>} query - Fastify request query object.
 * @returns {{ column: string, direction: 'asc' | 'desc' } | null} The requested
 *   sort, or `null` for the default ranking (also when `sort` is unknown).
 */
export function parseLigandSort(query) {
  const column = typeof query.sort === 'string' ? query.sort : null;
  if (column === null || !SORT_COLUMNS.has(column)) return null;
  return { column, direction: query.direction === 'desc' ? 'desc' : 'asc' };
}

/**
 * Build the ORDER BY body (without the keywords) for a ligand listing.
 *
 * The tie-break on `code` runs in the *same* direction as the sorted column, so
 * a single ascending composite index serves both directions: forward scan for
 * ASC, backward for DESC. Mixing directions would force a temp b-tree sort of
 * the whole table.
 * @param {ReturnType<typeof parseLigandSort>} sort - Parsed sort, or `null`.
 * @returns {string} The ORDER BY body.
 */
export function buildLigandOrderBy(sort) {
  if (sort === null) return DEFAULT_ORDER_BY;
  const expression = SORT_COLUMNS.get(sort.column);
  const direction = sort.direction === 'desc' ? 'DESC' : 'ASC';
  return `${expression} ${direction}, l.code ${direction}`;
}

/**
 * Whether a sort can be satisfied by the structure searcher's own ranking
 * (mass proximity for substructure, score for similarity). Only the default
 * ranking can — anything else has to be sorted in SQL.
 * @param {ReturnType<typeof parseLigandSort>} sort - Parsed sort, or `null`.
 * @returns {boolean} True when the searcher's own order is what the caller wants.
 */
export function usesSearchRanking(sort) {
  return sort === null;
}
