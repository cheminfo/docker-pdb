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
    request.onsuccess = () => resolve(request.result);
    request.addEventListener('error', () => {
      dbPromise = null;
      reject(request.error ?? new Error('IndexedDB open failed'));
    });
  });
  return dbPromise;
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
 */
export async function exportAll(): Promise<BackupData> {
  const [autoSaves, revisions, proteinScenes] = await Promise.all([
    getAllFromStore<AutoSave>('auto-saves'),
    getAllFromStore<Revision>('revisions'),
    getAllFromStore<ProteinScenes>('protein-scenes'),
  ]);
  return {
    version: 1,
    exportedAt: Date.now(),
    autoSaves,
    revisions,
    proteinScenes,
  };
}

/**
 * Replace the contents of every store with the records from a previously
 * exported backup.
 * @param data - Backup produced by `exportAll()`.
 */
export async function importAll(data: BackupData): Promise<void> {
  const db = await openDB();

  function replaceStore<T extends object>(
    storeName: string,
    rows: T[],
    omitKey?: keyof T,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      for (const row of rows) {
        if (omitKey) {
          store.add(
            Object.fromEntries(
              Object.entries(row).filter(([k]) => k !== (omitKey as string)),
            ),
          );
        } else {
          store.put(row);
        }
      }
      tx.oncomplete = () => resolve();
      tx.addEventListener('error', () =>
        reject(tx.error ?? new Error(`replaceStore(${storeName}) failed`)),
      );
    });
  }

  await Promise.all([
    replaceStore('auto-saves', data.autoSaves),
    replaceStore('revisions', data.revisions, 'id'),
    replaceStore('protein-scenes', data.proteinScenes),
  ]);
}
