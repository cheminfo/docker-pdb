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

interface VisibilityToggle {
  show(): void;
  hide(): void;
}

/** Sphere channel — covers each atom of the selection. */
interface AtomsChannel extends VisibilityToggle {
  /** Recolor (creates the spheres on first call). */
  color(spec: ColorSpec): void;
  /** Set sphere size factor. */
  radius(options: SizeOptions): void;
}

/** Bond cylinder channel. */
interface BondsChannel extends VisibilityToggle {
  /** Recolor (creates the cylinders on first call). */
  color(spec: ColorSpec): void;
  /** Set bond cylinder size factor. */
  diameter(value: number): void;
}

/** Cartoon / ribbon channel for protein backbone. */
interface RibbonChannel extends VisibilityToggle {
  /** Recolor (creates the ribbon on first call). */
  color(spec: ColorSpec): void;
}

/** Solvent-accessible surface channel. */
interface SurfaceChannel extends VisibilityToggle {
  /** Recolor (creates a solid surface unless \`dots()\` ran first). */
  color(spec: ColorSpec): void;
  /** Switch to a dotted Gaussian surface (subsequent \`color()\` keeps it). */
  dots(): void;
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
interface Selection extends VisibilityToggle {
  readonly atoms: AtomsChannel;
  readonly bonds: BondsChannel;
  readonly ribbon: RibbonChannel;
  readonly surface: SurfaceChannel;
  /** Sub-select within this selection (intersection with \`expression\`). */
  select(expression: string): Selection;
  /**
   * Add a residue/element/chain label overlay. The template can reference
   * \`\${atom.*}\`, \`\${residue.*}\` or \`\${chain.*}\` paths.
   */
  label(template: string): void;
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
   * \`"108-122:A"\`, \`"119:A"\`, plus operators \`and\` / \`or\` / \`not\`,
   * \`within X of …\`, and parentheses.
   */
  select(expression: string): Selection;
  /** Show a Ramachandran (φ × ψ) plot plus an ω plot overlay. */
  ramachandran(options?: RamachandranOptions): void;
  /** Remove the Ramachandran overlay. */
  clearRamachandran(): void;
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
