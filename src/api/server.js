import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';

import cors from '@fastify/cors';
import Fastify from 'fastify';

import { findAssemblyFile, findAsymUnitFile } from '../common.js';
import getConfig from '../config.js';
import { getLigandsDB } from '../db/getDB.js';
import { readPdbDoc } from '../db/readPdbEntry.js';

import { pairFrequency, STATS_HANDLERS } from './statsQueries.js';
import { substructureSearch } from './substructureSearch.js';

const ungzip = promisify(gunzip);

const DEFAULT_LIMIT = 200;
const DEFAULT_MAX_PDBS_PER_PAGE = 100;
const FIND_PAGE_LIMIT = 200;

/**
 * Build a Fastify instance exposing the docker-pdb HTTP API. Wired up here
 * (rather than registered globally) so tests can inject an in-memory DB
 * and run requests with `app.inject()` instead of opening a port.
 *
 * The API replaces every CouchDB-proxied path that the frontend used to
 * call: `/pdb/<id>`, `/assembly/<id>/...`, `/find`, `/view/jsmol`,
 * `/stats/*`, `/rsync-history/*` are all served from sqlite + the on-disk
 * rsync tree under their `/v1/...` equivalents (and the legacy paths are
 * preserved as aliases so existing third-party callers keep working).
 * @param {{ db: import('../db/getDB.js').LigandsDB, logger?: boolean }} options - Wiring options.
 * @returns {Promise<import('fastify').FastifyInstance>} A Fastify app ready to listen or be injected.
 */
