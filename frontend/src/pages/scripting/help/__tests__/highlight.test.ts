import { expect, test } from 'vitest';

import { CONCEPTS } from '../data/concepts.ts';
import { RECIPES } from '../data/recipes.ts';
import { REFERENCE_GROUPS } from '../data/reference.ts';
import { highlightCode } from '../highlight.ts';

/**
 * Rebuild the source from its tokens.
 * @param code - Code to round-trip.
 * @returns The concatenated token values.
 */
function roundTrip(code: string): string {
  return highlightCode(code)
    .map((token) => token.value)
    .join('');
}

test('tokenizes a declaration into keyword, call and string', () => {
  expect(highlightCode("const pdb = ms.loadPDB('x');")).toStrictEqual([
    { kind: 'keyword', value: 'const' },
    { kind: 'plain', value: ' ' },
    { kind: 'plain', value: 'pdb' },
    { kind: 'plain', value: ' = ' },
    { kind: 'plain', value: 'ms' },
    { kind: 'plain', value: '.' },
    { kind: 'function', value: 'loadPDB' },
    { kind: 'plain', value: '(' },
    { kind: 'string', value: "'x'" },
    { kind: 'plain', value: ');' },
  ]);
});

test('a call is still a call when a space precedes the paren', () => {
  const kinds = highlightCode('delay (2);').map((token) => token.kind);

  expect(kinds).toContain('function');
});

test('numbers are tokenized, including decimals', () => {
  expect(highlightCode('zoom(0.75);')).toStrictEqual([
    { kind: 'function', value: 'zoom' },
    { kind: 'plain', value: '(' },
    { kind: 'number', value: '0.75' },
    { kind: 'plain', value: ');' },
  ]);
});

test('a comment swallows the rest of the line but not the next one', () => {
  expect(highlightCode("// pick 'PLP' now\nms.clear();")).toStrictEqual([
    { kind: 'comment', value: "// pick 'PLP' now" },
    { kind: 'plain', value: '\n' },
    { kind: 'plain', value: 'ms' },
    { kind: 'plain', value: '.' },
    { kind: 'function', value: 'clear' },
    { kind: 'plain', value: '();' },
  ]);
});

test('a // inside a string is not a comment', () => {
  expect(highlightCode("echo('http://x');")).toStrictEqual([
    { kind: 'function', value: 'echo' },
    { kind: 'plain', value: '(' },
    { kind: 'string', value: "'http://x'" },
    { kind: 'plain', value: ');' },
  ]);
});

test('an escaped quote does not end the string early', () => {
  expect(highlightCode(String.raw`echo('it\'s');`)).toStrictEqual([
    { kind: 'function', value: 'echo' },
    { kind: 'plain', value: '(' },
    { kind: 'string', value: String.raw`'it\'s'` },
    { kind: 'plain', value: ');' },
  ]);
});

test('every help sample round-trips through the tokenizer unchanged', () => {
  // Highlighting must never drop or alter a character of a sample the reader
  // is about to copy and run.
  const samples = [
    ...CONCEPTS.map((concept) => concept.code),
    ...RECIPES.map((recipe) => recipe.code),
    ...REFERENCE_GROUPS.flatMap((group) =>
      group.entries.map((entry) => entry.example),
    ),
  ].filter((sample) => sample !== undefined);

  expect(samples.length).toBeGreaterThan(50);

  for (const sample of samples) {
    expect(roundTrip(sample)).toBe(sample);
  }
});
