import { MF } from 'react-mf';

import type { PdbFormula } from '../../shared/api/types.ts';

interface LigandsTableProps {
  /** Formula records of the active PDB document. */
  formula: PdbFormula[];
}

/**
 * Side-panel table of ligands / non-water HETATM records for the active PDB
 * entry. Water (`HOH`) is shown last to mirror the original tool.
 * @param props - Component props.
 * @param props.formula - Formula records (label, MF, name, count) parsed from the PDB.
 * @returns Compact ligand table.
 */
export default function LigandsTable({ formula }: LigandsTableProps) {
  const sorted = formula.toSorted((left, right) => {
    if (left.label === 'HOH') return 1;
    if (right.label === 'HOH') return -1;
    return left.label.localeCompare(right.label);
  });
  return (
    <table className="info-table">
      <thead>
        <tr>
          <th>Label</th>
          <th>MF</th>
          <th>Name</th>
          <th className="num">Number</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((entry, index) => (
          <tr key={`${entry.label}-${String(index)}`}>
            <td className="mono">{entry.label}</td>
            <td className="mf-cell">
              <MF mf={entry.mf} />
            </td>
            <td className="ligand-name" title={entry.name}>
              {entry.name ?? ''}
            </td>
            <td className="num">{entry.number}</td>
          </tr>
        ))}
        {sorted.length === 0 && (
          <tr>
            <td colSpan={4} className="placeholder">
              No ligand records.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
