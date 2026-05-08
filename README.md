# docker-pdb

Sync of the official PDB database into CouchDB. The database is searchable for
properties like number of residues, residue percentages, molecular weight, etc.

The stack is three containers wired together by `docker compose`:

- **nginx-proxy** — public read-only entry point (`/pdb`, `/assembly`, `/view`,
  `/stats`) and serves the homepage SPA from `nginx/www/`
- **couchdb** — stores the parsed PDB documents and rendered images
- **node-pdb-sync** — periodically `rsync`s the wwPDB tree, parses each file,
  generates PyMol images, and writes everything to CouchDB

The homepage is a small React + Vite + nivo dashboard built from
[`frontend/`](./frontend) into [`nginx/www/`](./nginx/www) (bind-mounted into
`nginx-proxy`).

## Deployment

Three example compose files are provided. Copy whichever one matches your
deployment to `compose.yaml` and run `docker compose up -d`.

```sh
cp .env.example .env
# edit .env, in particular COUCHDB_ADMIN_PASSWORD
```

### 1. Local / port-published — `compose.example.yaml`

Publishes nginx on `127.0.0.1:${NGINX_PORT}`.

```sh
cp compose.example.yaml compose.yaml
docker compose pull && docker compose up -d
# or, to build the image locally instead of pulling:
docker compose up -d --build
```

Open `http://localhost:${NGINX_PORT}` (e.g. `http://localhost:12345`) once
the database has finished its first build.

### 2. Public via Cloudflare Tunnel — `compose.example.cloudflared.yaml`

No port published on the host. Traffic enters via a `cloudflared` sidecar.

In the Cloudflare dashboard (https://dash.cloudflare.com):
**Networking → Tunnels → Create a tunnel → Cloudflared connector** → copy the
token into `.env` as `TUNNEL_TOKEN=...` → open the tunnel → **Published
applications** tab → add an application with **Service = HTTP**,
**URL = `nginx-proxy:80`**, **Public hostname = `pdb.lactame.com`** (or your
chosen hostname).

```sh
cp compose.example.cloudflared.yaml compose.yaml
docker compose pull && docker compose up -d
# or, to build the image locally instead of pulling:
docker compose up -d --build
```

### 3. Public via Traefik — `compose.example.traefik.yaml`

Requires the host to already run a Traefik instance attached to an external
Docker network named `traefik`, with a `websecure` entrypoint and a
`letsencrypt` cert resolver.

Adjust the `Host(...)` label in the file to your hostname (default
`pdb.cheminfo.org`).

```sh
cp compose.example.traefik.yaml compose.yaml
docker compose pull && docker compose up -d
# or, to build the image locally instead of pulling:
docker compose up -d --build
```

## Persistent data

Everything writable lives under `./data/`:

```
data/
  couchdb/             # CouchDB database files
  pdb/                 # rsynced PDB asymmetric units
  pdb-assembly/        # rsynced biological assemblies
  logs/                # rsync change logs
```

The first sync downloads the entire wwPDB tree and can take **days**.

## Local development

### Backend (`src/`)

```sh
npm install
npm run dev    # node --watch src/cron.js, with .env auto-loaded
```

You will need `pymol`, `graphicsmagick`, and `rsync` installed locally to run
the full pipeline. Tests that depend on `pymol` are skipped unless
`HAS_PYMOL=1` is set in the environment.

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

If your host runs SELinux you may need:

```sh
chcon -R -t container_file_t docker-pdb
```
