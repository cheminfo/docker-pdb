import { useNavigate } from 'react-router';

import { fetchLigandFrequency } from '../../shared/api/client.ts';
import HistogramBar from '../../shared/charts/HistogramBar.tsx';
import Panel from '../../shared/charts/Panel.tsx';
import { browseHref } from '../../shared/charts/browseLink.ts';
import { useAsync } from '../../shared/useAsync.ts';

const TOP_N = 20;

/**
 * Render a horizontal bar chart of the `TOP_N` most-frequent non-water
 * ligands across the DB. Each bar's value is the total occurrence count
 * (each ligand entry's `number` field, summed). Clicking a bar opens Browse
 * filtered to entries that contain that ligand code.
 * @returns Panel React element with the chart.
 */
export default function LigandFrequencyChart() {
  const state = useAsync(fetchLigandFrequency);
  const navigate = useNavigate();
  return (
    <Panel
      title={`Top ${TOP_N} ligands`}
      description="Most-frequent non-water HET groups by total occurrence count across all entries. Click a bar to browse entries containing that ligand."
      state={state}
      errorPrefix="Could not load ligand frequencies"
    >
      {(data) => {
        const chartData = data.rows
          .toSorted((left, right) => right.value - left.value)
          .slice(0, TOP_N)
          .map((row) => ({ index: row.key, count: row.value }));
        return (
          <HistogramBar
            data={chartData}
            layout="horizontal"
            valueLabel=" copies"
            height={Math.max(260, 20 * chartData.length + 60)}
            marginLeft={80}
            onBarClick={(index) => {
              void navigate(browseHref({ ligandCode: index }));
            }}
          />
        );
      }}
    </Panel>
  );
}
