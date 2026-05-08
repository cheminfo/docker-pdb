import { fetchNucleicBaseFreq } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const ORDER = ['DA', 'DC', 'DG', 'DT', 'DU', 'A', 'C', 'G', 'U', 'T'];

/**
 * Render a sorted bar chart of nucleic-base residue counts. DNA codes
 * (`DA`/`DC`/`DG`/`DT`) and RNA codes (`A`/`C`/`G`/`U`) share the chart so
 * the relative weight of DNA-vs-RNA structures is visible at a glance.
 * @returns Panel React element with the chart.
 */
export default function NucleicBaseChart() {
  const state = useAsync(fetchNucleicBaseFreq);
  return (
    <Panel
      title="Nucleic-base frequency"
      description="Total residue count per DNA / RNA base across all entries."
      state={state}
      errorPrefix="Could not load nucleic-base frequencies"
    >
      {(data) => {
        const byKey = new Map(data.rows.map((row) => [row.key, row.value]));
        const chartData = ORDER.map((base) => ({
          index: base,
          count: byKey.get(base) ?? 0,
        })).filter((row) => row.count > 0);
        return <HistogramBar data={chartData} valueLabel=" residues" />;
      }}
    </Panel>
  );
}
