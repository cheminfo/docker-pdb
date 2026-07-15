import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { splitCifBlocks } from '../splitCifBlocks.js';

/**
 * Feed an array of lines as an async iterable, mimicking the `readline`
 * interface `seedCCD` pipes the gunzipped archive through.
 * @param {string[]} lines - Lines to yield.
 * @yields {string} One line at a time.
 */
async function* asyncLines(lines) {
  for (const line of lines) yield line;
}

/**
 * Collect every block yielded by `splitCifBlocks`.
 * @param {string[]} lines - Lines to split.
 * @returns {Promise<string[]>} Raw text of each block.
 */
async function collect(lines) {
  const blocks = [];
  for await (const block of splitCifBlocks(asyncLines(lines))) {
    blocks.push(block);
  }
  return blocks;
}

test('splits the CCD fixture into one block per data_ section', async () => {
  const text = readFileSync(join(import.meta.dirname, 'fixture.cif'), 'utf8');
  const blocks = await collect(text.split('\n'));

  expect(blocks).toHaveLength(4);
  expect(blocks.map((block) => block.split('\n')[0])).toStrictEqual([
    'data_HOH',
    'data_NA',
    'data_BNZ',
    'data_ETA',
  ]);
});

test('keeps each block intact, without leaking the next block', async () => {
  const blocks = await collect(twoBlockCif());

  expect(blocks[1]).toBe(
    'data_NA\n_chem_comp.id NA\n_chem_comp.name "SODIUM ION"',
  );
});

test('yields the trailing block, which no data_ line terminates', async () => {
  const blocks = await collect(['data_A', 'x 1', 'data_B', 'y 2']);

  expect(blocks).toStrictEqual(['data_A\nx 1', 'data_B\ny 2']);
});

test('does not emit an empty leading block for a file starting with data_', async () => {
  const blocks = await collect(['data_A', 'x 1']);

  expect(blocks).toStrictEqual(['data_A\nx 1']);
});

test('keeps preamble lines before the first data_ in the first block', async () => {
  const blocks = await collect(['# comment', 'data_A', 'x 1']);

  expect(blocks).toStrictEqual(['# comment', 'data_A\nx 1']);
});

test('yields nothing for an empty stream', async () => {
  await expect(collect([])).resolves.toStrictEqual([]);
});

/**
 * Two minimal blocks used to assert exact block boundaries.
 * @returns {string[]} Lines of a two-entry CIF.
 */
function twoBlockCif() {
  return [
    'data_HOH',
    '_chem_comp.id HOH',
    'data_NA',
    '_chem_comp.id NA',
    '_chem_comp.name "SODIUM ION"',
  ];
}
