import { expect, test } from 'vitest';

import { CONCEPTS } from '../data/concepts.ts';
import { RECIPES } from '../data/recipes.ts';
import { REFERENCE_GROUPS } from '../data/reference.ts';
import { SELECTION_CATEGORIES } from '../data/selections.ts';
import { HELP_INDEX_SIZE, searchHelp } from '../search.ts';

test('a blank query returns nothing', () => {
  expect(searchHelp('')).toStrictEqual([]);
  expect(searchHelp(' '.repeat(3))).toStrictEqual([]);
});

test('finds a method by its exact signature, ranked above code that calls it', () => {
  const results = searchHelp('dihedralStats');

  // The method itself, plus the recipe whose code calls it.
  expect(results.map((result) => result.id)).toStrictEqual([
    'method:pdb-data:pdb.dihedralStats()',
    'recipe:ramachandran',
  ]);
  expect(results[0]?.tab).toBe('reference');
  expect(results[0]?.section).toBe('pdb — the structure and what is in it');
});

test('search is case-insensitive', () => {
  expect(searchHelp('DIHEDRALSTATS')[0]?.id).toBe(
    'method:pdb-data:pdb.dihedralStats()',
  );
});

test('ranks a title match above a body-only match', () => {
  const results = searchHelp('hydrophobicity');

  expect(results.length).toBeGreaterThan(1);
  // The colour form is titled `{ model: 'hydrophobicity' }`; the surface
  // recipe only mentions it in its code.
  expect(results[0]?.id).toBe("color:{ model: 'hydrophobicity' }");
  expect(results.map((result) => result.id)).toContain('recipe:surface');
});

test('every term must match (AND, not OR)', () => {
  const both = searchHelp('ramachandran orthographic');

  expect(both.map((result) => result.id)).toStrictEqual([
    'recipe:ramachandran',
    'method:pdb-models:pdb.createModel(name, options?)',
  ]);

  expect(searchHelp('ramachandran zzzznotathing')).toStrictEqual([]);
});

test('finds a selection expression, keeping its punctuation', () => {
  const results = searchHelp('within 3.5 of PLP');

  expect(results[0]?.id).toBe('selection:distance:within 3.5 of PLP');
  expect(results[0]?.tab).toBe('selections');
});

test('finds a concept by the plain-language question behind it', () => {
  const results = searchHelp('variable');

  expect(results[0]?.id).toBe('concept:variables');
  expect(results[0]?.tab).toBe('basics');
});

test('finds a recipe by its goal rather than its title', () => {
  const results = searchHelp('binding site');

  expect(results.map((result) => result.id)).toContain('recipe:pocket');
});

test('stopwords do not sink a natural-language query', () => {
  // "by" appears in the prose of unrelated entries far more often than in the
  // ones a reader asking this actually wants.
  const results = searchHelp('colour by chain');

  expect(results[0]?.id).toBe('recipe:chains');
  expect(results.map((result) => result.id)).toContain(
    "color:{ model: 'chain' }",
  );
});

test('British prose and the American API spelling match each other', () => {
  // The prose says "colour"; the API says `color`. Both must find both.
  const british = searchHelp('colour');
  const american = searchHelp('color');

  expect(british.map((result) => result.id)).toStrictEqual(
    american.map((result) => result.id),
  );
  expect(american.map((result) => result.id)).toContain(
    'method:channels:selection.atoms.color(spec)',
  );
  expect(british.map((result) => result.id)).toContain(
    'method:channels:selection.atoms.color(spec)',
  );
});

test('a query of nothing but stopwords still searches for them', () => {
  // Falling back to the raw terms beats silently returning nothing.
  expect(searchHelp('the').length).toBeGreaterThan(0);
});

test('selection operators are never treated as stopwords', () => {
  const results = searchHelp('not PLP');

  expect(results[0]?.id).toBe('selection:combining:not PLP');
});

test('the index covers every content module', () => {
  const selectionRows = SELECTION_CATEGORIES.reduce(
    (total, category) => total + category.rows.length,
    0,
  );
  const methods = REFERENCE_GROUPS.reduce(
    (total, group) => total + group.entries.length,
    0,
  );

  // Concepts + selection rows + methods + colour forms + recipes.
  expect(HELP_INDEX_SIZE).toBe(
    CONCEPTS.length + selectionRows + methods + 11 + RECIPES.length,
  );
});

test('every indexed id is unique', () => {
  const ids = searchHelp('a').map((result) => result.id);

  expect(new Set(ids).size).toBe(ids.length);
});
