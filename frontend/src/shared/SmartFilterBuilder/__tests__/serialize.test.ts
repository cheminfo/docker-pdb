import { expect, test } from 'vitest';

import { parse } from '../parse.ts';
import { quoteIfNeeded, serialize, serializeClause } from '../serialize.ts';
import type { Clause } from '../types.ts';

test('empty clauses → empty string', () => {
  expect(serialize([])).toBe('');
});

test('field:value clause with default operator', () => {
  expect(
    serializeClause({ field: 'name', operator: 'default', values: ['John'] }),
  ).toBe('name:John');
});

test('numeric comparison operators emit correct symbols', () => {
  const cases: Array<{ clause: Clause; expected: string }> = [
    {
      clause: { field: 'year', operator: 'gte', values: ['2024'] },
      expected: 'year:>=2024',
    },
    {
      clause: { field: 'year', operator: 'lte', values: ['2024'] },
      expected: 'year:<=2024',
    },
    {
      clause: { field: 'year', operator: 'gt', values: ['2024'] },
      expected: 'year:>2024',
    },
    {
      clause: { field: 'year', operator: 'lt', values: ['2024'] },
      expected: 'year:<2024',
    },
    {
      clause: { field: 'year', operator: 'eq', values: ['2024'] },
      expected: 'year:=2024',
    },
    {
      clause: { field: 'year', operator: 'neq', values: ['2024'] },
      expected: 'year:!=2024',
    },
  ];
  for (const { clause, expected } of cases) {
    expect(serializeClause(clause)).toBe(expected);
  }
});

test('between → low..high', () => {
  expect(
    serializeClause({
      field: 'year',
      operator: 'between',
      values: ['2020', '2023'],
    }),
  ).toBe('year:2020..2023');
});

test('OR list joined with commas', () => {
  expect(
    serializeClause({
      field: 'year',
      operator: 'default',
      values: ['1990', '2000'],
    }),
  ).toBe('year:1990,2000');
});

test('values with whitespace are double-quoted', () => {
  expect(
    serializeClause({
      field: 'experiment',
      operator: 'default',
      values: ['X-RAY DIFFRACTION'],
    }),
  ).toBe('experiment:"X-RAY DIFFRACTION"');
});

test('values with embedded double quotes get single quotes', () => {
  expect(quoteIfNeeded('say "hi" loud')).toBe(`'say "hi" loud'`);
});

test('negation prefix is preserved', () => {
  expect(
    serializeClause({
      field: 'experiment',
      operator: 'default',
      values: ['X-RAY'],
      negate: true,
    }),
  ).toBe('-experiment:X-RAY');
});

test('raw clauses round-trip verbatim', () => {
  expect(
    serializeClause({
      field: null,
      operator: 'default',
      values: [],
      raw: 'something::weird',
    }),
  ).toBe('something::weird');
});

test('AND across clauses joined by single space', () => {
  expect(
    serialize([
      { field: 'title', operator: 'contains', values: ['kinase'] },
      { field: 'year', operator: 'gte', values: ['2024'] },
    ]),
  ).toBe('title:~kinase year:>=2024');
});

test('round-trip: parse → serialize is stable for representative inputs', () => {
  const inputs = [
    'year:>=2024',
    'year:2020..2023',
    'title:~kinase year:>=2024',
    'title:^Crystal',
    'nb_helices:>5 nb_ligands:>=2',
    '-experiment:X-RAY',
    'bson.year:1990,2000',
  ];
  for (const input of inputs) {
    expect(serialize(parse(input))).toBe(input);
  }
});

test('round-trip handles quoted whitespace values', () => {
  const input = 'experiment:"X-RAY DIFFRACTION"';

  expect(serialize(parse(input))).toBe(input);
});
