import { expect, test } from 'vitest';

import { parse } from '../parse.ts';

test('empty input parses to no clauses', () => {
  expect(parse('')).toStrictEqual([]);
  expect(parse('   ')).toStrictEqual([]);
});

test('simple field:value clause', () => {
  expect(parse('name:John')).toStrictEqual([
    { field: 'name', operator: 'default', values: ['John'] },
  ]);
});

test('numeric comparison operators', () => {
  expect(parse('year:>=2024')).toStrictEqual([
    { field: 'year', operator: 'gte', values: ['2024'] },
  ]);
  expect(parse('year:<=2024')).toStrictEqual([
    { field: 'year', operator: 'lte', values: ['2024'] },
  ]);
  expect(parse('year:>2024')).toStrictEqual([
    { field: 'year', operator: 'gt', values: ['2024'] },
  ]);
  expect(parse('year:<2024')).toStrictEqual([
    { field: 'year', operator: 'lt', values: ['2024'] },
  ]);
  expect(parse('year:=2024')).toStrictEqual([
    { field: 'year', operator: 'eq', values: ['2024'] },
  ]);
  expect(parse('year:!=2024')).toStrictEqual([
    { field: 'year', operator: 'neq', values: ['2024'] },
  ]);
});

test('<> is recognised as a synonym of !=', () => {
  expect(parse('year:<>1990,2000')).toStrictEqual([
    { field: 'year', operator: 'neq', values: ['1990', '2000'] },
  ]);
});

test('range operator', () => {
  expect(parse('year:2020..2023')).toStrictEqual([
    { field: 'year', operator: 'between', values: ['2020', '2023'] },
  ]);
});

test('string operators', () => {
  expect(parse('title:~kinase')).toStrictEqual([
    { field: 'title', operator: 'contains', values: ['kinase'] },
  ]);
  expect(parse('title:^Crystal')).toStrictEqual([
    { field: 'title', operator: 'startsWith', values: ['Crystal'] },
  ]);
  expect(parse('title:$ase')).toStrictEqual([
    { field: 'title', operator: 'endsWith', values: ['ase'] },
  ]);
});

test('OR list within a clause', () => {
  expect(parse('year:1990,2000')).toStrictEqual([
    { field: 'year', operator: 'default', values: ['1990', '2000'] },
  ]);
});

test('AND across clauses (space-separated)', () => {
  expect(parse('year:>=2024 nb_helices:>5')).toStrictEqual([
    { field: 'year', operator: 'gte', values: ['2024'] },
    { field: 'nb_helices', operator: 'gt', values: ['5'] },
  ]);
});

test('negation prefix', () => {
  expect(parse('-experiment:X-RAY')).toStrictEqual([
    {
      field: 'experiment',
      operator: 'default',
      values: ['X-RAY'],
      negate: true,
    },
  ]);
});

test('free-text token (no field)', () => {
  expect(parse('John')).toStrictEqual([
    { field: null, operator: 'default', values: ['John'] },
  ]);
});

test('quoted value preserves whitespace', () => {
  expect(parse('experiment:"X-RAY DIFFRACTION"')).toStrictEqual([
    {
      field: 'experiment',
      operator: 'default',
      values: ['X-RAY DIFFRACTION'],
    },
  ]);
});

test('quoted OR-list mixing single and double quotes', () => {
  expect(parse(`experiment:"X-RAY DIFFRACTION",'SOLUTION NMR'`)).toStrictEqual([
    {
      field: 'experiment',
      operator: 'default',
      values: ['X-RAY DIFFRACTION', 'SOLUTION NMR'],
    },
  ]);
});

test('dotted JSON path field name (BSON column)', () => {
  expect(parse('bson.year:1990')).toStrictEqual([
    { field: 'bson.year', operator: 'default', values: ['1990'] },
  ]);
});

test('combined clause with operator + AND', () => {
  expect(parse('title:~kinase year:>=2024')).toStrictEqual([
    { field: 'title', operator: 'contains', values: ['kinase'] },
    { field: 'year', operator: 'gte', values: ['2024'] },
  ]);
});
