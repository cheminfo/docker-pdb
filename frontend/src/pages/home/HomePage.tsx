import type { ReactNode } from 'react';

import {
  fetchAssemblyInfo,
  fetchByExperiment,
  fetchByYear,
  fetchLastAsymRsync,
  fetchLastBioAssemblyRsync,
  fetchPdbInfo,
} from '../../shared/api/client.ts';
import type { AsyncState } from '../../shared/useAsync.ts';
import { useAsync } from '../../shared/useAsync.ts';

import ExperimentChart from './ExperimentChart.tsx';
import LastEntryPanel from './LastEntryPanel.tsx';
import StatsOverview from './StatsOverview.tsx';
import YearChart from './YearChart.tsx';

function fetchOverview() {
  return Promise.all([
    fetchPdbInfo(),
    fetchAssemblyInfo(),
    fetchLastAsymRsync(),
    fetchLastBioAssemblyRsync(),
  ]);
}

interface PanelProps<TData> {
  title: string;
  state: AsyncState<TData>;
  errorPrefix: string;
  children: (data: TData) => ReactNode;
}

function Panel<TData>({
  title,
  state,
  errorPrefix,
  children,
}: PanelProps<TData>) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      {state.status === 'loading' ? (
        <p className="placeholder">Loading…</p>
      ) : state.status === 'error' ? (
        <p className="placeholder">
          {errorPrefix}: {state.error.message}
        </p>
      ) : (
        children(state.data)
      )}
    </div>
  );
}

/**
 * Top-level page rendered at `/`: project headline, statistics grid, and the
 * year + experimental-method charts.
 * @returns Home page React element.
 */
export default function HomePage() {
  const overview = useAsync(fetchOverview);
  const byYear = useAsync(fetchByYear);
  const byExperiment = useAsync(fetchByExperiment);

  return (
    <div className="container">
      <header>
        <h1>
          PDB <em>quick</em> View
        </h1>
        <p>
          A self-hosted, fast read-only mirror of the worldwide Protein Data
          Bank — every entry parsed once into SQLite and rendered once into
          PyMol thumbnails so structure metadata loads instantly.
        </p>
      </header>

      <h2>Statistics</h2>
      {overview.status === 'loading' ? (
        <p className="placeholder">Loading…</p>
      ) : overview.status === 'error' ? (
        <p className="placeholder">
          Could not load database stats: {overview.error.message}
        </p>
      ) : (
        <StatsOverview
          pdb={overview.data[0]}
          assembly={overview.data[1]}
          lastAsymRsync={overview.data[2]}
          lastBioAssemblyRsync={overview.data[3]}
        />
      )}

      {overview.status === 'success' && overview.data[2]?.lastEntryId && (
        <>
          <h2>Last imported entry</h2>
          <LastEntryPanel pdbId={overview.data[2].lastEntryId} />
        </>
      )}

      <div className="charts">
        <Panel
          title="Structures by year"
          state={byYear}
          errorPrefix="Could not load year breakdown"
        >
          {(data) => <YearChart data={data} />}
        </Panel>
        <Panel
          title="Experimental method"
          state={byExperiment}
          errorPrefix="Could not load experiment breakdown"
        >
          {(data) => <ExperimentChart data={data} />}
        </Panel>
      </div>
    </div>
  );
}
