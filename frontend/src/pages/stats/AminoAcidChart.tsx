import { fetchAminoAcidFreq } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const ORDER = [
  'ALA',
  'ARG',
  'ASN',
  'ASP',
  'CYS',
  'GLU',
  'GLN',
  'GLY',
  'HIS',
  'ILE',
  'LEU',
  'LYS',
  'MET',
  'PHE',
  'PRO',
  'SER',
  'THR',
  'TRP',
  'TYR',
  'VAL',
];

/**
 * Render a sorted bar chart of total residue counts for the 20 standard
 * amino acids across the whole DB. The most-abundant AA appears first.
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
        const byKey = new Map(data.rows.map((row) => [row.key, row.value]));
        const chartData = ORDER.map((aa) => ({
          index: aa,
          count: byKey.get(aa) ?? 0,
        })).toSorted((left, right) => right.count - left.count);
        return <HistogramBar data={chartData} valueLabel=" residues" />;
      }}
    </Panel>
  );
}
