import { useCallback, useEffect, useRef, useState } from 'react';

import type { PdbViewerHandle } from '../../shared/PdbViewer.tsx';
import PdbViewer from '../../shared/PdbViewer.tsx';
import { fetchPdbText } from '../../shared/api/client.ts';
import { useAsync } from '../../shared/useAsync.ts';

import AnimateHelp from './AnimateHelp.tsx';
import type { EchoEntry } from './EchoOverlay.tsx';
import EchoOverlay from './EchoOverlay.tsx';
import Editor from './Editor.tsx';
import type { RamachandranEntry } from './RamachandranOverlay.tsx';
import RamachandranOverlay from './RamachandranOverlay.tsx';
import { createScriptApi } from './helpers.ts';
import { runScript } from './runScript.ts';
import { DEFAULT_SCENE_CODE, SCENES } from './scenes.ts';

const DEFAULT_PDB_ID = '1WRV';

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
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRun = useCallback(async () => {
    setScriptError(null);
    const handle = viewerHandleRef.current?.getPlugin();
    if (!handle || !colorModule || pdbText.status !== 'success') {
      setScriptError('Viewer is still initializing.');
      return;
    }
    const api = createScriptApi({
      plugin: handle.plugin,
      molScript: handle.molScript,
      colorModule,
      setEchoEntry,
      setRamachandranEntry,
      pdbText: pdbText.data,
    });
    setRunning(true);
    const { error } = await runScript(api, code);
    setRunning(false);
    if (error) setScriptError(error.message);
  }, [code, colorModule, pdbText]);

  const handleReset = useCallback(async () => {
    setScriptError(null);
    setEchoEntry(null);
    setRamachandranEntry(null);
    const handle = viewerHandleRef.current?.getPlugin();
    if (!handle || !colorModule || pdbText.status !== 'success') return;
    const api = createScriptApi({
      plugin: handle.plugin,
      molScript: handle.molScript,
      colorModule,
      setEchoEntry,
      setRamachandranEntry,
      pdbText: pdbText.data,
    });
    await api.clear();
    await api.resetCamera();
  }, [colorModule, pdbText]);

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

  const viewerReady = pdbText.status === 'success' && colorModule !== null;

  return (
    <div className="animate-page">
      <header className="animate-header">
        <h1>
          Animate <em>(Mol* scripting)</em>
        </h1>
        <p className="animate-tagline">
          Replacement for the legacy JSmol scripting tool — write a short JS
          script, click Run, and watch the structure animate. The helper API on
          the <code>api</code> object is documented in the project README.
        </p>
      </header>
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

      <div className="animate-grid">
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
        <div className="panel animate-editor-panel">
          <div className="animate-editor-header">
            <strong>Script</strong>
            <div className="animate-run-row">
              <button
                type="button"
                onClick={() => setShowHelp((value) => !value)}
              >
                {showHelp ? 'Hide help' : 'Help'}
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
          <Editor value={code} onChange={setCode} />
          {scriptError && <pre className="animate-error">{scriptError}</pre>}
          {showHelp && <AnimateHelp />}
        </div>
      </div>
    </div>
  );
}
