import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterAll, beforeAll, expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../../../db/getDB.js';
import { ligandSearch } from '../ligandSearch.js';

/**
 * 20 most-cited ligands from pdb.cheminfo.org, stored as a static fixture so
 * the tests run offline. Sourced via `GET /v1/ligands?limit=20`.
 */
const LIGANDS = JSON.parse(
  readFileSync(join(import.meta.dirname, 'fixtures', 'ligands.json'), 'utf8'),
);

let db;

beforeAll(async () => {
  db = await getInMemoryLigandsDB();
  db.db.exec('BEGIN');
  for (const ligand of LIGANDS) {
    const row = db.upsertLigand.get(
      ligand.code,
      ligand.name,
      '',
      '',
      ligand.idCode,
      ligand.coordinates,
      ligand.mf,
      ligand.mw,
      0,
    );
    // openchemlib-sqlite accepts the idCode string directly.
    db.molecules.insert(row.id, ligand.idCode);
  }
  db.db.exec('COMMIT');
});

afterAll(() => db.close());

test('substructure: EDO query matches EDO and GOL, results sorted by MW ascending', () => {
  const edo = LIGANDS.find((l) => l.code === 'EDO');
  const result = ligandSearch({
    db,
    queryIdCode: edo.idCode,
    mode: 'substructure',
  });

  const codes = result.ligands.map((l) => l.code);

  expect(codes).toContain('EDO');
  // Glycerol contains the 1,2-ethanediol fragment.
  expect(codes).toContain('GOL');

  // MW ascending order.
  const mws = result.ligands.map((l) => l.mw);

  expect(mws).toStrictEqual([...mws].toSorted((a, b) => a - b));

  // No similarity scores in substructure mode.
  for (const ligand of result.ligands) {
    expect(ligand.similarity).toBeUndefined();
  }
});

test('substructure: stats include screened count and no overLimit for a small DB', () => {
  const gol = LIGANDS.find((l) => l.code === 'GOL');
  const result = ligandSearch({
    db,
    queryIdCode: gol.idCode,
    mode: 'substructure',
  });

  expect(result.stats.screened).toBeGreaterThanOrEqual(result.ligands.length);
  expect(result.stats.screeningMs).toBeGreaterThanOrEqual(0);
  expect(result.stats.verificationMs).toBe(0);
  expect(result.stats.overLimit).toBe(false);
});

test('similarity: BMA query finds the three C6H12O6 hexose stereoisomers with scores', () => {
  const bma = LIGANDS.find((l) => l.code === 'BMA');
  const result = ligandSearch({
    db,
    queryIdCode: bma.idCode,
    mode: 'similarity',
    minSimilarity: 0.8,
  });

  const codes = result.ligands.map((l) => l.code);

  // BMA, MAN and GLC are C6H12O6 stereoisomers — should score above 0.8.
  expect(codes).toContain('BMA');
  expect(codes).toContain('MAN');
  expect(codes).toContain('GLC');

  // Every result must carry a similarity score between 0 and 1.
  for (const ligand of result.ligands) {
    expect(ligand.similarity).toBeGreaterThan(0);
    expect(ligand.similarity).toBeLessThanOrEqual(1);
  }

  // Results sorted by similarity descending.
  const scores = result.ligands.map((l) => l.similarity);

  expect(scores).toStrictEqual([...scores].toSorted((a, b) => b - a));
});

test('similarity: BMA matches itself with score 1.0 as the top result', () => {
  const bma = LIGANDS.find((l) => l.code === 'BMA');
  const result = ligandSearch({
    db,
    queryIdCode: bma.idCode,
    mode: 'similarity',
    minSimilarity: 0.8,
  });

  expect(result.ligands[0].code).toBe('BMA');
  expect(result.ligands[0].similarity).toBeCloseTo(1, 5);
});

test('similarity: without a threshold every ligand is returned, ranked', () => {
  const bma = LIGANDS.find((l) => l.code === 'BMA');
  const result = ligandSearch({
    db,
    queryIdCode: bma.idCode,
    mode: 'similarity',
  });

  // Ranked by descending similarity, then ascending MW on ties: MPD (118 Da)
  // precedes HEM (616 Da) and ACE (44 Da) precedes DMS (78 Da), both tied.
  expect(result.ligands.map((l) => l.code)).toStrictEqual([
    'BMA',
    'MAN',
    'GLC',
    'FUC',
    'NAG',
    'ADP',
    'ATP',
    'MSE',
    'FAD',
    'MPD',
    'HEM',
    'GOL',
    'PEG',
    'TRS',
    'EDO',
    'ACT',
    'PO4',
    'SO4',
    'ACE',
    'DMS',
  ]);
  expect(result.ligands).toHaveLength(LIGANDS.length);
});

test('exact: ATP query returns exactly one match', () => {
  const atp = LIGANDS.find((l) => l.code === 'ATP');
  const result = ligandSearch({
    db,
    queryIdCode: atp.idCode,
    mode: 'exact',
  });

  expect(result.ligands).toHaveLength(1);
  expect(result.ligands[0].code).toBe('ATP');
  expect(result.ligands[0].similarity).toBeUndefined();
});

test('exact: ADP and ATP do not match each other', () => {
  const adp = LIGANDS.find((l) => l.code === 'ADP');
  const result = ligandSearch({
    db,
    queryIdCode: adp.idCode,
    mode: 'exact',
  });

  expect(result.ligands.every((l) => l.code !== 'ATP')).toBe(true);
});
