import { useMemo, useRef, useState } from 'react';
import { filter as smartFilter } from 'smart-array-filter';

import {
  fetchJsmolList,
  fetchPdbText,
  fetchRangeStats,
} from '../../shared/api/client.ts';
import type { PdbDoc } from '../../shared/api/types.ts';
import { useAsync } from '../../shared/useAsync.ts';

import FilterPanel from './FilterPanel.tsx';
import HelicesTable from './HelicesTable.tsx';
import LigandsTable from './LigandsTable.tsx';
import PdbHeader from './PdbHeader.tsx';
import PdbTable from './PdbTable.tsx';
import type { PdbViewerHandle } from './PdbViewer.tsx';
import PdbViewer from './PdbViewer.tsx';
import SearchBox from './SearchBox.tsx';
import SheetsTable from './SheetsTable.tsx';
import ViewerControls from './ViewerControls.tsx';
import type { FilterState } from './filters.ts';
import { applyFilters, emptyFilterState } from './filters.ts';
import type {
  BackgroundName,
  ColorName,
  RepresentationName,
} from './viewerOptions.ts';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_COLOR,
  DEFAULT_REPRESENTATION,
} from './viewerOptions.ts';

/**
 * Page mounted at `/browse`. Loads the curated `_view/jsmol` set, lets the
 * user filter it client-side with smart-array-filter, and shows the active
 * entry's 3D structure (Mol*), header, ligands, helices, and sheets.
 * @returns Browse page React element.
 */
