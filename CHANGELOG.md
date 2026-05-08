# Changelog

## [1.2.0](https://github.com/cheminfo/docker-pdb/compare/v1.1.1...v1.2.0) (2026-05-08)


### Features

* **frontend:** migrate homepage to React + Vite + nivo ([513465f](https://github.com/cheminfo/docker-pdb/commit/513465f40ac0694985d0f084e625aa7f8e30c782))
* **home:** redesign home page and add database statistics ([d1337f2](https://github.com/cheminfo/docker-pdb/commit/d1337f2f3e65d73567ad4f06ea1750bfe1037699))


### Bug Fixes

* make `npm run rebuild` actually run ([d7cb803](https://github.com/cheminfo/docker-pdb/commit/d7cb803ca132cde91be0975d123f0c1ec5cda335))

## [1.1.1](https://github.com/cheminfo/docker-pdb/compare/v1.1.0...v1.1.1) (2026-05-08)


### Bug Fixes

* grant public read access on the pdb databases at init ([a6023d0](https://github.com/cheminfo/docker-pdb/commit/a6023d04c959ee2a7f1269d874ff9e2dceb10c34))

## [1.1.0](https://github.com/cheminfo/docker-pdb/compare/v1.0.1...v1.1.0) (2026-05-08)


### Features

* ingest pdb files into couchdb as soon as they finish downloading ([9ce19cc](https://github.com/cheminfo/docker-pdb/commit/9ce19ccbb04ea5a456ffab7fdc97f840feb852a8))


### Bug Fixes

* **compose:** raise couchdb pids_limit to 4096 ([0146598](https://github.com/cheminfo/docker-pdb/commit/01465989045afb914df35a4a5d1ccc1fcd881e24))
* **docker:** chown bind-mounted /app/data via gosu entrypoint ([fe76c01](https://github.com/cheminfo/docker-pdb/commit/fe76c01778e602b8724a99fb13f3b0fa8555ef3b))
* keep cron loop alive when an update cycle throws ([67a48bd](https://github.com/cheminfo/docker-pdb/commit/67a48bd1cfb0d19a64f0a37e76c4f3f8f09fc2c5))

## [1.0.1](https://github.com/cheminfo/docker-pdb/compare/v1.0.0...v1.0.1) (2026-05-08)


### Bug Fixes

* **ci:** pass tag-version so latest/major/minor tags get published ([e7bce3f](https://github.com/cheminfo/docker-pdb/commit/e7bce3f5121144a4945513dc492b92869894794d))

## [1.0.0](https://github.com/cheminfo/docker-pdb/compare/v0.0.2...v1.0.0) (2026-05-08)


### ⚠ BREAKING CHANGES

* data volume paths changed. Previously the compose files mounted ./couchdb-data, ./pdb-data, ./pdb-assembly-data and ./logs at the repo root. They now all live under a single ./data/ mount, with data/couchdb, data/pdb, data/pdb-assembly and data/logs subfolders. On upgrade, move existing data:

### Features

* add traefik compose  example ([248e8e6](https://github.com/cheminfo/docker-pdb/commit/248e8e6e166cb450ceac8545277828eb1ca2df33))
* align project with current standards ([609245c](https://github.com/cheminfo/docker-pdb/commit/609245c5958c6e37d56179f6f5ccba05b32c1421))
