import { fetchSheetLengthHist } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { pickEveryNth } from '../../shared/charts/theme.ts';
import { useAsync } from '../../shared/useAsync.ts';

const MAX_LENGTH = 30;

/**
 * Render a histogram of sheet-strand lengths (residues per strand). Strands
 * longer than `MAX_LENGTH` are folded into a single tail bucket.
 * @returns Panel React element with the chart.
 */
export default function SheetLengthChart() {
  const state = useAsync(fetchSheetLengthHist);
  return (
    <Panel
      title="Sheet-strand length distribution"
      description={`Number of β-sheet strands per length (residues). Tail beyond ${MAX_LENGTH} grouped.`}
      state={state}
      errorPrefix="Could not load sheet-length distribution"
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
            valueLabel=" strands"
            axisTickValues={pickEveryNth(
              chartData.map((row) => row.index),
              10,
            )}
          />
        );
      }}
    </Panel>
  );
}
