import { fetchHelixLengthHist } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { pickEveryNth } from '../../shared/charts/theme.ts';
import { useAsync } from '../../shared/useAsync.ts';

const MAX_LENGTH = 50;

/**
 * Render a histogram of helix lengths (residues per helix). Lengths above
 * `MAX_LENGTH` are folded into a single `≥50` bucket so the long tail
 * doesn't squash the rest of the chart.
 * @returns Panel React element with the chart.
 */
export default function HelixLengthChart() {
  const state = useAsync(fetchHelixLengthHist);
  return (
    <Panel
      title="Helix length distribution"
      description={`Number of helices of each length (residues). Tail beyond ${MAX_LENGTH} is grouped into a single bucket.`}
      state={state}
      errorPrefix="Could not load helix-length distribution"
    >
      {(data) => {
        const buckets = new Map<number, number>();
        let tail = 0;
        for (const row of data.rows) {
          if (row.key <= MAX_LENGTH) {
            buckets.set(row.key, (buckets.get(row.key) ?? 0) + row.value);
          } else {
            tail += row.value;
          }
        }
        const chartData = Array.from(buckets.entries())
          .toSorted(([leftKey], [rightKey]) => leftKey - rightKey)
          .map(([length, count]) => ({ index: String(length), count }));
        if (tail > 0) {
          chartData.push({ index: `≥${MAX_LENGTH + 1}`, count: tail });
        }
        return (
          <HistogramBar
            data={chartData}
            valueLabel=" helices"
            axisTickValues={pickEveryNth(
              chartData.map((row) => row.index),
              12,
            )}
          />
        );
      }}
    </Panel>
  );
}
