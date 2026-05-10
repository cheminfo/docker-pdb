/**
 * Ambient TypeScript declarations Monaco loads as `extraLib`. They describe
 * the three globals scripts on the Animate page see (`text`, `delay`,
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

interface RamachandranOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  highlight?: string[];
}

interface RotateOptions {
  /** Rotation axis. @default 'y' */
  axis?: 'x' | 'y' | 'z';
  /** Total rotation, in degrees. @default 360 */
  degrees?: number;
  /** Rotation speed, in degrees per second. @default 60 */
  speed?: number;
}

interface SizeOptions {
  /** Multiplier on the default sizing (e.g. ×Van der Waals radius for atoms). */
  value: number;
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
}

/** Solvent-accessible surface channel. */
interface SurfaceChannel extends VisibilityToggle<SurfaceChannel> {
  /** Recolor (creates a solid surface unless \`dots()\` ran first). */
  color(spec: ColorSpec): SurfaceChannel;
  /** Switch to a dotted Gaussian surface (subsequent \`color()\` keeps it). */
  dots(): SurfaceChannel;
}

/**
 * Hydrogen-bond channel. Computes backbone N…O hydrogen bonds within the
 * selection (distance 2.5–3.5 Å, |Δresidue| > 1) and renders them as
 * Mol*-managed dashed lines. Default style: yellow, diameter 0.3.
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
  /** Zoom + center the camera on this selection's bounding sphere. */
  focus(): void;
  /**
   * Center + frame the camera on this selection's bounding sphere. \`factor\`
   * is the fraction (0–1) of the viewport the sphere should occupy
   * (default 0.75).
   */
  zoom(factor?: number): void;
  /** Draw a labeled distance line to the centroid of \`other\`. */
  distance(other: Selection): void;
}

/** Handle on a loaded PDB structure, returned by \`ms.loadPDB(text)\`. */
interface PDB {
  readonly text: string;
  readonly atoms: readonly MolStarAtom[];
  readonly residues: readonly MolStarResidue[];
  readonly chains: readonly string[];
  readonly ligands: readonly string[];
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
  /** Show a Ramachandran (φ × ψ) plot plus an ω plot overlay. */
  ramachandran(options?: RamachandranOptions): void;
  /** Remove the Ramachandran overlay. */
  clearRamachandran(): void;
  /**
   * Create a named view of the structure. Clones the active model's PDB and
   * op log; pass \`{ pdb }\` to load a synthetic structure instead. The new
   * model becomes active and \`pdb\` follows it — channel calls now record
   * into this model. Returns the same \`pdb\` handle.
   */
  createModel(name: string, options?: { pdb?: string }): PDB;
  /**
   * Activate a previously-created model. Tears down current \`animate\`
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
  /** Show / hide Mol*'s yellow halos around the persistent selection. */
  selectionHalos(on: boolean): void;
  /** Show a text overlay on the canvas (independent of any molecule). */
  echo(text: string, options?: EchoOptions): void;
  /** Remove the current echo overlay. */
  clearEcho(): void;
  /** Wipe every representation/measurement/echo. Called automatically before each Run. */
  clear(): void;
}
`;
