import OCL from 'openchemlib';
import { afterAll, beforeAll, expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../../db/getDB.js';
import { buildApp } from '../server.js';

let db;
let app;

beforeAll(async () => {
  db = await getInMemoryLigandsDB();
  // Seed three ligands: benzene (BNZ), naphthalene (NAP), ethanol (ETH).
  // Substructure benzene should match BNZ + NAP, not ETH.
  for (const [code, smiles, name] of [
    ['BNZ', 'c1ccccc1', 'BENZENE'],
    ['NAP', 'c1ccc2ccccc2c1', 'NAPHTHALENE'],
    ['ETH', 'CCO', 'ETHANOL'],
  ]) {
    const molecule = OCL.Molecule.fromSmiles(smiles);
    const { idCode, coordinates } = molecule.getIDCodeAndCoordinates();
    const formula = molecule.getMolecularFormula();
    const { id } = db.upsertLigand.get(
      code,
      name,
      formula.formula,
      'NON-POLYMER',
      idCode,
      coordinates,
      formula.formula,
      formula.relativeWeight,
      molecule.getAllAtoms(),
    );
    db.molecules.insert(id, molecule);
  }
  // Three PDBs link to BNZ, two to NAP, none to ETH.
  for (const [pdbId, code] of [
    ['1AAA', 'BNZ'],
    ['1BBB', 'BNZ'],
    ['1CCC', 'BNZ'],
    ['2AAA', 'NAP'],
    ['2BBB', 'NAP'],
  ]) {
    db.statement(
      `INSERT INTO pdb_ligands (pdb_id, ligand_code, count) VALUES (?, ?, 1)`,
    ).run(pdbId, code);
  }
  app = await buildApp({ db });
});

afterAll(async () => {
  await app.close();
  db.close();
});

test('GET /v1/ligands returns a default ranking when no substructure is provided', async () => {
  const response = await app.inject({ method: 'GET', url: '/v1/ligands' });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.ligands.map((row) => row.code)).toStrictEqual([
    'BNZ',
    'NAP',
    'ETH',
  ]);
  expect(body.ligands[0]).toMatchObject({
    code: 'BNZ',
    name: 'BENZENE',
    nbPdbs: 3,
  });
});

test('GET /v1/ligands?substructure=<benzene> returns BNZ + NAP and stats', async () => {
  const benzeneIdCode = OCL.Molecule.fromSmiles('c1ccccc1').getIDCode();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}`,
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();
  const codes = body.ligands.map((row) => row.code).toSorted();

  expect(codes).toStrictEqual(['BNZ', 'NAP']);
  expect(body.stats.verified).toBeGreaterThanOrEqual(2);
});

test('GET /v1/ligands/:code returns a ligand row or 404', async () => {
  const ok = await app.inject({ method: 'GET', url: '/v1/ligands/BNZ' });

  expect(ok.statusCode).toBe(200);
  expect(ok.json().ligand).toMatchObject({
    code: 'BNZ',
    name: 'BENZENE',
    nbPdbs: 3,
  });

  const missing = await app.inject({ method: 'GET', url: '/v1/ligands/XXX' });

  expect(missing.statusCode).toBe(404);
});

test('GET /v1/ligands/:code/pdbs paginates the link table', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/ligands/BNZ/pdbs?limit=2&offset=0',
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body).toMatchObject({ total: 3, limit: 2, offset: 0 });
  expect(body.pdbs.map((row) => row.pdbId)).toStrictEqual(['1AAA', '1BBB']);

  const page2 = await app.inject({
    method: 'GET',
    url: '/v1/ligands/BNZ/pdbs?limit=2&offset=2',
  });

  expect(page2.json().pdbs.map((row) => row.pdbId)).toStrictEqual(['1CCC']);
});

// Legacy alias parity (`/pdb/:id`, `/stats/:view`, `/stats/pairFrequency`,
// `/assembly/:id/:size`, `/view/jsmol`) is covered with a seeded PDB dataset
// in `legacyAliases.test.js`.
