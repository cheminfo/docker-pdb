/* eslint-disable camelcase --
   Identifiers like `pdb_id` mirror SQL column names. */
import { expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../getDB.js';
import { replacePdbLigandsSync } from '../insertPdbLigands.js';

test('inserts non-water ligands and reports the row count', async () => {
  const db = await getInMemoryLigandsDB();
  const inserted = replacePdbLigandsSync(db, '1ABC', [
    { label: 'ATP', number: 2 },
    { label: 'HEM', number: 1 },
    { label: 'HOH', number: 30 },
  ]);

  expect(inserted).toBe(2);

  const rows = db
    .statement(
      `SELECT pdb_id, ligand_code, count FROM pdb_ligands
       WHERE pdb_id = ? ORDER BY ligand_code`,
    )
    .all('1ABC')
    .map((row) => ({ ...row }));

  expect(rows).toStrictEqual([
    { pdb_id: '1ABC', ligand_code: 'ATP', count: 2 },
    { pdb_id: '1ABC', ligand_code: 'HEM', count: 1 },
  ]);

  db.close();
});

test('rewrite is idempotent: rerunning replaces the previous rows', async () => {
  const db = await getInMemoryLigandsDB();
  replacePdbLigandsSync(db, '1ABC', [{ label: 'ATP', number: 2 }]);
  replacePdbLigandsSync(db, '1ABC', [
    { label: 'HEM', number: 1 },
    { label: 'NAD', number: 3 },
  ]);

  const rows = db
    .statement(
      `SELECT ligand_code, count FROM pdb_ligands WHERE pdb_id = ?
       ORDER BY ligand_code`,
    )
    .all('1ABC')
    .map((row) => ({ ...row }));

  expect(rows).toStrictEqual([
    { ligand_code: 'HEM', count: 1 },
    { ligand_code: 'NAD', count: 3 },
  ]);

  db.close();
});

test('defaults missing count to 1 and skips empty labels', async () => {
  const db = await getInMemoryLigandsDB();
  const inserted = replacePdbLigandsSync(db, '2XYZ', [
    { label: 'ATP' },
    { label: '' },
  ]);

  expect(inserted).toBe(1);

  const row = db
    .statement(`SELECT count FROM pdb_ligands WHERE pdb_id = ?`)
    .get('2XYZ');

  expect(row.count).toBe(1);

  db.close();
});
