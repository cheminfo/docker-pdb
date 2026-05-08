import type { FindParams } from '../../shared/api/client.ts';
import type { PdbDoc } from '../../shared/api/types.ts';

/** Numeric range filter with optional lower / upper bounds. */
export interface RangeFilter {
  min: number | null;
  max: number | null;
}

/** Combined filter state for the browse page sidebar. */
export interface FilterState {
  /** Set of allowed `doc.experiment` values; empty means "no method filter". */
  methods: Set<string>;
  helices: RangeFilter;
  sheets: RangeFilter;
  /** Ligand records, excluding water (`HOH`). */
  ligands: RangeFilter;
  residues: RangeFilter;
  year: RangeFilter;
}

/** Initial state — all filters disabled. */
export const emptyFilterState: FilterState = {
  methods: new Set(),
  helices: { min: null, max: null },
  sheets: { min: null, max: null },
  ligands: { min: null, max: null },
  residues: { min: null, max: null },
  year: { min: null, max: null },
};

/**
 * Count non-water ligand records.
 * @param doc - Parsed PDB document.
 * @returns Number of formula entries whose label is not `HOH`.
 */
export function countLigands(doc: PdbDoc): number {
  return doc.formula.filter((entry) => entry.label !== 'HOH').length;
}

/**
 * Apply structural filters (method, ranges) to the document list. Returns a
 * new array containing only documents that pass every active filter.
 * @param docs - Documents to filter.
 * @param filters - Current filter state.
 * @returns Filtered subset.
 */
export function applyFilters(docs: PdbDoc[], filters: FilterState): PdbDoc[] {
  return docs.filter((doc) => {
    if (
      filters.methods.size > 0 &&
      (!doc.experiment || !filters.methods.has(doc.experiment))
    ) {
      return false;
    }
    if (!withinRange(doc.helices.length, filters.helices)) return false;
    if (!withinRange(doc.sheets.length, filters.sheets)) return false;
    if (!withinRange(countLigands(doc), filters.ligands)) return false;
    if (!withinRange(doc.nbResidues, filters.residues)) return false;
    if (doc.year !== undefined && !withinRange(doc.year, filters.year)) {
      return false;
    }
    if (
      doc.year === undefined &&
      (filters.year.min !== null || filters.year.max !== null)
    ) {
      return false;
    }
    return true;
  });
}

function withinRange(value: number, range: RangeFilter): boolean {
  if (range.min !== null && value < range.min) return false;
  if (range.max !== null && value > range.max) return false;
  return true;
}

/**
 * Tally the number of documents per `doc.experiment` value.
 * @param docs - Documents to tally.
 * @returns Map keyed by method name with the document count for each.
 */
export function methodCounts(docs: PdbDoc[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const doc of docs) {
    if (!doc.experiment) continue;
    counts.set(doc.experiment, (counts.get(doc.experiment) ?? 0) + 1);
  }
  return counts;
}

/** Data-derived [min, max] bounds for every numeric range filter. */
export interface FilterBounds {
  helices: { min: number; max: number };
  sheets: { min: number; max: number };
  ligands: { min: number; max: number };
  residues: { min: number; max: number };
  year: { min: number; max: number };
}

/**
 * Compute the [min, max] of each numeric field across the documents. Used as
 * a fallback when DB-wide stats from CouchDB's `_stats` reduce are not
 * available.
 * @param docs - Documents to inspect.
 * @returns Bounds object with one entry per filterable field.
 */
export function computeBounds(docs: PdbDoc[]): FilterBounds {
  const helices = extent(docs.map((doc) => doc.helices.length));
  const sheets = extent(docs.map((doc) => doc.sheets.length));
  const ligands = extent(docs.map((doc) => countLigands(doc)));
  const residues = extent(docs.map((doc) => doc.nbResidues));
  const years = docs
    .map((doc) => doc.year)
    .filter((value): value is number => typeof value === 'number');
  const year =
    years.length > 0
      ? { min: Math.min(...years), max: Math.max(...years) }
      : { min: 1970, max: new Date().getFullYear() };
  return { helices, sheets, ligands, residues, year };
}

function extent(values: number[]): { min: number; max: number } {
  if (values.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...values), max: Math.max(...values) };
}

/**
 * Convert a `FilterState` (UI-friendly) plus a free-text query into a
 * `FindParams` object (Mango-friendly). Only fields with active constraints
 * are included so CouchDB can pick the smallest covering index.
 * @param filters - Current filter state.
 * @param query - Free-text search query (matched against `title`).
 * @returns Parameters ready to pass to `findDocuments`.
 */
export function filtersToFindParams(
  filters: FilterState,
  query: string,
): FindParams {
  return {
    methods: filters.methods.size > 0 ? [...filters.methods] : undefined,
    helices: hasRange(filters.helices) ? filters.helices : undefined,
    sheets: hasRange(filters.sheets) ? filters.sheets : undefined,
    ligands: hasRange(filters.ligands) ? filters.ligands : undefined,
    residues: hasRange(filters.residues) ? filters.residues : undefined,
    year: hasRange(filters.year) ? filters.year : undefined,
    query: query.trim() || undefined,
  };
}

function hasRange(range: RangeFilter): boolean {
  return range.min !== null || range.max !== null;
}
