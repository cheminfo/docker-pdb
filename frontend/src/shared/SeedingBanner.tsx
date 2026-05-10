import { useEffect, useState } from 'react';

import { fetchSyncStatus } from './api/client.ts';
import type { SyncPhase, SyncRunningInfo } from './api/types.ts';

const POLL_INTERVAL_RUNNING_MS = 2_000;
const POLL_INTERVAL_IDLE_MS = 30_000;

const PHASE_LABELS: Record<SyncPhase, string> = {
  'rebuild-asym':
    'Seeding asymmetric-unit metadata from on-disk archive (first boot)',
  'rebuild-assembly':
    'Seeding biological-assembly metadata from on-disk archive (first boot)',
  'rsync-asym': 'Syncing asymmetric units from wwPDB',
  'rsync-assembly': 'Syncing biological assemblies from wwPDB',
};

/**
 * Persistent banner that appears whenever the cron container is actively
 * working — first-boot rebuild from disk or the periodic wwPDB rsync. Polls
 * `/v1/sync/status` every 2 s while running and every 30 s when idle. Kept
 * out of the way (a single thin strip below the navbar) so it doesn't push
 * page content around once the seed completes.
 * @returns The banner React element, or null when no work is in flight.
 */
export default function SeedingBanner() {
  const [running, setRunning] = useState<SyncRunningInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      fetchSyncStatus().then(
        (status) => {
          if (cancelled) return;
          const next = status.rsync.running;
          setRunning(next);
          const nextDelay = next
            ? POLL_INTERVAL_RUNNING_MS
            : POLL_INTERVAL_IDLE_MS;
          timer = setTimeout(tick, nextDelay);
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

  if (!running?.phase) return null;

  const label = PHASE_LABELS[running.phase];
  const processed = running.processed ?? 0;
  const total = running.total;
  const percent =
    typeof total === 'number' && total > 0
      ? Math.min(100, Math.round((processed / total) * 100))
      : null;
  const counter =
    typeof total === 'number' && total > 0
      ? `${processed.toLocaleString()} / ${total.toLocaleString()}`
      : `${processed.toLocaleString()} files`;

  return (
    <div
      className="seeding-banner"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="seeding-banner-row">
        <span className="seeding-banner-label">{label}</span>
        <span className="seeding-banner-counter">
          {counter}
          {percent !== null ? ` (${percent}%)` : ''}
          {running.lastEntryId ? ` · last: ${running.lastEntryId}` : ''}
        </span>
      </div>
      {percent !== null ? (
        <div className="seeding-banner-track" aria-hidden="true">
          <div
            className="seeding-banner-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
