import type { FocusSpec } from '../../shared/PdbViewer.tsx';
import type { PdbHelix } from '../../shared/api/types.ts';

import FocusButton from './FocusButton.tsx';

interface HelicesTableProps {
  /** Helices parsed from the active PDB. */
  helices: PdbHelix[];
  /** Stable key of the row currently focused in the 3D viewer. */
  selectedKey?: string;
  /** Called when the user toggles a row's focus button. */
  onFocus: (key: string | null, spec: FocusSpec | null) => void;
}

/**
 * Side-panel table of α-helix annotations for the active PDB entry. Each row
 * carries a focus button that highlights the residue range in the 3D viewer.
 * @param props - Component props.
 * @param props.helices - Helix records parsed from the active PDB.
 * @param props.selectedKey - Stable key of the row currently focused in the 3D viewer.
 * @param props.onFocus - Called when the user toggles a row's focus button.
 * @returns Compact helix table.
 */
export default function HelicesTable({
  helices,
  selectedKey,
  onFocus,
}: HelicesTableProps) {
  return (
    <table className="info-table">
      <thead>
        <tr>
          <th className="focus-col" aria-label="Show in viewer" />
          <th>Chain</th>
          <th className="num">From</th>
          <th className="num">To</th>
          <th className="num">Length</th>
          <th className="num">Kind</th>
        </tr>
      </thead>
      <tbody>
        {helices.map((helix, index) => {
          const key = `helix:${helix.chain}:${String(helix.from)}:${String(helix.to)}:${String(index)}`;
          const isActive = key === selectedKey;
          return (
            <tr key={key} className={isActive ? 'is-focused' : undefined}>
              <td className="focus-col">
                <FocusButton
                  isActive={isActive}
                  label={`Show helix ${helix.chain} ${String(helix.from)}–${String(helix.to)} in viewer`}
                  onClick={() =>
                    isActive
                      ? onFocus(null, null)
                      : onFocus(key, {
                          kind: 'range',
                          chain: helix.chain,
                          from: helix.from,
                          to: helix.to,
                        })
                  }
                />
              </td>
              <td>{helix.chain}</td>
              <td className="num">{helix.from}</td>
              <td className="num">{helix.to}</td>
              <td className="num">{helix.to - helix.from + 1}</td>
              <td className="num">{helix.kind}</td>
            </tr>
          );
        })}
        {helices.length === 0 && (
          <tr>
            <td colSpan={6} className="placeholder">
              No helices.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
