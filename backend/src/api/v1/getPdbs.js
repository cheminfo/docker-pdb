import { search } from 'smart-sqlite3-filter';

import { readPdbDoc } from '../../db/readPdbEntry.js';
import { addRangeWhere } from '../util/addRangeWhere.js';
import { clampLimit } from '../util/clampLimit.js';

const FIND_PAGE_LIMIT = 200;
const SMART_FILTER_LIMIT = 50_000;

/**
 * Register `GET /v1/pdbs` — search/paginate the PDB-entry table with optional
 * filters (experiment, helix/sheet/ligand/residue/year ranges), an FTS5 title
 * query (`q`), and a smart-sqlite3-filter expression (`smart`) for ad-hoc
 * field queries (e.g. `year:>=2024 nb_helices:>5 title:~kinase`). Also serves
 * the legacy `/find` alias.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetPdbsRoute(fastify, db) {
  fastify.get('/v1/pdbs', async (request, reply) => {
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

    const smart = typeof query.smart === 'string' ? query.smart.trim() : '';
    let useSmart = false;
    if (smart) {
      // Resolve smart-filter to a list of candidate ids, then AND-intersect
      // with the rest of the WHERE clause.
      const rows = search(smart, db.db, {
        tableName: 'pdb_entries',
        limit: SMART_FILTER_LIMIT,
        orderBy: 'id',
      });
      if (rows.length === 0) {
        return reply.send({ docs: [], fts: useFts, smart: true });
      }
      where.push(`id IN (${rows.map(() => '?').join(',')})`);
      for (const row of rows) params.push(row.id);
      useSmart = true;
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
    return reply.send({ docs, fts: useFts, smart: useSmart });
  });
}
