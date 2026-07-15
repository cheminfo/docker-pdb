import { expect, test } from 'vitest';

import {
  buildLigandFilterWhere,
  parseLigandFilters,
} from '../ligandFilters.js';

test('no filter params yield an empty clause', () => {
  const filters = parseLigandFilters({});

  expect(filters).toStrictEqual({
    code: null,
    name: null,
    mf: null,
    mwMin: null,
    mwMax: null,
  });
  expect(buildLigandFilterWhere(filters)).toStrictEqual({
    clause: '',
    params: [],
  });
});

test('blank and non-numeric params are dropped', () => {
  const filters = parseLigandFilters({
    code: ' '.repeat(3),
    name: '',
    mwMin: 'abc',
    mwMax: undefined,
  });

  expect(buildLigandFilterWhere(filters)).toStrictEqual({
    clause: '',
    params: [],
  });
});

test('text filters match as substrings and MW bounds are inclusive', () => {
  const filters = parseLigandFilters({
    code: ' at ',
    name: 'adenosine',
    mf: 'C10',
    mwMin: '100',
    mwMax: '507.18',
  });
  const { clause, params } = buildLigandFilterWhere(filters);

  expect(clause).toBe(
    String.raw` AND l.code LIKE ? ESCAPE '\' AND l.name LIKE ? ESCAPE '\' AND l.mf LIKE ? ESCAPE '\' AND l.mw >= ? AND l.mw <= ?`,
  );
  expect(params).toStrictEqual(['%at%', '%adenosine%', '%C10%', 100, 507.18]);
});

test('LIKE wildcards typed by the user are escaped', () => {
  const { params } = buildLigandFilterWhere(
    parseLigandFilters({ name: '50%_a' }),
  );

  expect(params).toStrictEqual([String.raw`%50\%\_a%`]);
});
