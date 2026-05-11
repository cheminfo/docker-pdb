import { Button, Card, Tab, Tabs, Tag } from '@blueprintjs/core';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';

import type { FocusSpec, PdbViewerHandle } from '../../shared/PdbViewer.tsx';
import PdbViewer from '../../shared/PdbViewer.tsx';
import {
  fetchByExperiment,
  fetchPdbText,
  fetchRangeStats,
  findDocuments,
} from '../../shared/api/client.ts';
import type { PdbDoc } from '../../shared/api/types.ts';
import { useAsync } from '../../shared/useAsync.ts';
import { useDebouncedValue } from '../../shared/useDebouncedValue.ts';
import type {
  BackgroundName,
  ColorName,
  RepresentationName,
} from '../../shared/viewerOptions.ts';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_COLOR,
  DEFAULT_REPRESENTATION,
} from '../../shared/viewerOptions.ts';

import FilterPanel from './FilterPanel.tsx';
import LigandsTable from './LigandsTable.tsx';
import PdbHeader from './PdbHeader.tsx';
import PdbTable from './PdbTable.tsx';
import StructureTable from './StructureTable.tsx';
import ViewerControls from './ViewerControls.tsx';
import type { FilterState } from './filters.ts';
import { emptyFilterState, filtersToFindParams } from './filters.ts';

/**
 * Page mounted at `/browse`. Drives every list update from a single
 * server-side query: filter sidebar + free-text query → `findDocuments`
 * (`GET /v1/pdbs?...`). Stats and method counts come from grouped SQL
 * queries on the same backend, so the page never has to load the whole
 * database into memory.
 * @returns Browse page React element.
 */
export default function BrowsePage() {
  const stats = useAsync(fetchRangeStats);
  const methodView = useAsync(fetchByExperiment);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(emptyFilterState);
  const [pickedId, setPickedId] = useState<string | undefined>(undefined);

  // Debounce the inputs so the keyword box doesn't fire one search query per
  // keystroke and slider drags are smooth.
  const debouncedQuery = useDebouncedValue(query, 250);
  const debouncedFilters = useDebouncedValue(filters, 250);

  const findParams = useMemo(
    () => filtersToFindParams(debouncedFilters, debouncedQuery),
    [debouncedFilters, debouncedQuery],
  );

  const findTask = useCallback(
    () => findDocuments<PdbDoc>(findParams),
    [findParams],
  );
  const findResult = useAsync(findTask);

  const docs = findResult.status === 'success' ? findResult.data.docs : [];
  const totalCount = useMemo(
    () =>
      methodView.status === 'success'
        ? methodView.data.rows.reduce((sum, row) => sum + row.value, 0)
        : 0,
    [methodView],
  );

  const methodCounts = useMemo<Array<[string, number]>>(
    () =>
      methodView.status === 'success'
        ? methodView.data.rows
            .map((row) => [row.key, row.value] as [string, number])
            .toSorted(([, a], [, b]) => b - a)
        : [],
    [methodView],
  );

  // Resolve the active selection during render so we never need a `useEffect`
  // to keep `pickedId` in sync with the filtered list.
  const selectedDoc = docs.find((doc) => doc._id === pickedId) ?? docs[0];
  const selectedId = selectedDoc?._id;

  return (
    <div className="browse-container">
      <div className="browse-grid">
        <FilterPanel
          query={query}
          onQueryChange={setQuery}
          matchCount={docs.length}
          totalCount={totalCount}
          methodCounts={methodCounts}
          stats={stats.status === 'success' ? stats.data : undefined}
          filters={filters}
          onChange={setFilters}
        />
        <div className="browse-list-col">
          <Card className="browse-list panel">
            {findResult.status === 'loading' && (
              <p className="placeholder pdb-table-empty">Searching…</p>
            )}
            {findResult.status === 'error' && (
              <p className="placeholder pdb-table-empty">
                Search failed: {findResult.error.message}
              </p>
            )}
            {findResult.status === 'success' && (
              <PdbTable
                rows={docs}
                selectedId={selectedId}
                onSelect={setPickedId}
              />
            )}
          </Card>
        </div>
        {selectedDoc ? (
          <SelectedEntry doc={selectedDoc} />
        ) : (
          <>
            <div className="browse-main">
              <Card className="panel browse-entry-header">
                <p className="placeholder">
                  {findResult.status === 'success'
                    ? 'No entries match the current filter.'
                    : 'Loading…'}
                </p>
              </Card>
            </div>
            <Card className="panel browse-side" />
          </>
        )}
      </div>
    </div>
  );
}

interface SelectedEntryProps {
  doc: PdbDoc;
}

