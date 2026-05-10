// Pure SQL re-implementations of the CouchDB `_design/stats` reduce views.
// Every helper returns the same response shape the frontend already expects
// (`{ rows: [{ key, value }] }` for grouped reduce views, `{ rows: [{ key:
// null, value: { sum, count, min, max, sumsqr } }] }` for `_stats` reduces),
// so the chart components do not need to change when we drop CouchDB.
//
// Each named export below is a thin wrapper around a single grouped SQL
// query and shares the same `(db: LigandsDB) => CouchView` signature; per-
// function JSDoc would just restate the function name, so we disable the
// require-jsdoc rule for the whole file.

/* eslint-disable jsdoc/require-jsdoc -- single-line view-shaped wrappers */

const STANDARD_AA = [
  'ALA',
  'ARG',
  'ASN',
  'ASP',
  'CYS',
  'GLU',
  'GLN',
  'GLY',
  'HIS',
  'ILE',
  'LEU',
  'LYS',
  'MET',
  'PHE',
  'PRO',
  'SER',
  'THR',
  'TRP',
  'TYR',
  'VAL',
];
const NUCLEIC_BASES = ['DA', 'DC', 'DG', 'DT', 'DU', 'A', 'C', 'G', 'U', 'T'];

const RESIDUES_HISTOGRAM_BINS = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
const LIGAND_MW_BINS = [100, 250, 500, 1000, 2000, 5000];
const HELIX_SHEET_LENGTH_LIMIT = 200;

/**
 * Wrap a sequence of `[key, value]` pairs into the CouchDB grouped-reduce
 * envelope expected by the chart components.
 * @param {Array<[unknown, number]>} pairs - Key/value pairs.
 * @returns {{ rows: Array<{ key: unknown, value: number }> }} Wrapped response.
 */
function asGroupedRows(pairs) {
  return {
    rows: Array.from(pairs, ([key, value]) => ({ key, value })),
  };
}

/**
 * Strip every column except `key` and `value` and wrap into the CouchDB
 * grouped-reduce envelope. Convenience for SQL queries that already alias
 * the columns to `key` and `value`.
 * @param {Array<{ key: unknown, value: number }>} rows - SQL rows.
 * @returns {{ rows: Array<{ key: unknown, value: number }> }} Wrapped response.
 */
function rowsAsGroupedRows(rows) {
  return { rows: rows.map(({ key, value }) => ({ key, value })) };
}

/**
 * Build a histogram by lower-bound bucketing. Each row contributes 1 to the
 * bucket whose lower bound is the largest entry in `bins` strictly less than
 * or equal to the value (`0` for the first bucket). Empty buckets are
 * dropped, and the result is wrapped in the CouchDB grouped-reduce envelope.
 *
 * Mirrors the shape of the legacy `histogram(<column>, [<bins>])` reduce
 * views from the original CouchDB design docs.
 * @param {object[]} rows - Rows yielding the values to bucket.
 * @param {number[]} bins - Strictly-increasing upper bounds (last bin's upper bound is `Infinity`).
 * @param {(row: unknown) => number} valueOf - Extract the numeric value to bucket from each row.
 * @returns {{ rows: Array<{ key: number, value: number }> }} Grouped-reduce envelope sorted by lower bound.
 */
function histogram(rows, bins, valueOf) {
  const buckets = new Map();
  for (const lower of [0, ...bins]) buckets.set(lower, 0);
  for (const row of rows) {
    const value = valueOf(row);
    let lower = 0;
    let placed = false;
    for (const bin of bins) {
      if (value < bin) {
        buckets.set(lower, (buckets.get(lower) ?? 0) + 1);
        placed = true;
        break;
      }
      lower = bin;
    }
    if (!placed) buckets.set(lower, (buckets.get(lower) ?? 0) + 1);
  }
  return asGroupedRows(
    Array.from(buckets.entries())
      .filter(([, value]) => value > 0)
      .toSorted(([a], [b]) => a - b),
  );
}

/**
 * Compute a `_stats` reduce result over a single integer column.
 * @param {import('../db/getDB.js').LigandsDB} db - Open database.
 * @param {string} sql - Query that selects one numeric column called `v`.
 * @returns {{ rows: [{ key: null, value: { sum: number, count: number, min: number, max: number, sumsqr: number } }] }} CouchDB-shaped envelope.
 */
