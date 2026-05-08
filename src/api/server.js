import cors from '@fastify/cors';
import Fastify from 'fastify';

import { getLigandsDB } from '../db/getDB.js';

import { substructureSearch } from './substructureSearch.js';

const DEFAULT_LIMIT = 200;
const DEFAULT_MAX_PDBS_PER_PAGE = 100;

/**
 * Build a Fastify instance exposing the ligand search API. Wired up here
 * (rather than registered globally) so tests can inject an in-memory DB
 * and run requests with `app.inject()` instead of opening a port.
 * @param {{ db: import('../db/getDB.js').LigandsDB, logger?: boolean }} options - Wiring options.
 * @returns {Promise<import('fastify').FastifyInstance>} A Fastify app ready to listen or be injected.
 */
export async function buildApp({ db, logger = false }) {
  // eslint-disable-next-line new-cap -- Fastify is invoked as a factory, not a constructor.
  const app = Fastify({ logger });
  await app.register(cors, { origin: true });

  // GET /v1/ligands?substructure=<idCode>&limit=200
  // Two-phase substructure search; if `substructure` is omitted, returns
  // the most-used ligands by descending PDB count.
  app.get('/v1/ligands', async (request, reply) => {
    const query = request.query ?? {};
    const limit = clampLimit(query.limit, DEFAULT_LIMIT, 1, 1000);
    const queryIdCode =
      typeof query.substructure === 'string' && query.substructure.length > 0
        ? query.substructure
        : null;

    // Optional filter: a comma-separated list of ligand codes. Used by the
    // browse-page LigandsTable to fetch idCode + structure for each
    // FORMUL record in a single round-trip.
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

  // GET /v1/ligands/:code — ligand detail row.
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

  // GET /v1/ligands/:code/pdbs?limit=100&offset=0 — paginated PDBs for a code.
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
