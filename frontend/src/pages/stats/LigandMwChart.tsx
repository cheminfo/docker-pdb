import { fetchLigandMwHistogram } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const BUCKETS: Array<[number, string]> = [
  [0, '<100'],
  [100, '100–249'],
  [250, '250–499'],
  [500, '500–999'],
  [1000, '1000–1999'],
  [2000, '2000–4999'],
  [5000, '≥5000'],
];

/**
 * Render a histogram of ligand molecular weights (g/mol). Buckets are
 * pre-defined in the backend `ligandMwHistogram` query and mirrored here to
 * label the X-axis.
 * @returns Panel React element with the chart.
 */
export default function LigandMwChart() {
  const state = useAsync(fetchLigandMwHistogram);
  return (
    <Panel
      title="Ligand molecular weight"
      description="Number of (non-water) ligand occurrences per MW bucket (g/mol)."
      state={state}
      errorPrefix="Could not load ligand-MW distribution"
    >
      {(data) => {
        const byKey = new Map(data.rows.map((row) => [row.key, row.value]));
        const chartData = BUCKETS.map(([lower, label]) => ({
          index: label,
          count: byKey.get(lower) ?? 0,
        }));
        return (
          <HistogramBar
            data={chartData}
            valueLabel=" ligands"
            rotateBottom={-25}
          />
        );
      }}
    </Panel>
  );
}
