import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { parse } from '../pdbParser.js';

test('Check pdb parser of 1O8O', () => {
  const pdb = readFileSync(join(import.meta.dirname, '1O8O.pdb'), 'utf8');
  const result = parse(pdb);
  expect(result.chain.A.nbResidues).toBe(167);
  expect(result.helices).toHaveLength(21);
  expect(result.nbResidues).toBe(501);
  expect(result.nbChains).toBe(3);
});

test('Check pdb parser of 3QK2', () => {
  const pdb = readFileSync(join(import.meta.dirname, '3QK2.pdb'), 'utf8');
  const result = parse(pdb);
  expect(result.nbModifiedResidues).toBe(1);
  expect(result.omega.nbCis).toBe(1);
  expect(result.omega.cisBonds[0]).toStrictEqual({
    chain: 'A',
    residue1: 'ASP',
    residue2: 'PRO',
    position1: 239,
    position2: 240,
    omega: -3.51,
  });
});

test('Extract per-instance HETATM coordinates from 3QK2', () => {
  const pdb = readFileSync(join(import.meta.dirname, '3QK2.pdb'), 'utf8');
  const { ligandInstances } = parse(pdb);
  // 3QK2 has one CME (modified residue, 10 atoms, chain A 216) and one
  // SCN (3 atoms, chain A 1) — the rest of the HETATM records are waters.
  expect(ligandInstances).toHaveLength(2);

  const cme = ligandInstances.find((instance) => instance.code === 'CME');
  expect(cme).toStrictEqual({
    code: 'CME',
    chain: 'A',
    resSeq: 216,
    iCode: '',
    atoms: [
      { name: 'N', element: 'N', x: -22.484, y: -2.798, z: -0.176 },
      { name: 'CA', element: 'C', x: -22.097, y: -1.858, z: -1.261 },
      { name: 'CB', element: 'C', x: -20.643, y: -2.031, z: -1.677 },
      { name: 'SG', element: 'S', x: -19.585, y: -1.62, z: -0.33 },
      { name: 'SD', element: 'S', x: -18.136, y: -2.989, z: -0.418 },
      { name: 'CE', element: 'C', x: -18.802, y: -4.439, z: 0.337 },
      { name: 'CZ', element: 'C', x: -19.245, y: -5.425, z: -0.744 },
      { name: 'OH', element: 'O', x: -20.627, y: -5.222, z: -1.089 },
      { name: 'C', element: 'C', x: -22.983, y: -2.12, z: -2.434 },
      { name: 'O', element: 'O', x: -23.158, y: -3.26, z: -2.853 },
    ],
  });

  const scn = ligandInstances.find((instance) => instance.code === 'SCN');
  expect(scn).toStrictEqual({
    code: 'SCN',
    chain: 'A',
    resSeq: 1,
    iCode: '',
    atoms: [
      { name: 'S', element: 'S', x: -12.272, y: -30.742, z: 0.463 },
      { name: 'C', element: 'C', x: -11.764, y: -32.337, z: -0.139 },
      { name: 'N', element: 'N', x: -11.393, y: -33.409, z: -0.448 },
    ],
  });
});

test('Omega stats are consistent with bond classification', () => {
  const pdb = readFileSync(join(import.meta.dirname, '1O8O.pdb'), 'utf8');
  const { omega } = parse(pdb);
  expect(omega.nbCis + omega.nbTrans + omega.nbTwisted).toBe(
    omega.nbPeptideBonds,
  );
  expect(omega.cisBonds).toHaveLength(omega.nbCis);
  expect(omega.twistedBonds).toHaveLength(omega.nbTwisted);
  for (const bond of omega.cisBonds) {
    expect(Math.abs(bond.omega)).toBeLessThanOrEqual(30);
  }
  for (const bond of omega.twistedBonds) {
    const absOmega = Math.abs(bond.omega);
    expect(absOmega).toBeGreaterThan(30);
    expect(absOmega).toBeLessThan(150);
  }
});