export async function buildApp({ db, logger = false }) {
  const config = getConfig();
  // eslint-disable-next-line new-cap -- Fastify is invoked as a factory, not a constructor.
  const app = Fastify({ logger });
  await app.register(cors, { origin: true });

  // ----- /v1/ligands (unchanged) -----------------------------------

  app.get('/v1/ligands', async (request, reply) => {
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, DEFAULT_LIMIT, 1, 1000);
    const queryIdCode =
      typeof query.substructure === 'string' && query.substructure.length > 0
        ? query.substructure
        : null;

    const codes =
      typeof query.codes === 'string' && query.codes.length > 0
        ? query.codes
            .split(',')
            .map((code) => code.trim().toUpperCase())
            .filter(Boolean)
        : null;

    if (queryIdCode === null) {
      let ligands;
      if (codes && codes.length > 0) {
        const placeholders = codes.map(() => '?').join(',');
        ligands = db
          .statement(
            `SELECT l.code, l.name, l.mf, l.mw, l.id_code AS idCode, l.coordinates,
                    COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
             FROM ligands l
             WHERE l.code IN (${placeholders})`,
          )
          .all(...codes)
          .map((row) => ({ ...row }));
      } else {
        ligands = db
          .statement(
            `SELECT l.code, l.name, l.mf, l.mw, l.id_code AS idCode, l.coordinates,
                    COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
             FROM ligands l
             ORDER BY nbPdbs DESC
             LIMIT ?`,
          )
          .all(limit)
          .map((row) => ({ ...row }));
      }
      return reply.send({
        ligands,
        stats: {
          screened: 0,
          verified: 0,
          screeningMs: 0,
          verificationMs: 0,
          overLimit: false,
        },
      });
    }

    try {
      const result = substructureSearch({ db, queryIdCode, maxResults: limit });
      return reply.send(result);
    } catch (error) {
      request.log.warn({ error: error.message }, 'Substructure search failed');
      return reply.code(400).send({ error: 'invalid_substructure' });
    }
  });

  app.get('/v1/ligands/:code', async (request, reply) => {
    const code = String(request.params.code).toUpperCase();
    const ligand = db
      .statement(
        `SELECT l.code, l.name, l.formula, l.type, l.mf, l.mw, l.nb_atoms AS nbAtoms,
                l.id_code AS idCode, l.coordinates,
                COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
         FROM ligands l WHERE l.code = ?`,
      )
      .get(code);
    if (!ligand) return reply.code(404).send({ error: 'not_found' });
    return reply.send({ ligand: { ...ligand } });
  });

  app.get('/v1/ligands/:code/pdbs', async (request, reply) => {
    const code = String(request.params.code).toUpperCase();
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, DEFAULT_MAX_PDBS_PER_PAGE, 1, 1000);
    const offset = clampLimit(query.offset, 0, 0, 1_000_000);

    const total = db
      .statement(`SELECT COUNT(*) AS n FROM pdb_ligands WHERE ligand_code = ?`)
      .get(code).n;
    const pdbs = db
      .statement(
        `SELECT pdb_id AS pdbId, count
         FROM pdb_ligands
         WHERE ligand_code = ?
         ORDER BY pdb_id
         LIMIT ? OFFSET ?`,
      )
      .all(code, limit, offset)
      .map((row) => ({ ...row }));
    return reply.send({ total, limit, offset, pdbs });
  });

  // ----- /v1/database/info (replaces /pdb/, /assembly/) -------------

  app.get('/v1/database/info', async (_request, reply) => {
    const totals = db
      .statement(
        `SELECT COUNT(*)                                      AS pdb_count,
                COALESCE(SUM(raw_size), 0)                    AS pdb_bytes,
                SUM(CASE WHEN has_assembly = 1 THEN 1 ELSE 0 END) AS assembly_count,
                COALESCE(SUM(CASE WHEN has_assembly = 1 THEN assembly_size ELSE 0 END), 0) AS assembly_bytes
         FROM pdb_entries`,
      )
      .get();
    return reply.send({
      pdb: {
        // eslint-disable-next-line camelcase -- legacy CouchDB-shaped key
        doc_count: totals?.pdb_count ?? 0,
        sizes: { file: totals?.pdb_bytes ?? 0 },
      },
      assembly: {
        // eslint-disable-next-line camelcase -- legacy CouchDB-shaped key
        doc_count: totals?.assembly_count ?? 0,
        sizes: { file: totals?.assembly_bytes ?? 0 },
      },
    });
  });

  // ----- /v1/pdbs/:id (parsed metadata) ----------------------------

  app.get('/v1/pdbs/:id', async (request, reply) => {
    const id = String(request.params.id).toUpperCase();
    const doc = readPdbDoc(db, id);
    if (!doc) return reply.code(404).send({ error: 'not_found' });
    return reply.send(doc);
  });

  // ----- /v1/pdbs/:id/raw (raw .pdb text) --------------------------

  app.get('/v1/pdbs/:id/raw', async (request, reply) => {
    const id = String(request.params.id).toUpperCase();
    const file = findAsymUnitFile(id);
    if (!file) return reply.code(404).send({ error: 'not_found' });
    const buffer = await ungzip(await readFile(file.path));
    return reply.header('content-type', 'chemical/x-pdb').send(buffer);
  });

  // ----- /v1/assemblies/:id/raw ------------------------------------

  app.get('/v1/assemblies/:id/raw', async (request, reply) => {
    const id = String(request.params.id).toUpperCase();
    const file = findAssemblyFile(id);
    if (!file) return reply.code(404).send({ error: 'not_found' });
    const buffer = await ungzip(await readFile(file.path));
    return reply.header('content-type', 'chemical/x-pdb').send(buffer);
  });

  // ----- /v1/assemblies/:id/image/:size (pymol thumbnail) ----------

  app.get('/v1/assemblies/:id/image/:size', async (request, reply) => {
    const id = String(request.params.id).toUpperCase();
    const size = String(request.params.size);
    if (!/^\d+x\d+\.png$/.test(size) && !/^\d+x\d+$/.test(size)) {
      return reply.code(400).send({ error: 'invalid_size' });
    }
    const filename = size.endsWith('.png') ? size : `${size}.png`;
    const lower = id.toLowerCase();
    const path = join(config.pymolDir, lower.slice(1, 3), lower, filename);
    if (!existsSync(path)) return reply.code(404).send({ error: 'not_found' });
    const stream = await readFile(path);
    return reply.header('content-type', 'image/png').send(stream);
  });

  // ----- /v1/stats/<view> ------------------------------------------

  // pairFrequency is special-cased: it accepts an optional [fromYear,toYear]
  // window, just like the CouchDB pairFrequencyByYear view did.
  app.get('/v1/stats/pairFrequency', async (request, reply) => {
    const query = request.query ?? {};
    const fromYear = Number.parseInt(query.fromYear, 10);
    const toYear = Number.parseInt(query.toYear, 10);
    const range =
      Number.isFinite(fromYear) && Number.isFinite(toYear)
        ? [fromYear, toYear]
        : null;
    return reply.send(pairFrequency(db, range));
  });

  app.get('/v1/stats/:view', async (request, reply) => {
    const handler = STATS_HANDLERS[String(request.params.view)];
    if (!handler) return reply.code(404).send({ error: 'unknown_view' });
    return reply.send(handler(db));
  });

  // ----- /v1/pdbs (search; replaces /find Mango) -------------------

  app.get('/v1/pdbs', async (request, reply) => {
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, FIND_PAGE_LIMIT, 1, 1000);
    const offset = clampLimit(query.offset, 0, 0, 1_000_000);

    const where = [];
    const params = [];

    if (typeof query.methods === 'string' && query.methods.length > 0) {
      const methods = query.methods
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      if (methods.length > 0) {
        where.push(`experiment IN (${methods.map(() => '?').join(',')})`);
        params.push(...methods);
      }
    }
    addRangeWhere(
      where,
      params,
      'nb_helices',
      query.helicesMin,
      query.helicesMax,
    );
    addRangeWhere(where, params, 'nb_sheets', query.sheetsMin, query.sheetsMax);
    addRangeWhere(
      where,
      params,
      'nb_ligands',
      query.ligandsMin,
      query.ligandsMax,
    );
    addRangeWhere(
      where,
      params,
      'nb_residues',
      query.residuesMin,
      query.residuesMax,
    );
    addRangeWhere(where, params, 'year', query.yearMin, query.yearMax);

    const trimmed = typeof query.q === 'string' ? query.q.trim() : '';
    let useFts = false;
    if (trimmed) {
      // Multi-token AND query against the FTS5 title index.
      const tokens = trimmed.split(/\s+/).filter(Boolean);
      const ftsQuery = tokens
        .map((token) => `"${token.replaceAll('"', '""')}"`)
        .join(' AND ');
      where.push(
        `id IN (SELECT pdb_id FROM pdb_title_fts WHERE pdb_title_fts MATCH ?)`,
      );
      params.push(ftsQuery);
      useFts = true;
    }

    const sql = `SELECT id FROM pdb_entries
                 ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
                 ORDER BY id
                 LIMIT ? OFFSET ?`;
    const ids = db
      .statement(sql)
      .all(...params, limit, offset)
      .map((r) => r.id);

    const docs = [];
    for (const id of ids) {
      const doc = readPdbDoc(db, id);
      if (doc) docs.push(doc);
    }
    return reply.send({ docs, fts: useFts });
  });

  // ----- /v1/pdbs/jsmol (replaces /view/jsmol curated list) --------

  app.get('/v1/pdbs/jsmol', async (_request, reply) => {
    // Mirrors the CouchDB `_design/query/jsmol` filter:
    //  - 100 ≤ nbResidues ≤ 500
    //  - nbModifiedResidues = 0
    //  - nbSheets > 5  AND max sheet length ≥ 10
    //  - max helix length ≥ 10
    //  - 150 ≤ max formula MW ≤ 500
    const candidates = db
      .statement(
        `SELECT e.id
         FROM pdb_entries e
         WHERE e.nb_residues BETWEEN 100 AND 500
           AND e.nb_modified_residues = 0
           AND e.nb_sheets > 5
           AND EXISTS (SELECT 1 FROM pdb_helices h
                       WHERE h.pdb_id = e.id AND (h.res_to - h.res_from) >= 10)
           AND EXISTS (SELECT 1 FROM pdb_sheets s
                       WHERE s.pdb_id = e.id AND (s.res_to - s.res_from) >= 10)
           AND EXISTS (SELECT 1 FROM pdb_formulas f
                       WHERE f.pdb_id = e.id AND f.label <> 'HOH'
                         AND f.mw >= 150 AND f.mw <= 500)`,
      )
      .all()
      .map((row) => row.id);

    const rows = [];
    for (const id of candidates) {
      const doc = readPdbDoc(db, id);
      if (doc) {
        rows.push({ id, key: null, value: null, doc });
      }
    }
    return reply.send({
      // eslint-disable-next-line camelcase -- legacy CouchDB-shaped key
      total_rows: rows.length,
      offset: 0,
      rows,
    });
  });

  // ----- /v1/rsync-history -----------------------------------------

  app.get('/v1/rsync-history', async (request, reply) => {
    const query = request.query ?? {};
    const type = query.type === 'bioAssembly' ? 'bioAssembly' : 'asymUnit';
    const limit = clampLimit(query.limit, 20, 1, 200);
    const rows = db
      .statement(
        `SELECT type, started_at, finished_at, duration_ms, updated_count,
                deleted_count, last_entry_id, bytes_on_disk
         FROM rsync_history
         WHERE type = ?
         ORDER BY finished_at DESC
         LIMIT ?`,
      )
      .all(type, limit)
      .map((row) => ({
        type: row.type,
        startedAt: row.started_at,
        finishedAt: row.finished_at,
        durationMs: row.duration_ms,
        updatedCount: row.updated_count,
        deletedCount: row.deleted_count,
        lastEntryId: row.last_entry_id,
        bytesOnDisk: row.bytes_on_disk,
      }));
    return reply.send({ rows });
  });

  return app;
}

