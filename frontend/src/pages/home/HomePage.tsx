import type { ReactNode } from 'react';

import {
  fetchAssemblyInfo,
  fetchByExperiment,
  fetchByYear,
  fetchPdbInfo,
} from '../../shared/api/client.ts';
import type { AsyncState } from '../../shared/useAsync.ts';
import { useAsync } from '../../shared/useAsync.ts';

import EndpointList from './EndpointList.tsx';
import ExperimentChart from './ExperimentChart.tsx';
import StatsOverview from './StatsOverview.tsx';
import YearChart from './YearChart.tsx';

function fetchOverview() {
  return Promise.all([fetchPdbInfo(), fetchAssemblyInfo()]);
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
 * Top-level page rendered at `/`: header, statistics grid, charts, and API
 * endpoint reference.
 * @returns Home page React element.
 */
export default function HomePage() {
  const overview = useAsync(fetchOverview);
  const byYear = useAsync(fetchByYear);
  const byExperiment = useAsync(fetchByExperiment);

  return (
    <div className="container">
      <header>
        <h1>PDB web service</h1>
        <p>
          HTTP access to the wwPDB tree — asymmetric units, biological
          assemblies, parsed properties, and rendered images — backed by
          CouchDB.
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
        <StatsOverview pdb={overview.data[0]} assembly={overview.data[1]} />
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

      <h2>API endpoints</h2>
      <EndpointList />
    </div>
  );
}
