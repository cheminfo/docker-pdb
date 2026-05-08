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
