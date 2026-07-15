import { IDBFactory, IDBKeyRange as FakeIDBKeyRange } from 'fake-indexeddb';
import { beforeEach, expect, test, vi } from 'vitest';

import type * as DbNamespace from '../db.ts';

type DbModule = typeof DbNamespace;
type BackupData = DbNamespace.BackupData;
type PersistedScene = DbNamespace.PersistedScene;

/**
 * Load `db.ts` against an empty IndexedDB. `db.ts` talks to the browser API
 * directly and memoises its connection in a module-private variable, so the
 * globals and the module registry both have to be reset to isolate tests.
 */
async function freshDb(): Promise<DbModule> {
  globalThis.indexedDB = new IDBFactory();
  globalThis.IDBKeyRange = FakeIDBKeyRange;
  vi.resetModules();
  return import('../db.ts');
}

function scene(id: string, code: string): PersistedScene {
  return { id, label: id, code, createdAt: 0 };
}

function backup(overrides: Partial<BackupData> = {}): BackupData {
  return {
    version: 1,
    exportedAt: 0,
    autoSaves: [],
    revisions: [],
    proteinScenes: [],
    ...overrides,
  };
}

let db: DbModule;

beforeEach(async () => {
  db = await freshDb();
});

test('normalizePdbId trims and uppercases', () => {
  expect(db.normalizePdbId(' 1art ')).toBe('1ART');
});

test('backupProteinIds unions every store and de-duplicates', () => {
  const ids = db.backupProteinIds(
    backup({
      autoSaves: [{ pdbId: '1ART', code: 'a', updatedAt: 1 }],
      revisions: [{ pdbId: '8zxr', label: 'r', code: 'c', savedAt: 1 }],
      proteinScenes: [{ pdbId: '1ART', scenes: [] }],
    }),
  );

  expect(ids).toStrictEqual(['1ART', '8ZXR']);
});

test('listProteinIds unions the three stores', async () => {
  await db.setProteinScenes('1ART', [scene('global', 'x')]);
  await db.setAutoSave({ pdbId: '2XYZ', code: 'auto', updatedAt: 1 });
  await db.addRevision({ pdbId: '3ABC', label: 'r', code: 'c', savedAt: 1 });

  await expect(db.listProteinIds()).resolves.toStrictEqual([
    '1ART',
    '2XYZ',
    '3ABC',
  ]);
});

test('listProteinIds reports a protein with many revisions once', async () => {
  await db.addRevision({ pdbId: '1ART', label: 'a', code: 'c', savedAt: 1 });
  await db.addRevision({ pdbId: '1ART', label: 'b', code: 'c', savedAt: 2 });
  await db.addRevision({ pdbId: '1ART', label: 'c', code: 'c', savedAt: 3 });

  await expect(db.listProteinIds()).resolves.toStrictEqual(['1ART']);
});

test('deleteProtein removes all of one protein and nothing else', async () => {
  await db.setProteinScenes('1ART', [scene('global', 'code-1art')]);
  await db.setAutoSave({ pdbId: '1ART', code: 'auto-1art', updatedAt: 1 });
  await db.addRevision({ pdbId: '1ART', label: 'r1', code: 'c1', savedAt: 1 });
  await db.setProteinScenes('8ZXR', [scene('global', 'code-8zxr')]);
  await db.setAutoSave({ pdbId: '8ZXR', code: 'auto-8zxr', updatedAt: 1 });
  await db.addRevision({ pdbId: '8ZXR', label: 'r2', code: 'c2', savedAt: 1 });

  await db.deleteProtein('1ART');

  await expect(db.getProteinScenes('1ART')).resolves.toBeUndefined();
  await expect(db.getAutoSave('1ART')).resolves.toBeUndefined();
  await expect(db.getRevisions('1ART')).resolves.toStrictEqual([]);
  await expect(db.listProteinIds()).resolves.toStrictEqual(['8ZXR']);

  const keptAutoSave = await db.getAutoSave('8ZXR');
  const keptScenes = await db.getProteinScenes('8ZXR');

  expect(keptAutoSave?.code).toBe('auto-8zxr');
  expect(keptScenes?.[0]?.code).toBe('code-8zxr');
  await expect(db.getRevisions('8ZXR')).resolves.toHaveLength(1);
});

test('mergeImport replaces proteins in the backup and keeps the others', async () => {
  await db.setProteinScenes('1ART', [scene('global', 'local-1art')]);
  await db.setAutoSave({ pdbId: '1ART', code: 'local-auto', updatedAt: 1 });
  await db.setProteinScenes('9LOC', [scene('global', 'local-only')]);
  await db.setAutoSave({
    pdbId: '9LOC',
    code: 'local-only-auto',
    updatedAt: 1,
  });

  const replaced = await db.mergeImport(
    backup({
      autoSaves: [{ pdbId: '1ART', code: 'imported-auto', updatedAt: 2 }],
      proteinScenes: [
        { pdbId: '1ART', scenes: [scene('global', 'imported-1art')] },
        { pdbId: '5NEW', scenes: [scene('global', 'imported-5new')] },
      ],
    }),
  );

  expect(replaced).toStrictEqual(['1ART', '5NEW']);

  const replacedScenes = await db.getProteinScenes('1ART');
  const replacedAutoSave = await db.getAutoSave('1ART');
  const addedScenes = await db.getProteinScenes('5NEW');
  const untouchedScenes = await db.getProteinScenes('9LOC');
  const untouchedAutoSave = await db.getAutoSave('9LOC');

  expect(replacedScenes?.[0]?.code).toBe('imported-1art');
  expect(replacedAutoSave?.code).toBe('imported-auto');
  expect(addedScenes?.[0]?.code).toBe('imported-5new');
  // The "keep the unique ones" requirement.
  expect(untouchedScenes?.[0]?.code).toBe('local-only');
  expect(untouchedAutoSave?.code).toBe('local-only-auto');
  await expect(db.listProteinIds()).resolves.toStrictEqual([
    '1ART',
    '5NEW',
    '9LOC',
  ]);
});

