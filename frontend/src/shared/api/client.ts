import type {
  CouchStatsResponse,
  CouchStatsValue,
  DatabaseInfo,
  DatabaseInfoResponse,
  GroupedStatsResponse,
  LigandDetailResponse,
  LigandPdbsResponse,
  LigandSearchResponse,
  OmegaByYearResponse,
  OmegaSummaryResponse,
  PairFrequencyResponse,
  PdbDoc,
  PdbViewResponse,
  RsyncHistoryDoc,
  RsyncHistoryResponse,
  SyncStatusResponse,
  SyncTriggerResponse,
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

let databaseInfoPromise: Promise<DatabaseInfoResponse> | null = null;
function getDatabaseInfo(): Promise<DatabaseInfoResponse> {
  if (!databaseInfoPromise) {
    databaseInfoPromise = fetchJson<DatabaseInfoResponse>('/v1/database/info');
  }
  return databaseInfoPromise;
}

/**
 * Fetch counts and disk size for the asymmetric-unit archive.
 * @returns Promise resolving to the database info subset.
 */
export async function fetchPdbInfo(): Promise<DatabaseInfo> {
  const info = await getDatabaseInfo();
  return info.pdb;
}

/**
 * Fetch counts and disk size for the bio-assembly archive.
 * @returns Promise resolving to the database info subset.
 */
export async function fetchAssemblyInfo(): Promise<DatabaseInfo> {
  const info = await getDatabaseInfo();
  return info.assembly;
}

/**
 * Fetch the grouped `byYear` reduce: number of entries deposited per year.
 * @returns Promise resolving to the rows of the view, keyed by year.
 */
export function fetchByYear(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/byYear');
}

/**
 * Fetch the grouped `byExperiment` reduce: number of entries per experimental method.
 * @returns Promise resolving to the rows of the view, keyed by method name.
 */
export function fetchByExperiment(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/v1/stats/byExperiment');
}

/**
 * Fetch the curated `jsmol` list: PDB entries pre-filtered for student work
 * (100–500 residues, ≥1 long helix, ≥1 long sheet, a small ligand). Returns
 * the full parsed document for each entry so the UI can filter and display
 * client-side.
 * @returns Promise resolving to the rows of the view with documents inlined.
 */
export function fetchJsmolList(): Promise<PdbViewResponse> {
  return fetchJson<PdbViewResponse>('/v1/pdbs/jsmol');
}

/**
 * Fetch the grouped `aminoAcidFreq` reduce: total residue count for each
 * of the 20 standard amino-acid 3-letter codes across the whole DB.
 * @returns Promise resolving to a row per amino-acid code.
 */
export function fetchAminoAcidFreq(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/v1/stats/aminoAcidFreq');
}

/**
 * Fetch the grouped `nucleicBaseFreq` reduce: total residue count for
 * each DNA / RNA base across the whole DB.
 * @returns Promise resolving to a row per base code.
 */
export function fetchNucleicBaseFreq(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/v1/stats/nucleicBaseFreq');
}

/**
 * Fetch the grouped `moleculeType` reduce: number of entries per
 * molecule-type bucket (`protein`, `nucleic`, `hybrid`, `other`).
 * @returns Promise resolving to a row per molecule type.
 */
export function fetchMoleculeType(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/v1/stats/moleculeType');
}

/**
 * Fetch the grouped `modifiedResiduesHist` reduce: number of entries having
 * exactly N modified residues, keyed by N.
 * @returns Promise resolving to a row per modified-residue count.
 */
export function fetchModifiedResiduesHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/modifiedResiduesHist');
}

/**
 * Fetch the grouped `helixKindHist` reduce: number of helices per `kind` code.
 * @returns Promise resolving to a row per helix kind code.
 */
export function fetchHelixKindHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/helixKindHist');
}

/**
 * Fetch the grouped `helixLengthHist` reduce: number of helices per length.
 * @returns Promise resolving to a row per helix length.
 */
export function fetchHelixLengthHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/helixLengthHist');
}

/**
 * Fetch the grouped `sheetLengthHist` reduce: number of beta strands per length.
 * @returns Promise resolving to a row per sheet strand length.
 */
export function fetchSheetLengthHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/sheetLengthHist');
}

/**
 * Fetch the grouped `helicesVsSheets` reduce: number of entries with each
 * `[nbHelices, nbSheets]` pair, used to render a 2-D heatmap.
 * @returns Promise resolving to a row per `[nbHelices, nbSheets]` pair.
 */