/**
 * Coerce a query-string parameter into a bounded integer.
 * @param {unknown} value - Raw query value.
 * @param {number} fallback - Default when missing or unparseable.
 * @param {number} min - Lower clamp.
 * @param {number} max - Upper clamp.
 * @returns {number} Bounded integer.
 */
function clampLimit(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

/**
 * Append a `column BETWEEN ? AND ?` (or one-sided) clause when at least one
 * of `min` / `max` is set.
 * @param {string[]} where - WHERE-clause accumulator.
 * @param {unknown[]} params - Bound-parameter accumulator.
 * @param {string} column - Column name to constrain.
 * @param {unknown} minRaw - Raw query value for the lower bound.
 * @param {unknown} maxRaw - Raw query value for the upper bound.
 */
function addRangeWhere(where, params, column, minRaw, maxRaw) {
  const min = Number.parseFloat(minRaw);
  const max = Number.parseFloat(maxRaw);
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);
  if (hasMin && hasMax) {
    where.push(`${column} BETWEEN ? AND ?`);
    params.push(min, max);
  } else if (hasMin) {
    where.push(`${column} >= ?`);
    params.push(min);
  } else if (hasMax) {
    where.push(`${column} <= ?`);
    params.push(max);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  const db = await getLigandsDB();
  const app = await buildApp({ db, logger: true });
  try {
    await app.listen({ host, port });
  } catch (error) {
    app.log.error({ error }, 'API server failed to start');
    // eslint-disable-next-line unicorn/no-process-exit -- CLI entry point.
    process.exit(1);
  }
}
