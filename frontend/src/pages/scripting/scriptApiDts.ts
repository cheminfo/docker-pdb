/**
 * Ambient TypeScript declarations Monaco loads as `extraLib`. They describe
 * the three globals scripts on the Scripting page see (`text`, `delay`,
 * `MolStar`) using the synchronous-looking surface — `rewriteAwait.ts`
 * inserts `await` for the user, so hovers and completions advertise
 * `void` returns rather than `Promise<void>`.
 *
 * The declarations are written by hand (rather than imported from
 * `MolStar.ts`) so they live as a script-mode `.d.ts` and become
 * globals inside the Monaco worker. Keep this file in sync with
 * `MolStar.ts` whenever the runtime API changes.
 */
export const SCRIPT_API_DTS = `
/** Raw PDB text of the loaded structure. */
declare const text: string;

/** Pause the script. \`delay(2)\` waits two seconds. */
declare function delay(seconds: number): void;

/** Color helpers accept any of these shapes. */
type ColorSpec =
  | string
  | { value: string }
  | {
      model:
        | 'element'
        | 'chain'
        | 'residue'
        | 'sequence'
        | 'hydrophobicity'
        | 'molecule-type'
        | 'structure'
        | 'atoms';
    }
  | { color: ColorSpec; alpha: number };

interface EchoOptions {
  position?: 'top' | 'middle' | 'bottom';
  size?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

interface LabelOptions {
  /** Size factor (multiplier on the default 3D text size). */
  size?: number;
  /** Render text in bold. */
  bold?: boolean;
  /** Render text in italic. */
  italic?: boolean;
  /** Uniform CSS color for the text (name or \`#rrggbb\` / \`#rgb\`). */
  color?: string;
}

interface RotateOptions {
  /** Rotation axis. @default 'y' */
  axis?: 'x' | 'y' | 'z';
  /** Total rotation, in degrees. @default 360 */
  degrees?: number;
  /** Rotation speed, in degrees per second. @default 60 */
  speed?: number;
}

/**
 * Animation options for camera moves (\`selection.focus\` and
 * \`selection.zoom\`). \`seconds\` is the tween duration — omit (or pass
 * \`0\`) for an instant snap.
 */
interface CameraTransitionOptions {
  /** Tween duration in seconds. @default 0 */
  seconds?: number;
}

interface SizeOptions {
  /** Multiplier on the default sizing (e.g. ×Van der Waals radius for atoms). */
  value: number;
}

/** Per-region counts returned by \`pdb.dihedralStats()\`. */
interface DihedralStats {
  /** Residues with all three of φ / ψ / ω defined (the only ones counted). */
  total: number;
  /** Residues whose (φ, ψ) lies in the right-handed α-helix region. */
  helix: number;
  /** Residues whose (φ, ψ) lies in the β-sheet region. */
  sheet: number;
  /** Residues classified as coil. */
  coil: number;
  /** Peptide bonds with |ω| < 30° (cis). */
  cis: number;
  /** Peptide bonds with |ω| > 150° (trans). */
  trans: number;
}

interface VisibilityToggle<T> {
  show(): T;
  hide(): T;
}

/** Sphere channel — covers each atom of the selection. */
interface AtomsChannel extends VisibilityToggle<AtomsChannel> {
  /** Recolor (creates the spheres on first call). */
  color(spec: ColorSpec): AtomsChannel;
  /** Set sphere size factor. */
  radius(options: SizeOptions): AtomsChannel;
}

/** Bond cylinder channel. */
interface BondsChannel extends VisibilityToggle<BondsChannel> {
  /** Recolor (creates the cylinders on first call). */
  color(spec: ColorSpec): BondsChannel;
  /** Set bond cylinder size factor. */
  diameter(value: number): BondsChannel;
}

/** Cartoon / ribbon channel for protein backbone. */
interface RibbonChannel extends VisibilityToggle<RibbonChannel> {
  /** Recolor (creates the ribbon on first call). */
  color(spec: ColorSpec): RibbonChannel;
  /**
   * Switch to Mol*'s \`putty\` representation — a uniform polymer tube
   * that ignores secondary-structure annotations, so helices and β-strands
   * render as plain coil. Useful to show the backbone shape without
   * revealing where the helices and sheets sit.
   */
  tube(): RibbonChannel;
  /** Switch back to the standard SS-aware cartoon (the default). */
  cartoon(): RibbonChannel;
}

/** Solvent-accessible surface channel. */
interface SurfaceChannel extends VisibilityToggle<SurfaceChannel> {
  /** Recolor (creates a solid surface unless \`dots()\` ran first). */
  color(spec: ColorSpec): SurfaceChannel;
  /** Switch to a dotted Gaussian surface (subsequent \`color()\` keeps it). */
  dots(): SurfaceChannel;
}

/**
 * Hydrogen-bond channel. Detects H-bond pairs within the selection via
 * Mol*'s chemistry-aware \`computeInteractions\` (donor type, acceptor
 * type, geometric scoring — backbone *and* side chain) and renders them
 * as Mol*-styled dashed cylinders. Default: yellow, \`diameter\` 0.3.
 */
interface HbondsChannel extends VisibilityToggle<HbondsChannel> {
  /** Recolor (creates the lines on first call). Default \`{ value: 'yellow' }\`. */
  color(spec: ColorSpec): HbondsChannel;
  /** Set the line size factor. Default \`0.3\`. */
  diameter(value: number): HbondsChannel;
}

/** Per-line options for \`distances.to(other, options?)\`. */
interface DistanceToOptions {
  /** Color for this line — falls back to the channel default. */
  color?: ColorSpec;
  /** Line size factor for this line — falls back to the channel default. */
  diameter?: number;
  /** Override the auto-generated distance text. Pass \`''\` to hide it. */
  customText?: string;
}

/** Mol* \`extensions/interactions\` interaction kinds. */
type InteractionKind =
  | 'hydrogen-bond'
  | 'weak-hydrogen-bond'
  | 'hydrophobic'
  | 'pi-stacking'
  | 'cation-pi'
  | 'halogen-bond'
  | 'ionic'
  | 'metal-coordination'
  | 'covalent'
  | 'unknown';

/** Options for \`selection.contactsWith(other, options?)\`. */
interface ContactsOptions {
  /**
   * Which interaction kinds to render. Defaults to every chemistry kind
   * the extension produces. Pass e.g. \`['hydrogen-bond']\` to filter.
   */
  kinds?: InteractionKind[];
}

/**
 * Distances channel. Each \`to(other, options?)\` adds one labeled distance
 * line. \`color\` / \`diameter\` set the default for subsequent \`.to(...)\`
 * calls; existing lines keep their original style.
 */
interface DistancesChannel extends VisibilityToggle<DistancesChannel> {
  /** Default color for subsequent \`to(...)\` lines. */
  color(spec: ColorSpec): DistancesChannel;
  /** Default size factor for subsequent \`to(...)\` lines. */
  diameter(value: number): DistancesChannel;
  /** Add one labeled distance line to \`other\`. */
  to(other: Selection, options?: DistanceToOptions): DistancesChannel;
}

interface MolStarAtom {
  serial: number;
  name: string;
  element: string;
  resName: string;
  resNum: number;
  chainId: string;
  x: number;
  y: number;
  z: number;
  altLoc: string;
}

interface MolStarResidue {
  resName: string;
  resNum: number;
  chainId: string;
}

interface SecondaryStructureRange {
  chainId: string;
  fromResNum: number;
  toResNum: number;
}

/**
 * Selection returned by \`pdb.select(...)\`. Channel objects let you build a
 * representation incrementally; chained methods cover camera, labels and
 * measurements.
 */
interface Selection extends VisibilityToggle<Selection> {
  readonly atoms: AtomsChannel;
  readonly bonds: BondsChannel;
  readonly ribbon: RibbonChannel;
  readonly surface: SurfaceChannel;
  readonly hbonds: HbondsChannel;
  readonly distances: DistancesChannel;
  /** Sub-select within this selection (intersection with \`expression\`). */
  select(expression: string): Selection;
  /**
   * Add a residue/element/chain label overlay. The template can reference
   * \`\${atom.*}\`, \`\${residue.*}\` or \`\${chain.*}\` paths. \`options\`
   * mirror \`ms.echo(...)\`'s font preferences (\`size\`, \`bold\`,
   * \`italic\`, \`color\`); \`size\` is a Mol* size-factor multiplier on the
   * default 3D text size.
   */
  label(template: string, options?: LabelOptions): void;
  /**
   * Zoom + center the camera on this selection's bounding sphere. Pass
   * \`{ seconds }\` to animate the move over that duration; omit for an
   * instant snap.
   */
  focus(options?: CameraTransitionOptions): void;
  /**
   * Center + frame the camera on this selection's bounding sphere. \`factor\`
   * is the fraction (0–1) of the viewport the sphere should occupy
   * (default 0.75). Pass \`{ seconds }\` to animate the move — useful for
   * a slow cinematic zoom-in onto a small feature.
   */
  zoom(factor?: number, options?: CameraTransitionOptions): void;
  /** Draw a labeled distance line to the centroid of \`other\`. */
  distance(other: Selection): void;
  /**
   * Compute and render contacts between this selection and \`other\` via
   * Mol*'s chemistry-aware \`extensions/interactions\` pipeline. Coloured
   * per interaction kind. Best for inter-molecular cases (e.g. ligand
   * binding sites). For intra-chain backbone H-bonds use
   * \`selection.hbonds.show()\` — Mol*'s \`ComputeContacts\` hardcodes
   * \`skipIntraContacts: true\`.
   */
  contactsWith(other: Selection, options?: ContactsOptions): void;
}

/** Handle on a loaded PDB structure, returned by \`ms.loadPDB(text)\`. */
interface PDB {
  readonly text: string;
  readonly atoms: readonly MolStarAtom[];
  readonly residues: readonly MolStarResidue[];
  readonly chains: readonly string[];
  readonly ligands: readonly string[];
  /**
   * Inclusive residue ranges declared by every \`HELIX\` record. One entry
   * per record (≈ one entry per α-helix), in source order.
   */
  readonly helices: readonly SecondaryStructureRange[];
  /**
   * Inclusive residue ranges declared by every \`SHEET\` record. One entry
   * per record (≈ one entry per β-strand — a single β-sheet contains
   * several entries), in source order.
   */
  readonly sheets: readonly SecondaryStructureRange[];
  /** Selection covering every atom of the structure. */
  readonly all: Selection;
  /** Empty selection — matches no atoms. */
  readonly none: Selection;
  /**
   * Parse a JSmol-style selection expression. Supports atomic forms such as
   * \`"PLP"\`, \`"[CYS]"\`, \`"[CYS].CA"\` (or \`"CYS.CA"\`),
   * \`".CA"\`, \`"_C"\` (element symbol), \`":A"\` (whole chain),
   * \`"108-122:A"\`, \`"119:A"\`, plus the keyword groups
   * \`protein\` / \`ligand\` / \`water\` / \`nucleic\` / \`polymer\` /
   * \`hetero\` / \`helix\` / \`sheet\` / \`backbone\` / \`sidechain\`,
   * the operators \`and\` / \`or\` / \`not\`, \`within X of …\`, and
   * parentheses.
   */
  select(expression: string): Selection;
  /**
   * Build a synthetic PDB string with one Cα per residue at \`(φ, ψ, ω)\`
   * in degrees. Three short axis chains (\`X\` / \`Y\` / \`Z\`, residue names
   * \`XAX\` / \`YAX\` / \`ZAX\`) are embedded with \`CONECT\` records. Pass
   * to \`pdb.createModel('rama', { pdb: … })\` to swap the protein view for
   * the dihedral-space cloud.
   */
  ramachandranPdb(): string;
  /**
   * Tally α-helix / β-sheet / coil residues and cis / trans peptide bonds
   * across the structure.
   */
  dihedralStats(): DihedralStats;
  /**
   * Create a named view of the structure. The active model's PDB is
   * inherited unless \`{ pdb }\` overrides it. \`{ camera }\` chooses the
   * projection used while this model is active — \`'orthographic'\` removes
   * perspective foreshortening (atoms render at the same on-screen size
   * regardless of depth), \`'perspective'\` is Mol*'s default. The op log
   * of the new model starts empty — re-paint anything you want visible.
   * The new model becomes active and \`pdb\` follows it; channel calls
   * record into this model. Returns the same \`pdb\` handle.
   */
  createModel(
    name: string,
    options?: { pdb?: string; camera?: 'perspective' | 'orthographic' },
  ): PDB;
  /**
   * Activate a previously-created model. Tears down current \`scripting\`
   * representations, reloads Mol* when the target's PDB differs, then
   * replays the target's op log. Returns the same \`pdb\` handle.
   */
  switchModel(name: string): PDB;
  /** Active model name (defaults to \`'initial'\`). */
  currentModel(): string;
  /** Delete a model. \`'initial'\` cannot be deleted. */
  deleteModel(name: string): void;
  /** List every registered model name in creation order. */
  listModels(): readonly string[];
}

/**
 * The viewer instance. Construct with \`const ms = new MolStar()\`.
 */
declare class MolStar {
  /** Parse PDB text and return a structure handle. */
  loadPDB(text: string): PDB;
  /** Spin the camera, or stop with \`"off"\`. */
  spin(axis: 'x' | 'y' | 'z' | 'off', speedDegreesPerSecond?: number): void;
  /**
   * Rotate the camera by a finite number of degrees. Returns once the
   * rotation is finished. Defaults: axis \`'y'\`, 360°, 60 deg/s.
   */
  rotate(options?: RotateOptions): void;
  /** Reset to the default Mol* view. */
  resetCamera(): void;
  /**
   * Frame every atom of the currently-loaded structure with a comfortable
   * margin. \`factor\` is the fraction (0–1) of the viewport the bounding
   * sphere should fill (default \`0.85\`). Pins the camera so subsequent
   * rep additions don't undo the framing. Pass \`{ seconds }\` to animate.
   */
  fit(factor?: number, options?: CameraTransitionOptions): void;
  /** Show / hide Mol*'s yellow halos around the persistent selection. */
  selectionHalos(on: boolean): void;
  /** Show a text overlay on the canvas (independent of any molecule). */
  echo(text: string, options?: EchoOptions): void;
  /** Remove the current echo overlay. */
  clearEcho(): void;
  /** Wipe every representation/measurement/echo. Called automatically before each Run. */
  clear(): void;
  /**
   * Restore the freshly-loaded view: clear every script-added representation
   * and measurement, drop the persistent selection, and reset the camera to
   * Mol*'s initial auto-frame (center, zoom, orientation).
   */
  reset(): void;
  /**
   * Hide every component Mol* added through its default preset (polymer
   * cartoon, ligand ball-and-stick, water spheres). Channel-created
   * components are untouched. Use at the start of a scene that wants full
   * control of the canvas.
   */
  hideDefaults(): void;
  /** Re-show whatever \`hideDefaults()\` hid. */
  showDefaults(): void;

  /**
   * Hierarchical visibility aggregators — each one toggles every cell of
   * that kind across every selection without dropping color/size state,
   * so a later \`.show()\` restores the exact prior visual.
   */
  readonly atoms: MsKindToggle;
  readonly bonds: MsKindToggle;
  readonly ribbon: MsKindToggle;
  readonly surface: MsKindToggle;
  readonly label: MsKindToggle;
  readonly hbonds: MsKindToggle;
  readonly distances: MsKindToggle;
  readonly contacts: MsKindToggle;

  /**
   * Add a 3D arrow primitive (shaft + cone head) between \`from\` and \`to\`
   * (in Å, world coordinates). Recorded into the active model's op log so
   * it replays on \`switchModel\`. Defaults: \`radius: 0.4\`,
   * \`headLength: 4 × radius\`, \`headRadius: 2.4 × radius\`.
   */
  arrow(
    from: readonly [number, number, number],
    to: readonly [number, number, number],
    options?: {
      radius?: number;
      color?: string;
      label?: string;
      headLength?: number;
      headRadius?: number;
    },
  ): void;
  /** Add a uniform-radius cylinder primitive between \`from\` and \`to\`. */
  cylinder(
    from: readonly [number, number, number],
    to: readonly [number, number, number],
    options?: { radius?: number; color?: string; label?: string },
  ): void;
  /** Add a sphere primitive centred at \`center\`. */
  sphere(
    center: readonly [number, number, number],
    options?: { radius?: number; color?: string; label?: string },
  ): void;
  /**
   * Draw arbitrary 3D text at a world-coordinate position. Use this for
   * axis labels and any other free-floating annotation Mol*'s residue-
   * anchored label can't express (e.g. Greek letters: \`'φ'\`, \`'ψ'\`,
   * \`'ω'\`).
   */
  text(
    position: readonly [number, number, number],
    text: string,
    options?: {
      color?: string;
      size?: number;
      bold?: boolean;
      italic?: boolean;
      label?: string;
    },
  ): void;
}

interface MsKindToggle {
  show(): void;
  hide(): void;
}
`;