export function fetchHelicesVsSheets(): Promise<
  ViewResponse<[number, number]>
> {
  return fetchJson<ViewResponse<[number, number]>>('/v1/stats/helicesVsSheets');
}

/**
 * Fetch the grouped `secondaryStructurePresence` reduce: number of
 * entries in each presence bucket (`none`, `helices-only`, `sheets-only`,
 * `mixed`).
 * @returns Promise resolving to a row per presence bucket.
 */
export function fetchSecondaryStructurePresence(): Promise<
  ViewResponse<string>
> {
  return fetchJson<ViewResponse<string>>(
    '/v1/stats/secondaryStructurePresence',
  );
}

/**
 * Fetch the grouped `residuesHistogram` reduce: number of entries whose
 * total residue count falls into each pre-defined bucket (lower bound).
 * @returns Promise resolving to a row per residues-count bucket.
 */
export function fetchResiduesHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/residuesHistogram');
}

/**
 * Fetch the grouped `chainsHistogram` reduce: number of entries with
 * exactly N chains, keyed by N.
 * @returns Promise resolving to a row per chains count.
 */
export function fetchChainsHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/chainsHistogram');
}

/**
 * Fetch the (un-grouped) `residuesPerChainStats` reduce: min / max / mean
 * residues-per-chain across all entries.
 * @returns Promise resolving to the `_stats` value.
 */
export function fetchResiduesPerChainStats(): Promise<CouchStatsResponse> {
  return fetchJson<CouchStatsResponse>('/v1/stats/residuesPerChainStats');
}

/**
 * Fetch the grouped `ligandFrequency` reduce: total occurrence count of
 * each non-water ligand (HET code) across the whole DB.
 * @returns Promise resolving to a row per ligand label.
 */
export function fetchLigandFrequency(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/v1/stats/ligandFrequency');
}

/**
 * Fetch the grouped `ligandMwHistogram` reduce: number of ligand
 * occurrences per molecular-weight bucket (lower bound, in g/mol).
 * @returns Promise resolving to a row per MW bucket.
 */
export function fetchLigandMwHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/ligandMwHistogram');
}

/**
 * Fetch the grouped `ligandsByYear` reduce: per-year `_stats` of the
 * number of (non-water) ligands per entry.
 * @returns Promise resolving to a row per year.
 */
export function fetchLigandsByYear(): Promise<GroupedStatsResponse<number>> {
  return fetchJson<GroupedStatsResponse<number>>('/v1/stats/ligandsByYear');
}

/**
 * Fetch the grouped `iepHistogram` reduce: number of entries per
 * isoelectric-point bucket (0.5-wide bins, keyed by lower bound).
 * @returns Promise resolving to a row per IEP bucket.
 */
export function fetchIepHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/v1/stats/iepHistogram');
}

/**
 * Fetch the grouped `ecClasses` reduce: number of entries having at
 * least one chain in each of the 7 top-level Enzyme-Commission classes
 * (1 oxidoreductases, 2 transferases, …, 7 translocases).
 * @returns Promise resolving to a row per EC top-level class.
 */
export function fetchEcClasses(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/v1/stats/ecClasses');
}

/**
 * Fetch the grouped `residuesByYear` reduce: per-year `_stats` of the
 * total number of residues per entry.
 * @returns Promise resolving to a row per year.
 */
export function fetchResiduesByYear(): Promise<GroupedStatsResponse<number>> {
  return fetchJson<GroupedStatsResponse<number>>('/v1/stats/residuesByYear');
}

/**
 * Fetch the grouped `methodByYear` reduce: number of entries per
 * `[year, experiment]` pair, used to render a stacked-by-method timeline.
 * @returns Promise resolving to a row per `[year, experiment]` pair.
 */
