/* eslint-disable camelcase --
   Identifiers like `pdb_id` and `nb_atoms` mirror SQL column names. */
import { test, expect } from 'vitest';

import { getInMemoryLigandsDB } from '../getDB.js';

test('migrations create the ligands schema in an empty database', async () => {
  const db = await getInMemoryLigandsDB();
  const tables = db.db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type IN ('table','view')
       AND name NOT LIKE 'sqlite_%' AND name <> 'schemaversion'
       ORDER BY name`,
    )
    .all()
    .map((row) => row.name);
  expect(tables).toStrictEqual(['ligand_ss_index', 'ligands', 'pdb_ligands']);
  db.close();
});

test('insert + read round-trip through the prepared-statement wrapper', async () => {
  const db = await getInMemoryLigandsDB();
  db.statement(
    `INSERT INTO ligands (code, name, formula, type, id_code, coordinates, mf, mw, nb_atoms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    'BNZ',
    'BENZENE',
    'C6 H6',
    'NON-POLYMER',
    'gFp@DiTt@@@',
    '!coords',
    'C6H6',
    78.114,
    6,
  );

  const row = db
    .statement(
      'SELECT code, name, mf, mw, nb_atoms FROM ligands WHERE code = ?',
    )
    .get('BNZ');
  // node:sqlite rows have a null prototype, so spread into a plain object.
  expect({ ...row }).toStrictEqual({
    code: 'BNZ',
    name: 'BENZENE',
    mf: 'C6H6',
    mw: 78.114,
    nb_atoms: 6,
  });
  db.close();
});

test('ss-index row writes and reads as bigint', async () => {
  const db = await getInMemoryLigandsDB();
  db.statement(
    `INSERT INTO ligands (code, name, formula, type, id_code, coordinates, mf, mw, nb_atoms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    'BNZ',
    'BENZENE',
    'C6 H6',
    'NON-POLYMER',
    'gFp@DiTt@@@',
    '!coords',
    'C6H6',
    78.114,
    6,
  );
  db.statement(
    `INSERT INTO ligand_ss_index
       (code, ss_index0, ss_index1, ss_index2, ss_index3, ss_index4, ss_index5, ss_index6, ss_index7)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run('BNZ', 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n);

  const indexRow = db
    .statement('SELECT * FROM ligand_ss_index WHERE code = ?')
    .get('BNZ');
  expect(indexRow.ss_index0).toBe(1);
  expect(indexRow.ss_index7).toBe(8);
  db.close();
});

test('pdb_ligands link rows can be inserted and queried by ligand', async () => {
  const db = await getInMemoryLigandsDB();
  for (const [pdbId, ligandCode, count] of [
    ['1ABC', 'ATP', 2],
    ['2XYZ', 'ATP', 1],
    ['1ABC', 'HEM', 4],
  ]) {
    db.statement(
      `INSERT INTO pdb_ligands (pdb_id, ligand_code, count)
       VALUES (?, ?, ?)`,
    ).run(pdbId, ligandCode, count);
  }
  const rows = db
    .statement(
      `SELECT pdb_id, count FROM pdb_ligands WHERE ligand_code = ?
       ORDER BY pdb_id`,
    )
    .all('ATP');
  expect(rows.map((row) => ({ ...row }))).toStrictEqual([
    { pdb_id: '1ABC', count: 2 },
    { pdb_id: '2XYZ', count: 1 },
  ]);
  db.close();
});
