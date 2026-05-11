import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
  Tooltip,
} from '@blueprintjs/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import FloatingWindow from '../../shared/FloatingWindow.tsx';
import type { PdbViewerHandle } from '../../shared/PdbViewer.tsx';
import PdbViewer from '../../shared/PdbViewer.tsx';
import Splitter from '../../shared/Splitter.tsx';
import { fetchPdbText } from '../../shared/api/client.ts';
import { useAsync } from '../../shared/useAsync.ts';

import type { EchoEntry } from './EchoOverlay.tsx';
import EchoOverlay from './EchoOverlay.tsx';
import Editor from './Editor.tsx';
import type { Delay } from './MolStar.ts';
import { createMolStarClass } from './MolStar.ts';
import ScriptingHelp from './ScriptingHelp.tsx';
import { applyScriptingLoadDefaults } from './applyLoadDefaults.ts';
import type { ScriptApi } from './helpers.ts';
import { createScriptApi } from './helpers.ts';
import type {
  InteractionsApi,
  LociHelpers,
  PluginContext,
  ShapesApi,
  StructureElementApi,
} from './molstarTypes.ts';
import { runScript } from './runScript.ts';
import { DEFAULT_SCENE_CODE, SCENES } from './scenes.ts';
import { useCanvasRecording } from './useCanvasRecording.ts';

const DEFAULT_PDB_ID = '8ZXR';

interface ColorModule {
  Color: (hex: number) => unknown;
}

/**
 * Page mounted at `/scripting` and `/scripting/:pdbId`. Lets students write a small JS script using
 * a curated helper API (`api.cpk`, `api.cartoon`, `api.echo`, …) that
 * drives the Mol* viewer. Replaces the legacy JSmol-based teaching tool.
 * @returns The Scripting page React element.
 */
