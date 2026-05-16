-- Admin credentials for the settings page. Only one row is expected
-- (single-admin setup). The first row is seeded from ADMIN_USERNAME /
-- ADMIN_PASSWORD env vars at startup if the table is empty; subsequent
-- auth and password changes operate against this table, not the env.

CREATE TABLE IF NOT EXISTS credentials (
  username      TEXT NOT NULL PRIMARY KEY,
  password_hash TEXT NOT NULL
);
