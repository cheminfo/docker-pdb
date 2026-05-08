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
