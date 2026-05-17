import { ResponsiveBar } from '@nivo/bar';
import { useNavigate } from 'react-router';

import { fetchMethodByYear } from '../../shared/api/client.ts';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import {
  chartTheme,
  formatCompact,
  pickEveryNth,
} from '../../shared/charts/theme.ts';
import { formatNumber } from '../../shared/format.ts';
import { useAsync } from '../../shared/useAsync.ts';

const BUCKETS = ['X-ray', 'EM', 'NMR', 'Other'];

const BUCKET_COLORS: Record<string, string> = {
  'X-ray': '#2563eb',
  EM: '#16a34a',
  NMR: '#f59e0b',
  Other: '#94a3b8',
};

const BROWSE_METHOD: Record<string, string | undefined> = {
  'X-ray': 'X-RAY DIFFRACTION',
  EM: 'ELECTRON MICROSCOPY',
  NMR: undefined,
  Other: undefined,
};

function toBucket(method: string): string {
  if (method === 'X-RAY DIFFRACTION') return 'X-ray';
  if (method === 'ELECTRON MICROSCOPY') return 'EM';
  if (method.includes('NMR')) return 'NMR';
  return 'Other';
}

interface YearDatum {
  year: string;
  [method: string]: string | number;
}

/**
 * Render a stacked bar chart of structures deposited per year, grouped into
 * four fixed buckets: X-ray, EM, NMR, and Other. Clicking a segment navigates
 * to Browse filtered by that year (and method, where unambiguous).
 * @returns Panel React element with the chart.
 */
export default function HomeMethodsByYearChart() {
  const state = useAsync(fetchMethodByYear);
  const navigate = useNavigate();

  return (
    <Panel
      title="Methods over time"
      description="Yearly deposition counts by experimental method. Click a segment to browse that year."
      state={state}
      errorPrefix="Could not load method-by-year breakdown"
    >
      {(data) => {
        const byYear = new Map<number, YearDatum>();
        for (const row of data.rows) {
          const [year, method] = row.key;
          if (!Number.isFinite(year) || year < 1970) continue;
          let datum = byYear.get(year);
          if (!datum) {
            datum = { year: String(year) };
            for (const b of BUCKETS) datum[b] = 0;
            byYear.set(year, datum);
          }
          const bucket = toBucket(method);
          datum[bucket] = ((datum[bucket] as number) ?? 0) + row.value;
        }

        const chartData = Array.from(byYear.entries())
          .toSorted(([leftYear], [rightYear]) => leftYear - rightYear)
          .map(([, datum]) => datum);

        if (chartData.length === 0) {
          return <p className="placeholder">No data.</p>;
        }

        const colors = BUCKETS.map((b) => BUCKET_COLORS[b] ?? '#94a3b8');

        return (
          <div style={{ height: 320, cursor: 'pointer' }}>
            <ResponsiveBar
              data={chartData}
              keys={BUCKETS}
              indexBy="year"
              margin={{ top: 8, right: 24, bottom: 80, left: 56 }}
              padding={0.2}
              colors={colors}
              borderRadius={1}
              enableLabel={false}
              onClick={(bar) => {
                const year = String(bar.indexValue);
                const bucket = String(bar.id);
                void navigate(
                  browseHref({
                    yearMin: year,
                    yearMax: year,
                    methods: BROWSE_METHOD[bucket],
                  }),
                );
              }}
              axisBottom={{
                tickSize: 4,
                tickPadding: 6,
                tickRotation: 0,
                tickValues: pickEveryNth(
                  chartData.map((row) => row.year),
                  8,
                ),
              }}
              axisLeft={{
                tickSize: 4,
                tickPadding: 6,
                format: (value: number) => formatCompact(value),
              }}
              gridYValues={4}
              theme={chartTheme}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 64,
                  itemWidth: 90,
                  itemHeight: 14,
                  symbolSize: 10,
                  itemTextColor: '#475569',
                  itemDirection: 'left-to-right',
                  toggleSerie: true,
                },
              ]}
              tooltip={({ id, indexValue, value }) => (
                <div className="chart-tooltip">
                  <strong>
                    {indexValue} · {String(id)}
                  </strong>
                  : {formatNumber(value)}
                </div>
              )}
              animate={false}
            />
          </div>
        );
      }}
    </Panel>
  );
}
