import { useNavigate } from 'react-router';

import { fetchSecondaryStructurePresence } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import { useAsync } from '../../shared/useAsync.ts';

const LABELS: Record<string, string> = {
  mixed: 'Mixed (α + β)',
  'helices-only': 'Helices only',
  'sheets-only': 'Sheets only',
  none: 'No SS annotated',
};

/**
 * Render a horizontal bar chart of how many entries fall into each
 * secondary-structure presence bucket: mixed (α+β), helices-only,
 * sheets-only, or no SS annotated at all. Clicking a bar opens Browse
 * filtered to that bucket.
 * @returns Panel React element with the chart.
 */
export default function SecondaryStructureChart() {
  const state = useAsync(fetchSecondaryStructurePresence);
  const navigate = useNavigate();
  return (
    <Panel
      title="Secondary-structure presence"
      description="Share of entries with both / only-α / only-β / no annotated secondary structure. Click a bar to browse that subset."
      state={state}
      errorPrefix="Could not load secondary-structure presence"
    >
      {(data) => {
        const labelToKey = new Map<string, string>();
        // Sort by count descending, then reverse — Nivo horizontal renders
        // data[last] at the top, so this puts the most-abundant bucket on top.
        const chartData = data.rows
          .filter((row) => row.value > 0)
          .toSorted((left, right) => right.value - left.value)
          .toReversed()
          .map((row) => {
            const label = LABELS[row.key] ?? row.key;
            labelToKey.set(label, row.key);
            return { index: label, count: row.value };
          });
        return (
          <HistogramBar
            data={chartData}
            layout="horizontal"
            onBarClick={(index) => {
              const key = labelToKey.get(index);
              if (key) void navigate(browseHref({ ssPresence: key }));
            }}
          />
        );
      }}
    </Panel>
  );
}
