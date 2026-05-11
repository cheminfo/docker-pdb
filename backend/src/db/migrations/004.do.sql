-- ---- ccd_history (one row per CCD refresh run) ----------------------------
--
-- Mirrors `rsync_history`: replaces the previous "infer last refresh from
-- the cached archive's mtime" approach in the Settings page, which gave
-- us only the timestamp of the most recent successful download and no
-- history at all. Each row records start/finish/duration, the import
-- counters returned by seedCCD, the archive size, and either a
-- 'success' or 'failed' status with the captured error message.

CREATE TABLE IF NOT EXISTS ccd_history (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at     TEXT    NOT NULL,
  finished_at    TEXT    NOT NULL,
  duration_ms    INTEGER NOT NULL,
  status         TEXT    NOT NULL CHECK (status IN ('success', 'failed')),
  imported_count INTEGER NOT NULL DEFAULT 0,
  skipped_count  INTEGER NOT NULL DEFAULT 0,
  bytes_on_disk  INTEGER,
  error          TEXT
);

CREATE INDEX IF NOT EXISTS idx_ccd_history_finished
  ON ccd_history(finished_at DESC);
