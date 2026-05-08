# pdb-quickview

A self-hosted, **fast** read-only mirror of the [worldwide Protein Data
Bank](https://www.wwpdb.org/). Every entry is parsed once into CouchDB and
rendered once into PyMol thumbnails (100/200/400 px), so structure metadata
and previews are served straight from disk — no on-the-fly rendering, no
upstream lookup.

## What you get

- **Searchable index** — every PDB entry is parsed and indexed by number of
  residues, residue percentages, molecular weight, isoelectric point, etc.
- **Precomputed thumbnails** — three sizes per entry, rendered once with
  PyMol so the homepage loads instantly.
- **Mirror of the raw files** — both asymmetric units and biological
  assemblies are kept on disk, kept up-to-date by a daily `rsync` against
  `rsync.wwpdb.org`.
- **Small React dashboard** — homepage at `/` with database statistics and
  a thumbnail gallery, built from [`frontend/`](./frontend) into
  [`nginx/www/`](./nginx/www).

## Architecture

Three containers wired together by `docker compose`:

| Container       | Role                                                                                    |
| --------------- | --------------------------------------------------------------------------------------- |
| `nginx-proxy`   | Public read-only entry point (`/pdb`, `/assembly`, `/view`, `/stats`) + homepage SPA    |
| `couchdb`       | Stores parsed PDB documents + rendered thumbnails as attachments                        |
| `node-pdb-sync` | Daily cron: `rsync` the wwPDB tree, parse new files, render PyMol images, write to DB   |

## Deployment

Three example compose files are provided. Copy whichever matches your
deployment to `compose.yaml`, then start the stack.

```sh
cp .env.example .env
# edit .env, in particular COUCHDB_ADMIN_PASSWORD
```

By default, every example pulls the released image
`ghcr.io/cheminfo/pdb-quickview:latest`. To build the image locally instead,
add `--build`:

```sh
docker compose pull && docker compose up -d        # released image
docker compose up -d --build                       # local build
```

### 1. Local / port-published — `compose.example.yaml`

Publishes nginx on `127.0.0.1:${NGINX_PORT}`. Open
`http://localhost:${NGINX_PORT}` once the database has finished its first
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
**URL = `nginx-proxy:80`**, **Public hostname = `pdb.lactame.com`** (or
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

All endpoints are read-only (`GET`/`HEAD`) and proxied to CouchDB by nginx:

| Path                                                    | What it returns                                   |
| ------------------------------------------------------- | ------------------------------------------------- |
| `/pdb/{id}`                                             | Parsed asymmetric-unit document for entry `{id}`  |
| `/pdb/{id}/{size}.png`                                  | Rendered thumbnail attachment (`100`, `200`, `400`) |
| `/assembly/{id}`                                        | Parsed biological-assembly document               |
| `/view/{view-name}?key=...`                             | A CouchDB view defined in `src/couch/pdbViews.json` |
| `/stats/{view-name}`                                    | A stats view from `src/couch/pdbStatsViews.json`  |

## Persistent data

Everything writable lives under `./data/`:

```
data/
  couchdb/             # CouchDB database files
  pdb/                 # rsynced PDB asymmetric units
  pdb-assembly/        # rsynced biological assemblies
  logs/                # rsync change logs
```

The first sync downloads the entire wwPDB tree and renders every thumbnail
— this can take **days**. Subsequent daily cycles only process the diff.

## Local development

### Backend (`src/`)

```sh
npm install
npm run dev        # bring up CouchDB + seed a few local PDBs
npm run dev:down   # stop the dev CouchDB container
```

`npm run dev` brings up a minimal CouchDB on `127.0.0.1:5984` via
[`compose.dev.yaml`](./compose.dev.yaml), then runs
[`src/dev.js`](./src/dev.js) under `node --watch`: it initializes the
databases (`pdb`, `pdb-bio-assembly`, design docs, public-read security)
and ingests up to `DEV_SEED_LIMIT` (default 20) `.ent.gz` files already
present under `data/pdb/`, so the API is queryable in seconds:

```sh
curl http://127.0.0.1:5984/pdb/_all_docs
curl http://127.0.0.1:5984/pdb/100D
```

Editing any file under `src/` re-runs the seed (idempotent — existing
documents are revved). The full rsync pipeline and pymol-rendered
biological assemblies are skipped; if you need them locally you will need
`pymol`, `graphicsmagick`, and `rsync`, and should run `npm run cron` (or
`npm run rebuild` / `npm run update`) instead. Tests that depend on
`pymol` are skipped unless `HAS_PYMOL=1` is set.

```sh
npm run test       # tests + lint + format
npm run test-only  # vitest with coverage
```

### Frontend (`frontend/`)

```sh
cd frontend
npm install
npm run dev        # vite dev server, proxies /pdb /assembly /view /stats
                   # to PDB_API_URL (default http://localhost:12345)
npm run build      # type-check + vite build → ../nginx/www
npm run test       # check-types + eslint + prettier
```

`npm run build` writes to `nginx/www/` (committed to git). After any change
under `frontend/src/`, rebuild and commit both the source change and the
updated assets so a `git pull && docker compose up -d` on the deploy host
picks up the new homepage without needing Node installed.

To point the dev server at a remote stack instead of `localhost:12345`:

```sh
PDB_API_URL=https://pdb.cheminfo.org npm run dev
```

## SELinux

If your host runs SELinux you may need to relabel the project directory so
the bind mounts are accessible from the containers:

```sh
chcon -R -t container_file_t <repo-dir>
```