export function fetchMethodByYear(): Promise<ViewResponse<[number, string]>> {
  return fetchJson<ViewResponse<[number, string]>>('/v1/stats/methodByYear');
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
 * Fetch DB-wide min/max/count statistics for every numeric filter field.
 * @returns Promise resolving to one `CouchStatsValue` per field.
 */
export async function fetchRangeStats(): Promise<RangeStats> {
  const [helices, sheets, ligands, residues, year] = await Promise.all([
    fetchJson<CouchStatsResponse>('/v1/stats/helicesStats'),
    fetchJson<CouchStatsResponse>('/v1/stats/sheetsStats'),
    fetchJson<CouchStatsResponse>('/v1/stats/ligandsStats'),
    fetchJson<CouchStatsResponse>('/v1/stats/residuesStats'),
    fetchJson<CouchStatsResponse>('/v1/stats/yearStats'),
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
  const response = await fetch(`/v1/pdbs/${encodeURIComponent(pdbId)}/raw`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

/**
 * Fetch the parsed metadata document for a given PDB entry.
 * @param pdbId - 4-character PDB identifier (e.g. `4YYR`).
 * @returns Promise resolving to the parsed PDB document.
 */
export function fetchPdbDoc(pdbId: string): Promise<PdbDoc> {
  return fetchJson<PdbDoc>(`/v1/pdbs/${encodeURIComponent(pdbId)}`);
}

/**
 * Fetch the most recent rsync-history record for the asymmetric-unit archive.
 * @returns Promise resolving to the most recent run, or `null` if none exists.
 */
export async function fetchLastAsymRsync(): Promise<RsyncHistoryDoc | null> {
  const response = await fetchJson<RsyncHistoryResponse>(
    '/v1/rsync-history?type=asymUnit&limit=1',
  );
  return response.rows[0] ?? null;
}

/**
 * Fetch the most recent rsync-history record for the bio-assembly archive.
 * @returns Promise resolving to the most recent run, or `null` if none exists.
 */
export async function fetchLastBioAssemblyRsync(): Promise<RsyncHistoryDoc | null> {
  const response = await fetchJson<RsyncHistoryResponse>(
    '/v1/rsync-history?type=bioAssembly&limit=1',
  );
  return response.rows[0] ?? null;
}

/**
 * Fetch a page of rsync-history rows for the given archive type.
 * @param type - Which archive's history to load.
 * @param limit - Maximum rows to return (1–200).
 * @returns The rsync-history page.
 */
export function fetchRsyncHistory(
  type: 'asymUnit' | 'bioAssembly',
  limit = 20,
): Promise<RsyncHistoryResponse> {
  return fetchJson<RsyncHistoryResponse>(
    `/v1/rsync-history?type=${type}&limit=${limit}`,
  );
}

/**
 * Fetch the live state of the rsync and CCD crons.
 * @returns Promise resolving to the combined sync status.
 */
export function fetchSyncStatus(): Promise<SyncStatusResponse> {
  return fetchJson<SyncStatusResponse>('/v1/sync/status');
}

/**
 * Queue a manual run for the given cron. The API drops a marker in the
 * shared `data/control/` volume; the cron container picks it up on its
 * next 5-second poll and runs immediately.
 * @param kind - Which cron to wake.
 * @returns Promise resolving to the post-trigger sync state.
 */
export async function triggerSync(
  kind: 'rsync' | 'ccd',
): Promise<SyncTriggerResponse> {
  const response = await fetch('/v1/sync/trigger', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ kind }),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<SyncTriggerResponse>;
}

/* ------------------------------------------------------------------------ *
 * /v1/pdbs search (replaces CouchDB Mango `_find`)
 * ------------------------------------------------------------------------ */

/** A simple optional [min, max] range used to build search queries. */
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
  /**
   * Free-text query matched against the `title` FTS5 column. Whitespace
   * splits the query into AND-ed tokens.
   */
  query?: string;
  /**
   * smart-sqlite3-filter expression evaluated against the `pdb_entries`
   * table — supports field-scoped operators (e.g. `year:>=2024
   * nb_helices:>5 title:~kinase`). Composes with the structured filters
   * and `query` (FTS5) via AND-intersection.
   */
  smart?: string;
}

/** Response of a `_find`-style query. */
export interface FindResponse<TDoc> {
  docs: TDoc[];
}

const PAGE_LIMIT = 200;

function appendRange(
  params: URLSearchParams,
  field: string,
  range: NumericRange | undefined,
): void {
  if (!range) return;
  if (typeof range.min === 'number') {
    params.set(`${field}Min`, String(range.min));
  }
  if (typeof range.max === 'number') {
    params.set(`${field}Max`, String(range.max));
  }
}

/**
 * Run a search query against the parsed-PDB metadata. Returns up to
 * `PAGE_LIMIT` docs in id order.
 * @param params - Filter parameters.
 * @returns Promise resolving to the matching docs.
 */
export async function findDocuments<TDoc>(
  params: FindParams,
): Promise<FindResponse<TDoc>> {
  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(PAGE_LIMIT));
  if (params.methods && params.methods.length > 0) {
    queryParams.set('methods', params.methods.join(','));
  }
  appendRange(queryParams, 'helices', params.helices);
  appendRange(queryParams, 'sheets', params.sheets);
  appendRange(queryParams, 'ligands', params.ligands);
  appendRange(queryParams, 'residues', params.residues);
  appendRange(queryParams, 'year', params.year);
  if (params.query?.trim()) queryParams.set('q', params.query.trim());
  if (params.smart?.trim()) queryParams.set('smart', params.smart.trim());
  return fetchJson<FindResponse<TDoc>>(`/v1/pdbs?${queryParams.toString()}`);
}

/**
 * Fetch the global ω-bond totals across the whole database.
 * @returns Promise resolving to a single-row response whose value is the
 *   `[nbCis, nbTrans, nbTwisted, nbPeptideBonds]` tuple summed over every entry.
 */
export function fetchOmegaSummary(): Promise<OmegaSummaryResponse> {
  return fetchJson<OmegaSummaryResponse>('/v1/stats/omegaSummary');
}

/**
 * Fetch ω-bond totals broken down by deposition year.
 * @returns Promise resolving to one row per year.
 */
export function fetchOmegaByYear(): Promise<OmegaByYearResponse> {
  return fetchJson<OmegaByYearResponse>('/v1/stats/omegaByYear');
}

/**
 * Fetch the per-pair `[nbCis, nbTotal]` tuples for every observed
 * `[residue1, residue2]` peptide bond, optionally restricted to a year range.
 * @param yearRange - Optional `[minYear, maxYear]` inclusive bounds.
 * @returns Promise resolving to one row per pair.
 */
export function fetchPairFrequency(
  yearRange?: [number, number],
): Promise<PairFrequencyResponse> {
  if (!yearRange) {
    return fetchJson<PairFrequencyResponse>('/v1/stats/pairFrequency');
  }
  const [fromYear, toYear] = yearRange;
  return fetchJson<PairFrequencyResponse>(
    `/v1/stats/pairFrequency?fromYear=${fromYear}&toYear=${toYear}`,
  );
}

/**
 * Run a substructure search against the canonical CCD ligand database.
 * @param idCode - OpenChemLib idCode of the query fragment, or `null` to
 *   request the default ranking (most-used ligands by descending PDB count).
 * @param limit - Maximum number of results.
 * @returns Matching ligands and search statistics.
 */
export function fetchLigandSearch(
  idCode: string | null,
  limit = 200,
): Promise<LigandSearchResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (idCode) params.set('substructure', idCode);
  return fetchJson<LigandSearchResponse>(`/v1/ligands?${params.toString()}`);
}

/**
 * Fetch the canonical structure rows for a specific list of ligand codes.
 * @param codes - 3-letter chemical-component codes.
 * @returns Matching ligands (order is not guaranteed).
 */
export function fetchLigandsByCodes(
  codes: string[],
): Promise<LigandSearchResponse> {
  if (codes.length === 0) {
    return Promise.resolve({
      ligands: [],
      stats: {
        screened: 0,
        verified: 0,
        screeningMs: 0,
        verificationMs: 0,
        overLimit: false,
      },
    });
  }
  const params = new URLSearchParams({ codes: codes.join(',') });
  return fetchJson<LigandSearchResponse>(`/v1/ligands?${params.toString()}`);
}

/**
 * Fetch the canonical record for a single ligand code.
 * @param code - 3-letter chemical-component code.
 * @returns Ligand detail wrapper.
 */
export function fetchLigandDetail(code: string): Promise<LigandDetailResponse> {
  return fetchJson<LigandDetailResponse>(
    `/v1/ligands/${encodeURIComponent(code)}`,
  );
}

/**
 * Fetch a paginated list of PDBs containing a given ligand code.
 * @param code - 3-letter chemical-component code.
 * @param limit - Page size (max 1000).
 * @param offset - Number of rows to skip.
 * @returns Paginated PDB references for the ligand.
 */
export function fetchLigandPdbs(
  code: string,
  limit = 100,
  offset = 0,
): Promise<LigandPdbsResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return fetchJson<LigandPdbsResponse>(
    `/v1/ligands/${encodeURIComponent(code)}/pdbs?${params.toString()}`,
  );
}
