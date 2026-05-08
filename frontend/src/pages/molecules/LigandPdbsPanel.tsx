import { Link } from 'react-router';

import type { LigandPdbReference } from '../../shared/api/types.ts';

interface LigandPdbsPanelProps {
  /** Code of the active ligand selection, or `null` for the empty state. */
  ligandCode: string | null;
  /** Total number of PDBs containing this ligand (independent of pagination). */
  total: number;
  /** Current page of PDBs (or `null` while loading). */
  pdbs: LigandPdbReference[] | null;
  /** Error message from the most recent fetch, if any. */
  error: string | null;
}

/**
 * Side panel that shows the PDBs containing the active ligand selection.
 * Each PDB id links into the existing browse page so the user can inspect
 * its 3D structure. Falls back to a placeholder when nothing is selected.
 * @param props - Component props.
 * @param props.ligandCode - Code of the active ligand, or `null`.
 * @param props.total - Total PDB count for this ligand.
 * @param props.pdbs - Current page of PDB references (or `null` while loading).
 * @param props.error - Optional error message from the most recent fetch.
 * @returns PDB list React element.
 */
export default function LigandPdbsPanel({
  ligandCode,
  total,
  pdbs,
  error,
}: LigandPdbsPanelProps) {
  if (!ligandCode) {
    return (
      <p className="placeholder">
        Select a ligand to see the PDB entries that contain it.
      </p>
    );
  }
  if (error) {
    return <p className="error">{error}</p>;
  }
  if (pdbs === null) {
    return <p className="placeholder">Loading PDBs for {ligandCode}…</p>;
  }
  if (pdbs.length === 0) {
    return (
      <p className="placeholder">
        No PDB entries reference {ligandCode} in this mirror yet. The link table
        is built incrementally as new entries are imported.
      </p>
    );
  }
  return (
    <div>
      <p className="ligand-pdbs-summary">
        <strong>{ligandCode}</strong> appears in {total.toLocaleString('en-US')}{' '}
        PDB
        {total === 1 ? ' entry' : ' entries'}
        {pdbs.length < total
          ? ` (showing first ${pdbs.length.toString()})`
          : ''}
        .
      </p>
      <ul className="ligand-pdbs-list">
        {pdbs.map((pdb) => (
          <li key={pdb.pdbId}>
            <Link to={`/browse?pdb=${pdb.pdbId}`}>{pdb.pdbId}</Link>
            {pdb.count > 1 ? ` × ${pdb.count.toString()}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
