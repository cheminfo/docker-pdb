import { Molecule } from 'openchemlib';
import { useMemo } from 'react';
import { SvgRenderer } from 'react-ocl';

interface LigandStructureProps {
  /** Canonical OpenChemLib idCode for the ligand. */
  idCode: string;
  /** Width of the rendered SVG, in CSS pixels. */
  width: number;
  /** Height of the rendered SVG, in CSS pixels. */
  height: number;
}

/**
 * Render a 2D depiction of a ligand from its canonical `idCode` alone, with
 * coordinates invented client-side via OpenChemLib. This bypasses any
 * coordinates that the server may return and yields a consistent layout
 * regardless of the source data.
 * @param props - Component props.
 * @param props.idCode - OpenChemLib canonical idCode.
 * @param props.width - Width of the SVG.
 * @param props.height - Height of the SVG.
 * @returns SVG element, or a small placeholder on parse error.
 */
export default function LigandStructure({
  idCode,
  width,
  height,
}: LigandStructureProps) {
  const molecule = useMemo(() => {
    try {
      const mol = Molecule.fromIDCode(idCode);
      mol.inventCoordinates();
      return mol;
    } catch {
      return null;
    }
  }, [idCode]);

  if (!molecule) {
    return <span className="placeholder">—</span>;
  }
  return <SvgRenderer molecule={molecule} width={width} height={height} />;
}
