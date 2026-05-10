/**
 * Parse ATOM records from raw PDB text and compute φ / ψ / ω for every
 * residue. Used by `api.ramachandran(...)` to drive the 2D overlay panel.
 */

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface BackboneAtoms {
  N?: Vec3;
  CA?: Vec3;
  C?: Vec3;
}

interface Residue {
  chainId: string;
  resNum: number;
  iCode: string;
  resName: string;
  atoms: BackboneAtoms;
}

/** φ / ψ / ω for a single residue. `null` where the angle is not defined. */
export interface ResidueDihedrals {
  chainId: string;
  resNum: number;
  iCode: string;
  resName: string;
  /** φ (degrees), or `null` for the first residue of a chain / chain break. */
  phi: number | null;
  /** ψ (degrees), or `null` for the last residue of a chain / chain break. */
  psi: number | null;
  /** ω (degrees), or `null` for the first residue of a chain / chain break. */
  omega: number | null;
}

/** Per-region counts produced by {@link computeDihedralStats}. */
export interface DihedralStats {
  /** Residues with all three dihedrals defined (the only ones counted). */
  total: number;
  /** Residues whose (φ, ψ) sits in the right-handed α-helix region. */
  helix: number;
  /** Residues whose (φ, ψ) sits in the β-sheet region. */
  sheet: number;
  /** Residues classified as coil (everything else). */
  coil: number;
  /** Peptide bonds with `|ω| < 30°` (cis configuration). */
  cis: number;
  /** Peptide bonds with `|ω| > 150°` (trans configuration). */
  trans: number;
}

const RAD_TO_DEG = 180 / Math.PI;
const CHAIN_BREAK_DISTANCE_SQ = 2.5 * 2.5;
const CIS_THRESHOLD = 30;
const TRANS_THRESHOLD = 150;

/**
 * Coarse classification of (φ, ψ) into the right-handed α-helix region,
 * the β-sheet region, or everything else (coil). Shared by the synthetic
 * PDB builder (which uses the letter as the chain ID) and the stats helper
 * below so the boundary definitions stay in sync.
 * @param phi - φ in degrees.
 * @param psi - ψ in degrees.
 * @returns `'H'` (α-helix), `'S'` (β-sheet) or `'C'` (coil).
 */
export function classifySecondaryStructure(
  phi: number,
  psi: number,
): 'H' | 'S' | 'C' {
  if (phi >= -100 && phi <= -30 && psi >= -67 && psi <= -7) return 'H';
  if (phi >= -180 && phi <= -45 && psi >= 90 && psi <= 180) return 'S';
  return 'C';
}

/**
 * Tally α-helix / β-sheet / coil residues and cis / trans peptide bonds
 * across the structure. Residues missing any of φ / ψ / ω (chain ends,
 * chain breaks) are skipped.
 * @param pdbText - Raw PDB text.
 * @returns Per-region counts; `total = helix + sheet + coil`.
 */
export function computeDihedralStats(pdbText: string): DihedralStats {
  const dihedrals = computeRamachandran(pdbText);
  let total = 0;
  let helix = 0;
  let sheet = 0;
  let coil = 0;
  let cis = 0;
  let trans = 0;
  for (const dihedral of dihedrals) {
    if (dihedral.phi === null) continue;
    if (dihedral.psi === null) continue;
    if (dihedral.omega === null) continue;
    total += 1;
    const region = classifySecondaryStructure(dihedral.phi, dihedral.psi);
    if (region === 'H') helix += 1;
    else if (region === 'S') sheet += 1;
    else coil += 1;
    const absOmega = Math.abs(dihedral.omega);
    if (absOmega < CIS_THRESHOLD) cis += 1;
    else if (absOmega > TRANS_THRESHOLD) trans += 1;
  }
  return { total, helix, sheet, coil, cis, trans };
}

/**
 * Parse `pdbText` and return φ / ψ / ω for every residue, in chain order.
 * Reads only the first MODEL block (so NMR ensembles collapse to model 1).
 * @param pdbText - Raw PDB text, as fetched from the backend.
 * @returns One entry per residue, in original chain order.
 */
