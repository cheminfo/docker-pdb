/* eslint-disable @typescript-eslint/naming-convention -- CouchDB API uses snake_case field names */

/** CouchDB database info subset returned by `GET /pdb/` and `GET /assembly/`. */
export interface DatabaseInfo {
  /** Number of documents in the database. */
  doc_count?: number;
  /**
   * Total disk space used by the database in bytes (CouchDB <3.0 field).
   * @default undefined
   */
  disk_size?: number;
  /**
   * Sizes object exposed by CouchDB ≥3.0.
   * @default undefined
   */
  sizes?: {
    /** Total file size on disk in bytes. */
    file?: number;
  };
}

/** A single row returned by a CouchDB reduce view with `?group=true`. */
export interface ViewRow<TKey> {
  key: TKey;
  value: number;
}

/** Response wrapper returned by CouchDB view queries. */
export interface ViewResponse<TKey> {
  rows: Array<ViewRow<TKey>>;
}

/** Value object returned by CouchDB's built-in `_stats` reduce. */
export interface CouchStatsValue {
  sum: number;
  count: number;
  min: number;
  max: number;
  sumsqr: number;
}

/** Response of a `_stats` reduce view called without `?group=true`. */
export interface CouchStatsResponse {
  rows: Array<{ key: null; value: CouchStatsValue }>;
}

/** Response of a `_stats` reduce view with `?group=true`, keyed by `TKey`. */
export interface GroupedStatsResponse<TKey> {
  rows: Array<{ key: TKey; value: CouchStatsValue }>;
}

/** A helix annotation parsed from a PDB file. */
export interface PdbHelix {
  chain: string;
  from: number;
  to: number;
  kind: number;
}

/** A beta-sheet annotation parsed from a PDB file. */
export interface PdbSheet {
  chain: string;
  from: number;
  to: number;
}

/** A ligand / formula record parsed from a PDB file. */
export interface PdbFormula {
  label: string;
  mf: string;
  mw: string;
  number: number;
  name?: string;
}

/** A chain (peptidic sequence) inside a parsed PDB document. */
export interface PdbChain {
  id?: string;
  molecule?: string;
  synonym?: string;
  ec?: string;
  nbResidues: number;
  iep?: number;
}

/** Parsed PDB document stored in CouchDB. */
export interface PdbDoc {
  _id: string;
  _rev: string;
  title: string;
  year?: number;
  experiment?: string;
  nbResidues: number;
  nbChains: number;
  nbModifiedResidues: number;
  iep?: number;
  helices: PdbHelix[];
  sheets: PdbSheet[];
  formula: PdbFormula[];
  chain: Record<string, PdbChain>;
  percentageAA?: Record<string, number>;
  residueStats?: Record<string, number>;
}

/** A row of `_view/jsmol?include_docs=true`. */
export interface PdbViewRow {
  id: string;
  key: null;
  value: null;
  doc: PdbDoc;
}

/** Response of `_view/jsmol?include_docs=true`. */
export interface PdbViewResponse {
  total_rows: number;
  offset: number;
  rows: PdbViewRow[];
}

/**
 * Tuple emitted by the `omegaSummary` / `omegaByYear` views:
 * `[nbCis, nbTrans, nbTwisted, nbPeptideBonds]`.
 */
export type OmegaTuple = [number, number, number, number];

/** Response of the `omegaSummary` view (one row, key = null). */
export interface OmegaSummaryResponse {
  rows: Array<{ key: null; value: OmegaTuple }>;
}

/** Response of the `omegaByYear` view, grouped on the year. */
export interface OmegaByYearResponse {
  rows: Array<{ key: number; value: OmegaTuple }>;
}

/**
 * Response of `pairFrequency` (and the by-year collapsed variant), grouped by
 * `[residue1, residue2]`. Value is a `[nbCis, nbTotal]` tuple summed across
 * every document — the heatmap divides them to obtain P(cis) per pair.
 */
export interface PairFrequencyResponse {
  rows: Array<{ key: [string, string]; value: [number, number] }>;
}