export default function ScriptingPage() {
  const { pdbId: routePdbId } = useParams<{ pdbId?: string }>();
  const navigate = useNavigate();
  const urlPdbId = (routePdbId?.trim() || DEFAULT_PDB_ID).toUpperCase();
  // Track the `:pdbId` route param so navigating from Browse with a different
  // entry re-seeds the toolbar input and the loaded structure (the route
  // stays mounted across path-only navigations).
  const [trackedUrlPdbId, setTrackedUrlPdbId] = useState(urlPdbId);
  const [pdbId, setPdbId] = useState(urlPdbId);
  const [loadedId, setLoadedId] = useState(urlPdbId);
  if (trackedUrlPdbId !== urlPdbId) {
    setTrackedUrlPdbId(urlPdbId);
    setPdbId(urlPdbId);
    setLoadedId(urlPdbId);
  }
  const [code, setCode] = useState(DEFAULT_SCENE_CODE);
  const [echoEntry, setEchoEntry] = useState<EchoEntry | null>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [colorModule, setColorModule] = useState<ColorModule | null>(null);
  const [lociHelpers, setLociHelpers] = useState<LociHelpers | null>(null);
  const [structureElement, setStructureElement] =
    useState<StructureElementApi | null>(null);
  const [interactions, setInteractions] = useState<InteractionsApi | null>(
    null,
  );
  const [shapes, setShapes] = useState<ShapesApi | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const recording = useCanvasRecording();

  const viewerHandleRef = useRef<PdbViewerHandle | null>(null);
  // Tracks the PDB text Mol* currently has loaded. Persists across script
  // Runs so `api.clear()` can detect that a previous run left a swapped
  // structure and restore the original.
  const loadedPdbRef = useRef<string>('');
  // Controls cancellation of the currently-running script. The Stop button
  // calls `abort()`; the per-run `delay` then rejects with AbortError.
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTask = useCallback(() => fetchPdbText(loadedId), [loadedId]);
  const pdbText = useAsync(fetchTask);

  useEffect(() => {
    // Mirror Mol*'s currently-loaded structure into a ref so the next script
    // Run can detect (and undo) any swap a previous Run left behind. PdbViewer
    // owns the actual reload; we only track the source of truth from outside,
    // not handle a click event.
    /* eslint-disable react-you-might-not-need-an-effect/no-event-handler */
    if (pdbText.status === 'success') {
      loadedPdbRef.current = pdbText.data;
    }
    /* eslint-enable react-you-might-not-need-an-effect/no-event-handler */
  }, [pdbText]);

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
    void import('molstar/lib/mol-model/structure.js').then((module_) => {
      if (cancelled) return;
      setStructureElement({
        Loci: {
          isEmpty: (loci) =>
            module_.StructureElement.Loci.isEmpty(loci as never),
          toStructure: (loci) =>
            module_.StructureElement.Loci.toStructure(loci as never),
        },
        Bundle: {
          fromLoci: (loci) =>
            module_.StructureElement.Bundle.fromLoci(loci as never),
        },
        Location: {
          create: (structure, unit, element) =>
            module_.StructureElement.Location.create(
              structure as never,
              unit as never,
              element as never,
            ),
        },
      });
    });
    // The `shapes.ts` module brings in the heavy `mol-geo` / `mol-model/shape`
    // chain — lazy-load it so the bundle stays small for pages that never
    // render a scripting scene with custom shapes.
    void Promise.all([import('./shapes.ts'), import('./textShape.ts')]).then(
      ([shapesModule, textShapeModule]) => {
        if (cancelled) return;
        setShapes({
          addShape: shapesModule.addShape,
          addTextShape: textShapeModule.addTextShape,
        });
      },
    );
    void Promise.all([
      import('molstar/lib/extensions/interactions/transforms.js'),
      import('molstar/lib/mol-plugin-state/transforms/model.js'),
      import('molstar/lib/mol-plugin-state/transforms/representation.js'),
      import('molstar/lib/mol-model-props/computed/interactions/interactions.js'),
      import('molstar/lib/mol-model-props/computed/interactions/common.js'),
      import('molstar/lib/mol-task/index.js'),
      import('molstar/lib/mol-util/assets.js'),
      import('molstar/lib/mol-model/structure.js'),
    ]).then(
      ([
        interactionsModule,
        modelModule,
        representationModule,
        computeInteractionsModule,
        commonModule,
        taskModule,
        assetsModule,
        structureModule,
      ]) => {
        if (cancelled) return;
        setInteractions({
          ComputeContacts: interactionsModule.ComputeContacts,
          CustomInteractions: interactionsModule.CustomInteractions,
          InteractionsShape: interactionsModule.InteractionsShape,
          MultiStructureSelectionFromBundle:
            modelModule.MultiStructureSelectionFromBundle,
          ShapeRepresentation3D: representationModule.ShapeRepresentation3D,
          computeInteractions:
            computeInteractionsModule.computeInteractions as unknown as InteractionsApi['computeInteractions'],
          AssetManager: assetsModule.AssetManager,
          Task: taskModule.Task,
          InteractionType: {
            HydrogenBond: commonModule.InteractionType.HydrogenBond,
            WeakHydrogenBond: commonModule.InteractionType.WeakHydrogenBond,
          },
          // FeatureType is a `const enum` (inlined at compile time in Mol*),
          // so it isn't available at runtime. Reproduce the constants we
          // touch from `mol-model-props/computed/interactions/common.ts`.
          FeatureType: {
            HydrogenDonor: 4,
            HydrogenAcceptor: 5,
            WeakHydrogenDonor: 9,
          },
          /* eslint-disable camelcase -- Mol* mmCIF accessor names */
          StructureProperties: {
            chain: {
              auth_asym_id: (location) =>
                structureModule.StructureProperties.chain.auth_asym_id(
                  location as never,
                ),
            },
            residue: {
              auth_seq_id: (location) =>
                structureModule.StructureProperties.residue.auth_seq_id(
                  location as never,
                ),
            },
            atom: {
              auth_atom_id: (location) =>
                structureModule.StructureProperties.atom.auth_atom_id(
                  location as never,
                ),
            },
          },
          /* eslint-enable camelcase */
        });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRun = useCallback(
    async (afterReset?: () => void | Promise<void>) => {
      setScriptError(null);
      const handle = viewerHandleRef.current?.getPlugin();
      if (
        !handle ||
        !colorModule ||
        !lociHelpers ||
        !structureElement ||
        !interactions ||
        !shapes ||
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
        structureElement,
        interactions,
        shapes,
        setEchoEntry,
        pdbText: pdbText.data,
        loadedPdbRef,
        setSwapping,
      });
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const cancellableDelay = makeCancellableDelay(controller.signal);
      // Script-facing api throws AbortError on the first call after Stop, so
      // the script can't continue running synchronous commands (and re-arming
      // spin/rotate) between `await delay()`s.
      const scriptApi = makeAbortAwareApi(api, controller.signal);
      const MolStar = createMolStarClass(scriptApi);
      setStopping(false);
      setRunning(true);
      setEchoEntry(null);
      await api.reset();
      // Recording starts here so the first captured frame is the freshly
      // reset structure, not whatever a previous run left on screen.
      await afterReset?.();
      const { error } = await runScript({
        api: scriptApi,
        text: pdbText.data,
        MolStar,
        delay: cancellableDelay,
        body: code,
        signal: controller.signal,
      });
      abortControllerRef.current = null;
      setRunning(false);
      if (error) setScriptError(error.message);
    },
    [
      code,
      colorModule,
      lociHelpers,
      structureElement,
      interactions,
      shapes,
      pdbText,
    ],
  );

  const handleStop = useCallback(() => {
    setStopping(true);
    abortControllerRef.current?.abort();
    // The abort signal only unblocks the script at the next `await delay()`;
    // anything Mol* is animating on its own (a spin/rotate the script left
    // running) keeps going until we explicitly turn the trackball off here.
    viewerHandleRef.current?.stopAnimations();
  }, []);

  const handleRecord = useCallback(async () => {
    setScriptError(null);
    const canvas = viewerHandleRef.current?.getCanvas();
    if (!canvas) {
      setScriptError('Viewer is still initializing.');
      return;
    }
    let started = false;
    try {
      await handleRun(() => {
        recording.start(canvas);
        started = true;
      });
    } catch (error) {
      setScriptError(
        error instanceof Error ? error.message : 'Recording failed to start.',
      );
    } finally {
      if (started) recording.stop();
    }
  }, [handleRun, recording]);

  const handleReset = useCallback(async () => {
    setScriptError(null);
    setEchoEntry(null);
    const handle = viewerHandleRef.current?.getPlugin();
    if (
      !handle ||
      !colorModule ||
      !lociHelpers ||
      !structureElement ||
      !interactions ||
      !shapes ||
      pdbText.status !== 'success'
    ) {
      return;
    }
    const api = createScriptApi({
      plugin: handle.plugin,
      molScript: handle.molScript,
      colorModule,
      lociHelpers,
      structureElement,
      interactions,
      shapes,
      setEchoEntry,
      pdbText: pdbText.data,
      loadedPdbRef,
      setSwapping,
    });
    // `api.reset()` does the full restore: clear every script-added
    // representation, drop the persistent selection, AND snap the camera
    // back to the canonical (+Z, +Y up) frame. The earlier
    // `clear() + resetCamera()` pair preserved any rotation left behind
    // by spin/rotate/drag because Mol*'s default reset keeps the
    // camera's current direction and up.
    await api.reset();
  }, [
    colorModule,
    lociHelpers,
    structureElement,
    interactions,
    shapes,
    pdbText,
  ]);

  function handleLoadPdb() {
    const trimmed = pdbId.trim().toUpperCase();
    if (!trimmed) return;
    setLoadedId(trimmed);
    setEchoEntry(null);
    setScriptError(null);
    // Sync the URL so the current entry can be shared as a deep link. The
    // `trackedUrlPdbId` guard above prevents this from looping back into a
    // redundant state update once the route param matches.
    void navigate(`/scripting/${encodeURIComponent(trimmed)}`);
  }

  function pickScene(sceneCode: string) {
    setCode(sceneCode);
    setEchoEntry(null);
    setScriptError(null);
  }

  const viewerReady =
    pdbText.status === 'success' &&
    colorModule !== null &&
    lociHelpers !== null &&
    structureElement !== null &&
    interactions !== null &&
    shapes !== null;

  const viewerPane = (
    <Card className="panel scripting-viewer-panel">
      {pdbText.status === 'loading' && (
        <p className="placeholder">Loading {loadedId}…</p>
      )}
      {pdbText.status === 'error' && (
        <p className="placeholder">
          Could not load {loadedId}: {pdbText.error.message}
        </p>
      )}
      {pdbText.status === 'success' && (
        <div
          className={
            swapping
              ? 'scripting-viewer-stack scripting-viewer-stack--swapping'
              : 'scripting-viewer-stack'
          }
        >
          <PdbViewer
            ref={viewerHandleRef}
            pdb={pdbText.data}
            representation="auto"
            spin={false}
            background="white"
            onPresetApplied={(plugin) =>
              applyScriptingLoadDefaults(plugin as PluginContext)
            }
          />
          <EchoOverlay entry={echoEntry} />
        </div>
      )}
    </Card>
  );

  const editorPane = (
    <Card className="panel scripting-editor-panel">
      <div className="scripting-editor-header">
        <strong>Script</strong>
        <ButtonGroup>
          <Button icon="help" onClick={() => setShowHelp(true)}>
            Help
          </Button>
          <Button
            icon="reset"
            onClick={() => void handleReset()}
            disabled={!viewerReady || running}
          >
            Reset
          </Button>
          <Tooltip
            content="Run the script and download a video of the animation"
            placement="bottom"
          >
            <Button
              icon="record"
              intent={Intent.DANGER}
              variant="outlined"
              onClick={() => void handleRecord()}
              disabled={!viewerReady || running}
            >
              Record
            </Button>
          </Tooltip>
          {running ? (
            <Button
              icon="stop"
              intent={Intent.DANGER}
              onClick={handleStop}
              disabled={stopping}
              loading={stopping}
            >
              {stopping ? (
                'Stopping…'
              ) : recording.recording ? (
                <span className="scripting-record-label">
                  <span className="scripting-record-dot" />
                  Stop &amp; save
                </span>
              ) : (
                'Stop'
              )}
            </Button>
          ) : (
            <Button
              icon="play"
              intent={Intent.PRIMARY}
              onClick={() => void handleRun()}
              disabled={!viewerReady}
            >
              Run
            </Button>
          )}
        </ButtonGroup>
      </div>
      <div className="scripting-editor-frame">
        <Editor value={code} onChange={setCode} height="100%" />
      </div>
      {scriptError && <pre className="scripting-error">{scriptError}</pre>}
    </Card>
  );

  return (
    <div className="scripting-page">
      <Card className="scripting-toolbar panel">
        <FormGroup
          label="PDB code"
          inline
          className="scripting-pdb-input"
          contentClassName="scripting-pdb-input-control"
        >
          <InputGroup
            value={pdbId}
            onValueChange={setPdbId}
            onKeyDown={(event) => event.key === 'Enter' && handleLoadPdb()}
            maxLength={4}
            placeholder="1ART"
            size="small"
          />
        </FormGroup>
        <Button icon="cloud-download" onClick={handleLoadPdb}>
          Load
        </Button>
        <Divider />
        {SCENES.map((scene) => (
          <Button
            key={scene.id}
            variant="minimal"
            size="small"
            onClick={() => pickScene(scene.code)}
          >
            {scene.label}
          </Button>
        ))}
      </Card>

      <div className="scripting-content">
        <Splitter left={viewerPane} right={editorPane} />
      </div>

      {showHelp && (
        <FloatingWindow
          title="Scripting reference"
          onClose={() => setShowHelp(false)}
          initialWidth={680}
          initialHeight={560}
        >
          <ScriptingHelp />
        </FloatingWindow>
      )}
    </div>
  );
}

/**
 * Wrap a `ScriptApi` in a Proxy that throws `AbortError` from every method
 * call once the given signal aborts. Without this, Stop only interrupts the
 * script at the next `await delay(...)`: any synchronous block in between
 * (e.g. `ms.spin(); ms.echo(...); ms.cpk();`) still runs, and if any of those
 * re-arm a trackball animation the molecule keeps moving after Stop. With
 * the proxy in place the *next* method call on the script-facing surface
 * throws, `runScript` recognises the abort, and the script unwinds.
 * @param api - The real script api bound to the Mol* plugin.
 * @param signal - Abort signal owned by the current run.
 * @returns A drop-in proxy with the same shape as `api`.
 */
function makeAbortAwareApi(api: ScriptApi, signal: AbortSignal): ScriptApi {
  return new Proxy(api, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver) as unknown;
      if (typeof value !== 'function') return value;
      return (...args: unknown[]) => {
        if (signal.aborted) {
          throw new DOMException('Script stopped', 'AbortError');
        }
        return Reflect.apply(
          value as (...callArgs: unknown[]) => unknown,
          target,
          args,
        );
      };
    },
  });
}

function makeCancellableDelay(signal: AbortSignal): Delay {
  return (seconds) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException('Script stopped', 'AbortError'));
        return;
      }
      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException('Script stopped', 'AbortError'));
      };
      const timer = setTimeout(
        () => {
          signal.removeEventListener('abort', onAbort);
          resolve();
        },
        Math.max(0, seconds) * 1000,
      );
      signal.addEventListener('abort', onAbort, { once: true });
    });
}
