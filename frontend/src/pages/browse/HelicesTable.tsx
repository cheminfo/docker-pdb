import type { PdbHelix } from '../../shared/api/types.ts';

interface HelicesTableProps {
  /** Helices parsed from the active PDB. */
  helices: PdbHelix[];
}

/**
 * Side-panel table of α-helix annotations for the active PDB entry.
 * @param props - Component props.
 * @param props.helices - Helix records.
 * @returns Compact helix table.
 */
export default function HelicesTable({ helices }: HelicesTableProps) {
  return (
    <table className="info-table">
      <thead>
        <tr>
          <th>Chain</th>
          <th className="num">From</th>
          <th className="num">To</th>
          <th className="num">Length</th>
          <th className="num">Kind</th>
        </tr>
      </thead>
      <tbody>
        {helices.map((helix, index) => (
          <tr key={`${helix.chain}-${String(helix.from)}-${String(index)}`}>
            <td>{helix.chain}</td>
            <td className="num">{helix.from}</td>
            <td className="num">{helix.to}</td>
            <td className="num">{helix.to - helix.from + 1}</td>
            <td className="num">{helix.kind}</td>
          </tr>
        ))}
        {helices.length === 0 && (
          <tr>
            <td colSpan={5} className="placeholder">
              No helices.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
