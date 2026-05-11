import { getLigandsDB } from './getDB.js';

/**
 * Persist a parsed PDB entry into all the relational tables that back the
 * read API and stats charts. The write is fully atomic: every child table
 * (chains, helices, sheets, residue counts, formulas, omega pairs, ligand
 * link table, FTS title row) is replaced inside a single transaction, so a
 * partial parse can never leave the database in a half-updated state.
 *
 * Re-running this for the same `pdbId` is idempotent — old rows are deleted
 * before the new ones are inserted, which makes `npm run rebuild-db` safe to
 * resume after a crash.
 * @param {string} pdbId - Uppercased 4-character PDB identifier.
 * @param {object} parsed - Result of `pdbParser.parse(...)`.
 * @param {object} [options] - Optional metadata about the source files.
 * @param {number} [options.rawSize] - Decompressed size of the .ent file.
 * @param {number} [options.assemblySize] - Decompressed size of the .pdb1.
 * @param {boolean} [options.hasAssembly] - True when a bio-assembly file exists.
 * @param {boolean} [options.skipTransaction] - When true, the function does not
 *   wrap the writes in its own BEGIN/COMMIT — the caller has already opened
 *   an outer transaction (used by the batched rebuild path).
 * @returns {Promise<void>}
 */
export async function upsertPdbEntry(pdbId, parsed, options = {}) {
  const db = await getLigandsDB();
  upsertPdbEntrySync(db, pdbId, parsed, options);
}

/**
 * Synchronous variant for tests and one-shot scripts that already hold a
 * database instance (e.g. an in-memory connection).
 * @param {import('./getDB.js').LigandsDB} db - Open ligands database.
 * @param {string} pdbId - Uppercased 4-character PDB identifier.
 * @param {object} parsed - Result of `pdbParser.parse(...)`.
 * @param {object} [options] - Optional metadata about the source files.
 * @param {number} [options.rawSize] - Decompressed size of the .ent file.
 * @param {number} [options.assemblySize] - Decompressed size of the .pdb1.
 * @param {boolean} [options.hasAssembly] - True when a bio-assembly file exists.
 * @param {boolean} [options.skipTransaction] - When true, the function does not
 *   wrap the writes in its own BEGIN/COMMIT — the caller has already opened
 *   an outer transaction (used by the batched rebuild path).
 * @returns {void}
 */
