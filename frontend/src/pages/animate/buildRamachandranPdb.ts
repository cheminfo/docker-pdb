/**
 * Build a synthetic PDB string in which every residue's Cα atom is placed
 * at coordinates `(φ, ψ, ω)` in degrees. Intended for use with
 * `pdb.createModel('rama', { pdb: pdb.ramachandranPdb() })` so a script can
 * swap the protein view for a 3D Ramachandran cloud.
 *
 * The result also embeds three short axis chains — `XAX` / `YAX` / `ZAX`
 * (chains `X` / `Y` / `Z`) — with five tick atoms each at -180°, -90°, 0°,
 * +90°, +180°, connected by `CONECT` records so they can be rendered as
 * lines via `pdb.select(':X').bonds.diameter(...)`.
 */

import { computeRamachandran } from './ramachandran.ts';

const TICKS = [-180, -90, 0, 90, 180] as const;

interface AxisSpec {
  chainId: 'X' | 'Y' | 'Z';
  resName: 'XAX' | 'YAX' | 'ZAX';
  coord: (value: number) => readonly [number, number, number];
}

const AXES: readonly AxisSpec[] = [
  { chainId: 'X', resName: 'XAX', coord: (v) => [v, 0, 0] },
  { chainId: 'Y', resName: 'YAX', coord: (v) => [0, v, 0] },
  { chainId: 'Z', resName: 'ZAX', coord: (v) => [0, 0, v] },
];

/**
 * Synthesize a PDB string positioning each residue's Cα at (φ, ψ, ω).
 * Residues at chain ends or chain breaks (any of φ / ψ / ω undefined) are
 * skipped. Three axis chains are appended so axes can be drawn.
 * @param pdbText - Original PDB text the dihedrals are computed from.
 * @returns A self-contained PDB string suitable for `ms.loadPDB(...)`.
 */
export function buildRamachandranPdb(pdbText: string): string {
  const dihedrals = computeRamachandran(pdbText);
  const lines: string[] = [];
  const conects: string[] = [];

  lines.push(
    'HEADER    RAMACHANDRAN MODEL                                                  ',
  );
  lines.push(
    'TITLE     PHI / PSI / OMEGA (DEGREES) AS X / Y / Z                              ',
  );

  let serial = 1;
  for (const dihedral of dihedrals) {
    if (
      dihedral.phi === null ||
      dihedral.psi === null ||
      dihedral.omega === null
    ) {
      continue;
    }
    lines.push(
      formatHetatm(
        serial,
        dihedral.resName,
        dihedral.chainId,
        dihedral.resNum,
        dihedral.phi,
        dihedral.psi,
        dihedral.omega,
      ),
    );
    serial += 1;
  }

  for (const axis of AXES) {
    let previousSerial: number | null = null;
    for (let tickIndex = 0; tickIndex < TICKS.length; tickIndex += 1) {
      const value = TICKS[tickIndex];
      if (value === undefined) continue;
      const [x, y, z] = axis.coord(value);
      lines.push(
        formatHetatm(serial, axis.resName, axis.chainId, tickIndex + 1, x, y, z),
      );
      if (previousSerial !== null) {
        conects.push(formatConect(previousSerial, serial));
      }
      previousSerial = serial;
      serial += 1;
    }
  }

  return [...lines, ...conects, 'END', ''].join('\n');
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
  return (
    'HETATM' +
    serial.toString().padStart(5) +
    '  CA  ' +
    resName.padEnd(3).slice(0, 3) +
    ' ' +
    (chainId.charAt(0) || ' ') +
    resNum.toString().padStart(4) +
    '    ' +
    formatCoord(x) +
    formatCoord(y) +
    formatCoord(z) +
    '  1.00  0.00           C'
  );
}

function formatCoord(n: number): string {
  return n.toFixed(3).padStart(8);
}

function formatConect(a: number, b: number): string {
  return 'CONECT' + a.toString().padStart(5) + b.toString().padStart(5);
}
