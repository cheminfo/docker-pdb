-- ---- ccd_history: allow 'running' state -----------------------------------
--
-- The previous schema only persisted a ccd_history row in seedCCD's `finally`
-- block, so a catastrophic failure (SIGKILL/OOM during the multi-minute parse
-- phase) silently dropped the entire run. The Settings page then reported
-- "never refreshed" indistinguishably from "started but never finished" — the
-- exact state we hit on test.epfl.ch, where the cron container had
-- downloaded the gz archive but never written a single ligands row.
--
-- The new schema:
--   * Adds 'running' to the status CHECK constraint.
--   * Relaxes finished_at / duration_ms to NULL so the row can be written at
--     start and finalised on completion.
--   * Adds pid and last_heartbeat_at so /v1/diagnostics can show whether a
--     "running" row is genuinely live or an orphaned crash-leftover.

ALTER TABLE ccd_history RENAME TO ccd_history_old;

CREATE TABLE ccd_history (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at        TEXT    NOT NULL,
  finished_at       TEXT,
  duration_ms       INTEGER,
  status            TEXT    NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  imported_count    INTEGER NOT NULL DEFAULT 0,
  skipped_count     INTEGER NOT NULL DEFAULT 0,
  bytes_on_disk     INTEGER,
  error             TEXT,
  pid               INTEGER,
  last_heartbeat_at TEXT
);

INSERT INTO ccd_history (
  id, started_at, finished_at, duration_ms, status,
  imported_count, skipped_count, bytes_on_disk, error
)
SELECT
  id, started_at, finished_at, duration_ms, status,
  imported_count, skipped_count, bytes_on_disk, error
FROM ccd_history_old;

DROP TABLE ccd_history_old;

DROP INDEX IF EXISTS idx_ccd_history_finished;
CREATE INDEX IF NOT EXISTS idx_ccd_history_started
  ON ccd_history(started_at DESC);
