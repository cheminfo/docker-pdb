import { MF } from 'react-mf';

import type { FocusSpec } from '../../shared/PdbViewer.tsx';
import type { PdbFormula } from '../../shared/api/types.ts';

import FocusButton from './FocusButton.tsx';

interface LigandsTableProps {
  /** Formula records of the active PDB document. */
  formula: PdbFormula[];
  /** Stable key of the row currently focused in the 3D viewer. */
  selectedKey?: string;
  /** Called when the user toggles a row's focus button. */
  onFocus: (key: string | null, spec: FocusSpec | null) => void;
}

/**
 * Side-panel table of ligands / non-water HETATM records for the active PDB
 * entry. Water (`HOH`) is shown last to mirror the original tool. Each row
 * carries a focus button that highlights the matching residues in the 3D
 * viewer.
 * @param props - Component props.
 * @param props.formula - Formula records (label, MF, name, count) parsed from the PDB.
 * @param props.selectedKey - Stable key of the row currently focused in the 3D viewer.
 * @param props.onFocus - Called when the user toggles a row's focus button.
 * @returns Compact ligand table.
 */
export default function LigandsTable({
  formula,
  selectedKey,
  onFocus,
}: LigandsTableProps) {
  const sorted = formula.toSorted((left, right) => {
    if (left.label === 'HOH') return 1;
    if (right.label === 'HOH') return -1;
    return left.label.localeCompare(right.label);
  });
  return (
    <table className="info-table">
      <thead>
        <tr>
          <th className="focus-col" aria-label="Show in viewer" />
          <th>Label</th>
          <th>MF</th>
          <th>Name</th>
          <th className="num">Number</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((entry, index) => {
          const key = `ligand:${entry.label}:${String(index)}`;
          const isActive = key === selectedKey;
          return (
            <tr key={key} className={isActive ? 'is-focused' : undefined}>
              <td className="focus-col">
                <FocusButton
                  isActive={isActive}
                  label={`Show ${entry.label} in viewer`}
                  onClick={() =>
                    isActive
                      ? onFocus(null, null)
                      : onFocus(key, { kind: 'ligand', label: entry.label })
                  }
                />
              </td>
              <td className="mono">{entry.label}</td>
              <td className="mf-cell">
                <MF mf={entry.mf} />
              </td>
              <td className="ligand-name" title={entry.name}>
                {entry.name ?? ''}
              </td>
              <td className="num">{entry.number}</td>
            </tr>
          );
        })}
        {sorted.length === 0 && (
          <tr>
            <td colSpan={5} className="placeholder">
              No ligand records.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
