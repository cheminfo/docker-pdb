/* eslint-disable @typescript-eslint/naming-convention -- a few legacy CouchDB-shaped fields are preserved for chart compatibility */

/** Counts and disk size for one of the two archives, exposed by `/v1/database/info`. */
export interface DatabaseInfo {
  /** Number of entries in the archive. */
  doc_count?: number;
  /** Sizes object (file = total bytes on disk). */
  sizes?: {
    /** Total file size on disk in bytes. */
    file?: number;
  };
}

/** Combined response of `GET /v1/database/info`. */
export interface DatabaseInfoResponse {
  pdb: DatabaseInfo;
  assembly: DatabaseInfo;
}

/** A single row returned by a grouped stats query. */
export interface ViewRow<TKey> {
  key: TKey;
  value: number;
}

/** Response wrapper for grouped stats queries. */
export interface ViewResponse<TKey> {
  rows: Array<ViewRow<TKey>>;
}

/** `_stats`-shaped reduce result. */
export interface CouchStatsValue {
  sum: number;
  count: number;
  min: number;
  max: number;
  sumsqr: number;
}

/** Response of an un-grouped `_stats` query. */
export interface CouchStatsResponse {
  rows: Array<{ key: null; value: CouchStatsValue }>;
}

/** Response of a grouped `_stats` query, keyed by `TKey`. */
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

/** Parsed PDB document hydrated from sqlite by `/v1/pdbs/:id`. */
export interface PdbDoc {
  _id: string;
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

/** A row of `/v1/pdbs/jsmol`. */
export interface PdbViewRow {
  id: string;
  key: null;
  value: null;
  doc: PdbDoc;
}

/** Response of `/v1/pdbs/jsmol`. */
export interface PdbViewResponse {
  total_rows: number;
  offset: number;
  rows: PdbViewRow[];
}

/**
 * Tuple emitted by the omega summary / by-year endpoints:
 * `[nbCis, nbTrans, nbTwisted, nbPeptideBonds]`.
 */
export type OmegaTuple = [number, number, number, number];

/** Response of `/v1/stats/omegaSummary`. */
export interface OmegaSummaryResponse {
  rows: Array<{ key: null; value: OmegaTuple }>;
}

/** Response of `/v1/stats/omegaByYear`. */
export interface OmegaByYearResponse {
  rows: Array<{ key: number; value: OmegaTuple }>;
}

/**
 * Response of `/v1/stats/pairFrequency`. Value is a `[nbCis, nbTotal]` tuple
 * summed across every entry — heatmaps divide them to obtain P(cis) per pair.
 */
export interface PairFrequencyResponse {
  rows: Array<{ key: [string, string]; value: [number, number] }>;
}

/** Response of `/v1/stats/twistedPairFrequency`. */
export interface PairCountResponse {
  rows: Array<{ key: [string, string]; value: number }>;
}

/** A single rsync-run row exposed by `/v1/rsync-history`. */
export interface RsyncHistoryDoc {
  /** Which archive was rsynced. */
  type: 'asymUnit' | 'bioAssembly';
  /** ISO timestamp when the rsync started. */
  startedAt: string;
  /** ISO timestamp when the rsync finished. */
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
   * run, in bytes, or `null` when `du` failed.
   * @default null
   */
  bytesOnDisk?: number | null;
}

/** Response of `/v1/rsync-history`. */
export interface RsyncHistoryResponse {
  rows: RsyncHistoryDoc[];
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
  /** OpenChemLib canonical idCode. 2D coordinates are invented client-side. */
  idCode: string;
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
