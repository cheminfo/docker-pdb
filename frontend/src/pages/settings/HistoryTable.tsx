import { HTMLTable } from '@blueprintjs/core';

import type { RsyncHistoryDoc } from '../../shared/api/types.ts';
import { formatBytes, formatDateTime } from '../../shared/format.ts';

interface HistoryTableProps {
  rows: RsyncHistoryDoc[];
}

/**
 * Compact table rendering the recent rsync history for one archive type.
 * @param props - Component props.
 * @param props.rows - History rows in finished-at descending order.
 * @returns A `<table>` element, or a placeholder when the list is empty.
 */
export default function HistoryTable({ rows }: HistoryTableProps) {
  if (rows.length === 0) {
    return <p className="placeholder">No runs recorded yet.</p>;
  }
  return (
    <div className="settings-history-table-wrapper">
      <HTMLTable className="settings-history-table" compact striped>
        <thead>
          <tr>
            <th>Finished</th>
            <th>Duration</th>
            <th className="num">New</th>
            <th className="num">Removed</th>
            <th>Last entry</th>
            <th className="num">On disk</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.type}-${row.finishedAt}`}>
              <td>{formatDateTime(row.finishedAt)}</td>
              <td>{formatDuration(row.durationMs)}</td>
              <td className="num">{row.updatedCount}</td>
              <td className="num">{row.deletedCount}</td>
              <td>{row.lastEntryId ?? '–'}</td>
              <td className="num">
                {formatBytes(row.bytesOnDisk ?? undefined)}
              </td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '–';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remaining}s`;
  const hours = Math.floor(minutes / 60);
  const minRemaining = minutes % 60;
  return `${hours}h ${minRemaining}m`;
}
