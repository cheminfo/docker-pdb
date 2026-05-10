import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, expect, test } from 'vitest';

let syncControl;
let dataDir;

beforeAll(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'pdb-syncControl-'));
  process.env.DATA_DIR = dataDir;
  syncControl = await import('../syncControl.js');
});

afterAll(async () => {
  await rm(dataDir, { recursive: true, force: true });
});

test('readTrigger / readRunning return null when no markers exist', () => {
  expect(syncControl.triggerExists('rsync')).toBe(false);
  expect(syncControl.readTrigger('rsync')).toBeNull();
  expect(syncControl.readRunning('rsync')).toBeNull();
});

test('setTrigger writes a marker that triggerExists / readTrigger see', async () => {
  await syncControl.setTrigger('rsync', { source: 'unit-test' });

  expect(syncControl.triggerExists('rsync')).toBe(true);
  expect(existsSync(syncControl.getTriggerPath('rsync'))).toBe(true);

  const payload = syncControl.readTrigger('rsync');

  expect(payload).toMatchObject({ source: 'unit-test' });
  expect(typeof payload.requestedAt).toBe('string');
});

test('clearTrigger removes the marker', async () => {
  await syncControl.setTrigger('ccd');

  expect(syncControl.triggerExists('ccd')).toBe(true);

  await syncControl.clearTrigger('ccd');

  expect(syncControl.triggerExists('ccd')).toBe(false);
  expect(syncControl.readTrigger('ccd')).toBeNull();
});

test('markRunning / readRunning round-trip the payload', async () => {
  const payload = {
    startedAt: '2026-05-10T12:00:00.000Z',
    type: 'rsync',
    pid: 1234,
    scope: ['asymUnit', 'bioAssembly'],
  };
  await syncControl.markRunning('rsync', payload);

  expect(syncControl.readRunning('rsync')).toStrictEqual(payload);

  await syncControl.clearRunning('rsync');

  expect(syncControl.readRunning('rsync')).toBeNull();
});
