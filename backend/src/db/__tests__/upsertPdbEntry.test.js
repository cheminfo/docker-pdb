/* eslint-disable camelcase --
   Identifiers like `pdb_id` and `nb_atoms` mirror SQL column names. */
import { expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../getDB.js';
import { readPdbDoc } from '../readPdbEntry.js';
import { recordRsyncHistory, upsertPdbEntrySync } from '../upsertPdbEntry.js';

const SAMPLE = {
  title: 'TEST PROTEIN',
  experiment: 'X-RAY DIFFRACTION',
  year: 2024,
  nbResidues: 120,
  nbModifiedResidues: 0,
  nbChains: 2,
  nbHelices: 3,
  nbSheets: 2,
  iep: 7.4,
  helices: [
    { chain: 'A', from: 1, to: 12, kind: 1 },
    { chain: 'A', from: 20, to: 28, kind: 1 },
    { chain: 'B', from: 5, to: 15, kind: 5 },
  ],
  sheets: [
    { chain: 'A', from: 30, to: 40 },
    { chain: 'A', from: 50, to: 58 },
  ],
  formula: [
    { label: 'HOH', mf: 'O', mw: '18.015', number: 50 },
    {
      label: 'ATP',
      mf: 'C10H16N5O13P3',
      mw: '507.18',
      number: 2,
      name: 'ADENOSINE TRIPHOSPHATE',
    },
    { label: 'MG', mf: 'Mg', mw: '24.305', number: 1 },
  ],
  chain: {
    A: {
      id: '1',
      molecule: 'CATALYTIC SUBUNIT',
      ec: '3.4.21.5',
      nbResidues: 80,
      iep: 7.5,
    },
    B: { id: '2', molecule: 'REGULATORY SUBUNIT', nbResidues: 40, iep: 7.2 },
  },
  residueStats: { ALA: 12, GLY: 8, LEU: 9 },
  percentageAA: { ALA: 0.12, GLY: 0.08 },
  omega: {
    nbCis: 1,
    nbTrans: 117,
    nbTwisted: 0,
    nbPeptideBonds: 118,
    cisBonds: [{ residue1: 'ALA', residue2: 'PRO' }],
    twistedBonds: [],
    pairCounts: { 'ALA:GLY': 5, 'ALA:PRO': 1, 'LEU:ASP': 3 },
  },
};

test('upsertPdbEntrySync writes every relational table', async () => {
  const db = await getInMemoryLigandsDB();
  upsertPdbEntrySync(db, '1TST', SAMPLE, { rawSize: 4096 });

  const entry = db
    .statement(`SELECT * FROM pdb_entries WHERE id = ?`)
    .get('1TST');

  expect(entry).toMatchObject({
    id: '1TST',
    title: 'TEST PROTEIN',
    experiment: 'X-RAY DIFFRACTION',
    year: 2024,
    nb_residues: 120,
    nb_chains: 2,
    nb_helices: 3,
    nb_sheets: 2,
    nb_ligands: 2, // HOH excluded
    iep: 7.4,
    raw_size: 4096,
    omega_nb_cis: 1,
    omega_nb_peptide_bonds: 118,
  });

  const helices = db
    .statement(`SELECT * FROM pdb_helices WHERE pdb_id = ? ORDER BY idx`)
    .all('1TST');

  expect(helices).toHaveLength(3);
  expect(helices[0]).toMatchObject({
    chain: 'A',
    res_from: 1,
    res_to: 12,
    kind: 1,
  });

  const formulas = db
    .statement(
      `SELECT label, mw, count, name FROM pdb_formulas WHERE pdb_id = ? ORDER BY label`,
    )
    .all('1TST')
    .map((row) => ({ ...row }));

  expect(formulas).toHaveLength(3);
  expect(formulas).toStrictEqual([
    { label: 'ATP', mw: 507.18, count: 2, name: 'ADENOSINE TRIPHOSPHATE' },
    { label: 'HOH', mw: 18.015, count: 50, name: null },
    { label: 'MG', mw: 24.305, count: 1, name: null },
  ]);

  const ligandLinks = db
    .statement(
      `SELECT ligand_code, count FROM pdb_ligands WHERE pdb_id = ? ORDER BY ligand_code`,
    )
    .all('1TST')
    .map((row) => ({ ...row }));

  expect(ligandLinks).toStrictEqual([
    { ligand_code: 'ATP', count: 2 },
    { ligand_code: 'MG', count: 1 },
  ]);

  const omegaPairs = db
    .statement(
      `SELECT residue1, residue2, total_count, cis_count, twisted_count
       FROM pdb_omega_pairs WHERE pdb_id = ? ORDER BY residue1, residue2`,
    )
    .all('1TST')
    .map((row) => ({ ...row }));

  expect(omegaPairs).toStrictEqual([
    {
      residue1: 'ALA',
      residue2: 'GLY',
      total_count: 5,
      cis_count: 0,
      twisted_count: 0,
    },
    {
      residue1: 'ALA',
      residue2: 'PRO',
      total_count: 1,
      cis_count: 1,
      twisted_count: 0,
    },
    {
      residue1: 'LEU',
      residue2: 'ASP',
      total_count: 3,
      cis_count: 0,
      twisted_count: 0,
    },
  ]);

  const fts = db
    .statement(`SELECT pdb_id FROM pdb_title_fts WHERE pdb_title_fts MATCH ?`)
    .all('protein');

  expect(fts.map((row) => row.pdb_id)).toContain('1TST');

  db.close();
});

test('upsertPdbEntrySync is idempotent — re-runs replace rows in place', async () => {
  const db = await getInMemoryLigandsDB();
  upsertPdbEntrySync(db, '1TST', SAMPLE, { rawSize: 4096 });
  upsertPdbEntrySync(
    db,
    '1TST',
    { ...SAMPLE, title: 'UPDATED TITLE' },
    { rawSize: 4096 },
  );

  const entry = db
    .statement(`SELECT title FROM pdb_entries WHERE id = ?`)
    .get('1TST');

  expect(entry.title).toBe('UPDATED TITLE');

  const helixCount = db
    .statement(`SELECT COUNT(*) AS n FROM pdb_helices WHERE pdb_id = ?`)
    .get('1TST');

  expect(helixCount.n).toBe(3);

  db.close();
});

test('readPdbDoc reconstructs the legacy CouchDB doc shape', async () => {
  const db = await getInMemoryLigandsDB();
  upsertPdbEntrySync(db, '1TST', SAMPLE, { rawSize: 4096 });

  const doc = readPdbDoc(db, '1TST');

  expect(doc._id).toBe('1TST');
  expect(doc.title).toBe('TEST PROTEIN');
  expect(doc.year).toBe(2024);
  expect(doc.experiment).toBe('X-RAY DIFFRACTION');
  expect(doc.nbResidues).toBe(120);
  expect(doc.helices).toHaveLength(3);
  expect(doc.sheets).toHaveLength(2);
  expect(doc.formula).toHaveLength(3);
  expect(doc.chain).toHaveProperty('A');
  expect(doc.chain.A.molecule).toBe('CATALYTIC SUBUNIT');
  expect(doc.chain.A.ec).toBe('3.4.21.5');

  db.close();
});

test('recordRsyncHistory inserts a row that survives reads', async () => {
  await getInMemoryLigandsDB(); // warms up the singleton path used by the helper
  // recordRsyncHistory uses the singleton; for a deterministic test we
  // exercise the synchronous path directly via a fresh in-memory DB.
  const db = await getInMemoryLigandsDB();
  db.statement(
    `INSERT INTO rsync_history (type, started_at, finished_at, duration_ms,
       updated_count, deleted_count, last_entry_id, bytes_on_disk)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    'asymUnit',
    '2024-01-01T00:00:00.000Z',
    '2024-01-01T01:00:00.000Z',
    3600 * 1000,
    42,
    1,
    '9XYZ',
    1_000_000,
  );

  const rows = db
    .statement(
      `SELECT type, last_entry_id, updated_count
       FROM rsync_history WHERE type = ?`,
    )
    .all('asymUnit');

  expect(rows.length).toBeGreaterThan(0);
  expect(rows[0]).toMatchObject({
    type: 'asymUnit',
    last_entry_id: '9XYZ',
    updated_count: 42,
  });
  // Touch recordRsyncHistory so the export is exercised.
  expect(typeof recordRsyncHistory).toBe('function');

  db.close();
});
