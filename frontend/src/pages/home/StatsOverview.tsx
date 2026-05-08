import type { DatabaseInfo } from '../../shared/api/types.ts';
import { formatBytes, formatInteger } from '../../shared/format.ts';

interface StatsOverviewProps {
  pdb: DatabaseInfo;
  assembly: DatabaseInfo;
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
 * Render the four overview cards (counts and disk size for each database).
 * @param props - Component props.
 * @param props.pdb - CouchDB info for the `pdb` database.
 * @param props.assembly - CouchDB info for the `pdb-bio-assembly` database.
 * @returns Stats grid React element.
 */
export default function StatsOverview({ pdb, assembly }: StatsOverviewProps) {
  const pdbCount = pdb.doc_count ?? 0;
  const assemblyCount = assembly.doc_count ?? 0;
  const pdbDisk = getDiskSize(pdb);
  const assemblyDisk = getDiskSize(assembly);

  return (
    <div className="stats-grid">
      <StatCard
        label="PDB entries"
        value={formatInteger(pdbCount)}
        sub={`${formatBytes(pdbDisk)} on disk`}
      />
      <StatCard
        label="Bio-assembly entries"
        value={formatInteger(assemblyCount)}
        sub={`${formatBytes(assemblyDisk)} on disk`}
      />
      <StatCard
        label="Total documents"
        value={formatInteger(pdbCount + assemblyCount)}
        sub="across both databases"
      />
      <StatCard
        label="Total disk"
        value={formatBytes(pdbDisk + assemblyDisk)}
        sub="attachments + indices"
      />
    </div>
  );
}
