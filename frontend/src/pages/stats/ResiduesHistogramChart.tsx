import { fetchResiduesHistogram } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const BUCKETS: Array<[number, string]> = [
  [0, '<50'],
  [50, '50–99'],
  [100, '100–199'],
  [200, '200–499'],
  [500, '500–999'],
  [1000, '1000–1999'],
  [2000, '2000–4999'],
  [5000, '5000–9999'],
  [10000, '≥10000'],
];

/**
 * Render a histogram of total residues per entry using fixed log-ish
 * buckets (`<50`, `50–99`, …, `≥10000`). Mirrors the bucket boundaries used
 * inside the CouchDB map function.
 * @returns Panel React element with the chart.
 */
export default function ResiduesHistogramChart() {
  const state = useAsync(fetchResiduesHistogram);
  return (
    <Panel
      title="Residues per entry"
      description="Number of entries grouped by total residue count (log-ish buckets)."
      state={state}
      errorPrefix="Could not load residue-count distribution"
    >
      {(data) => {
        const byKey = new Map(data.rows.map((row) => [row.key, row.value]));
        const chartData = BUCKETS.map(([lower, label]) => ({
          index: label,
          count: byKey.get(lower) ?? 0,
        }));
        return <HistogramBar data={chartData} rotateBottom={-25} />;
      }}
    </Panel>
  );
}
