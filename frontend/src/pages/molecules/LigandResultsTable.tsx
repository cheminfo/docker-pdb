import { HTMLTable } from '@blueprintjs/core';
import { MF } from 'react-mf';

import LigandStructure from '../../shared/LigandStructure.tsx';
import type {
  LigandSearchMode,
  LigandSummary,
} from '../../shared/api/types.ts';
import { formatNumber } from '../../shared/format.ts';

interface LigandResultsTableProps {
  /** Matching ligand rows. */
  ligands: LigandSummary[];
  /** Code of the row currently selected (highlighted + drives the PDBs panel). */
  selectedCode: string | null;
  /** Called when the user clicks a row; pass `null` to clear the selection. */
  onSelect: (ligand: LigandSummary | null) => void;
  /** Active search mode — controls which extra columns are shown. */
  searchMode?: LigandSearchMode;
}

/**
 * Tabular view of ligand search results. Each row shows the canonical 2D
 * structure (rendered from `idCode` with coordinates invented client-side),
 * the 3-letter code, name, formula, MW, and PDB count. A Similarity column
 * is added when `searchMode` is `'similarity'`.
 * @param props - Component props.
 * @param props.ligands - Matching ligand rows to display.
 * @param props.selectedCode - Currently-selected ligand code, or `null`.
 * @param props.onSelect - Selection-change handler.
 * @param props.searchMode - Active search mode.
 * @returns Results table React element.
 */
export default function LigandResultsTable({
  ligands,
  selectedCode,
  onSelect,
  searchMode,
}: LigandResultsTableProps) {
  if (ligands.length === 0) {
    return <p className="placeholder">No matches.</p>;
  }
  const showSimilarity = searchMode === 'similarity';
  return (
    <div className="molecules-results-table-wrapper">
      <HTMLTable className="ligand-results-table" interactive compact>
        <thead>
          <tr>
            <th>Structure</th>
            <th>Code</th>
            <th>Name</th>
            <th>MF</th>
            <th className="num">MW</th>
            <th className="num">#PDBs</th>
            {showSimilarity && <th className="num">Sim.</th>}
          </tr>
        </thead>
        <tbody>
          {ligands.map((ligand) => {
            const isActive = ligand.code === selectedCode;
            return (
              <tr
                key={ligand.code}
                className={isActive ? 'is-selected' : undefined}
                onClick={() => onSelect(isActive ? null : ligand)}
              >
                <td className="ligand-structure-cell">
                  <LigandStructure
                    idCode={ligand.idCode}
                    width={120}
                    height={80}
                  />
                </td>
                <td className="mono">{ligand.code}</td>
                <td className="ligand-name" title={ligand.name}>
                  {ligand.name}
                </td>
                <td className="mf-cell">
                  <MF mf={ligand.mf} />
                </td>
                <td className="num">{formatNumber(ligand.mw, 2)}</td>
                <td className="num">{formatNumber(ligand.nbPdbs)}</td>
                {showSimilarity && (
                  <td className="num">
                    {ligand.similarity != null
                      ? `${formatNumber(ligand.similarity * 100, 1)}%`
                      : '—'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>
    </div>
  );
}
