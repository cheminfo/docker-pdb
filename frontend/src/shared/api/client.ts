import type {
  CouchStatsResponse,
  CouchStatsValue,
  DatabaseInfo,
  GroupedStatsResponse,
  OmegaByYearResponse,
  OmegaSummaryResponse,
  PairFrequencyResponse,
  PdbDoc,
  PdbViewResponse,
  RsyncHistoryDoc,
  RsyncHistoryViewResponse,
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

/**
 * Fetch the grouped `aminoAcidFreq` reduce view: total residue count for each
 * of the 20 standard amino-acid 3-letter codes across the whole DB.
 * @returns Promise resolving to a row per amino-acid code.
 */
export function fetchAminoAcidFreq(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/stats/aminoAcidFreq?group=true');
}

/**
 * Fetch the grouped `nucleicBaseFreq` reduce view: total residue count for
 * each DNA / RNA base across the whole DB.
 * @returns Promise resolving to a row per base code.
 */
export function fetchNucleicBaseFreq(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/stats/nucleicBaseFreq?group=true');
}

/**
 * Fetch the grouped `moleculeType` reduce view: number of entries per
 * molecule-type bucket (`protein`, `nucleic`, `hybrid`, `other`).
 * @returns Promise resolving to a row per molecule type.
 */
export function fetchMoleculeType(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/stats/moleculeType?group=true');
}

/**
 * Fetch the grouped `modifiedResiduesHist` reduce view: number of entries
 * having exactly N modified residues, keyed by N.
 * @returns Promise resolving to a row per modified-residue count.
 */
export function fetchModifiedResiduesHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>(
    '/stats/modifiedResiduesHist?group=true',
  );
}

/**
 * Fetch the grouped `helixKindHist` reduce view: number of helices per PDB
 * `kind` code (1 = right-handed alpha, 5 = 3-10, etc.).
 * @returns Promise resolving to a row per helix kind code.
 */
export function fetchHelixKindHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/helixKindHist?group=true');
}

/**
 * Fetch the grouped `helixLengthHist` reduce view: number of helices of each
 * residue-length value.
 * @returns Promise resolving to a row per helix length.
 */
export function fetchHelixLengthHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/helixLengthHist?group=true');
}

/**
 * Fetch the grouped `sheetLengthHist` reduce view: number of beta-sheet
 * strands of each residue-length value.
 * @returns Promise resolving to a row per sheet strand length.
 */
export function fetchSheetLengthHist(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/sheetLengthHist?group=true');
}

/**
 * Fetch the grouped `helicesVsSheets` reduce view: number of entries with each
 * `[nbHelices, nbSheets]` pair, used to render a 2-D heatmap.
 * @returns Promise resolving to a row per `[nbHelices, nbSheets]` pair.
 */
export function fetchHelicesVsSheets(): Promise<
  ViewResponse<[number, number]>
> {
  return fetchJson<ViewResponse<[number, number]>>(
    '/stats/helicesVsSheets?group=true',
  );
}

/**
 * Fetch the grouped `secondaryStructurePresence` reduce view: number of
 * entries in each presence bucket (`none`, `helices-only`, `sheets-only`,
 * `mixed`).
 * @returns Promise resolving to a row per presence bucket.
 */
export function fetchSecondaryStructurePresence(): Promise<
  ViewResponse<string>
> {
  return fetchJson<ViewResponse<string>>(
    '/stats/secondaryStructurePresence?group=true',
  );
}

/**
 * Fetch the grouped `residuesHistogram` reduce view: number of entries whose
 * total residue count falls into each pre-defined bucket (lower bound).
 * @returns Promise resolving to a row per residues-count bucket.
 */
export function fetchResiduesHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/residuesHistogram?group=true');
}

/**
 * Fetch the grouped `chainsHistogram` reduce view: number of entries with
 * exactly N chains, keyed by N.
 * @returns Promise resolving to a row per chains count.
 */
export function fetchChainsHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/chainsHistogram?group=true');
}

/**
 * Fetch the (un-grouped) `residuesPerChainStats` reduce view: min / max / mean
 * residues-per-chain across all entries.
 * @returns Promise resolving to the `_stats` value.
 */
