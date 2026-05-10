/**
 * Append a `column BETWEEN ? AND ?` (or one-sided) clause when at least one
 * of `min` / `max` is set.
 * @param {string[]} where - WHERE-clause accumulator.
 * @param {unknown[]} params - Bound-parameter accumulator.
 * @param {string} column - Column name to constrain.
 * @param {unknown} minRaw - Raw query value for the lower bound.
 * @param {unknown} maxRaw - Raw query value for the upper bound.
 */
export function addRangeWhere(where, params, column, minRaw, maxRaw) {
  const min = Number.parseFloat(minRaw);
  const max = Number.parseFloat(maxRaw);
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);
  if (hasMin && hasMax) {
    where.push(`${column} BETWEEN ? AND ?`);
    params.push(min, max);
  } else if (hasMin) {
    where.push(`${column} >= ?`);
    params.push(min);
  } else if (hasMax) {
    where.push(`${column} <= ?`);
    params.push(max);
  }
}