/**
 * Centre column (entry header + viewer + PDB header) and right column
 * (side tables) of the currently-selected entry, rendered as siblings of
 * the list inside `.browse-grid`.
 * @param props - Component props.
 * @param props.doc - The currently-selected PDB document.
 * @returns Fragment with the main column and the side column.
 */
function SelectedEntry({ doc }: SelectedEntryProps) {
  const fetchTextForId = useCallback(() => fetchPdbText(doc._id), [doc._id]);
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

  // Side-table → viewer focus selection. The key is opaque ("ligand:HOH:3",
  // "helix:A:12:24:0", …) and uniquely identifies the active row across all
  // three tables. Reset during render when the active document changes — the
  // loci from the previous structure are no longer valid.
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [trackedDocId, setTrackedDocId] = useState(doc._id);
  if (trackedDocId !== doc._id) {
    setTrackedDocId(doc._id);
    setFocusKey(null);
  }

  const handleFocus = useCallback(
    (key: string | null, spec: FocusSpec | null) => {
      setFocusKey(key);
      viewerHandleRef.current?.focus(spec);
    },
    [],
  );

  function copyId() {
    void navigator.clipboard.writeText(doc._id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <>
      <div className="browse-main">
        <Card className="panel browse-entry-header">
          <div className="browse-entry-top">
            <div className="browse-entry-id-row">
              <Button
                className="browse-entry-id"
                variant="minimal"
                icon={copied ? 'tick' : 'duplicate'}
                onClick={copyId}
                title="Click to copy PDB code"
              >
                <span className="browse-entry-id-code">{doc._id}</span>
                <span className="browse-entry-id-hint">
                  {copied ? 'copied!' : 'click to copy'}
                </span>
              </Button>
              <Link
                to={`/scripting?pdb=${encodeURIComponent(doc._id)}`}
                title={`Open ${doc._id} in the scripting page`}
              >
                <Button variant="minimal" icon="code" endIcon="arrow-right">
                  Open in Scripting
                </Button>
              </Link>
            </div>
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
        </Card>
        <div className="browse-entry-grid">
          <Card className="panel browse-viewer">
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
          </Card>
          <Card className="panel browse-pdb-text">
            {pdbText.status === 'success' ? (
              <PdbHeader pdb={pdbText.data} />
            ) : (
              <>
                <h3>PDB header</h3>
                <p className="placeholder">…</p>
              </>
            )}
          </Card>
        </div>
      </div>
      <Card className="panel browse-side">
        <SideTabs
          doc={doc}
          selectedKey={focusKey ?? undefined}
          onFocus={handleFocus}
        />
      </Card>
    </>
  );
}

type SideTab = 'ligands' | 'helices' | 'sheets';

interface SideTabsProps {
  doc: PdbDoc;
  selectedKey?: string;
  onFocus: (key: string | null, spec: FocusSpec | null) => void;
}

/**
 * Tabbed view of the selected entry's ligands, helices, and sheets.
 * @param props - Component props.
 * @param props.doc - The currently-selected PDB document.
 * @param props.selectedKey - Stable key of the row currently focused in the viewer.
 * @param props.onFocus - Called when the user toggles a row's focus button.
 * @returns Tab strip + active tab body.
 */
function SideTabs({ doc, selectedKey, onFocus }: SideTabsProps) {
  const [active, setActive] = useState<SideTab>('ligands');

  const tabs: Array<{ id: SideTab; label: string; count: number }> = [
    { id: 'ligands', label: 'Ligands', count: doc.formula.length },
    { id: 'helices', label: 'Helices', count: doc.helices.length },
    { id: 'sheets', label: 'Sheets', count: doc.sheets.length },
  ];

  function renderTabBody() {
    if (active === 'ligands') {
      return (
        <LigandsTable
          formula={doc.formula}
          selectedKey={selectedKey}
          onFocus={onFocus}
        />
      );
    }
    if (active === 'helices') {
      return (
        <StructureTable
          kind="helix"
          rows={doc.helices}
          extraColumns={[{ header: 'Kind', render: (helix) => helix.kind }]}
          selectedKey={selectedKey}
          onFocus={onFocus}
        />
      );
    }
    return (
      <StructureTable
        kind="sheet"
        rows={doc.sheets}
        selectedKey={selectedKey}
        onFocus={onFocus}
      />
    );
  }

  return (
    <div className="side-tabs">
      <Tabs
        id="browse-side-tabs"
        selectedTabId={active}
        onChange={(tabId) => setActive(tabId as SideTab)}
        size="large"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            title={
              <span className="side-tab-title">
                {tab.label}
                <Tag minimal round>
                  {tab.count}
                </Tag>
              </span>
            }
          />
        ))}
      </Tabs>
      <div className="side-tabpanel" role="tabpanel">
        {renderTabBody()}
      </div>
    </div>
  );
}
