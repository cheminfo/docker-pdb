import { beforeAll, expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../../../db/getDB.js';
import { buildApp } from '../../server.js';

/**
 * A handful of ligands with attributes worth filtering and sorting on. The
 * idCodes are real OCL codes so the structure search has something to match:
 * benzene is a substructure of toluene, phenol and aniline, but not of hexane.
 */
const LIGANDS = [
  // code, name, mf, mw, smiles, nbPdbs
  ['TOL', 'ACETATE ION toluene', 'C7H8', 92.14, 'Cc1ccccc1', 30],
  ['PHE', 'ACETATE ION phenol', 'C6H6O', 94.11, 'Oc1ccccc1', 10],
  ['ANI', 'KINASE INHIBITOR aniline', 'C6H7N', 93.13, 'Nc1ccccc1', 20],
  ['HEX', 'ACETATE ION hexane', 'C6H14', 86.18, 'CCCCCC', 40],
  ['BEN', 'ACETATE ION benzene', 'C6H6', 78.11, 'c1ccccc1', 0],
];

let app;
let benzeneIdCode;

beforeAll(async () => {
  const { Molecule } = await import('openchemlib');
  const db = await getInMemoryLigandsDB();
  for (const [code, name, mf, mw, smiles, nbPdbs] of LIGANDS) {
    const molecule = Molecule.fromSmiles(smiles);
    const row = db.upsertLigand.get(
      code,
      name,
      mf,
      'NON-POLYMER',
      molecule.getIDCode(),
      '!Bb@C~@',
      mf,
      mw,
      molecule.getAllAtoms(),
    );
    db.molecules.insert(row.id, molecule.getIDCode());
    for (let i = 0; i < nbPdbs; i++) {
      db.insertPdbLigand.run(`P${i.toString().padStart(3, '0')}`, code, 1);
    }
  }
  db.db.exec(
    `UPDATE ligands SET nb_pdbs = (SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = ligands.code)`,
  );
  benzeneIdCode = Molecule.fromSmiles('c1ccccc1').getIDCode();
  app = await buildApp({ db });
});

async function get(url) {
  const response = await app.inject({ method: 'GET', url });

  expect(response.statusCode).toBe(200);

  return JSON.parse(response.body);
}

const codesOf = (body) => body.ligands.map((ligand) => ligand.code);

test('lists every ligand ranked by pdb count, with the exact total', async () => {
  const body = await get('/v1/ligands');

  expect(codesOf(body)).toStrictEqual(['HEX', 'TOL', 'ANI', 'PHE', 'BEN']);
  expect(body.total).toBe(5);
  expect(body.limit).toBe(50);
  expect(body.offset).toBe(0);
});

test('paginates, and total stays the count before pagination', async () => {
  const first = await get('/v1/ligands?limit=2');

  expect(codesOf(first)).toStrictEqual(['HEX', 'TOL']);
  expect(first.total).toBe(5);

  const second = await get('/v1/ligands?limit=2&offset=2');

  expect(codesOf(second)).toStrictEqual(['ANI', 'PHE']);
  expect(second.total).toBe(5);
  expect(second.offset).toBe(2);

  const last = await get('/v1/ligands?limit=2&offset=4');

  expect(codesOf(last)).toStrictEqual(['BEN']);
});

test('smart filter: substring on name', async () => {
  const body = await get('/v1/ligands?smart=name:~acetate');

  expect(codesOf(body).toSorted()).toStrictEqual(['BEN', 'HEX', 'PHE', 'TOL']);
  expect(body.total).toBe(4);
});

test('smart filter: numeric range on mw', async () => {
  const body = await get('/v1/ligands?smart=mw:90..95');

  expect(codesOf(body).toSorted()).toStrictEqual(['ANI', 'PHE', 'TOL']);
  expect(body.total).toBe(3);
});

test('smart filter: several criteria are AND-ed', async () => {
  const body = await get(
    `/v1/ligands?smart=${encodeURIComponent('name:~acetate mw:90..95')}`,
  );

  expect(codesOf(body).toSorted()).toStrictEqual(['PHE', 'TOL']);
});

test('smart filter: a typed % is a LIKE wildcard, not a literal', async () => {
  // smart-sqlite3-filter does not escape LIKE metacharacters, so `%` matches
  // everything rather than the literal character. Pinned here because it is
  // user-visible in the filter box: if upstream starts escaping, this flips
  // to 0 and the change surfaces as a failure rather than a silent shift.
  const body = await get(`/v1/ligands?smart=${encodeURIComponent('name:~%')}`);

  expect(body.total).toBe(5);
});

test('smart filter: an unknown field is a 400, not a silent full listing', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/ligands?smart=nosuchfield:1',
  });

  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body)).toStrictEqual({ error: 'invalid_filter' });
});

