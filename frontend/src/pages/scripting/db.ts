/**
 * IndexedDB persistence for the Scripting page.
 *
 * Three stores:
 *   auto-saves     – one record per protein, overwritten on every debounced keystroke
 *   revisions      – append-only log of manually-saved snapshots, keyed by protein
 *   protein-scenes – one ordered scene list per protein; initialised from built-ins on first use
 */

const DB_NAME = 'pdb-scripting';
const DB_VERSION = 1;

/** The three stores, in the order a whole-database transaction locks them. */
const ALL_STORES = ['auto-saves', 'revisions', 'protein-scenes'] as const;

let dbPromise: Promise<IDBDatabase> | null = null;

/** Open (or create) the scripting database, memoising the connection. */
function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('auto-saves')) {
        db.createObjectStore('auto-saves', { keyPath: 'pdbId' });
      }
      if (!db.objectStoreNames.contains('revisions')) {
        const store = db.createObjectStore('revisions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-pdb', 'pdbId');
      }
      if (!db.objectStoreNames.contains('protein-scenes')) {
        db.createObjectStore('protein-scenes', { keyPath: 'pdbId' });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      // Another tab upgrading the schema would otherwise block on this
      // connection forever; drop ours so it can proceed.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    // Without this the promise never settles when an upgrade is blocked, and
    // because it is memoised every later caller waits on the same dead promise.
    request.addEventListener('blocked', () => {
      dbPromise = null;
      reject(new Error('IndexedDB is blocked — close other tabs of this app'));
    });
    request.addEventListener('error', () => {
      dbPromise = null;
      reject(request.error ?? new Error('IndexedDB open failed'));
    });
  });
  return dbPromise;
}

/** Normalise a PDB id so lookups are case- and whitespace-insensitive. */
export function normalizePdbId(pdbId: string): string {
  return pdbId.trim().toUpperCase();
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AutoSave {
  pdbId: string;
  code: string;
  updatedAt: number;
}

export interface Revision {
  id?: number;
  pdbId: string;
  label: string;
  code: string;
  savedAt: number;
}

export interface PersistedScene {
  id: string;
  label: string;
  code: string;
  createdAt: number;
}

export interface ProteinScenes {
  pdbId: string;
  scenes: PersistedScene[];
}

// ---------------------------------------------------------------------------
// Auto-save helpers
// ---------------------------------------------------------------------------

/**
 * Return the last auto-saved script for the given protein, or `undefined` if
 * the protein has never been opened before.
 * @param pdbId - Four-character PDB identifier.
 */
export async function getAutoSave(
  pdbId: string,
): Promise<AutoSave | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('auto-saves', 'readonly');
    const request = tx.objectStore('auto-saves').get(pdbId);
    request.onsuccess = () => resolve(request.result as AutoSave | undefined);
    request.addEventListener('error', () =>
      reject(request.error ?? new Error('getAutoSave failed')),
    );
  });
}

/**
 * Persist the current editor code for the given protein.
 * @param save - Auto-save record to write.
 */
export async function setAutoSave(save: AutoSave): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('auto-saves', 'readwrite');
    const request = tx.objectStore('auto-saves').put(save);
    request.onsuccess = () => resolve();
    request.addEventListener('error', () =>
      reject(request.error ?? new Error('setAutoSave failed')),
    );
  });
}

// ---------------------------------------------------------------------------
// Revision helpers
// ---------------------------------------------------------------------------

/**
 * Return all saved revisions for the given protein, newest first.
 * @param pdbId - Four-character PDB identifier.
 */
export async function getRevisions(pdbId: string): Promise<Revision[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('revisions', 'readonly');
    const index = tx.objectStore('revisions').index('by-pdb');
    const request = index.getAll(pdbId);
    request.onsuccess = () => {
      resolve(
        (request.result as Revision[]).toSorted(
          (a, b) => b.savedAt - a.savedAt,
        ),
      );
    };
    request.addEventListener('error', () =>
      reject(request.error ?? new Error('getRevisions failed')),
    );
  });
}

/**
 * Append a new revision and return its auto-incremented ID.
 * @param revision - Revision to persist (without `id`).
 */
export async function addRevision(
  revision: Omit<Revision, 'id'>,
): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('revisions', 'readwrite');
    const request = tx.objectStore('revisions').add(revision);
    request.onsuccess = () => resolve(request.result as number);
    request.addEventListener('error', () =>
      reject(request.error ?? new Error('addRevision failed')),
    );
  });
}

