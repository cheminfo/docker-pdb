# Changelog

## [1.0.1](https://github.com/cheminfo/docker-pdb/compare/v1.0.0...v1.0.1) (2026-05-08)


### Bug Fixes

* **ci:** pass tag-version so latest/major/minor tags get published ([e7bce3f](https://github.com/cheminfo/docker-pdb/commit/e7bce3f5121144a4945513dc492b92869894794d))

## [1.0.0](https://github.com/cheminfo/docker-pdb/compare/v0.0.2...v1.0.0) (2026-05-08)


### ⚠ BREAKING CHANGES

* data volume paths changed. Previously the compose files mounted ./couchdb-data, ./pdb-data, ./pdb-assembly-data and ./logs at the repo root. They now all live under a single ./data/ mount, with data/couchdb, data/pdb, data/pdb-assembly and data/logs subfolders. On upgrade, move existing data:

### Features

* add traefik compose  example ([248e8e6](https://github.com/cheminfo/docker-pdb/commit/248e8e6e166cb450ceac8545277828eb1ca2df33))
* align project with current standards ([609245c](https://github.com/cheminfo/docker-pdb/commit/609245c5958c6e37d56179f6f5ccba05b32c1421))
