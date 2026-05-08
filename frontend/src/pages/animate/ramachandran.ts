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

const RAD_TO_DEG = 180 / Math.PI;
const CHAIN_BREAK_DISTANCE_SQ = 2.5 * 2.5;

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
