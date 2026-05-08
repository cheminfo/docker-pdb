/**
 * Common nivo `theme` object reused by every chart on the home and stats
 * pages. Centralising it keeps the visual style consistent and avoids 20×
 * copies of the same literal.
 */
export const chartTheme = {
  axis: {
    ticks: { text: { fontSize: 11, fill: '#64748b' } },
    legend: { text: { fontSize: 12, fill: '#64748b' } },
  },
  grid: { line: { stroke: '#e2e8f0', strokeDasharray: '2 2' } },
};

/** Single-series accent colour matching the rest of the UI. */
export const chartAccent = '#2563eb';

/**
 * Format a numeric tick with a `k` suffix above 1000 and `M` above 1,000,000.
 * @param value - Raw numeric value to format.
 * @returns The formatted string.
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
}

/**
 * Sample every `step`-th label so the X-axis stays legible.
 * @param values - Full list of axis labels.
 * @param maxLabels - Soft maximum number of labels to keep.
 * @returns A subset of `values` sized so it never exceeds `maxLabels`.
 */
export function pickEveryNth<T>(values: T[], maxLabels: number): T[] {
  if (values.length <= maxLabels) return values;
  const step = Math.ceil(values.length / maxLabels);
  return values.filter((_, index) => index % step === 0);
}
