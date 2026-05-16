/**
 * Read API helpers that hydrate a `pdb_entries` row (and its child tables)
 * back into the `PdbDoc` shape the frontend and third-party callers expect.
 * The raw .pdb file is no longer attached to the document; it is streamed
 * directly from disk by the API server.
 */

/**
 * Hydrate a single PDB entry from the relational tables.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands database.
 * @param {string} pdbId - Uppercased PDB id.
 * @returns {object | null} Doc-shaped object, or `null` if the row does not exist.
 */
export function readPdbDoc(db, pdbId) {
  const entry = db.selectPdbEntry.get(pdbId);
  if (!entry) return null;
  return assembleDoc(
    entry,
    db.selectPdbChains.all(pdbId),
    db.selectPdbHelices.all(pdbId),
    db.selectPdbSheets.all(pdbId),
    db.selectPdbFormulas.all(pdbId),
  );
}

/**
 * Hydrate multiple PDB entries using 5 batch IN-queries instead of the
 * N×5 per-entry pattern. Reduces query count from O(n) to O(1) regardless
 * of result-set size. The returned array preserves the order of `ids` and
 * silently omits any id that does not exist in the database.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands database.
 * @param {string[]} ids - Uppercased PDB ids (preserves caller order).
 * @returns {object[]} Array of doc-shaped objects (same shape as readPdbDoc).
 */
export function readPdbDocs(db, ids) {
  if (ids.length === 0) return [];
  const ph = ids.map(() => '?').join(',');

  const entries = db
    .statement(
      `SELECT id, title, experiment, year, nb_residues, nb_modified_residues,
              nb_chains, nb_helices, nb_sheets, nb_ligands, iep,
              omega_nb_cis, omega_nb_trans, omega_nb_twisted, omega_nb_peptide_bonds,
              residue_stats_json, percentage_aa_json, has_assembly
       FROM pdb_entries WHERE id IN (${ph})`,
    )
    .all(...ids);

  if (entries.length === 0) return [];

  const entryIds = entries.map((e) => e.id);
  const eph = entryIds.map(() => '?').join(',');

  const chainRows = db
    .statement(
      `SELECT pdb_id, chain_id, molecule, synonym, ec, nb_residues, iep
       FROM pdb_chains WHERE pdb_id IN (${eph}) ORDER BY pdb_id, chain_id`,
    )
    .all(...entryIds);

  const helixRows = db
    .statement(
      `SELECT pdb_id, chain, res_from, res_to, kind
       FROM pdb_helices WHERE pdb_id IN (${eph}) ORDER BY pdb_id, idx`,
    )
    .all(...entryIds);

  const sheetRows = db
    .statement(
      `SELECT pdb_id, chain, res_from, res_to
       FROM pdb_sheets WHERE pdb_id IN (${eph}) ORDER BY pdb_id, idx`,
    )
    .all(...entryIds);

  const formulaRows = db
    .statement(
      `SELECT pdb_id, label, mf, mw, count, name
       FROM pdb_formulas WHERE pdb_id IN (${eph}) ORDER BY pdb_id, label`,
    )
    .all(...entryIds);

  const chainsByPdb = groupByPdbId(chainRows);
  const helicesByPdb = groupByPdbId(helixRows);
  const sheetsByPdb = groupByPdbId(sheetRows);
  const formulasByPdb = groupByPdbId(formulaRows);

  const entryMap = new Map(entries.map((e) => [e.id, e]));
  return ids
    .map((id) => {
      const entry = entryMap.get(id);
      if (!entry) return null;
      return assembleDoc(
        entry,
        chainsByPdb[id] ?? [],
        helicesByPdb[id] ?? [],
        sheetsByPdb[id] ?? [],
        formulasByPdb[id] ?? [],
      );
    })
    .filter(Boolean);
}

function groupByPdbId(rows) {
  const map = {};
  for (const row of rows) {
    if (!map[row.pdb_id]) map[row.pdb_id] = [];
    map[row.pdb_id].push(row);
  }
  return map;
}

function assembleDoc(entry, chains, helices, sheets, formulas) {
  const chain = {};
  for (const row of chains) {
    chain[row.chain_id] = {
      id: row.chain_id,
      molecule: row.molecule ?? undefined,
      synonym: row.synonym ?? undefined,
      ec: row.ec ?? undefined,
      nbResidues: row.nb_residues,
      iep: row.iep ?? undefined,
    };
  }
  return {
    _id: entry.id,
    title: entry.title,
    year: entry.year ?? undefined,
    experiment: entry.experiment ?? undefined,
    nbResidues: entry.nb_residues,
    nbChains: entry.nb_chains,
    nbModifiedResidues: entry.nb_modified_residues,
    nbHelices: entry.nb_helices,
    nbSheets: entry.nb_sheets,
    nbLigands: entry.nb_ligands,
    iep: entry.iep ?? undefined,
    helices: helices.map((row) => ({
      chain: row.chain ?? '',
      from: row.res_from,
      to: row.res_to,
      kind: row.kind ?? undefined,
    })),
    sheets: sheets.map((row) => ({
      chain: row.chain ?? '',
      from: row.res_from,
      to: row.res_to,
    })),
    formula: formulas.map((row) => ({
      label: row.label,
      mf: row.mf ?? '',
      mw: row.mw === null ? '' : String(row.mw),
      number: row.count,
      ...(row.name ? { name: row.name } : {}),
    })),
    chain,
    percentageAA: safeJson(entry.percentage_aa_json) ?? {},
    residueStats: safeJson(entry.residue_stats_json) ?? {},
    omega: {
      nbCis: entry.omega_nb_cis,
      nbTrans: entry.omega_nb_trans,
      nbTwisted: entry.omega_nb_twisted,
      nbPeptideBonds: entry.omega_nb_peptide_bonds,
    },
    hasAssembly: entry.has_assembly === 1,
  };
}

function safeJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
