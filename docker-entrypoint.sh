#!/bin/sh
# Runs as root so it can fix permissions on the bind-mounted /app/data
# directory (typically created by the host as root), then drops to the
# unprivileged `app` user before exec'ing the command. Mirrors the pattern
# used by the official couchdb image.
set -e

mkdir -p \
  /app/data/pdb \
  /app/data/pdb-assembly \
  /app/data/logs/pdb \
  /app/data/logs/bioAssembly \
  /app/data/sqlite3 \
  /app/data/ccd
chown -R app:app \
  /app/data/pdb \
  /app/data/pdb-assembly \
  /app/data/logs \
  /app/data/sqlite3 \
  /app/data/ccd

exec gosu app "$@"