export function computeRamachandran(pdbText: string): ResidueDihedrals[] {
  const residuesByChain = parseBackbone(pdbText);
  const result: ResidueDihedrals[] = [];
  for (const chainResidues of residuesByChain.values()) {
    for (let i = 0; i < chainResidues.length; i++) {
      const current = chainResidues[i];
      if (!current) continue;
      const previous = i > 0 ? (chainResidues[i - 1] ?? null) : null;
      const next =
        i + 1 < chainResidues.length ? (chainResidues[i + 1] ?? null) : null;
      result.push({
        chainId: current.chainId,
        resNum: current.resNum,
        iCode: current.iCode,
        resName: current.resName,
        phi: computePhi(previous, current),
        psi: computePsi(current, next),
        omega: computeOmega(previous, current),
      });
    }
  }
  return result;
}

function computePhi(previous: Residue | null, current: Residue): number | null {
  if (!previous) return null;
  const c0 = previous.atoms.C;
  const n = current.atoms.N;
  const ca = current.atoms.CA;
  const c = current.atoms.C;
  if (!c0 || !n || !ca || !c) return null;
  if (distanceSq(c0, n) > CHAIN_BREAK_DISTANCE_SQ) return null;
  return dihedral(c0, n, ca, c);
}

function computePsi(current: Residue, next: Residue | null): number | null {
  if (!next) return null;
  const n = current.atoms.N;
  const ca = current.atoms.CA;
  const c = current.atoms.C;
  const n2 = next.atoms.N;
  if (!n || !ca || !c || !n2) return null;
  if (distanceSq(c, n2) > CHAIN_BREAK_DISTANCE_SQ) return null;
  return dihedral(n, ca, c, n2);
}

function computeOmega(
  previous: Residue | null,
  current: Residue,
): number | null {
  if (!previous) return null;
  const ca0 = previous.atoms.CA;
  const c0 = previous.atoms.C;
  const n = current.atoms.N;
  const ca = current.atoms.CA;
  if (!ca0 || !c0 || !n || !ca) return null;
  if (distanceSq(c0, n) > CHAIN_BREAK_DISTANCE_SQ) return null;
  return dihedral(ca0, c0, n, ca);
}

function parseBackbone(pdbText: string): Map<string, Residue[]> {
  const residuesByChain = new Map<string, Residue[]>();
  const residueIndex = new Map<string, Residue>();
  let modelEnded = false;
  for (const line of pdbText.split('\n')) {
    if (line.startsWith('ENDMDL')) {
      modelEnded = true;
      continue;
    }
    if (modelEnded) continue;
    if (!line.startsWith('ATOM')) continue;
    const atomName = line.slice(12, 16).trim();
    if (atomName !== 'N' && atomName !== 'CA' && atomName !== 'C') continue;
    const altLoc = line.slice(16, 17);
    if (altLoc !== ' ' && altLoc !== 'A') continue;
    const chainId = line.slice(21, 22);
    const resNum = Number.parseInt(line.slice(22, 26), 10);
    if (Number.isNaN(resNum)) continue;
    const iCode = line.slice(26, 27);
    const key = `${chainId}|${resNum}|${iCode}`;
    let residue = residueIndex.get(key);
    if (!residue) {
      residue = {
        chainId,
        resNum,
        iCode,
        resName: line.slice(17, 20).trim(),
        atoms: {},
      };
      residueIndex.set(key, residue);
      const list = residuesByChain.get(chainId);
      if (list) {
        list.push(residue);
      } else {
        residuesByChain.set(chainId, [residue]);
      }
    }
    residue.atoms[atomName] = {
      x: Number.parseFloat(line.slice(30, 38)),
      y: Number.parseFloat(line.slice(38, 46)),
      z: Number.parseFloat(line.slice(46, 54)),
    };
  }
  return residuesByChain;
}

function dihedral(p1: Vec3, p2: Vec3, p3: Vec3, p4: Vec3): number {
  const b1 = subtract(p2, p1);
  const b2 = subtract(p3, p2);
  const b3 = subtract(p4, p3);
  const n1 = cross(b1, b2);
  const n2 = cross(b2, b3);
  const m = cross(n1, normalize(b2));
  return Math.atan2(dot(m, n2), dot(n1, n2)) * RAD_TO_DEG;
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function normalize(a: Vec3): Vec3 {
  const length = Math.sqrt(dot(a, a)) || 1;
  return { x: a.x / length, y: a.y / length, z: a.z / length };
}

function distanceSq(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}
