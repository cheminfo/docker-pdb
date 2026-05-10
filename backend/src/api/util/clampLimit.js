/**
 * Coerce a query-string parameter into a bounded integer.
 * @param {unknown} value - Raw query value.
 * @param {number} fallback - Default when missing or unparseable.
 * @param {number} min - Lower clamp.
 * @param {number} max - Upper clamp.
 * @returns {number} Bounded integer.
 */
export function clampLimit(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}
