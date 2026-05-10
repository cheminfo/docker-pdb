/**
 * Build a synthetic PDB string in which every residue's Cα is placed at
 * coordinates `(φ, ψ, ω)` in degrees. Used by
 * `pdb.createModel('rama', { pdb: pdb.ramachandranPdb() })` to swap the
 * protein view for a 3D Ramachandran cloud.
 *
 * Each residue's chain ID encodes a coarse secondary-structure
 * classification inferred from (φ, ψ): `H` for the right-handed α-helix
 * region, `S` for the β-sheet region, `C` for everything else. Scripts
 * select by chain (`pdb.select(':H')`, `:S`, `:C`) to color by SS.
 *
 * The three axes are NOT embedded as PDB chains anymore — scripts draw
 * them via `ms.arrow(...)` (real Mol* shape geometry, no atoms). Axis
 * tip labels are likewise free-floating `ms.text(...)` shapes, so no
 * label-anchor atoms are needed in the synthetic structure either.
 */

import {
  classifySecondaryStructure,
  computeRamachandran,
} from './ramachandran.ts';

// Scale degree → Å so the synthetic structure fits a normal protein-sized
// bounding box. With `SCALE = 0.1`, the cloud spans roughly -18 to +18 Å,
// so default-sized Cα spacefill spheres (≈ 1.7 Å radius) are visible at
// ordinary zoom rather than being sub-pixel against a 360 Å cube.
const SCALE = 0.1;
const AXIS_END = 180 * SCALE;

/**
 * Convenient access to the per-axis tip in world coordinates so scene
 * scripts can drop a `ms.arrow(...)` at the right spot without
 * recomputing the synth-PDB geometry locally.
 */
export const RAMACHANDRAN_AXIS_TIPS = {
  phi: [AXIS_END, 0, 0] as const,
  psi: [0, AXIS_END, 0] as const,
  omega: [0, 0, AXIS_END] as const,
  /**
   * Symmetrically the negative ends — useful if a script wants to draw
   * a double-headed arrow on each axis.
   */
  phiNegative: [-AXIS_END, 0, 0] as const,
  psiNegative: [0, -AXIS_END, 0] as const,
  omegaNegative: [0, 0, -AXIS_END] as const,
};

/**
 * Shift ω so that the canonical trans peptide bond (`ω ≈ ±180°`) lands at
 * `z = 0` — the centre of the synthetic z axis — and cis (`ω ≈ 0°`) ends up
 * at the edges. Trans is the overwhelmingly common case, so putting it in
 * the middle of the visualisation makes the cis outliers easy to spot.
 * @param omega - Original ω in degrees.
 * @returns Shifted value in `[-180, 180]`.
 */
function shiftedOmega(omega: number): number {
  if (omega > 0) return omega - 180;
  if (omega < 0) return omega + 180;
  return 180;
}

/**
 * Synthesize a PDB string whose Cα atoms sit at `(φ, ψ, ω)` in degrees.
 * Residues at chain ends or chain breaks (any of φ / ψ / ω undefined) are
 * skipped. The returned string is a self-contained PDB suitable for
 * `ms.loadPDB(...)` or `pdb.createModel(name, { pdb: ... })`.
 * @param pdbText - Original PDB text the dihedrals are computed from.
 * @returns A self-contained PDB string.
 */
export function buildRamachandranPdb(pdbText: string): string {
  const dihedrals = computeRamachandran(pdbText);
  const lines: string[] = [
    'HEADER    RAMACHANDRAN MODEL                                                  ',
    'TITLE     PHI / PSI / OMEGA (DEGREES); CHAIN ID = SS (H / S / C)              ',
  ];

  let serial = 1;
  for (const dihedral of dihedrals) {
    if (
      dihedral.phi === null ||
      dihedral.psi === null ||
      dihedral.omega === null
    ) {
      continue;
    }
    const ssChain = classifySecondaryStructure(dihedral.phi, dihedral.psi);
    // x = +φ          — literature, +φ to the right
    // y = +ψ          — Mol* uses Y-up, so +ψ at world +Y lands at the
    //                   top of the canvas (literature Ramachandran)
    // z = shifted ω   — trans (±180°) → 0, cis (0°) → ±180; trans clusters
    //                   in the middle of the ω spread
    lines.push(
      formatHetatm(
        serial,
        dihedral.resName,
        ssChain,
        dihedral.resNum,
        dihedral.phi * SCALE,
        dihedral.psi * SCALE,
        shiftedOmega(dihedral.omega) * SCALE,
      ),
    );
    serial += 1;
  }

  return [...lines, 'END', ''].join('\n');
}

function formatHetatm(
  serial: number,
  resName: string,
  chainId: string,
  resNum: number,
  x: number,
  y: number,
  z: number,
): string {
  // PDB ATOM/HETATM format: cols 1-6 record, 7-11 serial, 13-16 atom name
  // (right-justified for 1-letter elements → " CA "), 18-20 resName, 22
  // chainId, 23-26 resNum, 31-38/39-46/47-54 x/y/z (Real(8.3)), 55-60
  // occupancy, 61-66 b-factor, 77-78 element symbol.
  return `HETATM${serial.toString().padStart(5)}  CA  ${resName
    .padEnd(3)
    .slice(0, 3)} ${chainId.charAt(0) || ' '}${resNum
    .toString()
    .padStart(4)}    ${formatCoord(x)}${formatCoord(y)}${formatCoord(
    z,
  )}  1.00  0.00           C`;
}

function formatCoord(n: number): string {
  return n.toFixed(3).padStart(8);
}