test('mergeImport never lets a backup revision id overwrite a local one', async () => {
  // Both machines number their revisions from 1, so these two unrelated
  // records collide on id 1. The local 8ZXR revision must survive untouched.
  const localId = await db.addRevision({
    pdbId: '8ZXR',
    label: 'local-8zxr',
    code: 'local-code',
    savedAt: 1,
  });

  expect(localId).toBe(1);

  await db.mergeImport(
    backup({
      revisions: [
        { id: 1, pdbId: '1ART', label: 'imported', code: 'x', savedAt: 2 },
      ],
    }),
  );

  const local = await db.getRevisions('8ZXR');

  expect(local).toHaveLength(1);
  expect(local[0]?.label).toBe('local-8zxr');
  expect(local[0]?.id).toBe(1);

  const imported = await db.getRevisions('1ART');

  expect(imported).toHaveLength(1);
  expect(imported[0]?.label).toBe('imported');
  expect(imported[0]?.id).not.toBe(1);
});

test('mergeImport replaces the revisions of a protein it carries', async () => {
  await db.addRevision({
    pdbId: '1ART',
    label: 'old-a',
    code: 'a',
    savedAt: 1,
  });
  await db.addRevision({
    pdbId: '1ART',
    label: 'old-b',
    code: 'b',
    savedAt: 2,
  });

  await db.mergeImport(
    backup({
      revisions: [
        { id: 9, pdbId: '1ART', label: 'new-only', code: 'c', savedAt: 3 },
      ],
    }),
  );

  const revisions = await db.getRevisions('1ART');

  expect(revisions).toHaveLength(1);
  expect(revisions[0]?.label).toBe('new-only');
});

test('mergeImport drops a stale auto-save when the backup covers the protein without one', async () => {
  await db.setAutoSave({ pdbId: '1ART', code: 'stale', updatedAt: 1 });

  await db.mergeImport(
    backup({
      proteinScenes: [{ pdbId: '1ART', scenes: [scene('global', 'fresh')] }],
    }),
  );

  await expect(db.getAutoSave('1ART')).resolves.toBeUndefined();
});

test('importing the same backup twice is a no-op, not a duplicate', async () => {
  const data = backup({
    autoSaves: [{ pdbId: '1ART', code: 'auto', updatedAt: 1 }],
    revisions: [
      { id: 1, pdbId: '1ART', label: 'rev', code: 'c', savedAt: 1 },
      { id: 2, pdbId: '1ART', label: 'rev2', code: 'c2', savedAt: 2 },
    ],
    proteinScenes: [{ pdbId: '1ART', scenes: [scene('global', 'code')] }],
  });

  await db.mergeImport(data);
  await db.mergeImport(data);

  await expect(db.getRevisions('1ART')).resolves.toHaveLength(2);
  await expect(db.listProteinIds()).resolves.toStrictEqual(['1ART']);
});

test('mergeImport normalizes lowercase ids from a hand-edited backup', async () => {
  await db.setProteinScenes('1ART', [scene('global', 'local')]);

  await db.mergeImport(
    backup({
      proteinScenes: [{ pdbId: '1art', scenes: [scene('global', 'imported')] }],
    }),
  );

  const scenes = await db.getProteinScenes('1ART');

  expect(scenes?.[0]?.code).toBe('imported');
  await expect(db.listProteinIds()).resolves.toStrictEqual(['1ART']);
});

test('mergeImport rejects a file that is not a backup', async () => {
  await expect(
    db.mergeImport({ nope: true } as unknown as BackupData),
  ).rejects.toThrow('Not a scripting backup file.');
});

test('mergeImport rejects a backup from a newer schema', async () => {
  await expect(db.mergeImport(backup({ version: 99 }))).rejects.toThrow(
    'Backup version 99 is newer than this app supports.',
  );
});

test('exportAll round-trips every protein through mergeImport', async () => {
  await db.setProteinScenes('1ART', [scene('global', 'code-1art')]);
  await db.setAutoSave({ pdbId: '1ART', code: 'auto', updatedAt: 5 });
  await db.addRevision({ pdbId: '8ZXR', label: 'r', code: 'rc', savedAt: 7 });

  const exported = await db.exportAll();

  expect(exported.version).toBe(1);
  expect(db.backupProteinIds(exported)).toStrictEqual(['1ART', '8ZXR']);

  const other = await freshDb();
  await other.mergeImport(exported);

  const autoSave = await other.getAutoSave('1ART');
  const revisions = await other.getRevisions('8ZXR');

  expect(autoSave?.code).toBe('auto');
  expect(revisions[0]?.label).toBe('r');
  await expect(other.listProteinIds()).resolves.toStrictEqual(['1ART', '8ZXR']);
});
