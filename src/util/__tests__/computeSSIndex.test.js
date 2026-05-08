import OCL from 'openchemlib';
import { test, expect } from 'vitest';

import { computeSSIndex } from '../computeSSIndex.js';

test('computeSSIndex returns 8 bigint slots for benzene', () => {
  const molecule = OCL.Molecule.fromSmiles('c1ccccc1');
  const index = computeSSIndex(molecule);
  expect(Object.keys(index)).toStrictEqual([
    'ss_index0',
    'ss_index1',
    'ss_index2',
    'ss_index3',
    'ss_index4',
    'ss_index5',
    'ss_index6',
    'ss_index7',
  ]);
  for (const value of Object.values(index)) {
    expect(typeof value).toBe('bigint');
  }
  // At least one slot is non-zero for any non-trivial molecule.
  expect(Object.values(index).some((value) => value !== 0n)).toBe(true);
});

test('computeSSIndex is deterministic for the same molecule', () => {
  const a = OCL.Molecule.fromSmiles('CCO');
  const b = OCL.Molecule.fromSmiles('CCO');
  expect(computeSSIndex(a)).toStrictEqual(computeSSIndex(b));
});
