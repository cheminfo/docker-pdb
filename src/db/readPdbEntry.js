/**
 * Read API helpers that hydrate a `pdb_entries` row (and its child tables)
 * back into the document shape the frontend expects.
 *
 * Kept deliberately close to the legacy CouchDB document layout so that
 * removing CouchDB does not force a parallel frontend rewrite — the same
 * `PdbDoc` interface is satisfied, except the `_rev` and `_attachments`
 * fields are no longer carried (the raw .pdb file is streamed directly
 * from disk by the API server).
 */

/**
 * Hydrate a single PDB entry from the relational tables.
 * @param {import('./getDB.js').LigandsDB} db - Open ligands database.
 * @param {string} pdbId - Uppercased PDB id.
 * @returns {object | null} Doc-shaped object, or `null` if the row does not exist.
 */
export function readPdbDoc(db, pdbId) {
  const entry = db
    .statement(
      `SELECT id, title, experiment, year, nb_residues, nb_modified_residues,
              nb_chains, nb_helices, nb_sheets, nb_ligands, iep,
              omega_nb_cis, omega_nb_trans, omega_nb_twisted, omega_nb_peptide_bonds,
              residue_stats_json, percentage_aa_json,
              has_assembly, assembly_size, raw_size
       FROM pdb_entries WHERE id = ?`,
    )
    .get(pdbId);
  if (!entry) return null;

  const chains = db
    .statement(
      `SELECT chain_id, molecule, synonym, ec, nb_residues, iep
       FROM pdb_chains WHERE pdb_id = ? ORDER BY chain_id`,
    )
    .all(pdbId);

  const helices = db
    .statement(
      `SELECT chain, res_from, res_to, kind
       FROM pdb_helices WHERE pdb_id = ? ORDER BY idx`,
    )
    .all(pdbId);

  const sheets = db
    .statement(
      `SELECT chain, res_from, res_to
       FROM pdb_sheets WHERE pdb_id = ? ORDER BY idx`,
    )
    .all(pdbId);

  const formulas = db
    .statement(
      `SELECT label, mf, mw, count, name
       FROM pdb_formulas WHERE pdb_id = ? ORDER BY label`,
    )
    .all(pdbId);

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
      // Frontend treats `mw` as a string (parses it later); preserve that shape.
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
