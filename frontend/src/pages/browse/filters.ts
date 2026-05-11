import type { FilterField } from '../../shared/SmartFilterBuilder/index.ts';
import type { FindParams, OrderKey } from '../../shared/api/client.ts';
import type { PdbDoc } from '../../shared/api/types.ts';

/**
 * Schema of the `pdb_entries` columns exposed by the smart-sqlite3-filter
 * backend. Drives the `SmartFilterBuilder` field picker on the browse page.
 * Numeric `min`/`max` defaults are conservative; the live range comes from
 * `RangeStats` once the stats endpoint resolves (see {@link buildPdbFields}).
 */
export const PDB_FIELDS: FilterField[] = [
  {
    name: 'id',
    label: 'PDB ID',
    type: 'string',
    description: '4-character PDB code, e.g. 1A2B',
  },
  {
    name: 'title',
    label: 'Title',
    type: 'string',
    description: 'Entry title (case-insensitive)',
  },
  {
    name: 'experiment',
    label: 'Experimental method',
    type: 'enum',
    description: 'X-RAY DIFFRACTION, ELECTRON MICROSCOPY, SOLUTION NMR, …',
  },
  {
    name: 'year',
    label: 'Deposition year',
    type: 'number',
    description: 'Year the entry was deposited',
  },
  {
    name: 'nb_residues',
    label: 'Residues',
    type: 'number',
    description: 'Total number of residues across all chains',
  },
  {
    name: 'nb_modified_residues',
    label: 'Modified residues',
    type: 'number',
    description: 'Non-standard / modified residues',
  },
  {
    name: 'nb_chains',
    label: 'Chains',
    type: 'number',
    description: 'Number of polypeptide / nucleotide chains',
  },
  {
    name: 'nb_helices',
    label: 'α-Helices',
    type: 'number',
  },
  {
    name: 'nb_sheets',
    label: 'β-Sheets',
    type: 'number',
  },
  {
    name: 'nb_ligands',
    label: 'Ligands',
    type: 'number',
    description: 'Non-water ligand records',
  },
  {
    name: 'iep',
    label: 'Isoelectric point',
    type: 'number',
  },
  {
    name: 'assembly_size',
    label: 'Assembly size',
    type: 'number',
  },
];

/**
 * Same as {@link PDB_FIELDS} but with the runtime-known enum options for
 * `experiment` and the runtime-known `min`/`max` for each numeric field
 * folded in. Used as the `fields` prop of `SmartFilterBuilder`.
 * @param methodCounts - DB-wide method tally (drives enum options).
 * @param bounds - DB-wide numeric stats for placeholder hints.
 * @returns Enriched field list.
 */
export function buildPdbFields(
  methodCounts: Array<[string, number]>,
  bounds: FilterBounds | undefined,
): FilterField[] {
  const methodOptions = methodCounts.map(([method]) => method);
  return PDB_FIELDS.map((field) => {
    if (field.name === 'experiment' && methodOptions.length > 0) {
      return { ...field, options: methodOptions };
    }
    if (!bounds) return field;
    const boundsKey = NUMERIC_FIELD_TO_BOUNDS_KEY[field.name];
    if (!boundsKey) return field;
    const range = bounds[boundsKey];
    return { ...field, min: range.min, max: range.max };
  });
}

// Keys are SQL column names (snake_case by convention of `pdb_entries`);
// values are the camelCase keys of `FilterBounds`.
/* eslint-disable camelcase */
const NUMERIC_FIELD_TO_BOUNDS_KEY: Record<string, keyof FilterBounds> = {
  nb_helices: 'helices',
  nb_sheets: 'sheets',
  nb_ligands: 'ligands',
  nb_residues: 'residues',
  year: 'year',
};
/* eslint-enable camelcase */

/** Numeric range filter with optional lower / upper bounds. */
export interface RangeFilter {
  min: number | null;
  max: number | null;
}

/** Allowed values for the secondary-structure presence pill. */
export type SsPresence = 'mixed' | 'helices-only' | 'sheets-only' | 'none';

const SS_PRESENCE_VALUES = new Set<SsPresence>([
  'mixed',
  'helices-only',
  'sheets-only',
  'none',
]);

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
  /** Chart-driven: HELIX kind code (1–10), or null for "no filter". */
  helixKind: number | null;
  ssPresence: SsPresence | null;
  /** Top-level EC class digit ("1"–"7"), or null. */
  ecClass: string | null;
  /** CCD ligand code (e.g. `HEM`), or null. */
  ligandCode: string | null;
}

