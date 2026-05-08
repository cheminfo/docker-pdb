import { MF } from 'react-mf';
import { IdcodeSvgRenderer } from 'react-ocl';

import type { LigandSummary } from '../../shared/api/types.ts';

interface LigandResultsTableProps {
  /** Matching ligand rows, in descending PDB-count order. */
  ligands: LigandSummary[];
  /** Code of the row currently selected (highlighted + drives the PDBs panel). */
  selectedCode: string | null;
  /** Called when the user clicks a row; pass `null` to clear the selection. */
  onSelect: (ligand: LigandSummary | null) => void;
}

/**
 * Tabular view of ligand search results. Each row shows the canonical 2D
 * structure (rendered from idCode + coordinates), the 3-letter code, name,
 * formula, MW, and PDB count.
 * @param props - Component props.
 * @param props.ligands - Matching ligand rows to display.
 * @param props.selectedCode - Currently-selected ligand code, or `null`.
 * @param props.onSelect - Selection-change handler.
 * @returns Results table React element.
 */
export default function LigandResultsTable({
  ligands,
  selectedCode,
  onSelect,
}: LigandResultsTableProps) {
  if (ligands.length === 0) {
    return <p className="placeholder">No matches.</p>;
  }
  return (
    <table className="ligand-results-table">
      <thead>
        <tr>
          <th>Structure</th>
          <th>Code</th>
          <th>Name</th>
          <th>MF</th>
          <th className="num">MW</th>
          <th className="num">#PDBs</th>
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
                <IdcodeSvgRenderer
                  idcode={ligand.idCode}
                  coordinates={ligand.coordinates}
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
              <td className="num">{ligand.mw.toFixed(2)}</td>
              <td className="num">{ligand.nbPdbs.toLocaleString('en-US')}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
