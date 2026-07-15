import { Button, ButtonGroup, Card } from '@blueprintjs/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { OnChangeMoleculeCallback } from 'react-ocl';
import { CanvasMoleculeEditor } from 'react-ocl';

import { fetchLigandPdbs, fetchLigandSearch } from '../../shared/api/client.ts';
import type {
  LigandFilters,
  LigandPdbReference,
  LigandSearchMode,
  LigandSearchResponse,
  LigandSummary,
} from '../../shared/api/types.ts';
import { formatNumber } from '../../shared/format.ts';

import LigandFilterFields from './LigandFilterFields.tsx';
import LigandPagination from './LigandPagination.tsx';
import LigandPdbsPanel from './LigandPdbsPanel.tsx';
import LigandResultsTable from './LigandResultsTable.tsx';
import type { LigandFilterDraft } from './ligandFilters.ts';
import { EMPTY_FILTER_DRAFT, toLigandFilters } from './ligandFilters.ts';

const PAGE_SIZE = 50;

/** Delay before a filter keystroke reaches the API, in milliseconds. */
const FILTER_DEBOUNCE_MS = 300;

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
  const [searchMode, setSearchMode] =
    useState<LigandSearchMode>('substructure');
  const [search, setSearch] = useState<LigandSearchResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [filterDraft, setFilterDraft] =
    useState<LigandFilterDraft>(EMPTY_FILTER_DRAFT);
  const [debouncedDraft, setDebouncedDraft] =
    useState<LigandFilterDraft>(EMPTY_FILTER_DRAFT);
  const [offset, setOffset] = useState(0);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [pdbs, setPdbs] = useState<LigandPdbReference[] | null>(null);
  const [pdbsTotal, setPdbsTotal] = useState(0);
  const [pdbsError, setPdbsError] = useState<string | null>(null);

  // Debounce the filter fields so typing doesn't fire a request per keystroke.
  useEffect(() => {
    if (filterDraft === debouncedDraft) return;
    const timeout = setTimeout(() => {
      setDebouncedDraft(filterDraft);
      setOffset(0);
      setSearching(true);
    }, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [filterDraft, debouncedDraft]);

  const filters: LigandFilters = useMemo(
    () => toLigandFilters(debouncedDraft),
    [debouncedDraft],
  );

  // Run the search whenever the query, mode, filters or page change.
  useEffect(() => {
    let cancelled = false;
    fetchLigandSearch({
      idCode: queryIdCode,
      mode: searchMode,
      filters,
      limit: PAGE_SIZE,
      offset,
    })
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
  }, [queryIdCode, searchMode, filters, offset]);

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
    setOffset(0);
    setSearching(true);
  }, []);

  const handleClear = useCallback(() => {
    setQueryIdCode(null);
    setOffset(0);
    setSearching(true);
  }, []);

  const handleModeChange = useCallback(
    (mode: LigandSearchMode) => {
      if (mode === searchMode) return;
      setSearchMode(mode);
      setOffset(0);
      if (queryIdCode) setSearching(true);
    },
    [searchMode, queryIdCode],
  );

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
        <Card className="panel molecules-editor-panel">
          <div className="molecules-editor-header">
            <h2>Query</h2>
            <Button
              icon="cross"
              variant="minimal"
              size="small"
              className="molecules-clear-button"
              onClick={handleClear}
              disabled={!queryIdCode}
              title="Clear query"
              aria-label="Clear query"
            />
          </div>
          <div className="molecules-mode-selector">
            <ButtonGroup>
              <Button
                active={searchMode === 'substructure'}
                onClick={() => handleModeChange('substructure')}
                size="small"
              >
                Substructure
              </Button>
              <Button
                active={searchMode === 'similarity'}
                onClick={() => handleModeChange('similarity')}
                size="small"
              >
                Similarity
              </Button>
              <Button
                active={searchMode === 'exact'}
                onClick={() => handleModeChange('exact')}
                size="small"
              >
                Exact
              </Button>
            </ButtonGroup>
          </div>
          <div className="molecules-editor-canvas">
            <CanvasMoleculeEditor onChange={handleEditorChange} />
          </div>
          <div className="molecules-editor-actions">
            <span className="molecules-status">
              {searching
                ? 'Searching…'
                : search
                  ? formatStats(search, queryIdCode !== null, searchMode)
                  : ''}
            </span>
          </div>
          {searchError && <p className="error">{searchError}</p>}
          <LigandFilterFields draft={filterDraft} onChange={setFilterDraft} />
        </Card>

        <Card className="panel molecules-results-panel">
          <h2>
            {queryIdCode === null
              ? 'Most-referenced ligands'
              : searchMode === 'similarity'
                ? 'Similar ligands'
                : searchMode === 'exact'
                  ? 'Exact matches'
                  : 'Substructure matches'}
          </h2>
          <LigandResultsTable
            ligands={search?.ligands ?? []}
            selectedCode={selectedCode}
            onSelect={handleSelectLigand}
            searchMode={queryIdCode !== null ? searchMode : undefined}
          />
          <LigandPagination
            total={search?.total ?? 0}
            limit={PAGE_SIZE}
            offset={offset}
            pageSize={search?.ligands.length ?? 0}
            onOffsetChange={setOffset}
          />
        </Card>

        <Card className="panel molecules-pdbs-panel">
          <h2>PDBs</h2>
          <div className="molecules-pdbs-panel-body">
            <LigandPdbsPanel
              ligandCode={selectedCode}
              total={pdbsTotal}
              pdbs={pdbs}
              error={pdbsError}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * Render the search-stats line shown next to the editor. The match count is
 * the total across every page — the pager under the table reports the
 * visible range.
 * @param result - Most recent successful search response.
 * @param hasQuery - Whether a structure query is active.
 * @param mode - Active search mode.
 * @returns Human-readable status string.
 */
function formatStats(
  result: LigandSearchResponse,
  hasQuery: boolean,
  mode: LigandSearchMode,
): string {
  const { total, stats } = result;
  if (!hasQuery) return '';
  const overflow = stats.overLimit ? '+' : '';
  const count = `${formatNumber(total)}${overflow} match${total !== 1 ? 'es' : ''}`;
  const ms = stats.screeningMs + stats.verificationMs;
  if (mode === 'similarity') {
    return `${count} · ranked by similarity in ${ms.toString()} ms`;
  }
  if (mode === 'substructure') {
    return `${count} · ${stats.screened.toString()} screened in ${ms.toString()} ms`;
  }
  return `${count} in ${ms.toString()} ms`;
}
