import { useNavigate } from 'react-router';

import { fetchByYear } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import { pickEveryNth } from '../../shared/charts/theme.ts';
import { useAsync } from '../../shared/useAsync.ts';

/**
 * Render a cumulative bar chart of deposited structures over time. Each
 * bar's value is the running total up to and including that year, which
 * makes the steady exponential growth of the PDB easy to read. Clicking a
 * bar navigates to `/browse` filtered to entries deposited up to that year.
 * @returns Panel React element with the chart.
 */
export default function CumulativeYearChart() {
  const state = useAsync(fetchByYear);
  const navigate = useNavigate();
  return (
    <Panel
      title="Cumulative entries over time"
      description="Running total of all deposited entries up to each year. Click a bar to browse all entries up to that year."
      state={state}
      errorPrefix="Could not load cumulative-year stats"
    >
      {(data) => {
        const sortedRows = data.rows
          .filter((row) => Number.isFinite(row.key) && row.key >= 1970)
          .toSorted((left, right) => left.key - right.key);
        let running = 0;
        const chartData = sortedRows.map((row) => {
          running += row.value;
          return { index: String(row.key), count: running };
        });
        return (
          <HistogramBar
            data={chartData}
            valueLabel=" total"
            axisTickValues={pickEveryNth(
              chartData.map((row) => row.index),
              8,
            )}
            onBarClick={(index) => {
              void navigate(browseHref({ yearMax: index }));
            }}
          />
        );
      }}
    </Panel>
  );
}
