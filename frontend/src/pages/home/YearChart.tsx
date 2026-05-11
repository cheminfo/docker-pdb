import { ResponsiveBar } from '@nivo/bar';

import type { ViewResponse } from '../../shared/api/types.ts';
import {
  chartAccent,
  chartTheme,
  formatCompact,
  pickEveryNth,
} from '../../shared/charts/theme.ts';
import { formatNumber } from '../../shared/format.ts';

interface YearChartProps {
  data: ViewResponse<number>;
}

interface YearDatum {
  year: string;
  count: number;
  [key: string]: string | number;
}

/**
 * Render the per-year bar chart of structures.
 * @param props - Component props.
 * @param props.data - View response with one row per year.
 * @returns Bar chart React element.
 */
export default function YearChart({ data }: YearChartProps) {
  const chartData: YearDatum[] = data.rows
    .filter((row) => Number.isFinite(row.key) && row.key >= 1970)
    .toSorted((left, right) => left.key - right.key)
    .map((row) => ({ year: String(row.key), count: row.value }));

  if (chartData.length === 0) {
    return <p className="placeholder">No data.</p>;
  }

  return (
    <div style={{ height: 260 }}>
      <ResponsiveBar
        data={chartData}
        keys={['count']}
        indexBy="year"
        margin={{ top: 8, right: 16, bottom: 40, left: 56 }}
        padding={0.2}
        colors={[chartAccent]}
        borderRadius={2}
        enableLabel={false}
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
        tooltip={({ indexValue, value }) => (
          <div className="chart-tooltip">
            <strong>{indexValue}</strong>: {formatNumber(value)} structures
          </div>
        )}
        animate={false}
      />
    </div>
  );
}
