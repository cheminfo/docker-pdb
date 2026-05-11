import { fetchMoleculeType } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const LABELS: Record<string, string> = {
  protein: 'Protein only',
  nucleic: 'Nucleic only',
  hybrid: 'Hybrid',
  other: 'Other',
};

/**
 * Render a horizontal bar chart of how many entries fall into each
 * molecule-type bucket: protein-only, nucleic-only, hybrid, other.
 * @returns Panel React element with the chart.
 */
export default function MoleculeTypeChart() {
  const state = useAsync(fetchMoleculeType);
  return (
    <Panel
      title="Molecule type"
      description="Entries containing only protein, only nucleic acid, both, or neither."
      state={state}
      errorPrefix="Could not load molecule-type breakdown"
    >
      {(data) => {
        // Reverse the descending sort so the largest bucket lands at the
        // top — Nivo horizontal renders data[last] at the top of the chart.
        const chartData = data.rows
          .toSorted((left, right) => right.value - left.value)
          .toReversed()
          .map((row) => ({
            index: LABELS[row.key] ?? row.key,
            count: row.value,
          }));
        return <HistogramBar data={chartData} layout="horizontal" />;
      }}
    </Panel>
  );
}
