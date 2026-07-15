import { clampLimit } from '../util/clampLimit.js';
import {
  buildLigandFilterWhere,
  parseLigandFilters,
} from '../util/ligandFilters.js';
import { ligandSearch } from '../util/ligandSearch.js';

const DEFAULT_LIMIT = 50;

/**
 * Number of structural hits hydrated before the attribute filter and the page
 * slice are applied. Bounds the work a single structure query can trigger.
 */
const SEARCH_CAP = 1000;

const LIGAND_COLUMNS = `l.code, l.name, l.mf, l.mw, l.id_code AS idCode, l.coordinates`;

const VALID_MODES = new Set(['substructure', 'similarity', 'exact']);

const EMPTY_STATS = {
  screened: 0,
  verified: 0,
  screeningMs: 0,
  verificationMs: 0,
  overLimit: false,
};

/**
 * Register `GET /v1/ligands` — paginated ligand listing with optional
 * structure search (substructure, similarity, or exact), attribute filters
 * (`code`, `name`, `mf`, `mwMin`, `mwMax`) and an explicit-codes filter.
 * The response carries `total` (matches before pagination) alongside the
 * `limit` / `offset` that produced the page.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetLigandsRoute(fastify, db) {
  fastify.get('/v1/ligands', async (request, reply) => {
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, DEFAULT_LIMIT, 1, 1000);
    const offset = parseOffset(query.offset);
    const queryIdCode =
      typeof query.substructure === 'string' && query.substructure.length > 0
        ? query.substructure
        : null;

    const rawMode =
      typeof query.mode === 'string' ? query.mode : 'substructure';
    const mode = VALID_MODES.has(rawMode) ? rawMode : 'substructure';

    const rawMinSimilarity = Number.parseFloat(query.minSimilarity);
    const minSimilarity =
      Number.isFinite(rawMinSimilarity) &&
      rawMinSimilarity >= 0 &&
      rawMinSimilarity <= 1
        ? rawMinSimilarity
        : 0;

    const filter = buildLigandFilterWhere(parseLigandFilters(query));

    const codes =
      typeof query.codes === 'string' && query.codes.length > 0
        ? query.codes
            .split(',')
            .map((code) => code.trim().toUpperCase())
            .filter(Boolean)
        : null;

    if (codes && codes.length > 0) {
      // Dynamic IN-list size: SQL is built per-request.
      const placeholders = codes.map(() => '?').join(',');
      const ligands = db
        .statement(
          `SELECT ${LIGAND_COLUMNS},
                  COALESCE((SELECT COUNT(*) FROM pdb_ligands p WHERE p.ligand_code = l.code), 0) AS nbPdbs
           FROM ligands l
           WHERE l.code IN (${placeholders})`,
        )
        .all(...codes);
      return reply.send({
        ligands,
        total: ligands.length,
        limit,
        offset: 0,
        stats: EMPTY_STATS,
      });
    }

    if (queryIdCode === null) {
      const { n: total } = db
        .statement(
          `SELECT COUNT(*) AS n FROM ligands l WHERE 1 = 1${filter.clause}`,
        )
        .get(...filter.params);
      const ligands = db
        .statement(
          `SELECT ${LIGAND_COLUMNS}, l.nb_pdbs AS nbPdbs
           FROM ligands l
           WHERE 1 = 1${filter.clause}
           ORDER BY l.nb_pdbs DESC, l.code
           LIMIT ? OFFSET ?`,
        )
        .all(...filter.params, limit, offset);
      return reply.send({ ligands, total, limit, offset, stats: EMPTY_STATS });
    }

    try {
      const result = await ligandSearch({
        db,
        queryIdCode,
        mode,
        maxResults: SEARCH_CAP,
        minSimilarity,
        filter,
      });
      return reply.send({
        ligands: result.ligands.slice(offset, offset + limit),
        total: result.ligands.length,
        limit,
        offset,
        stats: result.stats,
      });
    } catch (error) {
      request.log.warn({ error: error.message }, 'Structure search failed');
      return reply.code(400).send({ error: 'invalid_query' });
    }
  });
}

function parseOffset(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
