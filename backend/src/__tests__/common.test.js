import { expect, test } from 'vitest';

import { asymUnitPath, bioAssemblyPath, getIdFromFileName } from '../common.js';

test('getIdFromFileName extracts the 4-letter id from an asym-unit filename', () => {
  expect(getIdFromFileName('/data/pdb/ab/pdb1abc.ent.gz')).toBe('1abc');
});

test('getIdFromFileName extracts the 4-letter id from a bio-assembly filename', () => {
  expect(getIdFromFileName('/data/pdb-assembly/ab/1abc.pdb1.gz')).toBe('1abc');
});

test('getIdFromFileName returns the input unchanged when the regex does not match', () => {
  // The regex anchors on `<path>/pdb<id>.ent.gz` or `<path>/<id>.pdb1.gz`
  // — a basename without a leading directory slash does not match either
  // alternative, so the function passes the string through untouched.
  expect(getIdFromFileName('pdb5aby.ent.gz')).toBe('pdb5aby.ent.gz');
});

test('asymUnitPath builds the canonical wwPDB-divided path', () => {
  expect(asymUnitPath('/data/pdb', '5ABY')).toBe('/data/pdb/ab/pdb5aby.ent.gz');
});

test('asymUnitPath lowercases the id before bucketing', () => {
  expect(asymUnitPath('/data/pdb', '4HHB')).toBe('/data/pdb/hh/pdb4hhb.ent.gz');
});

test('bioAssemblyPath builds the canonical wwPDB-divided path', () => {
  expect(bioAssemblyPath('/data/pdb-assembly', '101D')).toBe(
    '/data/pdb-assembly/01/101d.pdb1.gz',
  );
});

test('bioAssemblyPath accepts a trailing-slash root', () => {
  // join() collapses redundant slashes — exercising that the helper does
  // not double-up separators when the caller passes a slash-terminated root.
  expect(bioAssemblyPath('/data/pdb-assembly/', '7zzo')).toBe(
    '/data/pdb-assembly/zz/7zzo.pdb1.gz',
  );
});
