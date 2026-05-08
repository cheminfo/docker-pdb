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
});
