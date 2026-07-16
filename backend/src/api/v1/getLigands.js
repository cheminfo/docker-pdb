import OCL from 'openchemlib';
import { buildWhere } from 'smart-sqlite3-filter';

import { clampLimit } from '../util/clampLimit.js';
import { ligandSearch } from '../util/ligandSearch.js';
import { parseLigandSort } from '../util/ligandSort.js';

const DEFAULT_LIMIT = 50;

const VALID_MODES = new Set(['substructure', 'similarity', 'exact']);

const EMPTY_STATS = {
  screened: 0,
  verified: 0,
  screeningMs: 0,
  verificationMs: 0,
  overLimit: false,
};

/**
 * Register `GET /v1/ligands` — the ligand browser.
 *
 * Combines three things, any of which may be absent: a `smart` attribute filter
 * (smart-sqlite3-filter syntax, e.g. `code:~AT name:~adenosine mw:100..500`), a
 * structure query (`substructure` + `mode`), and an explicit column `sort`.
 * The response always carries the exact `total` before pagination, alongside
 * the `limit` / `offset` that produced the page.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetLigandsRoute(fastify, db) {
  fastify.get('/v1/ligands', async (request, reply) => {
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, DEFAULT_LIMIT, 1, 1000);
    const offset = parseOffset(query.offset);

    const codes =
      typeof query.codes === 'string' && query.codes.length > 0
        ? query.codes
            .split(',')
            .map((code) => code.trim().toUpperCase())
            .filter(Boolean)
        : null;
    if (codes && codes.length > 0) {
      return reply.send(selectByCodes(db, codes, limit));
    }

    let filter;
    try {
      filter = buildFilter(db, query.smart);
    } catch (error) {
      request.log.warn({ error: error.message }, 'Invalid ligand filter');
      return reply.code(400).send({ error: 'invalid_filter' });
    }

    const queryIdCode = resolveStructureQuery(query.substructure);
    const rawMode =
      typeof query.mode === 'string' ? query.mode : 'substructure';
    const rawMinSimilarity = Number.parseFloat(query.minSimilarity);

    try {
      const result = await ligandSearch({
        db,
        queryIdCode,
        mode: VALID_MODES.has(rawMode) ? rawMode : 'substructure',
        minSimilarity:
          Number.isFinite(rawMinSimilarity) &&
          rawMinSimilarity >= 0 &&
          rawMinSimilarity <= 1
            ? rawMinSimilarity
            : 0,
        filter,
        sort: parseLigandSort(query),
        limit,
        offset,
      });
      return reply.send({ ...result, limit, offset });
    } catch (error) {
      request.log.warn({ error: error.message }, 'Structure search failed');
      return reply.code(400).send({ error: 'invalid_query' });
    }
  });
}

/**
 * Resolve the `substructure` query param to a usable query idCode, or `null`.
 *
 * An empty structure is treated as no query. An empty fragment is contained in
 * every molecule, so passing one to the searcher would scan the whole CCD and
 * bill it as "substructure matches" — the guard the frontend also applies, kept
 * here so a third-party caller cannot trip it. The empty-molecule idCode varies
 * (`d@`, `dH`, more with coordinates), so the atom count decides, not the code.
 * A non-empty but unparseable idCode is passed through unchanged for the search
 * to reject with a 400.
 * @param {unknown} substructure - The raw `substructure` query param.
 * @returns {string | null} The query idCode, or `null` for no structure query.
 */
function resolveStructureQuery(substructure) {
  if (typeof substructure !== 'string' || substructure.length === 0) {
    return null;
  }
  try {
    if (OCL.Molecule.fromIDCode(substructure).getAllAtoms() === 0) return null;
  } catch {
    // Unparseable: let the search path surface a 400 rather than silently list.
  }
  return substructure;
}

/**
 * Translate the `smart` query param into a WHERE condition over `ligands`.
 * An absent or blank filter yields an empty condition, which the search reads
 * as "no attribute filter".
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 * @param {unknown} smart - The raw `smart` query param.
 * @returns {{ where: string, values: Record<string, unknown> }} The filter.
 */
function buildFilter(db, smart) {
  const expression = typeof smart === 'string' ? smart.trim() : '';
  if (expression === '') return { where: '', values: {} };
  return buildWhere(expression, db.db, { tableName: 'ligands' });
}

/**
 * Fetch the canonical rows for an explicit list of ligand codes. Used to render
 * the ligands of one PDB entry, so it never paginates.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 * @param {string[]} codes - Chemical-component codes.
 * @param {number} limit - Echoed back to the caller.
 * @returns {object} A ligands response covering exactly those codes.
 */
function selectByCodes(db, codes, limit) {
  const ligands = db
    .statement(
      `SELECT l.code, l.name, l.mf, l.mw, l.id_code AS idCode, l.coordinates,
              l.nb_pdbs AS nbPdbs
       FROM json_each(:codes) wanted JOIN ligands l ON l.code = wanted.value`,
    )
    .all({ codes: JSON.stringify(codes) });
  return {
    ligands,
    total: ligands.length,
    limit,
    offset: 0,
    stats: EMPTY_STATS,
  };
}

/**
 * Parse the `offset` query param, clamping anything invalid to 0.
 * @param {unknown} value - The raw `offset` query param.
 * @returns {number} A non-negative offset.
 */
function parseOffset(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
