-- Reverse of 005.do.sql: restore the strict (success|failed) status enum and
-- the NOT NULL finished_at / duration_ms columns. Any rows still in the
-- 'running' state are demoted to 'failed' with a synthetic finished_at so the
-- NOT NULL constraint can be satisfied.

ALTER TABLE ccd_history RENAME TO ccd_history_new;

CREATE TABLE ccd_history (
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

INSERT INTO ccd_history (
  id, started_at, finished_at, duration_ms, status,
  imported_count, skipped_count, bytes_on_disk, error
)
SELECT
  id,
  started_at,
  COALESCE(finished_at, started_at),
  COALESCE(duration_ms, 0),
  CASE WHEN status = 'running' THEN 'failed' ELSE status END,
  imported_count, skipped_count, bytes_on_disk,
  CASE WHEN status = 'running' THEN COALESCE(error, 'orphaned running row (migration 005 reverted)') ELSE error END
FROM ccd_history_new;

DROP TABLE ccd_history_new;

DROP INDEX IF EXISTS idx_ccd_history_started;
CREATE INDEX IF NOT EXISTS idx_ccd_history_finished
  ON ccd_history(finished_at DESC);
