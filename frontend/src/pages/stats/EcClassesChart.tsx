import { fetchEcClasses } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const EC_LABELS: Record<string, string> = {
  '1': '1 — Oxidoreductases',
  '2': '2 — Transferases',
  '3': '3 — Hydrolases',
  '4': '4 — Lyases',
  '5': '5 — Isomerases',
  '6': '6 — Ligases',
  '7': '7 — Translocases',
};

/**
 * Render a horizontal bar chart of how many entries contain at least one
 * chain in each top-level Enzyme-Commission class (1 → 7).
 * @returns Panel React element with the chart.
 */
export default function EcClassesChart() {
  const state = useAsync(fetchEcClasses);
  return (
    <Panel
      title="Enzyme-Commission classes"
      description="Number of entries with at least one chain in each top-level EC class."
      state={state}
      errorPrefix="Could not load EC-class distribution"
    >
      {(data) => {
        const chartData = data.rows
          .toSorted((left, right) => right.value - left.value)
          .map((row) => ({
            index: EC_LABELS[row.key] ?? `EC ${row.key}`,
            count: row.value,
          }));
        return <HistogramBar data={chartData} layout="horizontal" />;
      }}
    </Panel>
  );
}
