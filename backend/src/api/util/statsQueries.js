// SQL implementations of the `/v1/stats/<view>` aggregate endpoints. Each
// helper returns one of two response envelopes preserved for backward
// compatibility with third-party API callers:
//   * grouped reduce  → `{ rows: [{ key, value }] }`
//   * un-grouped stats → `{ rows: [{ key: null, value: { sum, count, min,
//     max, sumsqr } }] }`
//
// Each named export below is a thin wrapper around a single grouped SQL
// query and shares the same `(db: LigandsDB) => StatsView` signature; per-
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
 * Wrap a sequence of `[key, value]` pairs into the grouped-reduce envelope
 * expected by the chart components.
 * @param {Array<[unknown, number]>} pairs - Key/value pairs.
 * @returns {{ rows: Array<{ key: unknown, value: number }> }} Wrapped response.
 */
function asGroupedRows(pairs) {
  return {
    rows: Array.from(pairs, ([key, value]) => ({ key, value })),
  };
}

/**
 * Strip every column except `key` and `value` and wrap into the grouped-reduce
 * envelope. Convenience for SQL queries that already alias the columns to
 * `key` and `value`.
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
 * dropped, and the result is wrapped in the grouped-reduce envelope.
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
 * Wrap an aggregate row into the un-grouped `_stats` envelope expected by
 * the chart components. `row` is the `{ sum, count, min, max, sumsqr }`
 * shape produced by every `stats*` getter on `LigandsDB`.
 * @param {{ sum: number, count: number, min: number, max: number, sumsqr: number } | undefined} row
 *   Aggregate row, or `undefined` when the table was empty.
 * @returns {{ rows: [{ key: null, value: { sum: number, count: number, min: number, max: number, sumsqr: number } }] }} Stats envelope.
 */
function wrapStats(row) {
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
  return rowsAsGroupedRows(db.statsByYear.all());
}

export function byExperiment(db) {
  return rowsAsGroupedRows(db.statsByExperiment.all());
}

export function helicesStats(db) {
  return wrapStats(
    db
      .statement(
        `SELECT COALESCE(SUM(nb_helices), 0) AS sum,
                COUNT(nb_helices)              AS count,
                COALESCE(MIN(nb_helices), 0)  AS min,
                COALESCE(MAX(nb_helices), 0)  AS max,
                COALESCE(SUM(nb_helices*nb_helices), 0) AS sumsqr
         FROM pdb_entries`,
      )
      .get(),
  );
}

export function sheetsStats(db) {
  return wrapStats(
    db
      .statement(
        `SELECT COALESCE(SUM(nb_sheets), 0) AS sum,
                COUNT(nb_sheets)              AS count,
                COALESCE(MIN(nb_sheets), 0)  AS min,
                COALESCE(MAX(nb_sheets), 0)  AS max,
                COALESCE(SUM(nb_sheets*nb_sheets), 0) AS sumsqr
         FROM pdb_entries`,
      )
      .get(),
  );
}

export function ligandsStats(db) {
  return wrapStats(
    db
      .statement(
        `SELECT COALESCE(SUM(nb_ligands), 0) AS sum,
                COUNT(nb_ligands)              AS count,
                COALESCE(MIN(nb_ligands), 0)  AS min,
                COALESCE(MAX(nb_ligands), 0)  AS max,
                COALESCE(SUM(nb_ligands*nb_ligands), 0) AS sumsqr
         FROM pdb_entries`,
      )
      .get(),
  );
}

export function residuesStats(db) {
  return wrapStats(
    db
      .statement(
        `SELECT COALESCE(SUM(nb_residues), 0) AS sum,
                COUNT(nb_residues)              AS count,
                COALESCE(MIN(nb_residues), 0)  AS min,
                COALESCE(MAX(nb_residues), 0)  AS max,
                COALESCE(SUM(nb_residues*nb_residues), 0) AS sumsqr
         FROM pdb_entries
         WHERE nb_residues > 0`,
      )
      .get(),
  );
}

