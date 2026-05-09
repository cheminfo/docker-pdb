import type { DatabaseInfo, RsyncHistoryDoc } from '../../shared/api/types.ts';
import {
  formatBytes,
  formatDateTime,
  formatInteger,
  formatRelative,
} from '../../shared/format.ts';

interface StatsOverviewProps {
  pdb: DatabaseInfo;
  assembly: DatabaseInfo;
  /** Most recent asym-unit rsync run, if one has been recorded. */
  lastAsymRsync: RsyncHistoryDoc | null;
  /** Most recent bio-assembly rsync run, if one has been recorded. */
  lastBioAssemblyRsync: RsyncHistoryDoc | null;
}

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}

function getDiskSize(info: DatabaseInfo): number {
  return info.disk_size ?? info.sizes?.file ?? 0;
}

/**
 * Build the "X CouchDB · Y raw" sub-line for an archive card. Falls back to
 * `–` for the raw side when no rsync has recorded an on-disk size yet.
 * @param couchBytes - Disk space used by the CouchDB database.
 * @param rawBytes - Total size of the raw `.gz` archive on disk, or `null`.
 * @returns Formatted breakdown for the stat card's sub-line.
 */
function formatStorageBreakdown(
  couchBytes: number,
  rawBytes: number | null | undefined,
): string {
  return `${formatBytes(couchBytes)} CouchDB · ${formatBytes(rawBytes ?? undefined)} raw`;
}

/**
 * Render the overview cards (counts, per-archive storage breakdown, separate
 * CouchDB and raw-archive disk totals, and the timestamp of the latest
 * asym-unit rsync run).
 * @param props - Component props.
 * @param props.pdb - CouchDB info for the `pdb` database.
 * @param props.assembly - CouchDB info for the `pdb-bio-assembly` database.
 * @param props.lastAsymRsync - Most recent asym-unit rsync run, or `null`.
 * @param props.lastBioAssemblyRsync - Most recent bio-assembly rsync run, or `null`.
 * @returns Stats grid React element.
 */
export default function StatsOverview({
  pdb,
  assembly,
  lastAsymRsync,
  lastBioAssemblyRsync,
}: StatsOverviewProps) {
  const pdbCount = pdb.doc_count ?? 0;
  const assemblyCount = assembly.doc_count ?? 0;
  const pdbCouch = getDiskSize(pdb);
  const assemblyCouch = getDiskSize(assembly);
  const pdbRaw = lastAsymRsync?.bytesOnDisk ?? null;
  const assemblyRaw = lastBioAssemblyRsync?.bytesOnDisk ?? null;
  const totalCouch = pdbCouch + assemblyCouch;
  const totalRaw = (pdbRaw ?? 0) + (assemblyRaw ?? 0);

  return (
    <div className="stats-grid">
      <StatCard
        label="PDB entries"
        value={formatInteger(pdbCount)}
        sub={formatStorageBreakdown(pdbCouch, pdbRaw)}
      />
      <StatCard
        label="Bio-assembly entries"
        value={formatInteger(assemblyCount)}
        sub={formatStorageBreakdown(assemblyCouch, assemblyRaw)}
      />
      <StatCard
        label="CouchDB on disk"
        value={formatBytes(totalCouch)}
        sub="pdb + pdb-bio-assembly"
      />
      <StatCard
        label="Raw archives on disk"
        value={formatBytes(totalRaw)}
        sub="asym-unit + bio-assembly .gz"
      />
      <StatCard
        label="Last rsync"
        value={
          lastAsymRsync
            ? formatRelative(lastAsymRsync.finishedAt) ||
              formatDateTime(lastAsymRsync.finishedAt)
            : 'never'
        }
        sub={
          lastAsymRsync
            ? `${formatInteger(lastAsymRsync.updatedCount)} new · ${formatDateTime(lastAsymRsync.finishedAt)}`
            : 'no run recorded yet'
        }
      />
    </div>
  );
}