/**
 * Human-readable labels for every supported {@link OrderKey}, in the order they
 * should appear in the sort dropdown. The first entry (`id`) is the implicit
 * default and is therefore the only one omitted from the URL when chosen.
 */
export const ORDER_OPTIONS: Array<{ key: OrderKey; label: string }> = [
  { key: 'id', label: 'PDB ID (A → Z)' },
  { key: 'id-desc', label: 'PDB ID (Z → A)' },
  { key: 'year-desc', label: 'Year (newest first)' },
  { key: 'year', label: 'Year (oldest first)' },
  { key: 'residues-desc', label: 'Residues (most first)' },
  { key: 'residues', label: 'Residues (fewest first)' },
  { key: 'helices-desc', label: 'α-Helices (most first)' },
  { key: 'sheets-desc', label: 'β-Sheets (most first)' },
  { key: 'ligands-desc', label: 'Ligands (most first)' },
  { key: 'random', label: 'Random (shuffled)' },
];

const ORDER_KEYS = new Set<OrderKey>(ORDER_OPTIONS.map((option) => option.key));

/** Default ordering when no `order` parameter is present in the URL. */
export const DEFAULT_ORDER: OrderKey = 'id';

/**
 * Generate a fresh integer seed for the `random` ordering. Caller stores it in
 * URL state so the shuffle is reproducible by anyone who opens the link.
 * @returns A positive 31-bit integer.
 */
export function makeRandomSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647);
}

