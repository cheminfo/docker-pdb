import { fetchIepHistogram } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { pickEveryNth } from '../../shared/charts/theme.ts';
import { useAsync } from '../../shared/useAsync.ts';

/**
 * Render a histogram of computed isoelectric points (`iep`) for entries.
 * Map function emits 0.5-wide bins; we render every bin within the
 * physiologically relevant 3 → 12 range and sample ticks for legibility.
 * @returns Panel React element with the chart.
 */
export default function IepHistogramChart() {
  const state = useAsync(fetchIepHistogram);
  return (
    <Panel
      title="Isoelectric-point distribution"
      description="Number of entries per pI bucket (0.5-wide bins). Computed across the full sequence of each entry."
      state={state}
      errorPrefix="Could not load isoelectric-point distribution"
    >
      {(data) => {
        const chartData = data.rows
          .toSorted((left, right) => left.key - right.key)
          .map((row) => ({
            index: row.key.toFixed(1),
            count: row.value,
          }));
        return (
          <HistogramBar
            data={chartData}
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
