# pdb-quickview

A self-hosted, **fast** read-only mirror of the [worldwide Protein Data
Bank](https://www.wwpdb.org/). Every entry is parsed once into SQLite and
rendered once into PyMol thumbnails (100/200/400 px), so structure metadata
and previews are served straight from disk — no on-the-fly rendering, no
upstream lookup.

![Scripting page screenshot](./frontend/scripting-smoke.png)

## What you get

- **Searchable index** — every PDB entry is parsed and indexed by number of
  residues, residue percentages, molecular weight, isoelectric point,
  ligand composition, etc. Free-text title search uses SQLite FTS5;
  ligand substructure search uses an OpenChemLib fingerprint screen
  followed by exact verification.
- **Precomputed thumbnails** — three sizes per entry, rendered once with
  PyMol so the homepage loads instantly.
- **Mirror of the raw files** — both asymmetric units and biological
  assemblies are kept on disk, kept up-to-date by a daily `rsync` against
  `rsync.wwpdb.org`. The raw `.gz` files are the single source of truth:
  the sqlite index can be wiped and rebuilt from them with `npm run
  rebuild`, no re-download required.
- **Small React dashboard** — homepage at `/` with database statistics
  and a thumbnail gallery, built from [`frontend/`](./frontend) and baked
  into the `pdb-api` image at build time.

## Architecture

Two core containers, plus a CCD-refresh sidecar, wired together by
`docker compose`:

| Container       | Role                                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `pdb-api`       | Fastify server: HTTP API (parsed metadata, stats aggregates, raw file streaming, substructure search) **and** the React/Vite homepage SPA, baked into the image at build time |
| `node-pdb-sync` | Daily cron: `rsync` the wwPDB tree, parse new files, render PyMol images, write to sqlite                                  |
| `pdb-api-cron`  | Weekly cron: refreshes `data/sqlite/ligands.db` from the wwPDB Chemical Component Dictionary                               |

All persistent state lives in `data/sqlite/ligands.db` (parsed metadata,
ligand fingerprints, rsync history) plus the rsynced `.gz` archives.

## Deployment

Three example compose files are provided. Copy whichever matches your
deployment to `compose.yaml`, then start the stack.

```sh
cp .env.example .env
```

By default, every example pulls the released image
`ghcr.io/cheminfo/docker-pdb:latest`. To build the image locally instead,
add `--build`:

```sh
docker compose pull && docker compose up -d        # released image
docker compose up -d --build                       # local build
```

### 1. Local / port-published — `compose.example.yaml`

Publishes `pdb-api` on `127.0.0.1:${PUBLIC_PORT}`. Open
`http://localhost:${PUBLIC_PORT}` once the database has finished its first
build.

```sh
cp compose.example.yaml compose.yaml
docker compose pull && docker compose up -d
```

### 2. Public via Cloudflare Tunnel — `compose.example.cloudflared.yaml`

No port published on the host; traffic enters via a `cloudflared` sidecar.

In the Cloudflare dashboard (https://dash.cloudflare.com):
**Networking → Tunnels → Create a tunnel → Cloudflared connector** → copy
the token into `.env` as `TUNNEL_TOKEN=...` → open the tunnel →
**Published applications** → add an application with **Service = HTTP**,
**URL = `pdb-api:3000`**, **Public hostname = `pdb.lactame.com`** (or
your chosen hostname).

```sh
cp compose.example.cloudflared.yaml compose.yaml
docker compose pull && docker compose up -d
```

### 3. Public via Traefik — `compose.example.traefik.yaml`

Requires the host to already run a Traefik instance attached to an external
Docker network named `traefik`, with a `websecure` entrypoint and a
`letsencrypt` cert resolver. Adjust the `Host(...)` label to your hostname
(default `pdb.cheminfo.org`).

```sh
cp compose.example.traefik.yaml compose.yaml
docker compose pull && docker compose up -d
```

## HTTP API

All endpoints are read-only (`GET`/`HEAD`) and served by the Fastify
backend. Common ones:

| Path                                            | What it returns                                            |
| ----------------------------------------------- | ---------------------------------------------------------- |
| `/v1/database/info`                             | Entry counts and decompressed bytes per archive            |
| `/v1/pdbs/{id}`                                 | Parsed metadata for entry `{id}` (chains, helices, …)      |
| `/v1/pdbs/{id}/raw`                             | Raw `.pdb` text for entry `{id}` (gunzipped on the fly)    |
| `/v1/assemblies/{id}/raw`                       | Raw `.pdb1` text for the bio-assembly                      |
| `/v1/assemblies/{id}/image/{size}`              | Rendered PyMol thumbnail (`100x100`, `200x200`, `400x400`) |
| `/v1/pdbs?q=...&methods=...&yearMin=...`        | Search parsed metadata (FTS5 title + range filters)        |
| `/v1/stats/{view}`                              | Aggregated statistics (e.g. `byYear`, `aminoAcidFreq`, …)  |
| `/v1/ligands?substructure={idCode}`             | OpenChemLib substructure search over the CCD               |
| `/v1/rsync-history?type=asymUnit&limit=10`      | Recent rsync runs                                          |

## Persistent data

Everything writable lives under `./data/`:

```
data/
  pdb/                  # rsynced PDB asymmetric units (*.ent.gz)
  pdb-assembly/         # rsynced biological assemblies (*.pdb1.gz)
  pymol/<sub>/<id>/     # PyMol-rendered thumbnails (mirrors RCSB layout)
  sqlite/               # ligands.db (parsed metadata, fingerprints, rsync history)
  ccd/                  # cached components.cif.gz from wwPDB
  logs/                 # rsync change logs
```

The first sync downloads the entire wwPDB tree and renders every thumbnail
— this can take **days**. Subsequent daily cycles only process the diff.

### Rebuild the database from local files

If the sqlite index ever needs to be regenerated (corruption, schema
upgrade, restoring from a partial backup), wipe `data/sqlite/ligands.db`
and run:

```sh
docker compose exec node-pdb-sync npm run rebuild
```

This re-parses every `.ent.gz` and `.pdb1.gz` already on disk and rebuilds
all metadata tables. PyMol PNGs that already exist under
`data/pymol/<sub>/<id>/` are reused; missing ones are re-rendered. **No
data is re-downloaded from the wwPDB.**

The cron container also runs this automatically on boot whenever the
sqlite database is empty but the rsync directories already contain files
— so a fresh deploy that inherits a populated `data/` directory does the
right thing without any manual intervention.

## Local development

`npm run dev` runs entirely from Node — no docker, no nginx — so it works
on any machine with Node ≥ 22 installed.

```sh
npm install
npm run dev        # seed sqlite, then run the Fastify API + Vite dev server
```

Under the hood it:

1. Runs [`backend/src/dev.js`](./backend/src/dev.js) once to apply migrations
   on `data/sqlite/ligands.db` and seed a deterministic set of PDB entries
   from [`backend/fixtures/pdb/`](./backend/fixtures/pdb) (or from your
   local rsync tree under `data/pdb/`, if you have one).
2. Starts the Fastify API on `http://localhost:3000` under `node --watch`,
   so backend file changes restart the server.
3. Starts the Vite dev server (frontend), which proxies every `/v1/...`
   call to the API:

```sh
curl http://localhost:3000/v1/database/info
curl http://localhost:3000/v1/pdbs/100D
curl 'http://localhost:3000/v1/pdbs?methods=X-RAY+DIFFRACTION&limit=3'
```

The full rsync pipeline and pymol-rendered biological assemblies are
skipped; if you need them locally you will need `pymol`, `graphicsmagick`,
and `rsync`, and should run `npm run cron` (or `npm run rebuild` /
`npm run update`) instead. Tests that depend on `pymol` are skipped
unless `HAS_PYMOL=1` is set.

```sh
npm run test       # tests + lint + format
npm run test-only  # vitest with coverage
```

### Frontend-only commands

```sh
cd frontend
npm run build      # type-check + vite build → ../backend/public
npm run test       # check-types + eslint + prettier
```

`npm run build` writes to `backend/public/` (gitignored — rebuilt by
Docker). The `pdb-api` image is built from [`Dockerfile`](./Dockerfile),
whose first stage runs `vite build` and copies the bundle into
`/app/backend/public`. Fastify serves it from there alongside the JSON
API. To pick up frontend changes on the deploy host:

```sh
git pull && docker compose up -d --build
```

The `--build` flag is what regenerates the bundle — without it, the
existing `pdb-api` image (and its stale `/app/backend/public`) is reused.

To point the Vite dev server at a different backend (e.g. a production
stack on the local network):

```sh
PDB_API_URL=http://127.0.0.1:12345 npm run dev -w frontend
```

Or at a remote stack:

```sh
PDB_API_URL=https://pdb.cheminfo.org npm run dev -w frontend
```

## SELinux

If your host runs SELinux you may need to relabel the project directory so
the bind mounts are accessible from the containers:

```sh
chcon -R -t container_file_t <repo-dir>
```
