import { Card } from '@blueprintjs/core';
import { useCallback, useMemo } from 'react';

import PdbViewer from '../../shared/PdbViewer.tsx';
import { fetchPdbDoc, fetchPdbText } from '../../shared/api/client.ts';
import { useAsync } from '../../shared/useAsync.ts';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_COLOR,
  DEFAULT_REPRESENTATION,
} from '../../shared/viewerOptions.ts';

import PdbSummaryCard from './PdbSummaryCard.tsx';
import { parsePdbHeader } from './parsePdbHeader.ts';

interface LastEntryPanelProps {
  /** 4-character PDB id of the most recently imported entry to preview. */
  pdbId: string;
}

/**
 * Home-page panel that displays the most recently imported PDB entry: a Mol*
 * 3D viewer on the left and a parsed summary card (title, source, method,
 * ligands, …) on the right.
 * @param props - Component props.
 * @param props.pdbId - 4-character PDB id of the entry to display.
 * @returns Panel React element.
 */
export default function LastEntryPanel({ pdbId }: LastEntryPanelProps) {
  const fetchDoc = useCallback(() => fetchPdbDoc(pdbId), [pdbId]);
  const fetchText = useCallback(() => fetchPdbText(pdbId), [pdbId]);
  const docState = useAsync(fetchDoc);
  const textState = useAsync(fetchText);

  const header = useMemo(
    () =>
      textState.status === 'success'
        ? parsePdbHeader(textState.data)
        : { sourceOrganisms: [] },
    [textState],
  );

  return (
    <div className="last-entry-grid">
      <Card className="last-entry-viewer panel">
        {textState.status === 'loading' && (
          <p className="placeholder">Loading 3D structure…</p>
        )}
        {textState.status === 'error' && (
          <p className="placeholder">
            Could not load PDB file: {textState.error.message}
          </p>
        )}
        {textState.status === 'success' && (
          <PdbViewer
            pdb={textState.data}
            representation={DEFAULT_REPRESENTATION}
            color={DEFAULT_COLOR}
            spin
            background={DEFAULT_BACKGROUND}
          />
        )}
      </Card>
      <Card className="last-entry-info panel">
        {docState.status === 'loading' && (
          <p className="placeholder">Loading summary…</p>
        )}
        {docState.status === 'error' && (
          <p className="placeholder">
            Could not load entry: {docState.error.message}
          </p>
        )}
        {docState.status === 'success' && (
          <PdbSummaryCard doc={docState.data} header={header} />
        )}
      </Card>
    </div>
  );
}
