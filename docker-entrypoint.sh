#!/bin/sh
# Runs as root so it can fix permissions on the bind-mounted /app/data
# directory (typically created by the host as root), then drops to the
# unprivileged `app` user before exec'ing the command. Standard
# entrypoint + gosu pattern used by many official Docker images.
#
# IMPORTANT: chown WITHOUT -R. We only need to make each subdirectory
# itself writable by `app` (so it can create files inside). Existing
# files inside data/pdb/ and data/pdb-assembly/ — possibly hundreds of
# gigabytes of rsynced .gz archives owned by app from a previous run —
# must NOT be re-chowned every container restart. Recursive chown over
# the rsynced tree took 30+ minutes on a populated install and stalled
# the boot sequence.
set -e

mkdir -p \
  /app/data/pdb \
  /app/data/pdb-assembly \
  /app/data/pymol \
  /app/data/logs/pdb \
  /app/data/logs/bioAssembly \
  /app/data/sqlite \
  /app/data/ccd \
  /app/data/control
chown app:app \
  /app/data \
  /app/data/pdb \
  /app/data/pdb-assembly \
  /app/data/pymol \
  /app/data/logs \
  /app/data/logs/pdb \
  /app/data/logs/bioAssembly \
  /app/data/sqlite \
  /app/data/ccd \
  /app/data/control

# Fix ownership of any subdirectories that were created by root in a prior
# run (e.g. before gosu was introduced). We only touch directory inodes —
# never file data — so this finishes in seconds even on a fully-populated
# install (~2000 directory entries across the three trees).
find /app/data/pdb /app/data/pdb-assembly /app/data/pymol \
  -maxdepth 3 -type d ! -user app \
  -exec chown app:app {} +

exec gosu app "$@"