export default function BrowsePage() {
  const list = useAsync(fetchJsmolList);
  const stats = useAsync(fetchRangeStats);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(emptyFilterState);
  const [pickedId, setPickedId] = useState<string | undefined>(undefined);

  const docs: PdbDoc[] = useMemo(
    () => list.data?.rows.map((row) => row.doc) ?? [],
    [list.data],
  );

  const structurallyFiltered = useMemo(
    () => applyFilters(docs, filters),
    [docs, filters],
  );

  const filteredDocs = useMemo(() => {
    if (!query.trim()) return structurallyFiltered;
    return smartFilter(structurallyFiltered, { keywords: query });
  }, [structurallyFiltered, query]);

  // Resolve the effective selection during render: prefer the user's last
  // manual pick when it's still in the filtered set, otherwise fall back to
  // the first match. Storing only the manual pick avoids `useEffect` dances
  // to keep the selection in sync with the filter result.
  const selectedDoc =
    filteredDocs.find((doc) => doc._id === pickedId) ?? filteredDocs[0];
  const selectedId = selectedDoc?._id;

  return (
    <div className="browse-container">
      {list.status === 'loading' && (
        <p className="placeholder">Loading curated PDB list…</p>
      )}
      {list.status === 'error' && (
        <p className="placeholder">
          Could not load PDB list: {list.error.message}
        </p>
      )}
      {list.status === 'success' && (
        <div className="browse-grid">
          <FilterPanel
            docs={docs}
            stats={stats.status === 'success' ? stats.data : undefined}
            filters={filters}
            onChange={setFilters}
          />
          <div className="browse-list-col">
            <SearchBox
              value={query}
              onChange={setQuery}
              matchCount={filteredDocs.length}
              totalCount={docs.length}
            />
            <div className="browse-list panel">
              <PdbTable
                rows={filteredDocs}
                selectedId={selectedId}
                onSelect={setPickedId}
              />
            </div>
          </div>
          {selectedDoc ? (
            <SelectedEntry doc={selectedDoc} />
          ) : (
            <>
              <div className="browse-main">
                <div className="panel browse-entry-header">
                  <p className="placeholder">
                    Select an entry on the left to load its 3D structure.
                  </p>
                </div>
              </div>
              <div className="panel browse-side" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface SelectedEntryProps {
  doc: PdbDoc;
}

/**
 * Centre column (entry header + viewer + PDB header) and right column (side
 * tables) of the currently-selected entry, rendered as siblings of the list
 * inside `.browse-grid`.
 * @param props - Component props.
 * @param props.doc - The currently-selected PDB document.
 * @returns Fragment with the main column and the side column.
 */
function SelectedEntry({ doc }: SelectedEntryProps) {
  const fetchTextForId = useMemo(() => () => fetchPdbText(doc._id), [doc._id]);
  const pdbText = useAsync(fetchTextForId);
  const [copied, setCopied] = useState(false);
  const [representation, setRepresentation] = useState<RepresentationName>(
    DEFAULT_REPRESENTATION,
  );
  const [color, setColor] = useState<ColorName>(DEFAULT_COLOR);
  const [spin, setSpin] = useState(false);
  const [background, setBackground] =
    useState<BackgroundName>(DEFAULT_BACKGROUND);
  const viewerHandleRef = useRef<PdbViewerHandle | null>(null);

  function copyId() {
    void navigator.clipboard.writeText(doc._id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <>
      <div className="browse-main">
        <div className="panel browse-entry-header">
          <div className="browse-entry-top">
            <button
              type="button"
              className="browse-entry-id"
              onClick={copyId}
              title="Click to copy PDB code"
            >
              {doc._id}
              <span className="browse-entry-id-hint">
                {copied ? 'copied!' : 'click to copy'}
              </span>
            </button>
            <div className="browse-entry-meta">
              <span>
                <strong>Chains:</strong> {doc.nbChains}
              </span>
              <span>
                <strong>Residues:</strong> {doc.nbResidues}
              </span>
              {doc.year !== undefined && (
                <span>
                  <strong>Year:</strong> {doc.year}
                </span>
              )}
              {doc.experiment && (
                <span>
                  <strong>Method:</strong> {doc.experiment}
                </span>
              )}
            </div>
          </div>
          <div className="browse-entry-title">{doc.title}</div>
        </div>
        <div className="browse-entry-grid">
          <div className="panel browse-viewer">
            {pdbText.status === 'success' && (
              <div className="browse-viewer-header">
                <ViewerControls
                  representation={representation}
                  onRepresentationChange={setRepresentation}
                  color={color}
                  onColorChange={setColor}
                  spin={spin}
                  onSpinToggle={() => setSpin((value) => !value)}
                  background={background}
                  onBackgroundChange={setBackground}
                  onResetView={() => viewerHandleRef.current?.resetCamera()}
                />
              </div>
            )}
            {pdbText.status === 'loading' && (
              <p className="placeholder">Loading PDB file…</p>
            )}
            {pdbText.status === 'error' && (
              <p className="placeholder">
                Could not load PDB file: {pdbText.error.message}
              </p>
            )}
            {pdbText.status === 'success' && (
              <PdbViewer
                ref={viewerHandleRef}
                pdb={pdbText.data}
                representation={representation}
                color={color}
                spin={spin}
                background={background}
              />
            )}
          </div>
          <div className="panel browse-pdb-text">
            {pdbText.status === 'success' ? (
              <PdbHeader pdb={pdbText.data} />
            ) : (
              <>
                <h3>PDB header</h3>
                <p className="placeholder">…</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="panel browse-side">
        <SideTabs doc={doc} />
      </div>
    </>
  );
}

type SideTab = 'ligands' | 'helices' | 'sheets';

interface SideTabsProps {
  doc: PdbDoc;
}

/**
 * Tabbed view of the selected entry's ligands, helices, and sheets.
 * @param props - Component props.
 * @param props.doc - The currently-selected PDB document.
 * @returns Tab strip + active tab body.
 */
function SideTabs({ doc }: SideTabsProps) {
  const [active, setActive] = useState<SideTab>('ligands');

  const tabs: Array<{ id: SideTab; label: string; count: number }> = [
    { id: 'ligands', label: 'Ligands', count: doc.formula.length },
    { id: 'helices', label: 'Helices', count: doc.helices.length },
    { id: 'sheets', label: 'Sheets', count: doc.sheets.length },
  ];

  return (
    <div className="side-tabs">
      <div className="side-tablist" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={active === tab.id ? 'side-tab is-active' : 'side-tab'}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
            <span className="side-count">{tab.count}</span>
          </button>
        ))}
      </div>
      <div className="side-tabpanel" role="tabpanel">
        {active === 'ligands' && <LigandsTable formula={doc.formula} />}
        {active === 'helices' && <HelicesTable helices={doc.helices} />}
        {active === 'sheets' && <SheetsTable sheets={doc.sheets} />}
      </div>
    </div>
  );
}
