/**
 * Parse the attribute filters accepted by `GET /v1/ligands`. Every field is
 * optional; absent or blank params yield `null` so they never constrain the
 * query.
 * @param {Record<string, unknown>} query - Fastify request query object.
 * @returns {{ code: string | null, name: string | null, mf: string | null, mwMin: number | null, mwMax: number | null }} Parsed filters.
 */
export function parseLigandFilters(query) {
  return {
    code: text(query.code),
    name: text(query.name),
    mf: text(query.mf),
    mwMin: number(query.mwMin),
    mwMax: number(query.mwMax),
  };
}

/**
 * Build the SQL fragment applying {@link parseLigandFilters} output to a query
 * over the `ligands` table aliased as `l`. `code`, `name` and `mf` match as
 * case-insensitive substrings; `mwMin` / `mwMax` bound the molecular weight.
 * @param {ReturnType<typeof parseLigandFilters>} filters - Parsed filters.
 * @returns {{ clause: string, params: Array<string | number> }} A clause starting
 *   with ` AND ` (empty when no filter is active) and its bound parameters.
 */
export function buildLigandFilterWhere(filters) {
  const clauses = [];
  const params = [];
  for (const column of ['code', 'name', 'mf']) {
    const value = filters[column];
    if (value === null) continue;
    clauses.push(String.raw`l.${column} LIKE ? ESCAPE '\'`);
    params.push(`%${escapeLike(value)}%`);
  }
  if (filters.mwMin !== null) {
    clauses.push('l.mw >= ?');
    params.push(filters.mwMin);
  }
  if (filters.mwMax !== null) {
    clauses.push('l.mw <= ?');
    params.push(filters.mwMax);
  }
  return {
    clause: clauses.length > 0 ? ` AND ${clauses.join(' AND ')}` : '',
    params,
  };
}

function text(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function number(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function escapeLike(value) {
  return value.replaceAll(/[\\%_]/g, String.raw`\$&`);
}
