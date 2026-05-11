import { afterAll, beforeAll, expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../../../db/getDB.js';
import { upsertPdbEntrySync } from '../../../db/upsertPdbEntry.js';
import { buildApp } from '../../server.js';

const ENTRIES = [
  {
    id: '1ABC',
    parsed: {
      title: 'Crystal structure of human kinase domain',
      experiment: 'X-RAY DIFFRACTION',
      year: 2024,
      nbResidues: 350,
      nbHelices: 5,
      nbSheets: 4,
      formula: [{ label: 'ATP', mf: 'C10H16N5O13P3', mw: '507.18', number: 2 }],
    },
  },
  {
    id: '1DEF',
    parsed: {
      title: 'Lactamase complex with inhibitor',
      experiment: 'X-RAY DIFFRACTION',
      year: 2023,
      nbResidues: 280,
      nbHelices: 12,
      nbSheets: 0,
      formula: [{ label: 'PEN', mf: 'C16H17N2O5S', mw: '349.4', number: 3 }],
    },
  },
  {
    id: '1GHI',
    parsed: {
      title: 'Cryo-EM structure of ribosome',
      experiment: 'ELECTRON MICROSCOPY',
      year: 2025,
      nbResidues: 1500,
      nbHelices: 8,
      nbSheets: 3,
      formula: [{ label: 'MG', mf: 'Mg', mw: '24.305', number: 1 }],
    },
  },
];

let db;
let app;

beforeAll(async () => {
  db = await getInMemoryLigandsDB();
  for (const { id, parsed } of ENTRIES) {
    upsertPdbEntrySync(db, id, parsed);
  }
  app = await buildApp({ db });
});

afterAll(async () => {
  await app.close();
  db.close();
});

test('GET /v1/pdbs without filters returns all entries', async () => {
  const response = await app.inject({ method: 'GET', url: '/v1/pdbs' });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.docs.map((doc) => doc._id)).toStrictEqual([
    '1ABC',
    '1DEF',
    '1GHI',
  ]);
  expect(body.fts).toBe(false);
  expect(body.smart).toBe(false);
});

test('GET /v1/pdbs?q=kinase uses FTS5 title search', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?q=kinase',
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.docs.map((doc) => doc._id)).toStrictEqual(['1ABC']);
  expect(body.fts).toBe(true);
  expect(body.smart).toBe(false);
});

test('GET /v1/pdbs?smart=year:>=2024 filters via smart-sqlite3-filter', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?smart=year:%3E%3D2024',
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.docs.map((doc) => doc._id)).toStrictEqual(['1ABC', '1GHI']);
  expect(body.smart).toBe(true);
});

test('GET /v1/pdbs?smart=... composes with structured filters via AND', async () => {
  // year >= 2023 AND helices >= 10 → only 1DEF (year 2023, 12 helices).
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?smart=year:%3E%3D2023&helicesMin=10',
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.docs.map((doc) => doc._id)).toStrictEqual(['1DEF']);
  expect(body.smart).toBe(true);
});

test('GET /v1/pdbs?smart=... composes with FTS5 q via AND', async () => {
  // smart matches 1ABC + 1GHI; q=structure matches 1ABC + 1GHI; intersection = both.
  const intersection = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?smart=year:%3E%3D2024&q=structure',
  });

  expect(intersection.statusCode).toBe(200);
  expect(intersection.json().docs.map((doc) => doc._id)).toStrictEqual([
    '1ABC',
    '1GHI',
  ]);

  // smart=ribosome via title:~ → only 1GHI; AND q=kinase (FTS) → empty.
  const empty = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?smart=title:~ribosome&q=kinase',
  });

  expect(empty.statusCode).toBe(200);
  expect(empty.json()).toStrictEqual({ docs: [], fts: true, smart: true });
});

test('GET /v1/pdbs?smart=experiment:X-RAY filters by text field', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?smart=experiment:%5EX-RAY',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json().docs.map((doc) => doc._id)).toStrictEqual([
    '1ABC',
    '1DEF',
  ]);
});

test('GET /v1/pdbs?smart=year:0..1900 returns empty without 500', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?smart=year:0..1900',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toStrictEqual({ docs: [], fts: false, smart: true });
});

test('GET /v1/pdbs?order=year-desc sorts by year descending', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?order=year-desc',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json().docs.map((doc) => doc._id)).toStrictEqual([
    '1GHI', // 2025
    '1ABC', // 2024
    '1DEF', // 2023
  ]);
});

test('GET /v1/pdbs?order=residues sorts by residues ascending', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?order=residues',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json().docs.map((doc) => doc._id)).toStrictEqual([
    '1DEF', // 280
    '1ABC', // 350
    '1GHI', // 1500
  ]);
});

test('GET /v1/pdbs?order=random with same seed is deterministic', async () => {
  const url = '/v1/pdbs?order=random&seed=42';
  const first = await app.inject({ method: 'GET', url });
  const second = await app.inject({ method: 'GET', url });

  expect(first.statusCode).toBe(200);
  expect(second.statusCode).toBe(200);
  // Same seed → same shuffle on every call.
  expect(first.json().docs.map((doc) => doc._id)).toStrictEqual(
    second.json().docs.map((doc) => doc._id),
  );
  // And the set of returned ids is the full collection (no rows dropped).
  expect(
    first
      .json()
      .docs.map((doc) => doc._id)
      .toSorted(),
  ).toStrictEqual(['1ABC', '1DEF', '1GHI']);
});

test('GET /v1/pdbs?order=unknown falls back to id ordering', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/pdbs?order=banana',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json().docs.map((doc) => doc._id)).toStrictEqual([
    '1ABC',
    '1DEF',
    '1GHI',
  ]);
});
