import type {
  CouchStatsResponse,
  CouchStatsValue,
  DatabaseInfo,
  PdbViewResponse,
  ViewResponse,
} from './types.ts';

/**
 * Fetch a JSON resource from the same origin and throw on a non-2xx response.
 * @param url - Relative URL to fetch.
 * @returns Parsed JSON body of the response.
 */
async function fetchJson<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<TResponse>;
}

/**
 * Fetch CouchDB info for the `pdb` database (counts, disk size).
 * @returns Promise resolving to the database info document.
 */
export function fetchPdbInfo(): Promise<DatabaseInfo> {
  return fetchJson<DatabaseInfo>('/pdb/');
}

/**
 * Fetch CouchDB info for the `pdb-bio-assembly` database.
 * @returns Promise resolving to the database info document.
 */
export function fetchAssemblyInfo(): Promise<DatabaseInfo> {
  return fetchJson<DatabaseInfo>('/assembly/');
}

/**
 * Fetch the grouped `byYear` reduce view from `_design/stats`.
 * @returns Promise resolving to the rows of the view, keyed by year.
 */
export function fetchByYear(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/byYear?group=true');
}

/**
 * Fetch the grouped `byExperiment` reduce view from `_design/stats`.
 * @returns Promise resolving to the rows of the view, keyed by experimental method.
 */
export function fetchByExperiment(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/stats/byExperiment?group=true');
}

/**
 * Fetch the curated `jsmol` view: PDB entries pre-filtered for student work
 * (100–500 residues, ≥1 long helix, ≥1 long sheet, a small ligand). Returns
 * the full parsed document for each entry so the UI can filter and display
 * client-side.
 * @returns Promise resolving to the rows of the view with documents inlined.
 */
export function fetchJsmolList(): Promise<PdbViewResponse> {
  return fetchJson<PdbViewResponse>('/view/jsmol?include_docs=true');
}

/** DB-wide min/max/avg statistics for the numeric filter fields. */
export interface RangeStats {
  helices: CouchStatsValue;
  sheets: CouchStatsValue;
  ligands: CouchStatsValue;
  residues: CouchStatsValue;
  year: CouchStatsValue;
}

/**
 * Fetch DB-wide min/max/count statistics for every numeric filter field. Each
 * value comes from a `_stats` reduce view in `_design/stats` and reflects the
 * exact range of values currently stored in the database.
 * @returns Promise resolving to one `CouchStatsValue` per field.
 */
export async function fetchRangeStats(): Promise<RangeStats> {
  const [helices, sheets, ligands, residues, year] = await Promise.all([
    fetchJson<CouchStatsResponse>('/stats/helicesStats'),
    fetchJson<CouchStatsResponse>('/stats/sheetsStats'),
    fetchJson<CouchStatsResponse>('/stats/ligandsStats'),
    fetchJson<CouchStatsResponse>('/stats/residuesStats'),
    fetchJson<CouchStatsResponse>('/stats/yearStats'),
  ]);
  return {
    helices: helices.rows[0]?.value ?? emptyStats(),
    sheets: sheets.rows[0]?.value ?? emptyStats(),
    ligands: ligands.rows[0]?.value ?? emptyStats(),
    residues: residues.rows[0]?.value ?? emptyStats(),
    year: year.rows[0]?.value ?? emptyStats(),
  };
}

function emptyStats(): CouchStatsValue {
  return { sum: 0, count: 0, min: 0, max: 0, sumsqr: 0 };
}

/**
 * Fetch the raw PDB-format text for a given entry.
 * @param pdbId - 4-character PDB identifier (e.g. `4YYR`).
 * @returns Promise resolving to the PDB file as a string.
 */
export async function fetchPdbText(pdbId: string): Promise<string> {
  const response = await fetch(`/pdb/${pdbId}/${pdbId}.pdb`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

/* ------------------------------------------------------------------------ *
 * Mango / `_find` query layer
 * ------------------------------------------------------------------------ */

/** A simple optional [min, max] range used to build Mango selectors. */
export interface NumericRange {
  min: number | null;
  max: number | null;
}

/** Filters accepted by `findDocuments`. */
export interface FindParams {
  /** Allowed `experiment` values (any of). Empty / undefined = no filter. */
  methods?: string[];
  helices?: NumericRange;
  sheets?: NumericRange;
  ligands?: NumericRange;
  residues?: NumericRange;
  year?: NumericRange;
  /** Free-text query matched against `title` via case-insensitive regex. */
  query?: string;
}

/** Response of a `_find` query. */
export interface FindResponse<TDoc> {
  docs: TDoc[];
  bookmark?: string;
  warning?: string;
}

const PAGE_LIMIT = 200;

/**
 * Build a Mango selector from a `FindParams` object. Only fields with
 * actual constraints are included so CouchDB can pick the best index.
 * @param params - Filter parameters.
 * @returns Mango selector object suitable for `_find`.
 */
function buildSelector(params: FindParams): Record<string, unknown> {
  const selector: Record<string, unknown> = {};
  if (params.methods && params.methods.length > 0) {
    selector.experiment = { $in: params.methods };
  }
  addRange(selector, 'nbHelices', params.helices);
  addRange(selector, 'nbSheets', params.sheets);
  addRange(selector, 'nbLigands', params.ligands);
  addRange(selector, 'nbResidues', params.residues);
  addRange(selector, 'year', params.year);
  if (params.query?.trim()) {
    selector.title = { $regex: `(?i)${escapeRegex(params.query.trim())}` };
  }
  // Mango requires *some* selector. When nothing else is set, force a
  // wildcard so the query still runs.
  if (Object.keys(selector).length === 0) {
    selector._id = { $gt: null };
  }
  return selector;
}

function addRange(
  selector: Record<string, unknown>,
  field: string,
  range: NumericRange | undefined,
) {
  if (!range) return;
  const constraints: Record<string, number> = {};
  if (typeof range.min === 'number') constraints.$gte = range.min;
  if (typeof range.max === 'number') constraints.$lte = range.max;
  if (Object.keys(constraints).length > 0) selector[field] = constraints;
}

function escapeRegex(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Run a Mango `_find` query against the `pdb` database. Returns up to
 * `PAGE_LIMIT` docs and the bookmark needed to fetch the next page.
 * @param params - Filter parameters.
 * @param bookmark - Optional bookmark from a previous `findDocuments` call.
 * @returns Promise resolving to the matching docs and a paging bookmark.
 */
export async function findDocuments<TDoc>(
  params: FindParams,
  bookmark?: string,
): Promise<FindResponse<TDoc>> {
  const body = {
    selector: buildSelector(params),
    limit: PAGE_LIMIT,
    bookmark,
    // Sort by `_id` so pages are stable; CouchDB skips this if no matching
    // index covers it, which is fine — the bookmark handles ordering.
  };
  const response = await fetch('/find', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<FindResponse<TDoc>>;
}
