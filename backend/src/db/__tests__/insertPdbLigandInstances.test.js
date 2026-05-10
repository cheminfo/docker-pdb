/* eslint-disable camelcase --
   Identifiers like `pdb_id` mirror SQL column names. */
import { expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../getDB.js';
import { replacePdbLigandInstancesSync } from '../insertPdbLigandInstances.js';

const sampleAtoms = [
  { name: 'N', element: 'N', x: -22.484, y: -2.798, z: -0.176 },
  { name: 'CA', element: 'C', x: -22.097, y: -1.858, z: -1.261 },
];

test('inserts non-water ligand instances and reports the row count', async () => {
  const db = await getInMemoryLigandsDB();
  const inserted = replacePdbLigandInstancesSync(db, '3QK2', [
    { code: 'CME', chain: 'A', resSeq: 216, iCode: '', atoms: sampleAtoms },
    {
      code: 'SCN',
      chain: 'A',
      resSeq: 1,
      iCode: '',
      atoms: [{ name: 'S', element: 'S', x: -12.272, y: -30.742, z: 0.463 }],
    },
    // Water and empty-atom rows must be skipped.
    { code: 'HOH', chain: 'A', resSeq: 2001, iCode: '', atoms: sampleAtoms },
    { code: 'EMPTY', chain: 'A', resSeq: 99, iCode: '', atoms: [] },
  ]);

  expect(inserted).toBe(2);

  const rows = db
    .statement(
      `SELECT pdb_id, ligand_code, chain, res_seq, i_code, atoms
       FROM pdb_ligand_instances
       WHERE pdb_id = ? ORDER BY ligand_code, res_seq`,
    )
    .all('3QK2')
    .map((row) => ({ ...row }));

  expect(rows).toStrictEqual([
    {
      pdb_id: '3QK2',
      ligand_code: 'CME',
      chain: 'A',
      res_seq: 216,
      i_code: '',
      atoms: JSON.stringify(sampleAtoms),
    },
    {
      pdb_id: '3QK2',
      ligand_code: 'SCN',
      chain: 'A',
      res_seq: 1,
      i_code: '',
      atoms: JSON.stringify([
        { name: 'S', element: 'S', x: -12.272, y: -30.742, z: 0.463 },
      ]),
    },
  ]);

  db.close();
});

test('rewrite is idempotent: rerunning replaces the previous rows', async () => {
  const db = await getInMemoryLigandsDB();
  replacePdbLigandInstancesSync(db, '3QK2', [
    { code: 'CME', chain: 'A', resSeq: 216, iCode: '', atoms: sampleAtoms },
  ]);
  replacePdbLigandInstancesSync(db, '3QK2', [
    { code: 'NAD', chain: 'B', resSeq: 500, iCode: '', atoms: sampleAtoms },
  ]);

  const rows = db
    .statement(
      `SELECT ligand_code, chain FROM pdb_ligand_instances
       WHERE pdb_id = ? ORDER BY ligand_code`,
    )
    .all('3QK2')
    .map((row) => ({ ...row }));

  expect(rows).toStrictEqual([{ ligand_code: 'NAD', chain: 'B' }]);

  db.close();
});

test('defaults missing iCode to empty string', async () => {
  const db = await getInMemoryLigandsDB();
  const inserted = replacePdbLigandInstancesSync(db, '1ABC', [
    { code: 'ATP', chain: 'A', resSeq: 100, atoms: sampleAtoms },
  ]);

  expect(inserted).toBe(1);

  const row = db
    .statement(`SELECT i_code FROM pdb_ligand_instances WHERE pdb_id = ?`)
    .get('1ABC');

  expect(row.i_code).toBe('');

  db.close();
});
