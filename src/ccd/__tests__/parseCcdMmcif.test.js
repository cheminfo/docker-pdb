import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { test, expect } from 'vitest';

import { parseCcdMmcif, tokenizeMmcifLine } from '../parseCcdMmcif.js';

/**
 * Yield the lines of a string one at a time as an async iterable, so we
 * can feed them into the streaming `parseCcdMmcif` generator from a
 * synchronous fixture file.
 * @param {string} text - Multi-line input.
 * @yields {string} One line at a time.
 */
async function* asyncLines(text) {
  for (const line of text.split('\n')) yield line;
}

/**
 * Read the test fixture and run it through `parseCcdMmcif`.
 * @returns {Promise<object[]>} Parsed chem_comp blocks in source order.
 */
async function parseFixture() {
  const text = readFileSync(join(import.meta.dirname, 'fixture.cif'), 'utf8');
  const blocks = [];
  for await (const block of parseCcdMmcif(asyncLines(text))) {
    blocks.push(block);
  }
  return blocks;
}

test('tokenizeMmcifLine handles plain tokens', () => {
  expect(
    tokenizeMmcifLine('BNZ C1 C1 C 0 Y 1.000 0.000 0.000 1'),
  ).toStrictEqual([
    'BNZ',
    'C1',
    'C1',
    'C',
    '0',
    'Y',
    '1.000',
    '0.000',
    '0.000',
    '1',
  ]);
});

test('tokenizeMmcifLine respects double-quoted strings with spaces', () => {
  expect(tokenizeMmcifLine('_chem_comp.name "SODIUM ION"')).toStrictEqual([
    '_chem_comp.name',
    'SODIUM ION',
  ]);
});

test('parseCcdMmcif yields one block per data_ section', async () => {
  const blocks = await parseFixture();
  expect(blocks.map((block) => block.code)).toStrictEqual([
    'HOH',
    'NA',
    'BNZ',
    'ETA',
  ]);
});

test('parseCcdMmcif extracts scalar metadata', async () => {
  const blocks = await parseFixture();
  const benzene = blocks.find((block) => block.code === 'BNZ');
  expect(benzene.name).toBe('BENZENE');
  expect(benzene.type).toBe('NON-POLYMER');
  expect(benzene.formula).toBe('C6 H6');
});

test('parseCcdMmcif extracts atoms with normalized fields', async () => {
  const blocks = await parseFixture();
  const ethanolamine = blocks.find((block) => block.code === 'ETA');
  expect(ethanolamine.atoms).toStrictEqual([
    { id: 'N', symbol: 'N', charge: 0, x: 0, y: 0, z: 0, aromatic: false },
    { id: 'C1', symbol: 'C', charge: 0, x: 1.45, y: 0, z: 0, aromatic: false },
    {
      id: 'C2',
      symbol: 'C',
      charge: 0,
      x: 1.95,
      y: 1.45,
      z: 0,
      aromatic: false,
    },
    { id: 'O', symbol: 'O', charge: 0, x: 3.4, y: 1.45, z: 0, aromatic: false },
  ]);
});

test('parseCcdMmcif extracts bonds with normalized fields', async () => {
  const blocks = await parseFixture();
  const ethanolamine = blocks.find((block) => block.code === 'ETA');
  expect(ethanolamine.bonds).toStrictEqual([
    { atom1: 'N', atom2: 'C1', order: 'SING', aromatic: false },
    { atom1: 'C1', atom2: 'C2', order: 'SING', aromatic: false },
    { atom1: 'C2', atom2: 'O', order: 'SING', aromatic: false },
  ]);
});

test('parseCcdMmcif keeps single-atom entries (caller filters them)', async () => {
  const blocks = await parseFixture();
  const water = blocks.find((block) => block.code === 'HOH');
  expect(water.atoms).toHaveLength(1);
  expect(water.bonds).toHaveLength(0);
});
