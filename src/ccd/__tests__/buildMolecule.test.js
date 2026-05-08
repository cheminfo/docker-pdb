import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { test, expect } from 'vitest';

import { buildMoleculeFromCcdBlock } from '../buildMolecule.js';
import { parseCcdMmcif } from '../parseCcdMmcif.js';

/**
 * Yield each line of the fixture as an async iterable.
 * @param {string} text - Fixture contents.
 * @yields {string} One line at a time.
 */
async function* asyncLines(text) {
  for (const line of text.split('\n')) yield line;
}

/**
 * Read the fixture and index parsed blocks by their CCD code for easy lookup.
 * @returns {Promise<Record<string, object>>} Map of code → block.
 */
async function loadFixture() {
  const text = readFileSync(join(import.meta.dirname, 'fixture.cif'), 'utf8');
  const blocks = {};
  for await (const block of parseCcdMmcif(asyncLines(text))) {
    blocks[block.code] = block;
  }
  return blocks;
}

test('returns null for single-atom entries', async () => {
  const blocks = await loadFixture();
  expect(buildMoleculeFromCcdBlock(blocks.HOH)).toBeNull();
  expect(buildMoleculeFromCcdBlock(blocks.NA)).toBeNull();
});

test('builds benzene with the canonical OCL idCode', async () => {
  const blocks = await loadFixture();
  const molecule = buildMoleculeFromCcdBlock(blocks.BNZ);
  const { idCode } = molecule.getIDCodeAndCoordinates();
  // Canonical OCL idCode for benzene
  expect(idCode).toBe('gFp@DiTt@@@');
  const formula = molecule.getMolecularFormula();
  expect(formula.formula).toBe('C6H6');
  expect(formula.relativeWeight).toBeCloseTo(78.114, 2);
});

test('builds ethanolamine with correct formula and weight', async () => {
  const blocks = await loadFixture();
  const molecule = buildMoleculeFromCcdBlock(blocks.ETA);
  const formula = molecule.getMolecularFormula();
  expect(formula.formula).toBe('C2H7NO');
  expect(formula.relativeWeight).toBeCloseTo(61.083, 2);
});
