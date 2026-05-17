/* eslint-disable @typescript-eslint/naming-convention -- a few snake_case fields are preserved for backward compatibility with third-party API callers */

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
export interface StatsValue {
  sum: number;
  count: number;
  min: number;
  max: number;
  sumsqr: number;
}

/** Response of an un-grouped `_stats` query. */
export interface StatsResponse {
  rows: Array<{ key: null; value: StatsValue }>;
}

/** Response of a grouped `_stats` query, keyed by `TKey`. */
export interface GroupedStatsResponse<TKey> {
  rows: Array<{ key: TKey; value: StatsValue }>;
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

/**
 * Response of `/v1/stats/pairFrequencyByYear`. One row per
 * `[year, residue1, residue2]` triple with at least one observation, so the
 * frontend can sum across an arbitrary year range without a network call.
 */
export interface PairFrequencyByYearResponse {
  rows: Array<{
    key: [number, string, string];
    value: [number, number];
  }>;
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

/** A single CCD-refresh row exposed by `/v1/ccd-history`. */
export interface CcdHistoryDoc {
  /** ISO timestamp when the refresh started. */
  startedAt: string;
  /** ISO timestamp when the refresh finished (or failed). */
  finishedAt: string;
  /** Total refresh duration in milliseconds. */
  durationMs: number;
  /** Whether the refresh completed without throwing. */
  status: 'success' | 'failed';
  /** Number of CCD entries inserted / updated during the run. */
  importedCount: number;
  /** Number of CCD entries skipped (single-atom ions, OCL failures, …). */
  skippedCount: number;
  /**
   * Size on disk of the cached archive at the end of the run, or `null`
   * if the archive was missing (download failed before rename).
   * @default null
   */
  bytesOnDisk: number | null;
  /** Error message captured on failure, or `null` on success. */
  error: string | null;
}

/** Response of `/v1/ccd-history`. */
export interface CcdHistoryResponse {
  rows: CcdHistoryDoc[];
}

/** A trigger marker, present while the API has queued a manual sync. */
export interface SyncTriggerInfo {
  /** ISO timestamp when the API queued this trigger. */
  requestedAt: string;
  /** Identifier of the caller that queued the trigger (always `api`). */
  source: string;
}

/** Sub-phase of a long-running sync, surfaced for live progress display. */
export type SyncPhase =
  | 'rebuild-asym'
  | 'rebuild-assembly'
  | 'rsync-asym'
  | 'rsync-assembly';

/**
 * Fine-grained state of the rsync child process within an `rsync-*` phase.
 * - `connecting`: rsync was spawned, nothing has been received on stdout yet.
 * - `scanning`: rsync is walking the remote tree (no `.gz` file received yet).
 * - `transferring`: at least one `.gz` file has been received (or rsync has
 *   emitted a byte-level progress line).
 * - `post-rsync`: rsync has exited; the file watcher is still draining the
 *   awaitWriteFinish grace period before we close it.
 */
export type RsyncSubPhase =
  | 'connecting'
  | 'scanning'
  | 'transferring'
  | 'post-rsync';

/**
 * Byte-level progress parsed from rsync's `--info=progress2` output. Set
 * once rsync starts emitting per-file progress lines; remains `undefined`
 * during the silent connecting / scanning windows.
 */
export interface RsyncByteProgress {
  /** Rsync's own global progress percentage (0-100). */
  percent: number;
  /** Bytes received so far in this run. */
  bytesTransferred: number;
  /** Human-readable transfer rate (e.g. "1.23MB/s"). */
  rate: string;
  /**
   * Files left to check, as reported by rsync's `to-chk=` / `ir-chk=`
   * summary. `undefined` while rsync has not yet emitted a per-file
   * progress line.
   */
  filesRemaining?: number;
  /** Total files known to rsync at the moment of the last progress line. */
  filesTotal?: number;
}

/** A running marker, present while the cron container is actively working. */
export interface SyncRunningInfo {
  /** ISO timestamp when the cron loop started this iteration. */
  startedAt: string;
  /** Cron kind (`rsync` or `ccd`). */
  type: 'rsync' | 'ccd';
  /** PID of the cron container's node process — surfaced for debugging. */
  pid: number;
  /** Archives included in this rsync run, when applicable. */
  scope?: Array<'asymUnit' | 'bioAssembly'>;
  /**
   * Current sub-phase of the run. `rebuild-*` phases run on first boot when
   * the on-disk archive exists but `pdb_entries` is empty; `rsync-*` phases
   * run during the periodic wwPDB rsync. Absent on legacy markers.
   */
  phase?: SyncPhase;
  /**
   * Fine-grained state of the rsync child process. Only set during `rsync-*`
   * phases; absent during `rebuild-*` (rebuild has no upstream connection).
   */
  subPhase?: RsyncSubPhase;
  /** Files (or rows) processed so far in the current phase. */
  processed?: number;
  /**
   * Total work for the current phase. Set during rebuild (the file list is
   * known up-front); omitted during rsync (rsync writes files as it goes).
   */
  total?: number;
  /** Most recently processed PDB id, surfaced for the live banner. */
  lastEntryId?: string;
  /**
   * Aggregated PyMol render outcomes for the current bio-assembly phase.
   * `rendered` = new PNGs generated; `skipped` = existing PNGs kept;
   * `failed` = render attempts that threw (also appended to
   * `data/pymol/failures.log` for offline triage).
   */
  renderStats?: {
    rendered: number;
    skipped: number;
    failed: number;
  };
  /**
   * Byte-level progress from rsync's own output. Set once rsync has begun
   * transferring; absent during connecting / scanning windows where the
   * card falls back to an indeterminate "we're alive" animation.
   */
  rsyncProgress?: RsyncByteProgress;
}

/** Live state of the rsync cron. */
export interface RsyncSyncState {
  kind: 'rsync';
  label: string;
  /** Configured cadence between automatic runs (24 h). */
  intervalMs: number;
  running: SyncRunningInfo | null;
  triggerQueued: SyncTriggerInfo | null;
  /** Most recent asym-unit run, or `null` if none has been recorded yet. */
  lastAsymUnit: RsyncHistoryDoc | null;
  /** Most recent bio-assembly run, or `null` if none has been recorded yet. */
  lastBioAssembly: RsyncHistoryDoc | null;
}

/** Live state of the CCD cron. */
export interface CcdSyncState {
  kind: 'ccd';
  label: string;
  /** Configured cadence between automatic runs (7 days). */
  intervalMs: number;
  running: SyncRunningInfo | null;
  triggerQueued: SyncTriggerInfo | null;
  /**
   * ISO timestamp of the most recent refresh. Comes from the latest
   * `ccd_history` row when one exists, otherwise from the cached
   * archive's mtime (first-boot, before the cron container has written
   * any row yet).
   */
  lastRefreshedAt: string | null;
  /** Size on disk of the cached archive, or `null` if not present. */
  bytesOnDisk: number | null;
  /**
   * Full record for the most recent refresh, or `null` until the first
   * row is written. Used by the Settings page to render the last
   * outcome (success / failed, imported count, duration) alongside the
   * "next run" estimate.
   */
  lastRefresh: CcdHistoryDoc | null;
}

/** Response of `GET /v1/sync/status`. */
export interface SyncStatusResponse {
  rsync: RsyncSyncState;
  ccd: CcdSyncState;
  kinds: Array<'rsync' | 'ccd'>;
}

/** Response of `POST /v1/sync/trigger`. */
export interface SyncTriggerResponse {
  kind: 'rsync' | 'ccd';
  /** `queued` = marker written; `already-*` = no-op reasons. */
  status: 'queued' | 'already-queued' | 'already-running';
  triggerQueued?: SyncTriggerInfo;
  running?: SyncRunningInfo;
}

/** One assembly entry in the `data.assemblyThumbnailSamples.samples` array. */
/** `database` block from `GET /v1/diagnostics`. */
export interface DiagnosticsDatabase {
  ligandCount: number;
  pdbCount: number;
  /** Total entries with `has_assembly = 1`. */
  assemblyTotal: number;
  /** Assembly entries with no 200×200 PNG on disk. */
  assemblyMissing: number;
  ligandsLooksEmpty: boolean;
  /** Entries in `pdb_entries` with `title = ''`. */
  emptyTitleCount: number;
  /** Rows present in `pdb_title_fts`. */
  ftsTitleCount: number;
}

/** Response of `GET /v1/diagnostics`. */
export interface DiagnosticsResponse {
  database: DiagnosticsDatabase;
  data: {
    dataDir: string;
    pymolDir: string;
    pymolSamples: {
      pymolDirExists: boolean;
      bucketCount: number | null;
    };
  };
}

/** In-flight or completed thumbnail render job state. */
export interface RenderThumbnailsState {
  running: boolean;
  /** Entries processed so far (rendered + skipped + failed). */
  processed: number;
  /** Total entries with `has_assembly = 1`. */
  total: number;
  /** PNG sizes successfully written this job. */
  rendered: number;
  /** PNG sizes that already existed and were left as-is. */
  skipped: number;
  /** Assembly files missing on disk or PyMol errors. */
  failed: number;
  startedAt: string;
  finishedAt: string | null;
}

/** Response of `POST /v1/fix/render-thumbnails`. */
export interface RenderThumbnailsTriggerResponse {
  status: 'started' | 'already-running';
  state: RenderThumbnailsState;
}

/** Response of `GET /v1/fix/render-thumbnails/status`. */
export interface RenderThumbnailsStatusResponse {
  state: RenderThumbnailsState | null;
}

/** In-flight or completed rebuild-titles job state. */
export interface RebuildTitlesState {
  running: boolean;
  /** Entries processed so far (fixed + skipped). */
  processed: number;
  /** Total entries with an empty title at job start. */
  total: number;
  /** Entries whose title was successfully populated. */
  fixed: number;
  /** Entries with no raw file on disk or still-empty title after parse. */
  skipped: number;
  startedAt: string;
  finishedAt: string | null;
}

/** Response of `POST /v1/fix/rebuild-titles`. */
export interface RebuildTitlesTriggerResponse {
  status: 'started' | 'already-running';
  state: RebuildTitlesState;
}

/** Response of `GET /v1/fix/rebuild-titles/status`. */
export interface RebuildTitlesStatusResponse {
  state: RebuildTitlesState | null;
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
