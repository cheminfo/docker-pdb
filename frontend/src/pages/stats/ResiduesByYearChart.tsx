import { fetchResiduesByYear } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { pickEveryNth } from '../../shared/charts/theme.ts';
import { useAsync } from '../../shared/useAsync.ts';

/**
 * Render a per-year line of the *average* total residues per entry.
 * Picks up the long-term trend of structures becoming larger as
 * cryo-EM and improved crystallography enable bigger complexes.
 * @returns Panel React element with the chart.
 */
export default function ResiduesByYearChart() {
  const state = useAsync(fetchResiduesByYear);
  return (
    <Panel
      title="Average residues per entry by year"
      description="Mean total residue count of entries deposited each year."
      state={state}
      errorPrefix="Could not load residues-by-year stats"
    >
      {(data) => {
        const chartData = data.rows
          .filter((row) => Number.isFinite(row.key) && row.key >= 1970)
          .toSorted((left, right) => left.key - right.key)
          .map((row) => ({
            index: String(row.key),
            count:
              row.value.count > 0
                ? Math.round(row.value.sum / row.value.count)
                : 0,
          }));
        return (
          <HistogramBar
            data={chartData}
            valueLabel=" avg. residues"
            axisTickValues={pickEveryNth(
              chartData.map((row) => row.index),
              8,
            )}
          />
        );
      }}
    </Panel>
  );
}
