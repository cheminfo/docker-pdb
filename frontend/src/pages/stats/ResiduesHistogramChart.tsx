import { useNavigate } from 'react-router';

import { fetchResiduesHistogram } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import { useAsync } from '../../shared/useAsync.ts';

// Tuple shape: [inclusive lower bound, axis label, inclusive upper bound or
// `null` for the open-ended ≥10000 bucket]. Keep mirrored with the backend
// `residuesHistogram` query.
const BUCKETS: Array<[number, string, number | null]> = [
  [0, '<50', 49],
  [50, '50–99', 99],
  [100, '100–199', 199],
  [200, '200–499', 499],
  [500, '500–999', 999],
  [1000, '1000–1999', 1999],
  [2000, '2000–4999', 4999],
  [5000, '5000–9999', 9999],
  [10000, '≥10000', null],
];

/**
 * Render a histogram of total residues per entry using fixed log-ish
 * buckets (`<50`, `50–99`, …, `≥10000`). Mirrors the bucket boundaries used
 * by the backend `residuesHistogram` query. Clicking a bar opens Browse
 * with the residues range pre-applied to that bucket.
 * @returns Panel React element with the chart.
 */
export default function ResiduesHistogramChart() {
  const state = useAsync(fetchResiduesHistogram);
  const navigate = useNavigate();
  return (
    <Panel
      title="Residues per entry"
      description="Number of entries grouped by total residue count (log-ish buckets). Click a bar to browse that range."
      state={state}
      errorPrefix="Could not load residue-count distribution"
    >
      {(data) => {
        const byKey = new Map(data.rows.map((row) => [row.key, row.value]));
        const labelToRange = new Map(
          BUCKETS.map(([lower, label, upper]) => [label, { lower, upper }]),
        );
        const chartData = BUCKETS.map(([lower, label]) => ({
          index: label,
          count: byKey.get(lower) ?? 0,
        }));
        return (
          <HistogramBar
            data={chartData}
            rotateBottom={-25}
            onBarClick={(index) => {
              const range = labelToRange.get(index);
              if (!range) return;
              void navigate(
                browseHref({
                  residuesMin: range.lower,
                  residuesMax: range.upper ?? undefined,
                }),
              );
            }}
          />
        );
      }}
    </Panel>
  );
}
