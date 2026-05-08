import { fetchSecondaryStructurePresence } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { useAsync } from '../../shared/useAsync.ts';

const LABELS: Record<string, string> = {
  mixed: 'Mixed (α + β)',
  'helices-only': 'Helices only',
  'sheets-only': 'Sheets only',
  none: 'No SS annotated',
};
const ORDER = ['mixed', 'helices-only', 'sheets-only', 'none'];

/**
 * Render a horizontal bar chart of how many entries fall into each
 * secondary-structure presence bucket: mixed (α+β), helices-only,
 * sheets-only, or no SS annotated at all.
 * @returns Panel React element with the chart.
 */
export default function SecondaryStructureChart() {
  const state = useAsync(fetchSecondaryStructurePresence);
  return (
    <Panel
      title="Secondary-structure presence"
      description="Share of entries with both / only-α / only-β / no annotated secondary structure."
      state={state}
      errorPrefix="Could not load secondary-structure presence"
    >
      {(data) => {
        const byKey = new Map(data.rows.map((row) => [row.key, row.value]));
        const chartData = ORDER.map((key) => ({
          index: LABELS[key] ?? key,
          count: byKey.get(key) ?? 0,
        })).filter((row) => row.count > 0);
        return <HistogramBar data={chartData} layout="horizontal" />;
      }}
    </Panel>
  );
}