/** Initial state — all filters disabled. */
export const emptyFilterState: FilterState = {
  methods: new Set(),
  helices: { min: null, max: null },
  sheets: { min: null, max: null },
  ligands: { min: null, max: null },
  residues: { min: null, max: null },
  year: { min: null, max: null },
  helixKind: null,
  ssPresence: null,
  ecClass: null,
  ligandCode: null,
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
 * a fallback when DB-wide `_stats` aggregates are not available.
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
 * Convert a `FilterState` (UI-friendly), a free-text title query, a
 * smart-sqlite3-filter expression, and the chosen result ordering into a
 * `FindParams` object. The two text inputs are passed through to separate
 * backend parameters (`q` and `smart`) — composition happens server-side via
 * AND-intersection.
 * @param filters - Current filter state.
 * @param query - Free-text title query (FTS5 against the `title` column).
 * @param smart - Smart-sqlite3-filter expression evaluated against
 *   `pdb_entries` (e.g. `year:>=2024 nb_helices:>5`).
 * @param order - Result ordering key.
 * @param seed - Integer seed for the `random` ordering. Ignored otherwise.
 * @returns Parameters ready to pass to `findDocuments`.
 */
export function filtersToFindParams(
  filters: FilterState,
  query: string,
  smart: string,
  order: OrderKey,
  seed: number,
): FindParams {
  const trimmedQuery = query.trim();
  const trimmedSmart = smart.trim();
  return {
    methods: filters.methods.size > 0 ? [...filters.methods] : undefined,
    helices: hasRange(filters.helices) ? filters.helices : undefined,
    sheets: hasRange(filters.sheets) ? filters.sheets : undefined,
    ligands: hasRange(filters.ligands) ? filters.ligands : undefined,
    residues: hasRange(filters.residues) ? filters.residues : undefined,
    year: hasRange(filters.year) ? filters.year : undefined,
    helixKind: filters.helixKind ?? undefined,
    ssPresence: filters.ssPresence ?? undefined,
    ecClass: filters.ecClass ?? undefined,
    ligandCode: filters.ligandCode ?? undefined,
    query: trimmedQuery || undefined,
    smart: trimmedSmart || undefined,
    order,
    seed: order === 'random' ? seed : undefined,
  };
}

function hasRange(range: RangeFilter): boolean {
  return range.min !== null || range.max !== null;
}

/**
 * Parse `URLSearchParams` (or the URL fragment after `?`) into a `FilterState`
 * + query/smart strings. Unknown / malformed parameters are silently
 * ignored — any field that isn't present falls back to its empty default.
 * @param search - `URLSearchParams` instance to read from.
 * @returns Decoded state. Always returns a fully populated `FilterState`.
 */
export function filterStateFromUrl(search: URLSearchParams): {
  filters: FilterState;
  query: string;
  smart: string;
  order: OrderKey;
  seed: number;
} {
  const filters: FilterState = {
    ...emptyFilterState,
    methods: new Set(emptyFilterState.methods),
    helices: { ...emptyFilterState.helices },
    sheets: { ...emptyFilterState.sheets },
    ligands: { ...emptyFilterState.ligands },
    residues: { ...emptyFilterState.residues },
    year: { ...emptyFilterState.year },
  };
  const methodsParam = search.get('methods');
  if (methodsParam) {
    for (const method of methodsParam.split(',')) {
      const trimmed = method.trim();
      if (trimmed) filters.methods.add(trimmed);
    }
  }
  readRange(search, 'helices', filters.helices);
  readRange(search, 'sheets', filters.sheets);
  readRange(search, 'ligands', filters.ligands);
  readRange(search, 'residues', filters.residues);
  readRange(search, 'year', filters.year);
  const helixKind = Number.parseInt(search.get('helixKind') ?? '', 10);
  if (Number.isFinite(helixKind)) filters.helixKind = helixKind;
  const ssPresence = search.get('ssPresence') as SsPresence | null;
  if (ssPresence && SS_PRESENCE_VALUES.has(ssPresence)) {
    filters.ssPresence = ssPresence;
  }
  const ecClass = search.get('ecClass');
  if (ecClass && /^[1-7]$/.test(ecClass)) filters.ecClass = ecClass;
  const ligandCode = search.get('ligandCode');
  if (ligandCode) filters.ligandCode = ligandCode;
  const orderRaw = search.get('order') as OrderKey | null;
  const order: OrderKey =
    orderRaw && ORDER_KEYS.has(orderRaw) ? orderRaw : DEFAULT_ORDER;
  const seedParsed = Number.parseInt(search.get('seed') ?? '', 10);
  // A seed is only meaningful for `random`. When the URL lands on `random`
  // without one (e.g. someone typed `?order=random` by hand) generate one so
  // the result is at least defined; the next render will write it back out.
  const seed = Number.isFinite(seedParsed)
    ? seedParsed
    : order === 'random'
      ? makeRandomSeed()
      : 0;
  return {
    filters,
    query: search.get('q') ?? '',
    smart: search.get('smart') ?? '',
    order,
    seed,
  };
}

function readRange(
  search: URLSearchParams,
  field: string,
  range: RangeFilter,
): void {
  const min = Number.parseFloat(search.get(`${field}Min`) ?? '');
  const max = Number.parseFloat(search.get(`${field}Max`) ?? '');
  if (Number.isFinite(min)) range.min = min;
  if (Number.isFinite(max)) range.max = max;
}

/**
 * Inverse of {@link filterStateFromUrl}: serialize a `FilterState` (+ free
 * text inputs and ordering) into a `URLSearchParams`. Empty / null / default
 * fields are omitted so the resulting URL stays compact.
 * @param filters - Current filter state.
 * @param query - Free-text title query.
 * @param smart - smart-sqlite3-filter expression.
 * @param order - Result ordering key.
 * @param seed - Integer seed; only written when `order === 'random'`.
 * @returns A fresh `URLSearchParams` (no `?` prefix).
 */
export function filterStateToUrl(
  filters: FilterState,
  query: string,
  smart: string,
  order: OrderKey,
  seed: number,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.methods.size > 0) {
    params.set('methods', [...filters.methods].join(','));
  }
  writeRange(params, 'helices', filters.helices);
  writeRange(params, 'sheets', filters.sheets);
  writeRange(params, 'ligands', filters.ligands);
  writeRange(params, 'residues', filters.residues);
  writeRange(params, 'year', filters.year);
  if (filters.helixKind !== null) {
    params.set('helixKind', String(filters.helixKind));
  }
  if (filters.ssPresence) params.set('ssPresence', filters.ssPresence);
  if (filters.ecClass) params.set('ecClass', filters.ecClass);
  if (filters.ligandCode) params.set('ligandCode', filters.ligandCode);
  if (query.trim()) params.set('q', query.trim());
  if (smart.trim()) params.set('smart', smart.trim());
  // Omit the default — every other order key reflects in the URL.
  if (order !== DEFAULT_ORDER) params.set('order', order);
  if (order === 'random') params.set('seed', String(seed));
  return params;
}

function writeRange(
  params: URLSearchParams,
  field: string,
  range: RangeFilter,
): void {
  if (range.min !== null) params.set(`${field}Min`, String(range.min));
  if (range.max !== null) params.set(`${field}Max`, String(range.max));
}
