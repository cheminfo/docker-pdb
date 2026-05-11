import { useEffect, useState } from 'react';

import {
  fetchAssemblyInfo,
  fetchByExperiment,
  fetchByYear,
  fetchLastAsymRsync,
  fetchLastBioAssemblyRsync,
  fetchPdbInfo,
  fetchSyncStatus,
} from '../../shared/api/client.ts';
import Panel from '../../shared/charts/Panel.tsx';
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

/** Re-fetch the overview every 5 s while a sync is running. */
const POLL_INTERVAL_RUNNING_MS = 5_000;
/** Idle: still poll once a minute so a sync that starts later is noticed. */
const POLL_INTERVAL_IDLE_MS = 60_000;

/**
 * Top-level page rendered at `/`: project headline, statistics grid, and the
 * year + experimental-method charts.
 * @returns Home page React element.
 */
export default function HomePage() {
  // Bumping `refreshKey` makes the three `useAsync` calls below re-fire
  // without flashing back to "Loading…" — used to keep the home page in
  // step with the live `pdb_entries` count while the initial seed runs.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let wasRunning = false;

    const tick = () => {
      if (cancelled) return;
      fetchSyncStatus().then(
        (status) => {
          if (cancelled) return;
          const isRunning = Boolean(status.rsync.running || status.ccd.running);
          if (isRunning) {
            setRefreshKey((k) => k + 1);
            wasRunning = true;
          } else if (wasRunning) {
            // Final refetch right after a sync finishes so the page shows
            // the post-run totals instead of the throttled-final value.
            setRefreshKey((k) => k + 1);
            wasRunning = false;
          }
          timer = setTimeout(
            tick,
            isRunning ? POLL_INTERVAL_RUNNING_MS : POLL_INTERVAL_IDLE_MS,
          );
        },
        () => {
          if (cancelled) return;
          timer = setTimeout(tick, POLL_INTERVAL_IDLE_MS);
        },
      );
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const overview = useAsync(fetchOverview, refreshKey);
  const byYear = useAsync(fetchByYear, refreshKey);
  const byExperiment = useAsync(fetchByExperiment, refreshKey);

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