/** Response of `twistedPairFrequency`, grouped by `[residue1, residue2]`. */
export interface PairCountResponse {
  rows: Array<{ key: [string, string]; value: number }>;
}

/** A single rsync-run document stored in the `rsync-history` database. */
export interface RsyncHistoryDoc {
  _id: string;
  _rev: string;
  /** Which archive was rsynced. */
  type: 'asymUnit' | 'bioAssembly';
  /** ISO timestamp when the rsync started. */
  startedAt: string;
  /** ISO timestamp when the rsync finished (matches `_id`). */
  finishedAt: string;
  /** Total rsync duration in milliseconds. */
  durationMs: number;
  /** Number of files written to disk during the run. */
  updatedCount: number;
  /** Number of upstream deletions reported by rsync. */
  deletedCount: number;
  /**
   * Lexicographically-largest 4-character PDB id imported in this run, or
   * `null` if no files were updated. Used by the home page to preview the
   * most recently imported structure.
   */
  lastEntryId: string | null;
  /**
   * Total apparent size of the rsynced archive directory at the end of the
   * run, in bytes. `null` (or missing on older docs) when `du` failed or the
   * field had not yet been recorded.
   * @default null
   */
  bytesOnDisk?: number | null;
}

/** A row of `_design/history/_view/asymByDate?include_docs=true`. */
export interface RsyncHistoryRow {
  id: string;
  key: string;
  value: null;
  doc: RsyncHistoryDoc;
}

/** Response of `_design/history/_view/*ByDate?include_docs=true`. */
export interface RsyncHistoryViewResponse {
  total_rows: number;
  offset: number;
  rows: RsyncHistoryRow[];
}

/** One ligand row returned by the substructure-search API. */
export interface LigandSummary {
  /** 3-letter wwPDB chemical-component code (e.g. `ATP`). */
  code: string;
  /** Human-readable chemical name (HETNAM). */
  name: string;
  /** Molecular formula. */
  mf: string;
  /** Molecular weight in g/mol. */
  mw: number;
  /** OpenChemLib canonical idCode used by `IdcodeSvgRenderer`. */
  idCode: string;
  /** OpenChemLib coordinate string paired with `idCode`. */
  coordinates: string;
  /** Number of distinct PDBs that reference this ligand code. */
  nbPdbs: number;
}

/** Statistics returned alongside a substructure-search response. */
export interface LigandSearchStats {
  /** Number of candidates surviving the bitwise fingerprint screen. */
  screened: number;
  /** Number of candidates verified against the OCL substructure searcher. */
  verified: number;
  /** Wall-clock time spent in phase 1 (screening), in ms. */
  screeningMs: number;
  /** Wall-clock time spent in phase 2 (verification), in ms. */
  verificationMs: number;
  /** True when the result list was truncated to `limit`. */
  overLimit: boolean;
}

/** Response of `GET /v1/ligands?substructure=...`. */
export interface LigandSearchResponse {
  ligands: LigandSummary[];
  stats: LigandSearchStats;
}

/** Detailed ligand row returned by `GET /v1/ligands/:code`. */
export interface LigandDetail extends LigandSummary {
  /** Original CCD formula string (with element separators). */
  formula: string;
  /** CCD chemical-component type (`NON-POLYMER`, `L-PEPTIDE LINKING`, …). */
  type: string;
  /** Number of heavy atoms in the canonical structure. */
  nbAtoms: number;
}

/** Response of `GET /v1/ligands/:code`. */
export interface LigandDetailResponse {
  ligand: LigandDetail;
}

/** One PDB referenced by a given ligand. */
export interface LigandPdbReference {
  /** 4-character PDB id. */
  pdbId: string;
  /** Number of copies of the ligand in this PDB. */
  count: number;
}

/** Response of `GET /v1/ligands/:code/pdbs`. */
export interface LigandPdbsResponse {
  total: number;
  limit: number;
  offset: number;
  pdbs: LigandPdbReference[];
}
