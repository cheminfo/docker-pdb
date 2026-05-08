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
