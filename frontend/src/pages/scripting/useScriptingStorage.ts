import { useCallback, useEffect, useRef, useState } from 'react';

import { useDebouncedValue } from '../../shared/useDebouncedValue.ts';

import type { BackupData, PersistedScene, Revision } from './db.ts';
import {
  addRevision,
  exportAll,
  getAutoSave,
  getProteinScenes,
  getRevisions,
  importAll,
  setAutoSave,
  setProteinScenes,
} from './db.ts';
import { SCENES } from './scenes.ts';

/** ms between the last keystroke and an auto-save write */
const AUTO_SAVE_DEBOUNCE_MS = 2000;

/** Convert built-in SCENES into the persisted format for a fresh protein. */
function defaultScenes(): PersistedScene[] {
  return SCENES.map((s) => ({
    id: s.id,
    label: s.label,
    code: s.code,
    createdAt: 0,
  }));
}

export interface ScriptingStorage {
  /** Scene buttons shown for the current protein. */
  scenes: PersistedScene[];
  /** Saved revisions for the current protein, newest first. */
  revisions: Revision[];
  /**
   * Code that was auto-saved the last time this protein was open.
   * `null` when the protein has never been opened before.
   */
  loadedCode: string | null;
  /** True once IndexedDB has responded (scenes + auto-save are ready). */
  storageReady: boolean;
  /** Add the current editor code as a named scene for this protein. */
  addScene: (label: string, code: string) => Promise<void>;
  /** Remove a scene by its ID. */
  removeScene: (id: string) => Promise<void>;
  /** Persist the current code as a timestamped revision. */
  saveRevision: (label: string, code: string) => Promise<number>;
  /** Download a JSON file containing every stored record. */
  exportBackup: () => Promise<void>;
  /** Overwrite the entire database from a previously exported JSON file. */
  importBackup: (file: File) => Promise<BackupData>;
}

/**
 * Manages all IndexedDB persistence for the Scripting page.
 *
 * - Loads and initialises the scene list when `pdbId` changes.
 * - Auto-saves `code` to IndexedDB after a debounce delay.
 * - Exposes methods for manual save, scene management, and backup.
 * @param pdbId - The currently loaded protein identifier.
 * @param code - The current editor content (watched for auto-save).
 */
export function useScriptingStorage(
  pdbId: string,
  code: string,
): ScriptingStorage {
  const [scenes, setScenesState] = useState<PersistedScene[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loadedCode, setLoadedCode] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  // Avoid saving immediately on mount before we've finished loading.
  const autoSaveEnabled = useRef(false);

  // Load from IndexedDB whenever the protein changes.
  useEffect(() => {
    autoSaveEnabled.current = false;
    let cancelled = false;

    // Defer the "loading" flag to a microtask so it isn't synchronous in the
    // effect body — satisfies the set-state-in-effect lint rule.
    void Promise.resolve().then(() => {
      if (!cancelled) setStorageReady(false);
    });

    async function load() {
      const [storedScenes, autoSave, revs] = await Promise.all([
        getProteinScenes(pdbId),
        getAutoSave(pdbId),
        getRevisions(pdbId),
      ]);
      if (cancelled) return;

      // First visit for this protein → seed with built-in defaults.
      const initialScenes = storedScenes ?? defaultScenes();
      if (!storedScenes) {
        await setProteinScenes(pdbId, initialScenes);
      }

      setScenesState(initialScenes);
      setLoadedCode(autoSave?.code ?? null);
      setRevisions(revs);
      setStorageReady(true);
      autoSaveEnabled.current = true;
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [pdbId]);

  // Debounced auto-save whenever code changes.
  const debouncedCode = useDebouncedValue(code, AUTO_SAVE_DEBOUNCE_MS);
  useEffect(() => {
    if (!autoSaveEnabled.current) return;
    void setAutoSave({ pdbId, code: debouncedCode, updatedAt: Date.now() });
  }, [pdbId, debouncedCode]);

  const addScene = useCallback(
    async (label: string, sceneCode: string) => {
      const scene: PersistedScene = {
        id: `custom-${Date.now()}`,
        label,
        code: sceneCode,
        createdAt: Date.now(),
      };
      const updated = [...scenes, scene];
      await setProteinScenes(pdbId, updated);
      setScenesState(updated);
    },
    [pdbId, scenes],
  );

  const removeScene = useCallback(
    async (id: string) => {
      const updated = scenes.filter((s) => s.id !== id);
      await setProteinScenes(pdbId, updated);
      setScenesState(updated);
    },
    [pdbId, scenes],
  );

  const saveRevision = useCallback(
    async (label: string, revCode: string) => {
      const revision = { pdbId, label, code: revCode, savedAt: Date.now() };
      const id = await addRevision(revision);
      setRevisions((prev) => [{ ...revision, id }, ...prev]);
      return id;
    },
    [pdbId],
  );

  const exportBackup = useCallback(async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pdb-scripting-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importBackup = useCallback(async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text) as BackupData;
    await importAll(data);
    return data;
  }, []);

  return {
    scenes,
    revisions,
    loadedCode,
    storageReady,
    addScene,
    removeScene,
    saveRevision,
    exportBackup,
    importBackup,
  };
}
