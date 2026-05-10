import { useCallback, useEffect, useRef, useState } from 'react';

import FloatingWindow from '../../shared/FloatingWindow.tsx';
import type { PdbViewerHandle } from '../../shared/PdbViewer.tsx';
import PdbViewer from '../../shared/PdbViewer.tsx';
import Splitter from '../../shared/Splitter.tsx';
import { fetchPdbText } from '../../shared/api/client.ts';
import { useAsync } from '../../shared/useAsync.ts';

import AnimateHelp from './AnimateHelp.tsx';
import type { EchoEntry } from './EchoOverlay.tsx';
import EchoOverlay from './EchoOverlay.tsx';
import Editor from './Editor.tsx';
import { createMolStarClass, delay } from './MolStar.ts';
import type { RamachandranEntry } from './RamachandranOverlay.tsx';
import RamachandranOverlay from './RamachandranOverlay.tsx';
import { createScriptApi } from './helpers.ts';
import type { LociHelpers } from './molstarTypes.ts';
import { runScript } from './runScript.ts';
import { DEFAULT_SCENE_CODE, SCENES } from './scenes.ts';

const DEFAULT_PDB_ID = '7ZZO';

interface ColorModule {
  Color: (hex: number) => unknown;
}

/**
 * Page mounted at `/animate`. Lets students write a small JS script using
 * a curated helper API (`api.cpk`, `api.cartoon`, `api.echo`, …) that
 * drives the Mol* viewer. Replaces the legacy JSmol-based teaching tool.
 * @returns The Animate page React element.
 */
export default function AnimatePage() {
  const [pdbId, setPdbId] = useState(DEFAULT_PDB_ID);
  const [loadedId, setLoadedId] = useState(DEFAULT_PDB_ID);
  const [code, setCode] = useState(DEFAULT_SCENE_CODE);
  const [echoEntry, setEchoEntry] = useState<EchoEntry | null>(null);
  const [ramachandranEntry, setRamachandranEntry] =
    useState<RamachandranEntry | null>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [colorModule, setColorModule] = useState<ColorModule | null>(null);
  const [lociHelpers, setLociHelpers] = useState<LociHelpers | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const viewerHandleRef = useRef<PdbViewerHandle | null>(null);

  const fetchTask = useCallback(() => fetchPdbText(loadedId), [loadedId]);
  const pdbText = useAsync(fetchTask);

  useEffect(() => {
    let cancelled = false;
    void import('molstar/lib/mol-util/color/color.js').then((module_) => {
      if (cancelled) return;
      setColorModule({ Color: module_.Color });
    });
    void import('molstar/lib/mol-model/loci.js').then((module_) => {
      if (cancelled) return;
      setLociHelpers({
        getBoundingSphere: (loci) =>
          module_.Loci.getBoundingSphere(loci as never) as
            | { radius: number; center: [number, number, number] }
            | undefined,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRun = useCallback(async () => {
    setScriptError(null);
    const handle = viewerHandleRef.current?.getPlugin();
    if (
      !handle ||
      !colorModule ||
      !lociHelpers ||
      pdbText.status !== 'success'
    ) {
      setScriptError('Viewer is still initializing.');
      return;
    }
    const api = createScriptApi({
      plugin: handle.plugin,
      molScript: handle.molScript,
      colorModule,
      lociHelpers,
      setEchoEntry,
      setRamachandranEntry,
      pdbText: pdbText.data,
    });
    const MolStar = createMolStarClass(api);
    setRunning(true);
    const { error } = await runScript({
      api,
      text: pdbText.data,
      MolStar,
      delay,
      body: code,
    });
    setRunning(false);
    if (error) setScriptError(error.message);
  }, [code, colorModule, lociHelpers, pdbText]);

  const handleReset = useCallback(async () => {
    setScriptError(null);
    setEchoEntry(null);
    setRamachandranEntry(null);
    const handle = viewerHandleRef.current?.getPlugin();
    if (
      !handle ||
      !colorModule ||
      !lociHelpers ||
      pdbText.status !== 'success'
    ) {
      return;
    }
    const api = createScriptApi({
      plugin: handle.plugin,
      molScript: handle.molScript,
      colorModule,
      lociHelpers,
      setEchoEntry,
      setRamachandranEntry,
      pdbText: pdbText.data,
    });
    await api.clear();
    await api.resetCamera();
  }, [colorModule, lociHelpers, pdbText]);

  function handleLoadPdb() {
    const trimmed = pdbId.trim().toUpperCase();
    if (!trimmed) return;
    setLoadedId(trimmed);
    setEchoEntry(null);
    setRamachandranEntry(null);
    setScriptError(null);
  }

  function pickScene(sceneCode: string) {
    setCode(sceneCode);
    setEchoEntry(null);
    setRamachandranEntry(null);
    setScriptError(null);
  }

  const viewerReady =
    pdbText.status === 'success' &&
    colorModule !== null &&
    lociHelpers !== null;

  const viewerPane = (
    <div className="panel animate-viewer-panel">
      {pdbText.status === 'loading' && (
        <p className="placeholder">Loading {loadedId}…</p>
      )}
      {pdbText.status === 'error' && (
        <p className="placeholder">
          Could not load {loadedId}: {pdbText.error.message}
        </p>
      )}
      {pdbText.status === 'success' && (
        <div className="animate-viewer-stack">
          <PdbViewer
            ref={viewerHandleRef}
            pdb={pdbText.data}
            representation="auto"
            color="chain-id"
            spin={false}
            background="white"
          />
          <EchoOverlay entry={echoEntry} />
          <RamachandranOverlay entry={ramachandranEntry} />
        </div>
      )}
    </div>
  );

  const editorPane = (
    <div className="panel animate-editor-panel">
      <div className="animate-editor-header">
        <strong>Script</strong>
        <div className="animate-run-row">
          <button type="button" onClick={() => setShowHelp(true)}>
            Help
          </button>
          <button
            type="button"
            onClick={() => void handleReset()}
            disabled={!viewerReady || running}
          >
            Reset
          </button>
          <button
            type="button"
            className="animate-run-btn"
            onClick={() => void handleRun()}
            disabled={!viewerReady || running}
          >
            {running ? 'Running…' : 'Run'}
          </button>
        </div>
      </div>
      <div className="animate-editor-frame">
        <Editor value={code} onChange={setCode} height="100%" />
      </div>
      {scriptError && <pre className="animate-error">{scriptError}</pre>}
    </div>
  );

  return (
    <div className="animate-page">
      <div className="animate-toolbar panel">
        <label className="animate-pdb-input">
          PDB code
          <input
            type="text"
            value={pdbId}
            onChange={(event) => setPdbId(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleLoadPdb()}
            maxLength={4}
            placeholder="1ART"
          />
        </label>
        <button type="button" onClick={handleLoadPdb}>
          Load
        </button>
        <span className="animate-toolbar-divider" aria-hidden />
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            type="button"
            className="animate-scene-btn"
            onClick={() => pickScene(scene.code)}
          >
            {scene.label}
          </button>
        ))}
      </div>

      <div className="animate-content">
        <Splitter left={viewerPane} right={editorPane} />
      </div>

      {showHelp && (
        <FloatingWindow
          title="Animate scripting reference"
          onClose={() => setShowHelp(false)}
          initialWidth={680}
          initialHeight={560}
        >
          <AnimateHelp />
        </FloatingWindow>
      )}
    </div>
  );
}
