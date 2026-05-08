import { useMemo, useState } from 'react';

interface PdbHeaderProps {
  /** Raw PDB-format text. */
  pdb: string;
}

/**
 * Pre-formatted display of the PDB file. Defaults to showing every record
 * before the first ATOM/HETATM line; a toggle reveals the full file including
 * coordinates.
 * @param props - Component props.
 * @param props.pdb - Raw PDB-format text.
 * @returns Pre-formatted header element with a header/full toggle.
 */
export default function PdbHeader({ pdb }: PdbHeaderProps) {
  const [showFull, setShowFull] = useState(false);
  const headerOnly = useMemo(() => {
    const lines: string[] = [];
    for (const line of pdb.split(/\r?\n/)) {
      const field = line.slice(0, 6);
      if (field === 'ATOM  ' || field === 'HETATM') break;
      lines.push(line);
    }
    return lines.join('\n');
  }, [pdb]);
  return (
    <>
      <div className="pdb-header-bar">
        <h3>PDB header</h3>
        <div className="pdb-header-toggle">
          <button
            type="button"
            className={`pdb-header-toggle-button${showFull ? '' : ' is-active'}`}
            onClick={() => setShowFull(false)}
          >
            Header only
          </button>
          <button
            type="button"
            className={`pdb-header-toggle-button${showFull ? ' is-active' : ''}`}
            onClick={() => setShowFull(true)}
          >
            Full PDB
          </button>
        </div>
      </div>
      <pre className="pdb-header">{showFull ? pdb : headerOnly}</pre>
    </>
  );
}
