/**
 * Lightweight ATOM/HETATM parser used by `ms.loadPDB(text)` to expose
 * `pdb.atoms`, `pdb.residues`, `pdb.chains`, `pdb.ligands` to scripts.
 * Mol*'s own parser is more capable but doesn't surface a JS-friendly view
 * of the PDB lines for inspection from a teaching script.
 */

/** A single ATOM/HETATM record from the loaded structure. */
export interface MolStarAtom {
  /** PDB serial number (column 7–11). */
  serial: number;
  /** Atom name, e.g. `'CA'`, `'N'`, `'C'`. */
  name: string;
  /** Element symbol, e.g. `'C'`, `'N'`. Empty if the column is blank. */
  element: string;
  /** Three-letter residue name, e.g. `'ALA'`, `'PLP'`. */
  resName: string;
  /** Chain identifier (single character). */
  chainId: string;
  /** Residue sequence number. */
  resNum: number;
  /** Cartesian coordinates in Å. */
  x: number;
  y: number;
  z: number;
  /** `true` for `HETATM` records (ligands, water, cofactors). */
  isHetatm: boolean;
}

/** One residue (collapsed by chain + resNum). */
export interface MolStarResidue {
  chainId: string;
  resNum: number;
  resName: string;
  /** `true` if the residue's atoms are HETATM records. */
  isHetero: boolean;
  /** Number of atoms in this residue. */
  atomCount: number;
}

/** Inclusive residue range for one secondary-structure record. */
export interface SecondaryStructureRange {
  chainId: string;
  fromResNum: number;
  toResNum: number;
}

/** Result of `parsePdb`. */
export interface ParsedPdb {
  atoms: MolStarAtom[];
  residues: MolStarResidue[];
  chains: string[];
  ligands: string[];
  /** Inclusive residue ranges declared by HELIX records. */
  helices: SecondaryStructureRange[];
  /** Inclusive residue ranges declared by SHEET records. */
  sheets: SecondaryStructureRange[];
}

/**
 * Parse ATOM/HETATM records from raw PDB text. Reads only the first MODEL
 * block (so NMR ensembles collapse to model 1) and keeps altLoc A (or blank).
 * @param pdbText - Raw PDB-format text.
 * @returns Atoms in source order plus derived residue / chain / ligand lists.
 */
export function parsePdb(pdbText: string): ParsedPdb {
  const atoms: MolStarAtom[] = [];
  const residueIndex = new Map<string, MolStarResidue>();
  const residues: MolStarResidue[] = [];
  const chains: string[] = [];
  const chainSeen = new Set<string>();
  const ligands: string[] = [];
  const ligandSeen = new Set<string>();

  const helices: SecondaryStructureRange[] = [];
  const sheets: SecondaryStructureRange[] = [];

  let modelEnded = false;
  for (const line of pdbText.split(/\r?\n/)) {
    if (line.startsWith('HELIX ')) {
      const range = parseSecondaryStructureRange(line, 19, 21, 31, 33);
      if (range) helices.push(range);
      continue;
    }
    if (line.startsWith('SHEET ')) {
      const range = parseSecondaryStructureRange(line, 21, 22, 32, 33);
      if (range) sheets.push(range);
      continue;
    }
    if (line.startsWith('ENDMDL')) {
      modelEnded = true;
      continue;
    }
    if (modelEnded) continue;
    const isAtom = line.startsWith('ATOM');
    const isHetatm = line.startsWith('HETATM');
    if (!isAtom && !isHetatm) continue;
    const altLoc = line.slice(16, 17);
    if (altLoc !== ' ' && altLoc !== 'A') continue;
    const resNum = Number.parseInt(line.slice(22, 26), 10);
    if (Number.isNaN(resNum)) continue;
    const chainId = line.slice(21, 22).trim() || ' ';
    const resName = line.slice(17, 20).trim();
    atoms.push({
      serial: Number.parseInt(line.slice(6, 11), 10) || atoms.length + 1,
      name: line.slice(12, 16).trim(),
      element: line.slice(76, 78).trim(),
      resName,
      chainId,
      resNum,
      x: Number.parseFloat(line.slice(30, 38)),
      y: Number.parseFloat(line.slice(38, 46)),
      z: Number.parseFloat(line.slice(46, 54)),
      isHetatm,
    });

    const residueKey = `${chainId}|${resNum}|${resName}`;
    const existing = residueIndex.get(residueKey);
    if (existing) {
      existing.atomCount += 1;
    } else {
      const residue: MolStarResidue = {
        chainId,
        resNum,
        resName,
        isHetero: isHetatm,
        atomCount: 1,
      };
      residueIndex.set(residueKey, residue);
      residues.push(residue);
    }

    if (!chainSeen.has(chainId)) {
      chainSeen.add(chainId);
      chains.push(chainId);
    }
    if (isHetatm && resName !== 'HOH' && !ligandSeen.has(resName)) {
      ligandSeen.add(resName);
      ligands.push(resName);
    }
  }

  return { atoms, residues, chains, ligands, helices, sheets };
}

/**
 * Parse a HELIX or SHEET record's residue range (chain + start/end seq num).
 * Both records share the same column layout for the chain id and sequence
 * numbers, but at different offsets — pass them in. Returns `null` if the
 * line is too short or the numbers are unparseable.
 * @param line - Raw record line.
 * @param chainColumn - Column (0-based) holding the initial chain id.
 * @param fromColumnStart - Start of the 4-char `initSeqNum` slice.
 * @param endChainColumn - Column (0-based) holding the terminal chain id.
 * @param toColumnStart - Start of the 4-char `endSeqNum` slice.
 * @returns Parsed range, or `null` if invalid.
 */
function parseSecondaryStructureRange(
  line: string,
  chainColumn: number,
  fromColumnStart: number,
  endChainColumn: number,
  toColumnStart: number,
): SecondaryStructureRange | null {
  const chainId = line.charAt(chainColumn).trim();
  const endChainId = line.charAt(endChainColumn).trim();
  if (!chainId || chainId !== endChainId) return null;
  const fromResNum = Number.parseInt(
    line.slice(fromColumnStart, fromColumnStart + 4),
    10,
  );
  const toResNum = Number.parseInt(
    line.slice(toColumnStart, toColumnStart + 4),
    10,
  );
  if (Number.isNaN(fromResNum) || Number.isNaN(toResNum)) return null;
  return { chainId, fromResNum, toResNum };
}
