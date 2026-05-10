import { Button, Card, Intent, Tag } from '@blueprintjs/core';
import type { ReactNode } from 'react';

import type {
  CcdSyncState,
  RsyncSyncState,
  SyncRunningInfo,
} from '../../shared/api/types.ts';
import { formatDateTime, formatRelative } from '../../shared/format.ts';

type SyncState = RsyncSyncState | CcdSyncState;

interface SyncCardProps<TState extends SyncState> {
  state: TState | null;
  loading: boolean;
  pending: boolean;
  onTrigger: () => void;
  renderBody: (state: TState) => ReactNode;
}

/**
 * One sync card: schedule label, current state badge, last-run details,
 * and a "Sync now" button that's disabled while a run is in flight.
 * @param props - Component props.
 * @param props.state - Live state of the cron, or `null` while loading.
 * @param props.loading - Whether the initial status fetch is still pending.
 * @param props.pending - Whether the trigger POST is in flight.
 * @param props.onTrigger - Click handler that POSTs `/v1/sync/trigger`.
 * @param props.renderBody - Cron-specific body (last-run info).
 * @returns A single `.panel` representing one cron.
 */
export default function SyncCard<TState extends SyncState>({
  state,
  loading,
  pending,
  onTrigger,
  renderBody,
}: SyncCardProps<TState>) {
  if (loading || !state) {
    return (
      <Card className="panel settings-sync-card">
        <p className="placeholder">Loading…</p>
      </Card>
    );
  }

  const running = state.running;
  const queued = state.triggerQueued;
  const interval = formatInterval(state.intervalMs);
  const disabled = pending || Boolean(running) || Boolean(queued);

  return (
    <Card className="panel settings-sync-card">
      <div className="settings-sync-header">
        <h3>{state.label}</h3>
        <StateBadge running={running} queued={Boolean(queued)} />
      </div>
      <p className="settings-sync-schedule">Runs every {interval}.</p>

      {running ? (
        <p className="settings-sync-running">
          Started {formatRelative(running.startedAt)} (
          {formatDateTime(running.startedAt)}).
        </p>
      ) : queued ? (
        <p className="settings-sync-running">
          Queued {formatRelative(queued.requestedAt)}; the cron container polls
          every 5&nbsp;seconds.
        </p>
      ) : null}

      {renderBody(state)}

      <div className="settings-sync-actions">
        <Button
          icon="refresh"
          intent={Intent.PRIMARY}
          loading={Boolean(running) || pending}
          onClick={onTrigger}
          disabled={disabled}
        >
          {running ? 'Running…' : queued ? 'Queued' : 'Sync now'}
        </Button>
      </div>
    </Card>
  );
}

function StateBadge({
  running,
  queued,
}: {
  running: SyncRunningInfo | null;
  queued: boolean;
}) {
  if (running) {
    return <Tag intent={Intent.PRIMARY}>Running</Tag>;
  }
  if (queued) {
    return <Tag intent={Intent.WARNING}>Queued</Tag>;
  }
  return <Tag minimal>Idle</Tag>;
}

function formatInterval(ms: number): string {
  const hours = ms / 3_600_000;
  if (hours < 24) {
    return `${Math.round(hours)} hour${hours === 1 ? '' : 's'}`;
  }
  const days = hours / 24;
  return `${Math.round(days)} day${days === 1 ? '' : 's'}`;
}