export function upsertPdbEntrySync(db, pdbId, parsed, options = {}) {
  const omega = parsed.omega || {};
  const residueStats = parsed.residueStats || {};
  const percentageAA = parsed.percentageAA || {};
  const helices = parsed.helices || [];
  const sheets = parsed.sheets || [];
  const formula = parsed.formula || [];
  const chains = parsed.chain || {};
  const pairCounts = omega.pairCounts || {};
  const cisBonds = omega.cisBonds || [];
  const twistedBonds = omega.twistedBonds || [];

  // Aggregate cis / twisted bond counts per (residue1, residue2) pair, since
  // omega.cisBonds / twistedBonds are arrays of individual bonds.
  const cisByPair = new Map();
  for (const bond of cisBonds) {
    if (!bond?.residue1 || !bond?.residue2) continue;
    const key = `${bond.residue1}\t${bond.residue2}`;
    cisByPair.set(key, (cisByPair.get(key) ?? 0) + 1);
  }
  const twistedByPair = new Map();
  for (const bond of twistedBonds) {
    if (!bond?.residue1 || !bond?.residue2) continue;
    const key = `${bond.residue1}\t${bond.residue2}`;
    twistedByPair.set(key, (twistedByPair.get(key) ?? 0) + 1);
  }

  const nbLigands = formula.filter((entry) => entry.label !== 'HOH').length;
  const parsedAt = Date.now();
  const rawSize = Number.isFinite(options.rawSize) ? options.rawSize : null;
  const assemblySize = Number.isFinite(options.assemblySize)
    ? options.assemblySize
    : null;
  const hasAssembly = options.hasAssembly ? 1 : 0;
  const skipTransaction = Boolean(options.skipTransaction);

  if (!skipTransaction) db.db.exec('BEGIN');
  try {
    db.upsertPdbEntry.run(
      pdbId,
      parsed.title || '',
      parsed.experiment || null,
      Number.isFinite(parsed.year) ? parsed.year : null,
      parsed.nbResidues || 0,
      parsed.nbModifiedResidues || 0,
      parsed.nbChains || 0,
      parsed.nbHelices || 0,
      parsed.nbSheets || 0,
      nbLigands,
      Number.isFinite(parsed.iep) ? parsed.iep : null,
      rawSize,
      hasAssembly,
      assemblySize,
      parsedAt,
      omega.nbCis || 0,
      omega.nbTrans || 0,
      omega.nbTwisted || 0,
      omega.nbPeptideBonds || 0,
      JSON.stringify(residueStats),
      JSON.stringify(percentageAA),
    );

    db.deletePdbChains.run(pdbId);
    for (const chainId of Object.keys(chains)) {
      const chain = chains[chainId];
      db.insertPdbChain.run(
        pdbId,
        chainId,
        chain.molecule || null,
        chain.synonym || null,
        chain.ec || null,
        chain.nbResidues || 0,
        Number.isFinite(chain.iep) ? chain.iep : null,
      );
    }

    db.deletePdbResidueCounts.run(pdbId);
    for (const [residue, count] of Object.entries(residueStats)) {
      if (!Number.isFinite(count) || count <= 0) continue;
      db.insertPdbResidueCount.run(pdbId, residue, count);
    }

    db.deletePdbHelices.run(pdbId);
    for (let index = 0; index < helices.length; index++) {
      const helix = helices[index];
      db.insertPdbHelix.run(
        pdbId,
        index,
        helix.chain || null,
        Number.isFinite(helix.from) ? helix.from : 0,
        Number.isFinite(helix.to) ? helix.to : 0,
        Number.isFinite(helix.kind) ? helix.kind : null,
      );
    }

    db.deletePdbSheets.run(pdbId);
    for (let index = 0; index < sheets.length; index++) {
      const sheet = sheets[index];
      db.insertPdbSheet.run(
        pdbId,
        index,
        sheet.chain || null,
        Number.isFinite(sheet.from) ? sheet.from : 0,
        Number.isFinite(sheet.to) ? sheet.to : 0,
      );
    }

    db.deletePdbFormulas.run(pdbId);
    for (const entry of formula) {
      if (!entry?.label) continue;
      const mw = Number.parseFloat(entry.mw);
      db.insertPdbFormula.run(
        pdbId,
        entry.label,
        entry.mf || null,
        Number.isFinite(mw) ? mw : null,
        entry.number || 1,
        entry.name || null,
      );
    }

    db.deletePdbOmegaPairs.run(pdbId);
    for (const [key, total] of Object.entries(pairCounts)) {
      const sep = key.indexOf(':');
      if (sep <= 0) continue;
      const residue1 = key.slice(0, sep);
      const residue2 = key.slice(sep + 1);
      db.insertPdbOmegaPair.run(
        pdbId,
        residue1,
        residue2,
        total,
        cisByPair.get(`${residue1}\t${residue2}`) ?? 0,
        twistedByPair.get(`${residue1}\t${residue2}`) ?? 0,
      );
    }

    db.deletePdbLigands.run(pdbId);
    for (const entry of formula) {
      if (!entry?.label || entry.label === 'HOH') continue;
      db.insertPdbLigand.run(pdbId, entry.label, entry.number || 1);
    }

    db.deletePdbTitleFts.run(pdbId);
    if (parsed.title) {
      db.insertPdbTitleFts.run(pdbId, parsed.title);
    }

    if (!skipTransaction) db.db.exec('COMMIT');
  } catch (error) {
    if (!skipTransaction) db.db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Mark whether a bio-assembly file is available on disk and store its size.
 * Called after the bio-assembly rsync ingest writes the .pdb1 + PNG files.
 * Idempotent: safe to call when the parent `pdb_entries` row does not exist
 * yet (creates a stub row so subsequent rebuilds keep the assembly metadata).
 * @param {string} pdbId - Uppercased PDB id.
 * @param {number | null} assemblySize - Decompressed assembly file size, or null.
 * @returns {Promise<void>}
 */
export async function markAssembly(pdbId, assemblySize) {
  const db = await getLigandsDB();
  markAssemblySync(db, pdbId, assemblySize);
}

/**
 * Synchronous variant of {@link markAssembly}.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands database.
 * @param {string} pdbId - Uppercased PDB id.
 * @param {number | null} assemblySize - Decompressed assembly file size, or null.
 * @returns {void}
 */
export function markAssemblySync(db, pdbId, assemblySize) {
  db.markPdbAssembly.run(pdbId, assemblySize, Date.now());
}

/**
 * Append a row to `rsync_history` describing a completed rsync run. Failures
 * are caught and logged by the caller — the cron loop must keep running.
 * @param {{ type: 'asymUnit' | 'bioAssembly', startedAt: string,
 *   finishedAt: string, durationMs: number, updatedCount: number,
 *   deletedCount: number, lastEntryId: string | null,
 *   bytesOnDisk: number | null }} run - Completed rsync run summary.
 * @returns {Promise<void>}
 */
export async function recordRsyncHistory(run) {
  const db = await getLigandsDB();
  db.insertRsyncHistory.run(
    run.type,
    run.startedAt,
    run.finishedAt,
    run.durationMs,
    run.updatedCount,
    run.deletedCount,
    run.lastEntryId,
    run.bytesOnDisk,
  );
}

/**
 * Append a row to `ccd_history` describing a completed CCD refresh run
 * (whether it succeeded or failed). Failures inside this helper are
 * surfaced to the caller; the cron loop must decide whether to swallow
 * them — same contract as {@link recordRsyncHistory}.
 * @param {{ startedAt: string, finishedAt: string, durationMs: number,
 *   status: 'success' | 'failed', importedCount: number,
 *   skippedCount: number, bytesOnDisk: number | null,
 *   error: string | null }} run - Completed CCD refresh summary.
 * @returns {Promise<void>}
 */
export async function recordCcdHistory(run) {
  const db = await getLigandsDB();
  db.insertCcdHistory.run(
    run.startedAt,
    run.finishedAt,
    run.durationMs,
    run.status,
    run.importedCount,
    run.skippedCount,
    run.bytesOnDisk,
    run.error,
  );
}
