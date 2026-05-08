import type { PdbSheet } from '../../shared/api/types.ts';

interface SheetsTableProps {
  /** Sheets parsed from the active PDB. */
  sheets: PdbSheet[];
}

/**
 * Side-panel table of β-sheet annotations for the active PDB entry.
 * @param props - Component props.
 * @param props.sheets - Sheet records.
 * @returns Compact sheet table.
 */
export default function SheetsTable({ sheets }: SheetsTableProps) {
  return (
    <table className="info-table">
      <thead>
        <tr>
          <th>Chain</th>
          <th className="num">From</th>
          <th className="num">To</th>
          <th className="num">Length</th>
        </tr>
      </thead>
      <tbody>
        {sheets.map((sheet, index) => (
          <tr key={`${sheet.chain}-${String(sheet.from)}-${String(index)}`}>
            <td>{sheet.chain}</td>
            <td className="num">{sheet.from}</td>
            <td className="num">{sheet.to}</td>
            <td className="num">{sheet.to - sheet.from + 1}</td>
          </tr>
        ))}
        {sheets.length === 0 && (
          <tr>
            <td colSpan={4} className="placeholder">
              No sheets.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
