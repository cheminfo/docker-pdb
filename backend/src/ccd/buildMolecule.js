import OCL from 'openchemlib';

const { Molecule } = OCL;

/**
 * Translate the CCD `value_order` enum to an OpenChemLib bond-type
 * constant. CCD typically stores the Kekulized form for aromatic rings
 * (alternating SING/DOUB with `pdbx_aromatic_flag=Y`); a small number of
 * legacy entries use AROM directly, which we map to the delocalized
 * bond type so OCL's perception still recognizes them.
 */
const BOND_TYPE = {
  SING: Molecule.cBondTypeSingle,
  DOUB: Molecule.cBondTypeDouble,
  TRIP: Molecule.cBondTypeTriple,
  AROM: Molecule.cBondTypeDelocalized,
  AROMATIC: Molecule.cBondTypeDelocalized,
};

/**
 * Build an OpenChemLib `Molecule` from one parsed CCD chem_comp block.
 *
 * Returns `null` if the block is unusable as a small molecule:
 * - no atoms, or only a single atom (covers single-atom ions like NA, CL)
 * - an atom with an unknown element symbol
 * - a bond referencing an atom id that doesn't exist
 * @param {object} block - block emitted by `parseCcdMmcif`.
 * @returns {OCL.Molecule | null} The OCL molecule, or `null` if the block is unusable.
 */
export function buildMoleculeFromCcdBlock(block) {
  const { atoms, bonds } = block;
  if (!atoms || atoms.length < 2) return null;

  const molecule = new Molecule(atoms.length, bonds.length);

  /** Map CCD atom_id → OCL atom index */
  const atomIndex = new Map();
  for (const atom of atoms) {
    const atomicNo = Molecule.getAtomicNoFromLabel(
      normalizeSymbol(atom.symbol),
    );
    if (!atomicNo) return null;
    const i = molecule.addAtom(atomicNo);
    molecule.setAtomX(i, atom.x);
    molecule.setAtomY(i, atom.y);
    molecule.setAtomZ(i, atom.z);
    if (atom.charge) {
      molecule.setAtomCharge(i, atom.charge);
    }
    atomIndex.set(atom.id, i);
  }

  for (const bond of bonds) {
    const a = atomIndex.get(bond.atom1);
    const b = atomIndex.get(bond.atom2);
    if (a === undefined || b === undefined) return null;
    const bondIndex = molecule.addBond(a, b);
    const bondType = BOND_TYPE[bond.order] ?? Molecule.cBondTypeSingle;
    molecule.setBondType(bondIndex, bondType);
  }

  return molecule;
}

/**
 * CCD writes element symbols in mixed case (`C`, `Cl`, `FE`, …). OCL's
 * `getAtomicNoFromLabel` is case-sensitive ("Cl" works, "CL" does not),
 * so normalize first letter uppercase / rest lowercase.
 * @param {string} symbol - Raw element symbol from CCD.
 * @returns {string} Normalized symbol suitable for OCL lookup.
 */
function normalizeSymbol(symbol) {
  if (!symbol) return '';
  return symbol[0].toUpperCase() + symbol.slice(1).toLowerCase();
}
