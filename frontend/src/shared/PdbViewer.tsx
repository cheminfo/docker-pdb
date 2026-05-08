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

/**
 * Selection target sent from the side tables to the 3D viewer. A `range`
 * selection covers a contiguous residue range on a single chain (helices and
 * sheets); a `ligand` selection covers every residue in the structure with
 * the given 3-letter component label.
 */
export type FocusSpec =
  | { kind: 'ligand'; label: string }
  | { kind: 'range'; chain: string; from: number; to: number };

export interface PdbViewerHandle {
  resetCamera: () => void;
  /** Focus the camera on a structural element and persist its highlight, or clear the selection when given `null`. */
  focus: (spec: FocusSpec | null) => void;
  /**
   * Return the Mol* plugin context plus the lazily-loaded MolScript API,
   * or `null` while the viewer is still initializing. The Animate page uses
   * this to drive Mol* directly from student-written scripts.
   */
  getPlugin: () => { plugin: unknown; molScript: unknown } | null;
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
    managers: {
      camera: {
        reset: () => void;
        focusLoci: (loci: unknown) => void;
      };
      structure: {
        hierarchy: {
          current: {
            structures: Array<{ cell: { obj?: { data: unknown } } }>;
          };
        };
        selection: {
          fromLoci: (modifier: 'set' | 'add' | 'remove', loci: unknown) => void;
          clear: () => void;
        };
      };
    };
    clear: () => Promise<void>;
  };
  dispose: () => void;
}

interface MolScriptApi {
  Script: {
    getStructureSelection: (
      build: (builder: unknown) => unknown,
      structure: unknown,
    ) => unknown;
  };
  StructureSelection: {
    toLociWithSourceUnits: (selection: unknown) => unknown;
  };
  builder: unknown;
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
    const molScriptApiRef = useRef<MolScriptApi | null>(null);
    const [viewerReady, setViewerReady] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        resetCamera: () => {
          viewerRef.current?.plugin.managers.camera.reset();
        },
        focus: (spec) => {
          const viewer = viewerRef.current;
          const api = molScriptApiRef.current;
          if (!viewer || !api) return;

          const { plugin } = viewer;
          if (!spec) {
            plugin.managers.structure.selection.clear();
            plugin.managers.camera.reset();
            return;
          }

          const structure =
            plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj
              ?.data;
          if (!structure) return;

          const selection = api.Script.getStructureSelection(
            buildExpression(spec),
            structure,
          );
          const loci = api.StructureSelection.toLociWithSourceUnits(selection);
          plugin.managers.structure.selection.fromLoci('set', loci);
          plugin.managers.camera.focusLoci(loci);
        },
        getPlugin: () => {
          const viewer = viewerRef.current;
          const api = molScriptApiRef.current;
          if (!viewer || !api) return null;
          return { plugin: viewer.plugin, molScript: api };
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
          const [
            { Viewer },
            { PluginConfig },
            scriptModule,
            structureModule,
            builderModule,
          ] = await Promise.all([
            import('molstar/lib/apps/viewer/app.js'),
            import('molstar/lib/mol-plugin/config.js'),
            import('molstar/lib/mol-script/script.js'),
            import('molstar/lib/mol-model/structure.js'),
            import('molstar/lib/mol-script/language/builder.js'),
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
          molScriptApiRef.current = {
            Script: scriptModule.Script as MolScriptApi['Script'],
            StructureSelection:
              structureModule.StructureSelection as MolScriptApi['StructureSelection'],
            builder: builderModule.MolScriptBuilder,
          };
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
        molScriptApiRef.current = null;
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

/**
 * Build the mol-script expression that selects the residues for a focus
 * spec. The returned function is consumed by `Script.getStructureSelection`,
 * which passes the live MolScriptBuilder as argument.
 * @param spec - Side-table selection target.
 * @returns Builder callback returning a mol-script `atomGroups` expression.
 */
function buildExpression(spec: FocusSpec) {
  return (builder: unknown) => {
    // The builder is the MolScriptBuilder; treat it as a loose record so we
    // don't have to import its (large) type here.
    /* eslint-disable @typescript-eslint/naming-convention -- mmCIF property names mandated by Mol* MolScript */
    const Q = builder as {
      struct: {
        generator: { atomGroups: (params: Record<string, unknown>) => unknown };
        atomProperty: {
          macromolecular: {
            auth_comp_id: () => unknown;
            auth_asym_id: () => unknown;
            auth_seq_id: () => unknown;
          };
        };
      };
      core: {
        rel: {
          eq: (args: [unknown, unknown]) => unknown;
          inRange: (args: [unknown, number, number]) => unknown;
        };
      };
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    if (spec.kind === 'ligand') {
      return Q.struct.generator.atomGroups({
        'residue-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_comp_id(),
          spec.label,
        ]),
      });
    }
    return Q.struct.generator.atomGroups({
      'chain-test': Q.core.rel.eq([
        Q.struct.atomProperty.macromolecular.auth_asym_id(),
        spec.chain,
      ]),
      'residue-test': Q.core.rel.inRange([
        Q.struct.atomProperty.macromolecular.auth_seq_id(),
        spec.from,
        spec.to,
      ]),
    });
  };
}

export default PdbViewer;