function computeStats(db, sql) {
  const row = db
    .statement(
      `SELECT
         COALESCE(SUM(v),    0) AS sum,
         COUNT(v)               AS count,
         COALESCE(MIN(v),    0) AS min,
         COALESCE(MAX(v),    0) AS max,
         COALESCE(SUM(v*v),  0) AS sumsqr
       FROM (${sql})`,
    )
    .get();
  return {
    rows: [
      {
        key: null,
        value: {
          sum: row?.sum ?? 0,
          count: row?.count ?? 0,
          min: row?.min ?? 0,
          max: row?.max ?? 0,
          sumsqr: row?.sumsqr ?? 0,
        },
      },
    ],
  };
}

export function byYear(db) {
  const rows = db
    .statement(
      `SELECT year AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
       GROUP BY year
       ORDER BY year`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function byExperiment(db) {
  const rows = db
    .statement(
      `SELECT experiment AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE experiment IS NOT NULL AND experiment <> ''
       GROUP BY experiment
       ORDER BY value DESC`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function helicesStats(db) {
  return computeStats(db, `SELECT nb_helices AS v FROM pdb_entries`);
}

export function sheetsStats(db) {
  return computeStats(db, `SELECT nb_sheets AS v FROM pdb_entries`);
}

export function ligandsStats(db) {
  return computeStats(db, `SELECT nb_ligands AS v FROM pdb_entries`);
}

export function residuesStats(db) {
  return computeStats(
    db,
    `SELECT nb_residues AS v FROM pdb_entries WHERE nb_residues > 0`,
  );
}

export function yearStats(db) {
  return computeStats(
    db,
    `SELECT year AS v FROM pdb_entries WHERE year IS NOT NULL AND year > 0`,
  );
}

export function aminoAcidFreq(db) {
  const placeholders = STANDARD_AA.map(() => '?').join(',');
  const rows = db
    .statement(
      `SELECT residue AS key, SUM(count) AS value
       FROM pdb_residue_counts
       WHERE residue IN (${placeholders})
       GROUP BY residue`,
    )
    .all(...STANDARD_AA);
  return rowsAsGroupedRows(rows);
}

export function nucleicBaseFreq(db) {
  const placeholders = NUCLEIC_BASES.map(() => '?').join(',');
  const rows = db
    .statement(
      `SELECT residue AS key, SUM(count) AS value
       FROM pdb_residue_counts
       WHERE residue IN (${placeholders})
       GROUP BY residue`,
    )
    .all(...NUCLEIC_BASES);
  return rowsAsGroupedRows(rows);
}

export function moleculeType(db) {
  const aaPlaceholders = STANDARD_AA.map(() => '?').join(',');
  const basePlaceholders = NUCLEIC_BASES.map(() => '?').join(',');
  const rows = db
    .statement(
      `WITH per_pdb AS (
         SELECT pdb_id,
                MAX(CASE WHEN residue IN (${aaPlaceholders}) THEN 1 ELSE 0 END) AS has_protein,
                MAX(CASE WHEN residue IN (${basePlaceholders}) THEN 1 ELSE 0 END) AS has_nucleic
         FROM pdb_residue_counts
         GROUP BY pdb_id
       )
       SELECT category AS key, COUNT(*) AS value FROM (
         SELECT
           CASE
             WHEN has_protein = 1 AND has_nucleic = 1 THEN 'hybrid'
             WHEN has_protein = 1                     THEN 'protein'
             WHEN has_nucleic = 1                     THEN 'nucleic'
             ELSE 'other'
           END AS category
         FROM per_pdb
       )
       GROUP BY category`,
    )
    .all(...STANDARD_AA, ...NUCLEIC_BASES);
  return rowsAsGroupedRows(rows);
}

export function modifiedResiduesHist(db) {
  const rows = db
    .statement(
      `SELECT nb_modified_residues AS key, COUNT(*) AS value
       FROM pdb_entries
       GROUP BY nb_modified_residues
       ORDER BY nb_modified_residues`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function helixKindHist(db) {
  const rows = db
    .statement(
      `SELECT kind AS key, COUNT(*) AS value
       FROM pdb_helices
       WHERE kind IS NOT NULL
       GROUP BY kind
       ORDER BY kind`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function helixLengthHist(db) {
  const rows = db
    .statement(
      `SELECT (res_to - res_from + 1) AS key, COUNT(*) AS value
       FROM pdb_helices
       WHERE res_to >= res_from
         AND (res_to - res_from + 1) > 0
         AND (res_to - res_from + 1) < ?
       GROUP BY key
       ORDER BY key`,
    )
    .all(HELIX_SHEET_LENGTH_LIMIT);
  return rowsAsGroupedRows(rows);
}

export function sheetLengthHist(db) {
  const rows = db
    .statement(
      `SELECT (res_to - res_from + 1) AS key, COUNT(*) AS value
       FROM pdb_sheets
       WHERE res_to >= res_from
         AND (res_to - res_from + 1) > 0
         AND (res_to - res_from + 1) < ?
       GROUP BY key
       ORDER BY key`,
    )
    .all(HELIX_SHEET_LENGTH_LIMIT);
  return rowsAsGroupedRows(rows);
}

export function helicesVsSheets(db) {
  const rows = db
    .statement(
      `SELECT nb_helices AS h, nb_sheets AS s, COUNT(*) AS value
       FROM pdb_entries
       GROUP BY nb_helices, nb_sheets`,
    )
    .all();
  return {
    rows: rows.map((row) => ({ key: [row.h, row.s], value: row.value })),
  };
}

export function secondaryStructurePresence(db) {
  const rows = db
    .statement(
      `SELECT label AS key, COUNT(*) AS value FROM (
         SELECT CASE
           WHEN nb_helices = 0 AND nb_sheets = 0 THEN 'none'
           WHEN nb_helices > 0 AND nb_sheets = 0 THEN 'helices-only'
           WHEN nb_helices = 0 AND nb_sheets > 0 THEN 'sheets-only'
           ELSE 'mixed'
         END AS label
         FROM pdb_entries
       )
       GROUP BY label`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function residuesHistogram(db) {
  const all = db
    .statement(`SELECT nb_residues FROM pdb_entries WHERE nb_residues > 0`)
    .all();
  return histogram(all, RESIDUES_HISTOGRAM_BINS, (row) => row.nb_residues);
}

export function chainsHistogram(db) {
  const rows = db
    .statement(
      `SELECT nb_chains AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE nb_chains > 0
       GROUP BY nb_chains
       ORDER BY nb_chains`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function residuesPerChainStats(db) {
  return computeStats(
    db,
    `SELECT (CAST(nb_residues AS REAL) / nb_chains) AS v
     FROM pdb_entries WHERE nb_chains > 0`,
  );
}

export function ligandFrequency(db) {
  const rows = db
    .statement(
      `SELECT label AS key, SUM(count) AS value
       FROM pdb_formulas
       WHERE label <> 'HOH'
       GROUP BY label
       ORDER BY value DESC`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function ligandMwHistogram(db) {
  const all = db
    .statement(
      `SELECT mw FROM pdb_formulas WHERE label <> 'HOH' AND mw IS NOT NULL AND mw > 0`,
    )
    .all();
  return histogram(all, LIGAND_MW_BINS, (row) => row.mw);
}

export function ligandsByYear(db) {
  const rows = db
    .statement(
      `SELECT year                          AS key,
              COALESCE(SUM(nb_ligands), 0)  AS sum,
              COUNT(*)                      AS count,
              COALESCE(MIN(nb_ligands), 0)  AS min,
              COALESCE(MAX(nb_ligands), 0)  AS max,
              COALESCE(SUM(nb_ligands*nb_ligands), 0) AS sumsqr
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
       GROUP BY year
       ORDER BY year`,
    )
    .all();
  return {
    rows: rows.map((row) => ({
      key: row.key,
      value: {
        sum: row.sum,
        count: row.count,
        min: row.min,
        max: row.max,
        sumsqr: row.sumsqr,
      },
    })),
  };
}

export function iepHistogram(db) {
  const rows = db
    .statement(
      `SELECT (CAST(iep * 2 AS INTEGER) / 2.0) AS key, COUNT(*) AS value
       FROM pdb_entries
       WHERE iep IS NOT NULL
       GROUP BY key
       ORDER BY key`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function ecClasses(db) {
  // Each pdb contributes once per top-level EC class (1..7) it has any chain in.
  const rows = db
    .statement(
      `SELECT head AS key, COUNT(DISTINCT pdb_id) AS value FROM (
         SELECT pdb_id, substr(ec, 1, 1) AS head
         FROM pdb_chains
         WHERE ec IS NOT NULL
           AND length(ec) > 0
           AND substr(ec, 1, 1) BETWEEN '1' AND '7'
       )
       GROUP BY head
       ORDER BY head`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function residuesByYear(db) {
  const rows = db
    .statement(
      `SELECT year                            AS key,
              COALESCE(SUM(nb_residues), 0)   AS sum,
              COUNT(*)                        AS count,
              COALESCE(MIN(nb_residues), 0)   AS min,
              COALESCE(MAX(nb_residues), 0)   AS max,
              COALESCE(SUM(nb_residues*nb_residues), 0) AS sumsqr
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
       GROUP BY year
       ORDER BY year`,
    )
    .all();
  return {
    rows: rows.map((row) => ({
      key: row.key,
      value: {
        sum: row.sum,
        count: row.count,
        min: row.min,
        max: row.max,
        sumsqr: row.sumsqr,
      },
    })),
  };
}

export function methodByYear(db) {
  const rows = db
    .statement(
      `SELECT year, experiment, COUNT(*) AS value
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
         AND experiment IS NOT NULL AND experiment <> ''
       GROUP BY year, experiment
       ORDER BY year`,
    )
    .all();
  return {
    rows: rows.map((row) => ({
      key: [row.year, row.experiment],
      value: row.value,
    })),
  };
}

export function omegaSummary(db) {
  const row = db
    .statement(
      `SELECT
         COALESCE(SUM(omega_nb_cis), 0)            AS cis,
         COALESCE(SUM(omega_nb_trans), 0)          AS trans,
         COALESCE(SUM(omega_nb_twisted), 0)        AS twisted,
         COALESCE(SUM(omega_nb_peptide_bonds), 0)  AS total
       FROM pdb_entries
       WHERE omega_nb_peptide_bonds > 0`,
    )
    .get();
  return {
    rows: [
      {
        key: null,
        value: [
          row?.cis ?? 0,
          row?.trans ?? 0,
          row?.twisted ?? 0,
          row?.total ?? 0,
        ],
      },
    ],
  };
}

export function omegaByYear(db) {
  const rows = db
    .statement(
      `SELECT year                                  AS key,
              COALESCE(SUM(omega_nb_cis), 0)        AS cis,
              COALESCE(SUM(omega_nb_trans), 0)      AS trans,
              COALESCE(SUM(omega_nb_twisted), 0)    AS twisted,
              COALESCE(SUM(omega_nb_peptide_bonds), 0) AS total
       FROM pdb_entries
       WHERE year IS NOT NULL AND year > 0
         AND omega_nb_peptide_bonds > 0
       GROUP BY year
       ORDER BY year`,
    )
    .all();
  return {
    rows: rows.map((row) => ({
      key: row.key,
      value: [row.cis, row.trans, row.twisted, row.total],
    })),
  };
}

export function cisCountHistogram(db) {
  const rows = db
    .statement(
      `SELECT omega_nb_cis AS key, COUNT(*) AS value
       FROM pdb_entries
       GROUP BY omega_nb_cis
       ORDER BY omega_nb_cis`,
    )
    .all();
  return rowsAsGroupedRows(rows);
}

export function pairFrequency(db, yearRange) {
  let rows;
  if (yearRange) {
    rows = db
      .statement(
        `SELECT residue1, residue2,
                SUM(cis_count)   AS cis,
                SUM(total_count) AS total
         FROM pdb_omega_pairs op
         JOIN pdb_entries e ON e.id = op.pdb_id
         WHERE e.year IS NOT NULL AND e.year BETWEEN ? AND ?
         GROUP BY residue1, residue2`,
      )
      .all(yearRange[0], yearRange[1]);
  } else {
    rows = db
      .statement(
        `SELECT residue1, residue2,
                SUM(cis_count)   AS cis,
                SUM(total_count) AS total
         FROM pdb_omega_pairs
         GROUP BY residue1, residue2`,
      )
      .all();
  }
  return {
    rows: rows.map((row) => ({
      key: [row.residue1, row.residue2],
      value: [row.cis ?? 0, row.total ?? 0],
    })),
  };
}

export function twistedPairFrequency(db) {
  const rows = db
    .statement(
      `SELECT residue1, residue2, SUM(twisted_count) AS value
       FROM pdb_omega_pairs
       WHERE twisted_count > 0
       GROUP BY residue1, residue2
       ORDER BY value DESC`,
    )
    .all();
  return {
    rows: rows.map((row) => ({
      key: [row.residue1, row.residue2],
      value: row.value,
    })),
  };
}

/** Mapping from CouchDB stats-view names to their SQL implementations. */
export const STATS_HANDLERS = {
  byYear,
  byExperiment,
  helicesStats,
  sheetsStats,
  ligandsStats,
  residuesStats,
  yearStats,
  aminoAcidFreq,
  nucleicBaseFreq,
  moleculeType,
  modifiedResiduesHist,
  helixKindHist,
  helixLengthHist,
  sheetLengthHist,
  helicesVsSheets,
  secondaryStructurePresence,
  residuesHistogram,
  chainsHistogram,
  residuesPerChainStats,
  ligandFrequency,
  ligandMwHistogram,
  ligandsByYear,
  iepHistogram,
  ecClasses,
  residuesByYear,
  methodByYear,
  omegaSummary,
  omegaByYear,
  cisCountHistogram,
  twistedPairFrequency,
};
