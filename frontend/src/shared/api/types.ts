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