export function fetchResiduesPerChainStats(): Promise<CouchStatsResponse> {
  return fetchJson<CouchStatsResponse>('/stats/residuesPerChainStats');
}

/**
 * Fetch the grouped `ligandFrequency` reduce view: total occurrence count of
 * each non-water ligand (HET code) across the whole DB.
 * @returns Promise resolving to a row per ligand label.
 */
export function fetchLigandFrequency(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/stats/ligandFrequency?group=true');
}

/**
 * Fetch the grouped `ligandMwHistogram` reduce view: number of ligand
 * occurrences per molecular-weight bucket (lower bound, in g/mol).
 * @returns Promise resolving to a row per MW bucket.
 */
export function fetchLigandMwHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/ligandMwHistogram?group=true');
}

/**
 * Fetch the grouped `ligandsByYear` reduce view: per-year `_stats` of the
 * number of (non-water) ligands per entry.
 * @returns Promise resolving to a row per year.
 */
export function fetchLigandsByYear(): Promise<GroupedStatsResponse<number>> {
  return fetchJson<GroupedStatsResponse<number>>(
    '/stats/ligandsByYear?group=true',
  );
}

/**
 * Fetch the grouped `iepHistogram` reduce view: number of entries per
 * isoelectric-point bucket (0.5-wide bins, keyed by lower bound).
 * @returns Promise resolving to a row per IEP bucket.
 */
export function fetchIepHistogram(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/iepHistogram?group=true');
}

/**
 * Fetch the grouped `ecClasses` reduce view: number of entries having at
 * least one chain in each of the 7 top-level Enzyme-Commission classes
 * (1 oxidoreductases, 2 transferases, …, 7 translocases).
 * @returns Promise resolving to a row per EC top-level class.
 */
export function fetchEcClasses(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/stats/ecClasses?group=true');
}

/**
 * Fetch the grouped `residuesByYear` reduce view: per-year `_stats` of the
 * total number of residues per entry.
 * @returns Promise resolving to a row per year.
 */
export function fetchResiduesByYear(): Promise<GroupedStatsResponse<number>> {
  return fetchJson<GroupedStatsResponse<number>>(
    '/stats/residuesByYear?group=true',
  );
}

/**
 * Fetch the grouped `methodByYear` reduce view: number of entries per
 * `[year, experiment]` pair, used to render a stacked-by-method timeline.
 * @returns Promise resolving to a row per `[year, experiment]` pair.
 */