/**
 * Delete a revision by its ID.
 * @param id - Auto-incremented revision ID.
 */
export async function deleteRevision(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('revisions', 'readwrite');
    const request = tx.objectStore('revisions').delete(id);
    request.onsuccess = () => resolve();
    request.addEventListener('error', () =>
      reject(request.error ?? new Error('deleteRevision failed')),
    );
  });
}

// ---------------------------------------------------------------------------
// Per-protein scene helpers
// ---------------------------------------------------------------------------

/**
 * Return the stored scene list for the given protein, or `undefined` if the
 * protein has never been opened.
 * @param pdbId - Four-character PDB identifier.
 */
export async function getProteinScenes(
  pdbId: string,
): Promise<PersistedScene[] | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('protein-scenes', 'readonly');
    const request = tx.objectStore('protein-scenes').get(pdbId);
    request.onsuccess = () => {
      const row = request.result as ProteinScenes | undefined;
      resolve(row?.scenes);
    };
    request.addEventListener('error', () =>
      reject(request.error ?? new Error('getProteinScenes failed')),
    );
  });
}

/**
 * Overwrite the scene list for the given protein.
 * @param pdbId - Four-character PDB identifier.
 * @param scenes - Ordered array of scenes to persist.
 */
export async function setProteinScenes(
  pdbId: string,
  scenes: PersistedScene[],
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('protein-scenes', 'readwrite');
    const request = tx.objectStore('protein-scenes').put({ pdbId, scenes });
    request.onsuccess = () => resolve();
    request.addEventListener('error', () =>
      reject(request.error ?? new Error('setProteinScenes failed')),
    );
  });
}

// ---------------------------------------------------------------------------
// Protein registry
// ---------------------------------------------------------------------------

/**
 * Every protein that has any stored data, sorted alphabetically. Unions the
 * keys of all three stores: a protein normally gets a `protein-scenes` row as
 * soon as it is opened, but an imported backup can carry an auto-save or a
 * revision without one, and such a protein must still appear in the menu.
 */
export async function listProteinIds(): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ALL_STORES, 'readonly');
    const ids = new Set<string>();

    // These two are keyed by pdbId, so their primary keys are the answer.
    for (const storeName of ['auto-saves', 'protein-scenes'] as const) {
      const request = tx.objectStore(storeName).getAllKeys();
      request.onsuccess = () => {
        for (const key of request.result) {
          if (typeof key === 'string') ids.add(key);
        }
      };
    }

    // `revisions` is keyed by an autoIncrement id instead, so the protein has
    // to come from the `by-pdb` index's own keys — `getAllKeys()` on an index
    // would return the primary keys (the revision ids), not the pdbIds.
    // `nextunique` stops at the first revision of each protein.
    const cursorRequest = tx
      .objectStore('revisions')
      .index('by-pdb')
      .openKeyCursor(null, 'nextunique');
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) return;
      // The index is on `pdbId`, so its keys are always strings; anything else
      // would be a corrupt row and has no protein to name.
      if (typeof cursor.key === 'string') ids.add(cursor.key);
      cursor.continue();
    };

    tx.oncomplete = () => resolve([...ids].toSorted());
    tx.addEventListener('error', () =>
      reject(tx.error ?? new Error('listProteinIds failed')),
    );
  });
}

/**
 * Delete every record belonging to one protein — its auto-save, all of its
 * revisions, and its scene list — in a single transaction.
 * @param pdbId - Four-character PDB identifier.
 */
export async function deleteProtein(pdbId: string): Promise<void> {
  const db = await openDB();
  const id = normalizePdbId(pdbId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ALL_STORES, 'readwrite');
    tx.objectStore('auto-saves').delete(id);
    tx.objectStore('protein-scenes').delete(id);
    deleteRevisionsFor(tx.objectStore('revisions'), id);
    tx.oncomplete = () => resolve();
    tx.addEventListener('error', () =>
      reject(tx.error ?? new Error('deleteProtein failed')),
    );
  });
}

// ---------------------------------------------------------------------------
// Backup / restore
// ---------------------------------------------------------------------------

export interface BackupData {
  version: number;
  exportedAt: number;
  autoSaves: AutoSave[];
  revisions: Revision[];
  proteinScenes: ProteinScenes[];
}

/**
 * Return every record in `storeName` as a typed array.
 * @param storeName
 */
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.addEventListener('error', () =>
      reject(
        request.error ?? new Error(`getAllFromStore(${storeName}) failed`),
      ),
    );
  });
}

/**
 * Export every record from every store as a single JSON-serialisable object.
 * Covers every protein, not just the one currently open.
 */
