import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, expect, test } from 'vitest';

import { getInMemoryLigandsDB } from '../../db/getDB.js';

let app;
let db;
let dataDir;
let syncControl;

beforeAll(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'pdb-syncRoutes-'));
  process.env.DATA_DIR = dataDir;
  // Defer the imports so they pick up the patched DATA_DIR.
  syncControl = await import('../../syncControl.js');
  const { buildApp } = await import('../server.js');
  db = await getInMemoryLigandsDB();
  app = await buildApp({ db });
});

afterAll(async () => {
  await app.close();
  db.close();
  await rm(dataDir, { recursive: true, force: true });
});

test('GET /v1/sync/status returns idle state when no markers exist', async () => {
  const response = await app.inject({ method: 'GET', url: '/v1/sync/status' });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.kinds).toStrictEqual(['rsync', 'ccd']);
  expect(body.rsync).toMatchObject({
    kind: 'rsync',
    intervalMs: 24 * 3600 * 1000,
    running: null,
    triggerQueued: null,
  });
  expect(body.ccd).toMatchObject({
    kind: 'ccd',
    intervalMs: 7 * 24 * 3600 * 1000,
    running: null,
    triggerQueued: null,
    lastRefreshedAt: null,
    lastRefresh: null,
  });
});

test('GET /v1/ccd-history surfaces inserted refresh rows in DESC order', async () => {
  db.insertCcdHistory.run(
    '2026-04-01T00:00:00.000Z',
    '2026-04-01T00:05:00.000Z',
    300_000,
    'success',
    30_000,
    42,
    250_000_000,
    null,
  );
  db.insertCcdHistory.run(
    '2026-04-08T00:00:00.000Z',
    '2026-04-08T00:00:02.000Z',
    2_000,
    'failed',
    0,
    0,
    null,
    'HTTP 503',
  );

  const response = await app.inject({
    method: 'GET',
    url: '/v1/ccd-history?limit=5',
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.rows).toHaveLength(2);
  expect(body.rows[0]).toStrictEqual({
    startedAt: '2026-04-08T00:00:00.000Z',
    finishedAt: '2026-04-08T00:00:02.000Z',
    durationMs: 2_000,
    status: 'failed',
    importedCount: 0,
    skippedCount: 0,
    bytesOnDisk: null,
    error: 'HTTP 503',
  });
  expect(body.rows[1].status).toBe('success');

  // /v1/sync/status now surfaces lastRefresh sourced from the same rows.
  const status = await app.inject({ method: 'GET', url: '/v1/sync/status' });

  expect(status.json().ccd.lastRefresh).toMatchObject({
    status: 'failed',
    error: 'HTTP 503',
  });
});

test('POST /v1/sync/trigger queues a marker, dedupes a repeat, refuses while running', async () => {
  const queued = await app.inject({
    method: 'POST',
    url: '/v1/sync/trigger',
    payload: { kind: 'rsync' },
  });

  expect(queued.statusCode).toBe(200);
  expect(queued.json()).toMatchObject({ kind: 'rsync', status: 'queued' });
  expect(syncControl.triggerExists('rsync')).toBe(true);

  const repeat = await app.inject({
    method: 'POST',
    url: '/v1/sync/trigger',
    payload: { kind: 'rsync' },
  });

  expect(repeat.json()).toMatchObject({
    kind: 'rsync',
    status: 'already-queued',
  });

  // Simulate the cron picking up the trigger and starting a run.
  await syncControl.clearTrigger('rsync');
  await syncControl.markRunning('rsync', {
    startedAt: '2026-05-10T12:00:00.000Z',
    type: 'rsync',
    pid: 1234,
  });

  const running = await app.inject({
    method: 'POST',
    url: '/v1/sync/trigger',
    payload: { kind: 'rsync' },
  });

  expect(running.json()).toMatchObject({
    kind: 'rsync',
    status: 'already-running',
  });
  expect(syncControl.triggerExists('rsync')).toBe(false);

  await syncControl.clearRunning('rsync');
});

test('POST /v1/sync/trigger rejects an unknown kind', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/v1/sync/trigger',
    payload: { kind: 'whatever' },
  });

  expect(response.statusCode).toBe(400);
  expect(response.json().error).toContain('rsync');
});