test('sort: each column, both directions', async () => {
  expect(codesOf(await get('/v1/ligands?sort=code'))).toStrictEqual([
    'ANI',
    'BEN',
    'HEX',
    'PHE',
    'TOL',
  ]);
  expect(
    codesOf(await get('/v1/ligands?sort=code&direction=desc')),
  ).toStrictEqual(['TOL', 'PHE', 'HEX', 'BEN', 'ANI']);
  expect(codesOf(await get('/v1/ligands?sort=mw'))).toStrictEqual([
    'BEN',
    'HEX',
    'TOL',
    'ANI',
    'PHE',
  ]);
  expect(
    codesOf(await get('/v1/ligands?sort=mw&direction=desc')),
  ).toStrictEqual(['PHE', 'ANI', 'TOL', 'HEX', 'BEN']);
  expect(
    codesOf(await get('/v1/ligands?sort=nbPdbs&direction=desc')),
  ).toStrictEqual(['HEX', 'TOL', 'ANI', 'PHE', 'BEN']);
  expect(codesOf(await get('/v1/ligands?sort=name'))[0]).toBe('BEN');
});

test('sort: an unknown column falls back to the default ranking', async () => {
  const body = await get('/v1/ligands?sort=; DROP TABLE ligands');

  expect(codesOf(body)).toStrictEqual(['HEX', 'TOL', 'ANI', 'PHE', 'BEN']);
});

test('substructure: benzene matches the four rings, not hexane', async () => {
  const body = await get(
    `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}&mode=substructure`,
  );

  expect(codesOf(body).toSorted()).toStrictEqual(['ANI', 'BEN', 'PHE', 'TOL']);
  expect(body.total).toBe(4);
});

test('substructure ranks by mass proximity: the exact match comes first', async () => {
  const body = await get(
    `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}&mode=substructure`,
  );

  expect(codesOf(body)[0]).toBe('BEN');
});

test('structure + smart filter: the filter excludes a structural match', async () => {
  const body = await get(
    `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}&mode=substructure&smart=name:~acetate`,
  );

  // ANI contains benzene but is not an "ACETATE" name; HEX matches the name but
  // has no ring.
  expect(codesOf(body).toSorted()).toStrictEqual(['BEN', 'PHE', 'TOL']);
  expect(body.total).toBe(3);
  // The filtered-out molecules were never screened, not screened then dropped.
  expect(body.stats.screened).toBeLessThanOrEqual(4);
});

test('structure + filter + sort + pagination compose', async () => {
  const url = `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}&mode=substructure&smart=name:~acetate&sort=mw&direction=desc`;
  const all = await get(url);

  expect(codesOf(all)).toStrictEqual(['PHE', 'TOL', 'BEN']);
  expect(all.total).toBe(3);

  const page = await get(`${url}&limit=1&offset=1`);

  expect(codesOf(page)).toStrictEqual(['TOL']);
  expect(page.total).toBe(3);
});

test('similarity: every result carries a score, ranked descending', async () => {
  const body = await get(
    `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}&mode=similarity&minSimilarity=0.1`,
  );

  expect(body.ligands.length).toBeGreaterThan(0);
  expect(body.ligands[0].code).toBe('BEN');
  expect(body.ligands[0].similarity).toBeCloseTo(1, 5);

  const scores = body.ligands.map((ligand) => ligand.similarity);

  expect(scores).toStrictEqual(scores.toSorted((a, b) => b - a));
});

test('exact: matches one ligand, and the filter still applies', async () => {
  const body = await get(
    `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}&mode=exact`,
  );

  expect(codesOf(body)).toStrictEqual(['BEN']);

  const filtered = await get(
    `/v1/ligands?substructure=${encodeURIComponent(benzeneIdCode)}&mode=exact&smart=name:~kinase`,
  );

  expect(filtered.ligands).toStrictEqual([]);
  expect(filtered.total).toBe(0);
});

test('codes: fetches an explicit list, unpaginated', async () => {
  const body = await get('/v1/ligands?codes=TOL,BEN');

  expect(codesOf(body).toSorted()).toStrictEqual(['BEN', 'TOL']);
  expect(body.total).toBe(2);
});
