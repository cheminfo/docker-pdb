import { clampLimit } from '../util/clampLimit.js';
import { substructureSearch } from '../util/substructureSearch.js';

const DEFAULT_LIMIT = 200;

/**
 * Register `GET /v1/ligands` — paginated ligand listing with optional
 * substructure search and explicit-codes filter.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetLigandsRoute(fastify, db) {
  fastify.get('/v1/ligands', async (request, reply) => {
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
        // Dynamic IN-list size: SQL is built per-request.
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
        ligands = db.selectLigandsByDefaultRanking
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
}
