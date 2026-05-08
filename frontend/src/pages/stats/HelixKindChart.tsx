import { fetchHelixKindHist } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const KIND_LABELS: Record<number, string> = {
  1: '1 — α right',
  2: '2 — ω right',
  3: '3 — π right',
  4: '4 — γ right',
  5: '5 — 3-10 right',
  6: '6 — α left',
  7: '7 — ω left',
  8: '8 — γ left',
  9: '9 — 2.7 ribbon',
  10: '10 — polyproline',
};

/**
 * Render a horizontal bar chart of helix kinds (PDB HELIX kind column).
 * Each bar's value is the total number of helix records of that kind
 * across the entire DB.
 * @returns Panel React element with the chart.
 */
export default function HelixKindChart() {
  const state = useAsync(fetchHelixKindHist);
  return (
    <Panel
      title="Helix kinds"
      description="Total helix annotations across the DB, grouped by the PDB HELIX kind code."
      state={state}
      errorPrefix="Could not load helix-kind distribution"
    >
      {(data) => {
        const chartData = data.rows
          .toSorted((left, right) => right.value - left.value)
          .map((row) => ({
            index: KIND_LABELS[row.key] ?? `Kind ${row.key}`,
            count: row.value,
          }));
        return (
          <HistogramBar
            data={chartData}
            layout="horizontal"
            valueLabel=" helices"
          />
        );
      }}
    </Panel>
  );
}
