/**
 * Pure-JS residue-set evaluation and backbone H-bond detection used by the
 * `selection.hbonds` channel. Walking Mol*'s loci would also work but pulls
 * in `StructureProperties` / `StructureElement.Loci.forEachLocation`; doing
 * the filtering against our own `parsePdb` output keeps the channel logic
 * self-contained and side-steps Mol*'s heavier element-iteration cost.
 *
 * The H-bond detector is intentionally simple — N…O distance between
 * backbone atoms, excluding peptide-bond neighbours — which is enough for
 * the teaching scenes (alpha helices and beta sheets).
 */

import type { MolStarAtom, MolStarResidue, ParsedPdb } from './parsePdb.ts';
import type {
  KeywordGroup,
  Selection as SelectionAst,
} from './selectionParser.ts';

/** A backbone N…O hydrogen bond, represented as the pair of partner atoms. */
export interface HBondPair {
  donor: MolStarAtom;
  acceptor: MolStarAtom;
}

/** N…O distance window (Å²) used by {@link computeBackboneHBonds}. */
const HBOND_MIN = 2.5;
const HBOND_MAX = 3.5;
const HBOND_MIN_SQ = HBOND_MIN * HBOND_MIN;
const HBOND_MAX_SQ = HBOND_MAX * HBOND_MAX;

/** 20 standard amino acids. Used to gate `protein` / backbone residue checks. */
const AMINO_ACIDS = new Set([
  'ALA',
  'ARG',
  'ASN',
  'ASP',
  'CYS',
  'GLN',
  'GLU',
  'GLY',
  'HIS',
  'ILE',
  'LEU',
  'LYS',
  'MET',
  'PHE',
  'PRO',
  'SER',
  'THR',
  'TRP',
  'TYR',
  'VAL',
]);

/** Names PDB files commonly use for water residues. */
const WATER_NAMES = new Set(['HOH', 'H2O', 'WAT']);

/**
 * Build the set of residue keys (`chainId|resNum`) covered by a selection.
 * The check works at the residue level — atom-name selectors such as `.CA`
 * are treated as "this residue might contain such an atom"; this is fine
 * for the current consumer (H-bond filtering, which then re-filters at the
 * atom level on backbone N / O names).
 *
 * `within X of …` is approximated as the inner expression's residues; the
 * geometric expansion is dropped because residue-set membership cannot
 * represent an Å-radius bubble cheaply.
 * @param ast - Parsed selection AST.
 * @param pdb - Parsed PDB metadata (atoms, residues, helices, sheets).
 * @returns Set of `chainId|resNum` keys.
 */
export function selectionResidueKeys(
  ast: SelectionAst,
  pdb: ParsedPdb,
): Set<string> {
  const keys = new Set<string>();
  for (const residue of pdb.residues) {
    if (residueMatches(ast, residue, pdb)) {
      keys.add(`${residue.chainId}|${residue.resNum}`);
    }
  }
  return keys;
}

/**
 * Detect backbone N…O hydrogen bonds within the residue set. Excludes pairs
 * sharing the same chain whose `resNum` differ by ≤1 (peptide-bond / direct
 * neighbour artefacts).
 * @param pdb - Parsed PDB.
 * @param residueKeys - Subset returned by {@link selectionResidueKeys}.
 * @returns Detected H-bond pairs.
 */
export function computeBackboneHBonds(
  pdb: ParsedPdb,
  residueKeys: Set<string>,
): HBondPair[] {
  const donors: MolStarAtom[] = [];
  const acceptors: MolStarAtom[] = [];
  for (const atom of pdb.atoms) {
    if (atom.isHetatm) continue;
    if (!AMINO_ACIDS.has(atom.resName)) continue;
    if (!residueKeys.has(`${atom.chainId}|${atom.resNum}`)) continue;
    if (atom.name === 'N') donors.push(atom);
    else if (atom.name === 'O') acceptors.push(atom);
  }

  const pairs: HBondPair[] = [];
  for (const donor of donors) {
    for (const acceptor of acceptors) {
      if (
        donor.chainId === acceptor.chainId &&
        Math.abs(donor.resNum - acceptor.resNum) <= 1
      ) {
        continue;
      }
      const dx = donor.x - acceptor.x;
      const dy = donor.y - acceptor.y;
      const dz = donor.z - acceptor.z;
      const distanceSq = dx * dx + dy * dy + dz * dz;
      if (distanceSq >= HBOND_MIN_SQ && distanceSq <= HBOND_MAX_SQ) {
        pairs.push({ donor, acceptor });
      }
    }
  }
  return pairs;
}

function residueMatches(
  ast: SelectionAst,
  residue: MolStarResidue,
  pdb: ParsedPdb,
): boolean {
  switch (ast.kind) {
    case 'group':
      return groupMatches(ast.name, residue, pdb);
    case 'ligand':
      return residue.resName === ast.label;
    case 'residueAtom':
      return residue.resName === ast.residue;
    case 'chain':
      return residue.chainId === ast.chain;
    case 'residueRange':
      return (
        residue.chainId === ast.chain &&
        residue.resNum >= ast.from &&
        residue.resNum <= ast.to
      );
    case 'residue':
      return residue.chainId === ast.chain && residue.resNum === ast.index;
    case 'not':
      return !residueMatches(ast.expr, residue, pdb);
    case 'and':
      return (
        residueMatches(ast.left, residue, pdb) &&
        residueMatches(ast.right, residue, pdb)
      );
    case 'or':
      return (
        residueMatches(ast.left, residue, pdb) ||
        residueMatches(ast.right, residue, pdb)
      );
    case 'within':
      return residueMatches(ast.expr, residue, pdb);
    case 'atomName':
    case 'element':
      return true;
    default:
      return false;
  }
}

function groupMatches(
  name: KeywordGroup,
  residue: MolStarResidue,
  pdb: ParsedPdb,
): boolean {
  switch (name) {
    case 'all':
      return true;
    case 'none':
      return false;
    case 'water':
      return WATER_NAMES.has(residue.resName);
    case 'protein':
    case 'backbone':
    case 'sidechain':
      return AMINO_ACIDS.has(residue.resName);
    case 'nucleic':
      return false;
    case 'polymer':
      return AMINO_ACIDS.has(residue.resName);
    case 'ligand':
      return residue.isHetero && !WATER_NAMES.has(residue.resName);
    case 'hetero':
      return residue.isHetero;
    case 'helix':
      return pdb.helices.some(
        (helix) =>
          helix.chainId === residue.chainId &&
          residue.resNum >= helix.fromResNum &&
          residue.resNum <= helix.toResNum,
      );
    case 'sheet':
      return pdb.sheets.some(
        (sheet) =>
          sheet.chainId === residue.chainId &&
          residue.resNum >= sheet.fromResNum &&
          residue.resNum <= sheet.toResNum,
      );
    default:
      return false;
  }
}
