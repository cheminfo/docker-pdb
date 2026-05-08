import { fetchChainsHistogram } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const TAIL_THRESHOLD = 12;

/**
 * Render a histogram of chains per entry. Counts above
 * `TAIL_THRESHOLD` are folded into a single `≥12` bucket so the chart
 * stays readable for the long-tail of huge multi-chain assemblies.
 * @returns Panel React element with the chart.
 */
export default function ChainsHistogramChart() {
  const state = useAsync(fetchChainsHistogram);
  return (
    <Panel
      title="Chains per entry"
      description="Number of entries with N chains (SEQRES blocks)."
      state={state}
      errorPrefix="Could not load chain-count distribution"
    >
      {(data) => {
        const byKey = new Map<number, number>();
        let tail = 0;
        for (const row of data.rows) {
          if (row.key < TAIL_THRESHOLD) {
            byKey.set(row.key, (byKey.get(row.key) ?? 0) + row.value);
          } else {
            tail += row.value;
          }
        }
        const chartData: Array<{ index: string; count: number }> = [];
        for (let chainCount = 1; chainCount < TAIL_THRESHOLD; chainCount++) {
          chartData.push({
            index: String(chainCount),
            count: byKey.get(chainCount) ?? 0,
          });
        }
        if (tail > 0) {
          chartData.push({ index: `≥${TAIL_THRESHOLD}`, count: tail });
        }
        return <HistogramBar data={chartData} />;
      }}
    </Panel>
  );
}
