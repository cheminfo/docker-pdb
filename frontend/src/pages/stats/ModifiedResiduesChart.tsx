import { fetchModifiedResiduesHist } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

interface Bucket {
  index: string;
  order: number;
  count: number;
}

/**
 * Render a histogram of the number of modified residues (MODRES records)
 * per entry. Values are clipped at `≥10` so the long tail doesn't squash
 * the rest of the chart.
 * @returns Panel React element with the chart.
 */
export default function ModifiedResiduesChart() {
  const state = useAsync(fetchModifiedResiduesHist);
  return (
    <Panel
      title="Modified residues per entry"
      description="Number of entries with N MODRES records (post-translational modifications, mutations, …)."
      state={state}
      errorPrefix="Could not load modified-residue distribution"
    >
      {(data) => {
        const buckets = new Map<string, Bucket>();
        const ensure = (label: string, order: number): Bucket => {
          let bucket = buckets.get(label);
          if (!bucket) {
            bucket = { index: label, order, count: 0 };
            buckets.set(label, bucket);
          }
          return bucket;
        };
        for (const row of data.rows) {
          if (row.key < 10) {
            ensure(String(row.key), row.key).count += row.value;
          } else {
            ensure('≥10', 10).count += row.value;
          }
        }
        const chartData = Array.from(buckets.values())
          .toSorted((left, right) => left.order - right.order)
          .map(({ index, count }) => ({ index, count }));
        return <HistogramBar data={chartData} />;
      }}
    </Panel>
  );
}
