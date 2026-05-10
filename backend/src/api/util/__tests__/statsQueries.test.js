import { beforeEach, expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../../../db/getDB.js';
import { upsertPdbEntrySync } from '../../../db/upsertPdbEntry.js';
import {
  STATS_HANDLERS,
  byYear,
  helicesVsSheets,
  ligandFrequency,
  ligandMwHistogram,
  pairFrequency,
  residuesHistogram,
  secondaryStructurePresence,
} from '../statsQueries.js';

function entry(overrides) {
  return {
    title: 'TEST',
    experiment: 'X-RAY DIFFRACTION',
    year: 2020,
    nbResidues: 100,
    nbModifiedResidues: 0,
    nbChains: 1,
    nbHelices: 0,
    nbSheets: 0,
    iep: 7,
    helices: [],
    sheets: [],
    formula: [],
    chain: {},
    residueStats: {},
    percentageAA: {},
    omega: {
      nbCis: 0,
      nbTrans: 0,
      nbTwisted: 0,
      nbPeptideBonds: 0,
      cisBonds: [],
      twistedBonds: [],
      pairCounts: {},
    },
    ...overrides,
  };
}

let db;

beforeEach(async () => {
  db = await getInMemoryLigandsDB();
});

test('residuesHistogram buckets by configured edges and drops empty buckets', () => {
  upsertPdbEntrySync(db, '1AAA', entry({ nbResidues: 30 }), { rawSize: 1 });
  upsertPdbEntrySync(db, '2AAA', entry({ nbResidues: 75 }), { rawSize: 1 });
  upsertPdbEntrySync(db, '3AAA', entry({ nbResidues: 90 }), { rawSize: 1 });
  upsertPdbEntrySync(db, '4AAA', entry({ nbResidues: 250 }), { rawSize: 1 });
  upsertPdbEntrySync(db, '5AAA', entry({ nbResidues: 12345 }), { rawSize: 1 });

  // 30   → bucket 0     (under 50)
  // 75,90 → bucket 50    (≥50, <100)
  // 250  → bucket 200   (≥200, <500)
  // 12345 → bucket 10000 (overflow)
  expect(residuesHistogram(db)).toStrictEqual({
    rows: [
      { key: 0, value: 1 },
      { key: 50, value: 2 },
      { key: 200, value: 1 },
      { key: 10000, value: 1 },
    ],
  });
});

test('residuesHistogram on an empty DB yields no rows', () => {
  expect(residuesHistogram(db)).toStrictEqual({ rows: [] });
});

test('byYear groups entry counts per deposition year', () => {
  upsertPdbEntrySync(db, '1AAA', entry({ year: 2018 }), { rawSize: 1 });
  upsertPdbEntrySync(db, '2AAA', entry({ year: 2018 }), { rawSize: 1 });
  upsertPdbEntrySync(db, '3AAA', entry({ year: 2020 }), { rawSize: 1 });

  expect(byYear(db)).toStrictEqual({
    rows: [
      { key: 2018, value: 2 },
      { key: 2020, value: 1 },
    ],
  });
});

test('helicesVsSheets returns 2D bin counts with `[h, s]` keys', () => {
  upsertPdbEntrySync(db, '1AAA', entry({ nbHelices: 3, nbSheets: 0 }), {
    rawSize: 1,
  });
  upsertPdbEntrySync(db, '2AAA', entry({ nbHelices: 3, nbSheets: 0 }), {
    rawSize: 1,
  });
  upsertPdbEntrySync(db, '3AAA', entry({ nbHelices: 1, nbSheets: 4 }), {
    rawSize: 1,
  });

  const rows = helicesVsSheets(db).rows.toSorted((a, b) =>
    a.key[0] === b.key[0] ? a.key[1] - b.key[1] : a.key[0] - b.key[0],
  );

  expect(rows).toStrictEqual([
    { key: [1, 4], value: 1 },
    { key: [3, 0], value: 2 },
  ]);
});

test('secondaryStructurePresence labels every entry by helix/sheet presence', () => {
  upsertPdbEntrySync(db, '1AAA', entry({ nbHelices: 0, nbSheets: 0 }), {
    rawSize: 1,
  });
  upsertPdbEntrySync(db, '2AAA', entry({ nbHelices: 2, nbSheets: 0 }), {
    rawSize: 1,
  });
  upsertPdbEntrySync(db, '3AAA', entry({ nbHelices: 0, nbSheets: 1 }), {
    rawSize: 1,
  });
  upsertPdbEntrySync(db, '4AAA', entry({ nbHelices: 1, nbSheets: 1 }), {
    rawSize: 1,
  });
  upsertPdbEntrySync(db, '5AAA', entry({ nbHelices: 3, nbSheets: 2 }), {
    rawSize: 1,
  });

  const byLabel = Object.fromEntries(
    secondaryStructurePresence(db).rows.map((row) => [row.key, row.value]),
  );

  expect(byLabel).toStrictEqual({
    none: 1,
    'helices-only': 1,
    'sheets-only': 1,
    mixed: 2,
  });
});

test('ligandFrequency excludes water and ranks by total occurrences', () => {
  const formula = [
    { label: 'HOH', mf: 'O', mw: '18', number: 50 },
    { label: 'ATP', mf: 'C10H16N5O13P3', mw: '507', number: 1 },
    { label: 'HEM', mf: 'C34H32FeN4O4', mw: '616', number: 2 },
  ];
  upsertPdbEntrySync(db, '1AAA', entry({ formula }), { rawSize: 1 });
  upsertPdbEntrySync(
    db,
    '2AAA',
    entry({ formula: [{ label: 'ATP', mf: 'C10', mw: '507', number: 3 }] }),
    { rawSize: 1 },
  );

  expect(ligandFrequency(db)).toStrictEqual({
    rows: [
      { key: 'ATP', value: 4 },
      { key: 'HEM', value: 2 },
    ],
  });
});

test('ligandMwHistogram buckets ligand MW and excludes water', () => {
  const formula = [
    { label: 'HOH', mf: 'O', mw: '18', number: 1 },
    { label: 'A50', mf: 'C', mw: '50', number: 1 },
    { label: 'A150', mf: 'C', mw: '150', number: 1 },
    { label: 'A300', mf: 'C', mw: '300', number: 1 },
    { label: 'A9999', mf: 'C', mw: '9999', number: 1 },
  ];
  upsertPdbEntrySync(db, '1AAA', entry({ formula }), { rawSize: 1 });

  // Bins: 100, 250, 500, 1000, 2000, 5000.
  // 50    → bucket 0
  // 150   → bucket 100
  // 300   → bucket 250
  // 9999  → bucket 5000 (overflow)
  expect(ligandMwHistogram(db)).toStrictEqual({
    rows: [
      { key: 0, value: 1 },
      { key: 100, value: 1 },
      { key: 250, value: 1 },
      { key: 5000, value: 1 },
    ],
  });
});

test('pairFrequency returns [cis, total] per ordered residue pair', () => {
  const omega = {
    nbCis: 1,
    nbTrans: 4,
    nbTwisted: 0,
    nbPeptideBonds: 5,
    cisBonds: [{ residue1: 'ALA', residue2: 'PRO' }],
    twistedBonds: [],
    pairCounts: { 'ALA:PRO': 5 },
  };
  upsertPdbEntrySync(db, '1AAA', entry({ omega }), { rawSize: 1 });

  const rows = pairFrequency(db).rows;
  const alaPro = rows.find(
    (row) => row.key[0] === 'ALA' && row.key[1] === 'PRO',
  );

  expect(alaPro).toStrictEqual({ key: ['ALA', 'PRO'], value: [1, 5] });
});

test('STATS_HANDLERS exposes every public statsQueries function', () => {
  for (const view of [
    'byYear',
    'byExperiment',
    'helicesVsSheets',
    'secondaryStructurePresence',
    'residuesHistogram',
    'ligandFrequency',
    'ligandMwHistogram',
    'aminoAcidFreq',
    'nucleicBaseFreq',
    'moleculeType',
    'omegaSummary',
    'twistedPairFrequency',
  ]) {
    expect(typeof STATS_HANDLERS[view]).toBe('function');
  }
});