export async function exportAll(): Promise<BackupData> {
  const [autoSaves, revisions, proteinScenes] = await Promise.all([
    getAllFromStore<AutoSave>('auto-saves'),
    getAllFromStore<Revision>('revisions'),
    getAllFromStore<ProteinScenes>('protein-scenes'),
  ]);
  return {
    version: DB_VERSION,
    exportedAt: Date.now(),
    autoSaves,
    revisions,
    proteinScenes,
  };
}

/**
 * Collect the proteins a backup carries data for, normalised.
 * @param data - Backup produced by `exportAll()`.
 * @returns Sorted, de-duplicated PDB identifiers.
 */
export function backupProteinIds(data: BackupData): string[] {
  const ids = new Set<string>();
  for (const row of data.autoSaves) ids.add(normalizePdbId(row.pdbId));
  for (const row of data.revisions) ids.add(normalizePdbId(row.pdbId));
  for (const row of data.proteinScenes) ids.add(normalizePdbId(row.pdbId));
  return [...ids].toSorted();
}

/**
 * Merge a backup into the database, protein by protein.
 *
 * Every protein the backup carries data for is replaced wholesale: its local
 * auto-save, revisions and scenes are dropped first, then the backup's rows
 * are written. Proteins the backup does not mention are left untouched, so a
 * backup taken on another machine adds its work without erasing local work.
 * Replacing a protein wholesale (rather than merging row by row) is what makes
 * importing the same backup twice a no-op instead of duplicating revisions.
 * @param data - Backup produced by `exportAll()`.
 * @returns The proteins that were replaced.
 */
export async function mergeImport(data: BackupData): Promise<string[]> {
  assertBackupShape(data);
  const replacedIds = backupProteinIds(data);
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(ALL_STORES, 'readwrite');
    const autoSaves = tx.objectStore('auto-saves');
    const revisions = tx.objectStore('revisions');
    const proteinScenes = tx.objectStore('protein-scenes');

    // Deletes are queued before the writes below. IndexedDB runs requests in
    // the order they are placed on the transaction, so the keyed stores can't
    // have a just-written row deleted again by this loop.
    for (const id of replacedIds) {
      autoSaves.delete(id);
      proteinScenes.delete(id);
      deleteRevisionsFor(revisions, id);
    }

    for (const row of data.autoSaves) {
      autoSaves.put({ ...row, pdbId: normalizePdbId(row.pdbId) });
    }
    for (const row of data.proteinScenes) {
      proteinScenes.put({ ...row, pdbId: normalizePdbId(row.pdbId) });
    }
    for (const row of data.revisions) {
      // Never reuse the backup's `id`: it is an autoIncrement value that is
      // only meaningful on the machine that wrote it, so writing it here would
      // overwrite an unrelated local revision that happens to share the number.
      // Dropping it lets IndexedDB assign a fresh local key.
      const { id: _ignored, ...rest } = row;
      revisions.add({ ...rest, pdbId: normalizePdbId(row.pdbId) });
    }

    tx.oncomplete = () => resolve(replacedIds);
    tx.addEventListener('error', () =>
      reject(tx.error ?? new Error('mergeImport failed')),
    );
  });
}

/**
 * Queue deletion of every revision belonging to one protein.
 *
 * Uses a key snapshot from the `by-pdb` index rather than a live cursor: a
 * cursor would also walk over rows added later in the same transaction and
 * delete them again.
 * @param store - The open `revisions` object store.
 * @param pdbId - Already-normalised PDB identifier.
 */
function deleteRevisionsFor(store: IDBObjectStore, pdbId: string): void {
  const request = store.index('by-pdb').getAllKeys(IDBKeyRange.only(pdbId));
  request.onsuccess = () => {
    for (const key of request.result) store.delete(key);
  };
}

/**
 * Reject anything that is not a backup before it reaches the database. With
 * per-protein merging a malformed file would otherwise corrupt a subset of
 * proteins, which is far harder to notice than an outright failure.
 * @param data - Parsed JSON to validate.
 */
function assertBackupShape(data: BackupData): void {
  if (
    !Array.isArray(data?.autoSaves) ||
    !Array.isArray(data.revisions) ||
    !Array.isArray(data.proteinScenes)
  ) {
    throw new Error('Not a scripting backup file.');
  }
  if (typeof data.version !== 'number' || data.version > DB_VERSION) {
    throw new Error(
      `Backup version ${String(data.version)} is newer than this app supports.`,
    );
  }
}
