import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import 'molstar/build/viewer/molstar.css';

import type {
  BackgroundName,
  ColorName,
  RepresentationName,
} from './viewerOptions.ts';
import { BACKGROUND_HEX } from './viewerOptions.ts';

interface PdbViewerProps {
  /** Raw PDB-format file contents to render. */
  pdb: string;
  representation: RepresentationName;
  color: ColorName;
  spin: boolean;
  background: BackgroundName;
}

export interface PdbViewerHandle {
  resetCamera: () => void;
}

interface MolstarViewer {
  plugin: {
    builders: {
      data: { rawData: (params: { data: string }) => Promise<unknown> };
      structure: {
        parseTrajectory: (data: unknown, format: 'pdb') => Promise<unknown>;
        hierarchy: {
          applyPreset: (
            trajectory: unknown,
            preset: 'default',
            params: {
              representationPreset: RepresentationName;
              representationPresetParams: { theme: { globalName: ColorName } };
            },
          ) => Promise<unknown>;
        };
      };
    };
    canvas3d?: { setProps: (props: Record<string, unknown>) => void };
    managers: { camera: { reset: () => void } };
    clear: () => Promise<void>;
  };
  dispose: () => void;
}

/**
 * Render a PDB structure with the Mol* viewer.
 * Mol* is loaded via dynamic `import()` so the heavy bundle stays out of the
 * main entry chunk and is only fetched when the browse page is opened.
 * @param props - Component props.
 * @returns Container element that receives the Mol* canvas.
 */
const PdbViewer = forwardRef<PdbViewerHandle, PdbViewerProps>(
  function PdbViewer(props, ref) {
    const { pdb, representation, color, spin, background } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<MolstarViewer | null>(null);
    const [viewerReady, setViewerReady] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        resetCamera: () => {
          viewerRef.current?.plugin.managers.camera.reset();
        },
      }),
      [],
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let disposed = false;

      async function initViewer() {
        try {
          const [{ Viewer }, { PluginConfig }] = await Promise.all([
            import('molstar/lib/apps/viewer/app.js'),
            import('molstar/lib/mol-plugin/config.js'),
          ]);
          if (disposed || !container) return;

          const viewer = (await Viewer.create(container, {
            layoutIsExpanded: false,
            layoutShowControls: false,
            layoutShowRemoteState: false,
            layoutShowSequence: false,
            layoutShowLog: false,
            layoutShowLeftPanel: false,
            viewportShowExpand: false,
            viewportShowControls: false,
            viewportShowSelectionMode: false,
            viewportShowAnimation: false,
            viewportShowTrajectoryControls: false,
            viewportShowSettings: false,
            viewportShowReset: false,
            viewportShowScreenshotControls: false,
            viewportShowToggleFullscreen: false,
            viewportBackgroundColor: '#ffffff',
            // ShowIllumination (sun icon) and ShowXR (VR-headset icon) are not
            // exposed as viewportShow* options; disable them via the raw config.
            config: [
              [PluginConfig.Viewport.ShowIllumination, false],
              [PluginConfig.Viewport.ShowXR, 'never'],
            ],
          })) as unknown as MolstarViewer;

          if (disposed) {
            viewer.dispose();
            return;
          }

          viewerRef.current = viewer;
          setViewerReady(true);
        } catch (error) {
          // eslint-disable-next-line no-console -- surface init failures during dev
          console.error('Mol* viewer failed to initialize', error);
        }
      }

      void initViewer();

      return () => {
        disposed = true;
        viewerRef.current?.dispose();
        viewerRef.current = null;
      };
    }, []);

    useEffect(() => {
      if (!viewerReady) return;
      const viewer = viewerRef.current;
      if (!viewer) return;

      let cancelled = false;

      async function loadStructure() {
        if (!viewer) return;
        const { plugin } = viewer;
        await plugin.clear();
        if (cancelled) return;
        const data = await plugin.builders.data.rawData({ data: pdb });
        if (cancelled) return;
        const trajectory = await plugin.builders.structure.parseTrajectory(
          data,
          'pdb',
        );
        if (cancelled) return;
        await plugin.builders.structure.hierarchy.applyPreset(
          trajectory,
          'default',
          {
            representationPreset: representation,
            representationPresetParams: { theme: { globalName: color } },
          },
        );
      }

      void loadStructure();

      return () => {
        cancelled = true;
      };
    }, [viewerReady, pdb, representation, color]);

    useEffect(() => {
      // Sync the canvas3d trackball state with the React-controlled spin prop —
      // declarative sync against external (Mol*) state, not an event handler.
      /* eslint-disable react-you-might-not-need-an-effect/no-event-handler */
      if (!viewerReady) return;
      const viewer = viewerRef.current;
      viewer?.plugin.canvas3d?.setProps({
        trackball: {
          animate: spin
            ? { name: 'spin', params: { speed: 1, axis: [0, 1, 0] } }
            : { name: 'off', params: {} },
        },
      });
      /* eslint-enable react-you-might-not-need-an-effect/no-event-handler */
    }, [viewerReady, spin]);

    useEffect(() => {
      if (!viewerReady) return;
      let cancelled = false;
      void (async () => {
        const { Color } = await import('molstar/lib/mol-util/color/color.js');
        if (cancelled) return;
        const viewer = viewerRef.current;
        viewer?.plugin.canvas3d?.setProps({
          renderer: {
            backgroundColor: Color.fromRgb(
              (BACKGROUND_HEX[background] >> 16) & 0xff,
              (BACKGROUND_HEX[background] >> 8) & 0xff,
              BACKGROUND_HEX[background] & 0xff,
            ),
          },
        });
      })();
      return () => {
        cancelled = true;
      };
    }, [viewerReady, background]);

    return <div ref={containerRef} className="pdb-viewer-canvas" />;
  },
);

export default PdbViewer;
