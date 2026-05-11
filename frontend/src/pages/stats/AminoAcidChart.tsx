import { fetchAminoAcidFreq } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

/**
 * Render a sorted bar chart of total residue counts for the 20 standard
 * amino acids across the whole DB. The most-abundant AA appears first.
 * The API already returns every AA in canonical order (zero-filled where
 * missing) so the chart only needs to re-sort by count.
 * @returns Panel React element with the chart.
 */
export default function AminoAcidChart() {
  const state = useAsync(fetchAminoAcidFreq);
  return (
    <Panel
      title="Amino-acid frequency"
      description="Total residue count per amino-acid across all entries."
      state={state}
      errorPrefix="Could not load amino-acid frequencies"
    >
      {(data) => {
        const chartData = data.rows
          .map((row) => ({ index: row.key, count: row.value }))
          .toSorted((left, right) => right.count - left.count);
        return <HistogramBar data={chartData} valueLabel=" residues" />;
      }}
    </Panel>
  );
}
