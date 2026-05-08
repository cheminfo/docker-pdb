import type { FocusSpec } from '../../shared/PdbViewer.tsx';
import type { PdbSheet } from '../../shared/api/types.ts';

import FocusButton from './FocusButton.tsx';

interface SheetsTableProps {
  /** Sheets parsed from the active PDB. */
  sheets: PdbSheet[];
  /** Stable key of the row currently focused in the 3D viewer. */
  selectedKey?: string;
  /** Called when the user toggles a row's focus button. */
  onFocus: (key: string | null, spec: FocusSpec | null) => void;
}

/**
 * Side-panel table of β-sheet annotations for the active PDB entry. Each row
 * carries a focus button that highlights the residue range in the 3D viewer.
 * @param props - Component props.
 * @param props.sheets - Sheet records parsed from the active PDB.
 * @param props.selectedKey - Stable key of the row currently focused in the 3D viewer.
 * @param props.onFocus - Called when the user toggles a row's focus button.
 * @returns Compact sheet table.
 */
export default function SheetsTable({
  sheets,
  selectedKey,
  onFocus,
}: SheetsTableProps) {
  return (
    <table className="info-table">
      <thead>
        <tr>
          <th className="focus-col" aria-label="Show in viewer" />
          <th>Chain</th>
          <th className="num">From</th>
          <th className="num">To</th>
          <th className="num">Length</th>
        </tr>
      </thead>
      <tbody>
        {sheets.map((sheet, index) => {
          const key = `sheet:${sheet.chain}:${String(sheet.from)}:${String(sheet.to)}:${String(index)}`;
          const isActive = key === selectedKey;
          return (
            <tr key={key} className={isActive ? 'is-focused' : undefined}>
              <td className="focus-col">
                <FocusButton
                  isActive={isActive}
                  label={`Show sheet ${sheet.chain} ${String(sheet.from)}–${String(sheet.to)} in viewer`}
                  onClick={() =>
                    isActive
                      ? onFocus(null, null)
                      : onFocus(key, {
                          kind: 'range',
                          chain: sheet.chain,
                          from: sheet.from,
                          to: sheet.to,
                        })
                  }
                />
              </td>
              <td>{sheet.chain}</td>
              <td className="num">{sheet.from}</td>
              <td className="num">{sheet.to}</td>
              <td className="num">{sheet.to - sheet.from + 1}</td>
            </tr>
          );
        })}
        {sheets.length === 0 && (
          <tr>
            <td colSpan={5} className="placeholder">
              No sheets.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