export function fetchMethodByYear(): Promise<ViewResponse<[number, string]>> {
  return fetchJson<ViewResponse<[number, string]>>(
    '/stats/methodByYear?group=true',
  );
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

/**
 * Fetch the parsed CouchDB document for a given PDB entry. Returns the same
 * record produced by the ingestion parser (title, year, experiment, formula,
 * chains, etc.), without attachments.
 * @param pdbId - 4-character PDB identifier (e.g. `4YYR`).
 * @returns Promise resolving to the parsed PDB document.
 */
export function fetchPdbDoc(pdbId: string): Promise<PdbDoc> {
  return fetchJson<PdbDoc>(`/pdb/${pdbId}`);
}

/**
 * Fetch the most recent rsync-history record for the asymmetric-unit archive,
 * which carries the timestamp, the count of imported files, and the id of the
 * latest imported entry to be previewed on the home page.
 * @returns Promise resolving to the most recent run, or `null` if no run has
 *   been recorded yet.
 */
export async function fetchLastAsymRsync(): Promise<RsyncHistoryDoc | null> {
  const response = await fetchJson<RsyncHistoryViewResponse>(
    '/rsync-history/_design/history/_view/asymByDate?descending=true&limit=1&include_docs=true',
  );
  return response.rows[0]?.doc ?? null;
}

/**
 * Fetch the most recent rsync-history record for the biological-assembly
 * archive. Used on the home page to surface the on-disk size of the raw
 * `.pdb1.gz` files alongside the asymmetric-unit numbers.
 * @returns Promise resolving to the most recent run, or `null` if no run has
 *   been recorded yet.
 */
export async function fetchLastBioAssemblyRsync(): Promise<RsyncHistoryDoc | null> {
  const response = await fetchJson<RsyncHistoryViewResponse>(
    '/rsync-history/_design/history/_view/bioAssemblyByDate?descending=true&limit=1&include_docs=true',
  );
  return response.rows[0]?.doc ?? null;
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
  /**
   * Free-text query matched against `title` via case-insensitive regex.
   * Whitespace splits the query into tokens; every token must match
   * (anywhere, in any order).
   */
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
  const trimmedQuery = params.query?.trim();
  if (trimmedQuery) {
    const tokens = trimmedQuery.split(/\s+/);
    if (tokens.length === 1) {
      selector.title = { $regex: `(?i)${escapeRegex(trimmedQuery)}` };
    } else {
      selector.$and = tokens.map((token) => ({
        title: { $regex: `(?i)${escapeRegex(token)}` },
      }));
    }
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

/**
 * Fetch the global ω-bond totals across the whole database.
 * @returns Promise resolving to a single-row response whose value is the
 *   `[nbCis, nbTrans, nbTwisted, nbPeptideBonds]` tuple summed over every entry.
 */
export function fetchOmegaSummary(): Promise<OmegaSummaryResponse> {
  return fetchJson<OmegaSummaryResponse>('/stats/omegaSummary');
}

/**
 * Fetch ω-bond totals broken down by deposition year.
 * @returns Promise resolving to one row per year, value =
 *   `[nbCis, nbTrans, nbTwisted, nbPeptideBonds]` summed for that year.
 */
export function fetchOmegaByYear(): Promise<OmegaByYearResponse> {
  return fetchJson<OmegaByYearResponse>('/stats/omegaByYear?group_level=1');
}

/**
 * Fetch the per-pair `[nbCis, nbTotal]` tuples for every observed
 * `[residue1, residue2]` peptide bond, optionally restricted to a year range.
 * The heatmap divides cis/total to obtain P(cis) per pair.
 * @param yearRange - Optional `[minYear, maxYear]` inclusive bounds. When
 *   omitted, the unrestricted `pairFrequency` view is queried.
 * @returns Promise resolving to one row per pair.
 */
export function fetchPairFrequency(
  yearRange?: [number, number],
): Promise<PairFrequencyResponse> {
  if (!yearRange) {
    return fetchJson<PairFrequencyResponse>('/stats/pairFrequency?group=true');
  }
  const [minYear, maxYear] = yearRange;
  const start = encodeURIComponent(JSON.stringify([minYear]));
  const end = encodeURIComponent(JSON.stringify([maxYear, {}, {}]));
  return fetchAndCollapsePairsByYear(
    `/stats/pairFrequencyByYear?group_level=3&start_key=${start}&end_key=${end}`,
  );
}

/**
 * Fetch the `pairFrequencyByYear` view at `group_level=3` and collapse the
 * `[year, r1, r2]` keys to `[r1, r2]` summed across years, so the caller sees
 * the same shape as the unrestricted `pairFrequency` view.
 * @param url - View URL (must already contain `group_level=3` and key bounds).
 * @returns Pair-frequency response keyed by `[r1, r2]`.
 */
async function fetchAndCollapsePairsByYear(
  url: string,
): Promise<PairFrequencyResponse> {
  const raw = await fetchJson<{
    rows: Array<{
      key: [number, string, string];
      value: [number, number];
    }>;
  }>(url);
  const collapsed = new Map<string, [number, number]>();
  for (const row of raw.rows) {
    const [, residue1, residue2] = row.key;
    const mapKey = `${residue1}\t${residue2}`;
    const [cis, total] = row.value;
    const previous = collapsed.get(mapKey);
    if (previous) {
      previous[0] += cis;
      previous[1] += total;
    } else {
      collapsed.set(mapKey, [cis, total]);
    }
  }
  const rows = Array.from(collapsed.entries()).map(([mapKey, value]) => {
    const [residue1, residue2] = mapKey.split('\t') as [string, string];
    return { key: [residue1, residue2] as [string, string], value };
  });
  return { rows };
}
