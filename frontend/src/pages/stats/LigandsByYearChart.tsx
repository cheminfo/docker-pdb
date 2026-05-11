import { useNavigate } from 'react-router';

import { fetchLigandsByYear } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import { pickEveryNth } from '../../shared/charts/theme.ts';
import { useAsync } from '../../shared/useAsync.ts';

/**
 * Render a per-year line of average ligands per entry. Useful as a proxy
 * for drug-discovery activity: years dominated by complex / fragment-based
 * screens push the mean upwards. Clicking a bar filters the Browse page to
 * entries deposited in that year.
 * @returns Panel React element with the chart.
 */
export default function LigandsByYearChart() {
  const state = useAsync(fetchLigandsByYear);
  const navigate = useNavigate();
  return (
    <Panel
      title="Average ligands per entry by year"
      description="Mean number of (non-water) ligands across entries deposited each year. Click a bar to browse that year."
      state={state}
      errorPrefix="Could not load ligands-by-year stats"
    >
      {(data) => {
        const chartData = data.rows
          .filter((row) => Number.isFinite(row.key) && row.key >= 1970)
          .toSorted((left, right) => left.key - right.key)
          .map((row) => ({
            index: String(row.key),
            count:
              row.value.count > 0
                ? Math.round((row.value.sum / row.value.count) * 100) / 100
                : 0,
          }));
        return (
          <HistogramBar
            data={chartData}
            valueLabel=" avg. ligands"
            axisTickValues={pickEveryNth(
              chartData.map((row) => row.index),
              8,
            )}
            onBarClick={(index) => {
              void navigate(browseHref({ yearMin: index, yearMax: index }));
            }}
          />
        );
      }}
    </Panel>
  );
}