export function yearStats(db) {
  return wrapStats(
    db
      .statement(
        `SELECT COALESCE(SUM(year), 0) AS sum,
                COUNT(year)              AS count,
                COALESCE(MIN(year), 0)  AS min,
                COALESCE(MAX(year), 0)  AS max,
                COALESCE(SUM(year*year), 0) AS sumsqr
         FROM pdb_entries
         WHERE year IS NOT NULL AND year > 0`,
      )
      .get(),
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
  // Always return all 20 AAs in the canonical STANDARD_AA order (zero
  // count when the table has no rows for one) so the frontend can render
  // directly without re-ordering or filling holes.
  const counts = new Map(rows.map((row) => [row.key, row.value]));
  return {
    rows: STANDARD_AA.map((aa) => ({ key: aa, value: counts.get(aa) ?? 0 })),
  };
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
  return rowsAsGroupedRows(db.statsModifiedResiduesHist.all());
}

export function helixKindHist(db) {
  return rowsAsGroupedRows(db.statsHelixKindHist.all());
}

export function helixLengthHist(db) {
  return rowsAsGroupedRows(
    db.statsHelixLengthHist.all(HELIX_SHEET_LENGTH_LIMIT),
  );
}

export function sheetLengthHist(db) {
  return rowsAsGroupedRows(
    db.statsSheetLengthHist.all(HELIX_SHEET_LENGTH_LIMIT),
  );
}

export function helicesVsSheets(db) {
  const rows = db.statsHelicesVsSheets.all();
  return {
    rows: rows.map((row) => ({ key: [row.h, row.s], value: row.value })),
  };
}

export function secondaryStructurePresence(db) {
  return rowsAsGroupedRows(db.statsSecondaryStructurePresence.all());
}

export function residuesHistogram(db) {
  const all = db.selectResidueCountsForHistogram.all();
  return histogram(all, RESIDUES_HISTOGRAM_BINS, (row) => row.nb_residues);
}

export function chainsHistogram(db) {
  return rowsAsGroupedRows(db.statsChainsHistogram.all());
}

export function residuesPerChainStats(db) {
  return wrapStats(
    db
      .statement(
        `SELECT COALESCE(SUM(CAST(nb_residues AS REAL) / nb_chains), 0) AS sum,
                COUNT(*)                                                  AS count,
                COALESCE(MIN(CAST(nb_residues AS REAL) / nb_chains), 0)  AS min,
                COALESCE(MAX(CAST(nb_residues AS REAL) / nb_chains), 0)  AS max,
                COALESCE(SUM((CAST(nb_residues AS REAL) / nb_chains) *
                             (CAST(nb_residues AS REAL) / nb_chains)), 0) AS sumsqr
         FROM pdb_entries WHERE nb_chains > 0`,
      )
      .get(),
  );
}

export function ligandFrequency(db) {
  return rowsAsGroupedRows(db.statsLigandFrequency.all());
}

export function ligandMwHistogram(db) {
  const all = db.selectLigandMwForHistogram.all();
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
  return rowsAsGroupedRows(db.statsIepHistogram.all());
}

export function ecClasses(db) {
  // Each pdb contributes once per top-level EC class (1..7) it has any chain in.
  return rowsAsGroupedRows(db.statsEcClasses.all());
}

export function residuesByYear(db) {
  const rows = db.statsResiduesByYear.all();
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
  const rows = db.statsMethodByYear.all();
  return {
    rows: rows.map((row) => ({
      key: [row.year, row.experiment],
      value: row.value,
    })),
  };
}

export function omegaSummary(db) {
  const row = db.statsOmegaSummary.get();
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
  const rows = db.statsOmegaByYear.all();
  return {
    rows: rows.map((row) => ({
      key: row.key,
      value: [row.cis, row.trans, row.twisted, row.total],
    })),
  };
}

export function cisCountHistogram(db) {
  return rowsAsGroupedRows(db.statsCisCountHistogram.all());
}

export function pairFrequency(db, yearRange) {
  const rows = yearRange
    ? db.statsPairFrequencyByYearRange.all(yearRange[0], yearRange[1])
    : db.statsPairFrequencyAllYears.all();
  return {
    rows: rows.map((row) => ({
      key: [row.residue1, row.residue2],
      value: [row.cis ?? 0, row.total ?? 0],
    })),
  };
}

export function twistedPairFrequency(db) {
  const rows = db.statsTwistedPairFrequency.all();
  return {
    rows: rows.map((row) => ({
      key: [row.residue1, row.residue2],
      value: row.value,
    })),
  };
}

/** Mapping from `/v1/stats/<view>` names to their SQL implementations. */
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
