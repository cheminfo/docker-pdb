import { Card } from '@blueprintjs/core';
import { useFullscreen } from 'react-science/ui';

import type { PdbViewerHandle } from '../../shared/PdbViewer.tsx';
import PdbViewer from '../../shared/PdbViewer.tsx';
import type { AsyncState } from '../../shared/useAsync.ts';
import type {
  BackgroundName,
  ColorName,
  RepresentationName,
} from '../../shared/viewerOptions.ts';

import ViewerControls from './ViewerControls.tsx';

interface BrowseViewerCardProps {
  pdbText: AsyncState<string>;
  representation: RepresentationName;
  onRepresentationChange: (value: RepresentationName) => void;
  color: ColorName;
  onColorChange: (value: ColorName) => void;
  spin: boolean;
  onSpinToggle: () => void;
  background: BackgroundName;
  onBackgroundChange: (value: BackgroundName) => void;
  viewerHandleRef: { current: PdbViewerHandle | null };
}

/**
 * Card that renders the Mol* viewer plus its toolbar. Lives inside the
 * `FullScreenProvider` so it can call `useFullscreen()` directly and wire
 * the toolbar's fullscreen button to the browser's full-screen API. When
 * the wrapping div is fullscreened, the card stretches to fill the screen
 * (see the `:fullscreen` CSS rules) and only the protein + its controls
 * remain visible.
 * @param props - Component props.
 * @returns Viewer card React element.
 */
export default function BrowseViewerCard(props: BrowseViewerCardProps) {
  const {
    pdbText,
    representation,
    onRepresentationChange,
    color,
    onColorChange,
    spin,
    onSpinToggle,
    background,
    onBackgroundChange,
    viewerHandleRef,
  } = props;
  const fullscreen = useFullscreen();
  return (
    <Card className="panel browse-viewer">
      {pdbText.status === 'success' && (
        <div className="browse-viewer-header">
          <ViewerControls
            representation={representation}
            onRepresentationChange={onRepresentationChange}
            color={color}
            onColorChange={onColorChange}
            spin={spin}
            onSpinToggle={onSpinToggle}
            background={background}
            onBackgroundChange={onBackgroundChange}
            onResetView={() => viewerHandleRef.current?.resetCamera()}
            isFullScreen={fullscreen.isFullScreen}
            onToggleFullscreen={fullscreen.toggle}
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
  );
}
