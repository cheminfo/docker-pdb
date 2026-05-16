// Parity tests: every legacy alias must return exactly the same response as
// its `/v1/...` counterpart. The aliases exist for third-party callers that
// were written against the original API and must keep working unchanged.
//
// The fixtures under `backend/fixtures/pdb/` are committed to git, so the
// tests run on a fresh checkout without any rsync.

/* eslint-disable vitest/expect-expect -- assertions live in the `assertParity` helper */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';

import { afterAll, beforeAll, expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../../db/getDB.js';
import {
  markAssemblySync,
  upsertPdbEntrySync,
} from '../../db/upsertPdbEntry.js';
import { parse as parsePdb } from '../../util/pdbParser.js';
import { buildApp } from '../server.js';
import { STATS_HANDLERS } from '../util/statsQueries.js';

const ungzip = promisify(gunzip);
const FIXTURES_DIR = join(import.meta.dirname, '../../../fixtures/pdb');

/** PDBs to seed. Pairs of `[id, relative .ent.gz path under fixtures/pdb/]`. */
const SEEDS = [
  ['101D', '01/pdb101d.ent.gz'],
  ['1CRN', 'cr/pdb1crn.ent.gz'],
  ['4HHB', 'hh/pdb4hhb.ent.gz'],
];

let db;
let app;

beforeAll(async () => {
  db = await getInMemoryLigandsDB();
  for (const [id, fixture] of SEEDS) {
    const gz = readFileSync(join(FIXTURES_DIR, fixture));
    // eslint-disable-next-line no-await-in-loop -- sequential seed
    const buffer = await ungzip(gz);
    const parsed = parsePdb(buffer.toString());
    upsertPdbEntrySync(db, id, parsed, { rawSize: buffer.length });
    markAssemblySync(db, id, buffer.length);
  }
  app = await buildApp({ db });
});

afterAll(async () => {
  await app.close();
  db.close();
});

/**
 * Inject a request twice (v1 + alias) and assert the alias returns exactly
 * the same status code and body as the v1 route.
 * @param {string} v1Url - `/v1/...` URL.
 * @param {string} aliasUrl - Legacy URL expected to mirror it.
 */
async function assertParity(v1Url, aliasUrl) {
  const v1Response = await app.inject({ method: 'GET', url: v1Url });
  const aliasResponse = await app.inject({ method: 'GET', url: aliasUrl });

  expect(aliasResponse.statusCode).toBe(v1Response.statusCode);
  expect(aliasResponse.body).toBe(v1Response.body);
}

test('/pdb/:id mirrors /v1/pdbs/:id for known and unknown ids', async () => {
  for (const [id] of SEEDS) {
    // eslint-disable-next-line no-await-in-loop -- shared app, sequential
    await assertParity(`/v1/pdbs/${id}`, `/pdb/${id}`);
  }
  await assertParity('/v1/pdbs/0XXX', '/pdb/0XXX');
});

test('/pdb/:id response carries the expected document shape', async () => {
  const response = await app.inject({ method: 'GET', url: '/pdb/101D' });
  const body = response.json();

  expect(response.statusCode).toBe(200);
  expect(body._id).toBe('101D');
  expect(typeof body.title).toBe('string');
  expect(typeof body.nbResidues).toBe('number');
  expect(Array.isArray(body.helices)).toBe(true);
  expect(Array.isArray(body.sheets)).toBe(true);
  expect(Array.isArray(body.formula)).toBe(true);
  expect(typeof body.chain).toBe('object');
});

test('/stats/:view mirrors /v1/stats/:view for every registered view', async () => {
  for (const view of Object.keys(STATS_HANDLERS)) {
    // eslint-disable-next-line no-await-in-loop -- shared app, sequential
    await assertParity(`/v1/stats/${view}`, `/stats/${view}`);
  }
});

test('/stats/:view rejects unknown views the same way the v1 route does', async () => {
  await assertParity('/v1/stats/bogusView', '/stats/bogusView');

  const response = await app.inject({ method: 'GET', url: '/stats/bogusView' });

  expect(response.statusCode).toBe(404);
  expect(response.json()).toStrictEqual({ error: 'unknown_view' });
});

test('/stats/byYear returns one row per seeded year', async () => {
  const response = await app.inject({ method: 'GET', url: '/stats/byYear' });
  const body = response.json();

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(body.rows)).toBe(true);
  expect(body.rows.length).toBeGreaterThan(0);

  for (const row of body.rows) {
    expect(typeof row.key).toBe('number');
    expect(typeof row.value).toBe('number');
  }
});

test('/stats/helicesStats returns the un-grouped reduce envelope', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/stats/helicesStats',
  });
  const body = response.json();

  expect(response.statusCode).toBe(200);
  expect(body.rows).toHaveLength(1);
  expect(body.rows[0].key).toBeNull();
  expect(body.rows[0].value).toMatchObject({
    sum: expect.any(Number),
    count: expect.any(Number),
    min: expect.any(Number),
    max: expect.any(Number),
    sumsqr: expect.any(Number),
  });
});

test('/stats/pairFrequency mirrors /v1/stats/pairFrequency', async () => {
  await assertParity('/v1/stats/pairFrequency', '/stats/pairFrequency');
  await assertParity(
    '/v1/stats/pairFrequency?fromYear=1990&toYear=2000',
    '/stats/pairFrequency?fromYear=1990&toYear=2000',
  );
});

test('/view/jsmol mirrors /v1/pdbs/jsmol', async () => {
  await assertParity('/v1/pdbs/jsmol', '/view/jsmol');

  const response = await app.inject({ method: 'GET', url: '/view/jsmol' });
  const body = response.json();

  expect(response.statusCode).toBe(200);
  // eslint-disable-next-line camelcase -- legacy snake_case key preserved for backward compatibility
  expect(body).toMatchObject({ total_rows: expect.any(Number), offset: 0 });
  expect(Array.isArray(body.rows)).toBe(true);
});

test('/assembly/:id/:size mirrors /v1/assemblies/:id/image/:size for error cases', async () => {
  // No PyMol PNGs are written to disk in the test environment, so both routes
  // return the same 404 — and an invalid size yields the same 400.
  await assertParity(
    '/v1/assemblies/4HHB/image/100x100',
    '/assembly/4HHB/100x100',
  );
  await assertParity(
    '/v1/assemblies/4HHB/image/notasize',
    '/assembly/4HHB/notasize',
  );
});

test('/assembly/:id/:filename mirrors /v1/assemblies/:id/raw for PDB filenames', async () => {
  // No .pdb1.gz files on disk in the test environment, so both routes return
  // 404 — but a filename like "4HHB.pdb1" must not be treated as an image size.
  await assertParity('/v1/assemblies/4HHB/raw', '/assembly/4HHB/4HHB.pdb1');
  await assertParity('/v1/assemblies/4HHB/raw', '/assembly/4HHB/4HHB.pdb');
});
