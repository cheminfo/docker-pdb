import { HTMLTable } from '@blueprintjs/core';
import type { ReactNode } from 'react';

import type { FocusSpec } from '../../shared/PdbViewer.tsx';

import FocusButton from './FocusButton.tsx';

interface StructureRow {
  /** PDB chain id this annotation belongs to. */
  chain: string;
  /** First residue index (inclusive). */
  from: number;
  /** Last residue index (inclusive). */
  to: number;
}

interface ExtraColumn<T> {
  /** Column header text. */
  header: string;
  /** Cell renderer for the column. */
  render: (row: T) => ReactNode;
}

interface StructureTableProps<T extends StructureRow> {
  /** Row category — drives focus key prefix, aria labels, and the empty message. */
  kind: 'helix' | 'sheet';
  /** Rows to render. */
  rows: T[];
  /** Optional trailing columns (e.g. helix `Kind`). */
  extraColumns?: Array<ExtraColumn<T>>;
  /** Stable key of the row currently focused in the 3D viewer. */
  selectedKey?: string;
  /** Called when the user toggles a row's focus button. */
  onFocus: (key: string | null, spec: FocusSpec | null) => void;
}

/**
 * Side-panel table of helix or sheet annotations for the active PDB entry.
 * Each row exposes a focus button that highlights the residue range in the
 * 3D viewer; helices add a trailing "Kind" column via `extraColumns`.
 * @param props - Component props.
 * @param props.kind - Row category — drives focus key prefix, aria labels, and the empty message.
 * @param props.rows - Rows to render.
 * @param props.extraColumns - Optional trailing columns.
 * @param props.selectedKey - Stable key of the row currently focused in the 3D viewer.
 * @param props.onFocus - Called when the user toggles a row's focus button.
 * @returns Compact structure table.
 */
export default function StructureTable<T extends StructureRow>({
  kind,
  rows,
  extraColumns = [],
  selectedKey,
  onFocus,
}: StructureTableProps<T>) {
  const totalCols = 5 + extraColumns.length;
  const empty = kind === 'helix' ? 'No helices.' : 'No sheets.';
  return (
    <HTMLTable className="info-table" compact>
      <thead>
        <tr>
          <th className="focus-col" aria-label="Show in viewer" />
          <th>Chain</th>
          <th className="num">From</th>
          <th className="num">To</th>
          <th className="num">Length</th>
          {extraColumns.map((column) => (
            <th key={column.header} className="num">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const key = `${kind}:${row.chain}:${String(row.from)}:${String(row.to)}:${String(index)}`;
          const isActive = key === selectedKey;
          return (
            <tr key={key} className={isActive ? 'is-focused' : undefined}>
              <td className="focus-col">
                <FocusButton
                  isActive={isActive}
                  label={`Show ${kind} ${row.chain} ${String(row.from)}–${String(row.to)} in viewer`}
                  onClick={() =>
                    isActive
                      ? onFocus(null, null)
                      : onFocus(key, {
                          kind: 'range',
                          chain: row.chain,
                          from: row.from,
                          to: row.to,
                        })
                  }
                />
              </td>
              <td>{row.chain}</td>
              <td className="num">{row.from}</td>
              <td className="num">{row.to}</td>
              <td className="num">{row.to - row.from + 1}</td>
              {extraColumns.map((column) => (
                <td key={column.header} className="num">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          );
        })}
        {rows.length === 0 && (
          <tr>
            <td colSpan={totalCols} className="placeholder">
              {empty}
            </td>
          </tr>
        )}
      </tbody>
    </HTMLTable>
  );
}
