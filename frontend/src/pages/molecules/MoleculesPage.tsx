import { useCallback, useEffect, useState } from 'react';
import type { OnChangeMoleculeCallback } from 'react-ocl';
import { CanvasMoleculeEditor } from 'react-ocl';

import { fetchLigandPdbs, fetchLigandSearch } from '../../shared/api/client.ts';
import type {
  LigandPdbReference,
  LigandSearchResponse,
  LigandSummary,
} from '../../shared/api/types.ts';

import LigandPdbsPanel from './LigandPdbsPanel.tsx';
import LigandResultsTable from './LigandResultsTable.tsx';

const DEFAULT_LIMIT = 200;

/**
 * Molecules page mounted at `/molecules`. Lets the user draw or paste a
 * substructure query, lists matching ligand codes ranked by PDB count, and
 * — once a ligand is selected — shows the PDBs that contain it. The panel
 * on the left always shows a ranking of the most-used ligands when no
 * query is active, so the page is useful as a browser even before any
 * drawing.
 * @returns Molecules-page React element.
 */
export default function MoleculesPage() {
  const [queryIdCode, setQueryIdCode] = useState<string | null>(null);
  const [search, setSearch] = useState<LigandSearchResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [pdbs, setPdbs] = useState<LigandPdbReference[] | null>(null);
  const [pdbsTotal, setPdbsTotal] = useState(0);
  const [pdbsError, setPdbsError] = useState<string | null>(null);

  // Run the search whenever the query idCode changes. State updates are
  // confined to the async callbacks (per react-hooks/set-state-in-effect)
  // — the effect body only kicks off the fetch and arms the cancel flag.
  useEffect(() => {
    let cancelled = false;
    fetchLigandSearch(queryIdCode, DEFAULT_LIMIT)
      .then((result) => {
        if (cancelled) return;
        setSearch(result);
        setSearchError(null);
        setSearching(false);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setSearchError(
          error instanceof Error ? error.message : 'Search failed',
        );
        setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryIdCode]);

  // When the user types/draws a new query, mark the page as loading via an
  // event handler instead of an effect setter so React 19 stops complaining
  // about cascading renders.

  // Fetch PDBs for the active ligand selection.
  useEffect(() => {
    if (!selectedCode) return;
    let cancelled = false;
    fetchLigandPdbs(selectedCode, 100, 0)
      .then((response) => {
        if (cancelled) return;
        setPdbs(response.pdbs);
        setPdbsTotal(response.total);
        setPdbsError(null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setPdbsError(
          error instanceof Error ? error.message : 'Failed to load PDBs',
        );
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCode]);

  const handleEditorChange = useCallback<OnChangeMoleculeCallback>((event) => {
    const idCode = event.getIdcode();
    // OCL emits an empty-molecule idCode (`d@`) when the canvas is cleared.
    const next = idCode && idCode !== 'd@' && idCode !== 'd@@' ? idCode : null;
    setQueryIdCode(next);
    setSearching(true);
  }, []);

  const handleClear = useCallback(() => {
    setQueryIdCode(null);
    setSearching(true);
  }, []);

  const handleSelectLigand = useCallback((ligand: LigandSummary | null) => {
    setSelectedCode(ligand?.code ?? null);
    // Clear stale state up-front so the panel doesn't flash old PDBs.
    setPdbs(null);
    setPdbsTotal(0);
    setPdbsError(null);
  }, []);

  return (
    <div className="container molecules-page">
      <header>
        <h1>Molecules</h1>
        <p>
          Draw a substructure on the left to find every wwPDB ligand that
          contains it. Results are ranked by the number of PDB entries that
          reference each ligand. Selecting a ligand reveals the list of PDBs.
        </p>
      </header>

      <div className="molecules-layout">
        <section className="panel molecules-editor-panel">
          <h2>Query</h2>
          <CanvasMoleculeEditor
            width="100%"
            height={400}
            onChange={handleEditorChange}
          />
          <div className="molecules-editor-actions">
            <button type="button" onClick={handleClear} disabled={!queryIdCode}>
              Clear query
            </button>
            <span className="molecules-status">
              {searching
                ? 'Searching…'
                : search
                  ? formatStats(search, queryIdCode !== null)
                  : ''}
            </span>
          </div>
          {searchError && <p className="error">{searchError}</p>}
        </section>

        <section className="panel molecules-results-panel">
          <h2>
            {queryIdCode === null
              ? 'Most-referenced ligands'
              : 'Substructure matches'}
          </h2>
          <LigandResultsTable
            ligands={search?.ligands ?? []}
            selectedCode={selectedCode}
            onSelect={handleSelectLigand}
          />
        </section>

        <section className="panel molecules-pdbs-panel">
          <h2>PDBs</h2>
          <LigandPdbsPanel
            ligandCode={selectedCode}
            total={pdbsTotal}
            pdbs={pdbs}
            error={pdbsError}
          />
        </section>
      </div>
    </div>
  );
}

/**
 * Render the search-stats line shown next to the editor.
 * @param result - Most recent successful search response.
 * @param hasQuery - Whether a substructure query is active.
 * @returns Human-readable status string.
 */
function formatStats(result: LigandSearchResponse, hasQuery: boolean): string {
  const { ligands, stats } = result;
  if (!hasQuery) return `${ligands.length.toString()} ligands`;
  const total = stats.screeningMs + stats.verificationMs;
  const overflow = stats.overLimit ? '+' : '';
  return `${ligands.length.toString()}${overflow} matches · ${stats.screened.toString()} screened in ${total.toString()} ms`;
}
