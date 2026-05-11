import { useNavigate } from 'react-router';

import { fetchHelixKindHist } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import { useAsync } from '../../shared/useAsync.ts';

const KIND_LABELS: Record<number, string> = {
  1: '1 — α right',
  2: '2 — ω right',
  3: '3 — π right',
  4: '4 — γ right',
  5: '5 — 3-10 right',
  6: '6 — α left',
  7: '7 — ω left',
  8: '8 — γ left',
  9: '9 — 2.7 ribbon',
  10: '10 — polyproline',
};

/**
 * Render a horizontal bar chart of helix kinds (PDB HELIX kind column).
 * Each bar's value is the total number of helix records of that kind
 * across the entire DB. Clicking a bar opens Browse filtered to entries
 * containing at least one helix of that kind.
 * @returns Panel React element with the chart.
 */
export default function HelixKindChart() {
  const state = useAsync(fetchHelixKindHist);
  const navigate = useNavigate();
  return (
    <Panel
      title="Helix kinds"
      description="Total helix annotations across the DB, grouped by the PDB HELIX kind code. Click a bar to browse entries containing that kind."
      state={state}
      errorPrefix="Could not load helix-kind distribution"
    >
      {(data) => {
        const sortedRows = data.rows.toSorted(
          (left, right) => right.value - left.value,
        );
        const labelToKind = new Map<string, number>();
        const chartData = sortedRows.map((row) => {
          const label = KIND_LABELS[row.key] ?? `Kind ${row.key}`;
          labelToKind.set(label, row.key);
          return { index: label, count: row.value };
        });
        return (
          <HistogramBar
            data={chartData}
            layout="horizontal"
            valueLabel=" helices"
            onBarClick={(index) => {
              const kind = labelToKind.get(index);
              if (kind !== undefined) {
                void navigate(browseHref({ helixKind: kind }));
              }
            }}
          />
        );
      }}
    </Panel>
  );
}
