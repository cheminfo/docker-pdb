import { useNavigate } from 'react-router';

import { fetchEcClasses } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import { useAsync } from '../../shared/useAsync.ts';

const EC_LABELS: Record<string, string> = {
  '1': '1 — Oxidoreductases',
  '2': '2 — Transferases',
  '3': '3 — Hydrolases',
  '4': '4 — Lyases',
  '5': '5 — Isomerases',
  '6': '6 — Ligases',
  '7': '7 — Translocases',
};

/**
 * Render a horizontal bar chart of how many entries contain at least one
 * chain in each top-level Enzyme-Commission class (1 → 7). Clicking a bar
 * opens Browse filtered to entries containing at least one chain in that
 * class.
 * @returns Panel React element with the chart.
 */
export default function EcClassesChart() {
  const state = useAsync(fetchEcClasses);
  const navigate = useNavigate();
  return (
    <Panel
      title="Enzyme-Commission classes"
      description="Number of entries with at least one chain in each top-level EC class. Click a bar to browse that class."
      state={state}
      errorPrefix="Could not load EC-class distribution"
    >
      {(data) => {
        // Reverse the descending sort so the largest bar lands at the top
        // (Nivo horizontal renders data[last] at the top of the chart).
        const sortedRows = data.rows
          .toSorted((left, right) => right.value - left.value)
          .toReversed();
        const labelToDigit = new Map<string, string>();
        const chartData = sortedRows.map((row) => {
          const label = EC_LABELS[row.key] ?? `EC ${row.key}`;
          labelToDigit.set(label, row.key);
          return { index: label, count: row.value };
        });
        return (
          <HistogramBar
            data={chartData}
            layout="horizontal"
            onBarClick={(index) => {
              const digit = labelToDigit.get(index);
              if (digit) void navigate(browseHref({ ecClass: digit }));
            }}
          />
        );
      }}
    </Panel>
  );
}
