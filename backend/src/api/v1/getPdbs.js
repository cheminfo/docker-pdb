import { search } from 'smart-sqlite3-filter';

import { readPdbDocs } from '../../db/readPdbEntry.js';
import { addRangeWhere } from '../util/addRangeWhere.js';
import { clampLimit } from '../util/clampLimit.js';

const FIND_PAGE_LIMIT = 200;
const SMART_FILTER_LIMIT = 50_000;

const SS_PRESENCE_CLAUSES = {
  mixed: 'nb_helices >= 1 AND nb_sheets >= 1',
  'helices-only': 'nb_helices >= 1 AND nb_sheets = 0',
  'sheets-only': 'nb_helices = 0 AND nb_sheets >= 1',
  none: 'nb_helices = 0 AND nb_sheets = 0',
};

// Static ORDER BY snippets keyed by the `order` query parameter. The trailing
// `id` tiebreaker keeps pagination stable when a column has ties or NULLs.
const ORDER_CLAUSES = {
  id: 'id ASC',
  'id-desc': 'id DESC',
  year: 'year IS NULL, year ASC, id ASC',
  'year-desc': 'year IS NULL, year DESC, id ASC',
  residues: 'nb_residues ASC, id ASC',
  'residues-desc': 'nb_residues DESC, id ASC',
  helices: 'nb_helices ASC, id ASC',
  'helices-desc': 'nb_helices DESC, id ASC',
  sheets: 'nb_sheets ASC, id ASC',
  'sheets-desc': 'nb_sheets DESC, id ASC',
  ligands: 'nb_ligands ASC, id ASC',
  'ligands-desc': 'nb_ligands DESC, id ASC',
};

// Prime modulus for the seeded-random sort. `(rowid * multiplier) % MOD` is a
// permutation for any `multiplier` coprime with `MOD`, so each seed → a
// distinct, deterministic shuffle that is the same for everyone sharing the URL.
const RANDOM_MOD = 2147483647;

/**
 * Register `GET /v1/pdbs` — search/paginate the PDB-entry table with optional
 * filters (experiment, helix/sheet/ligand/residue/year ranges, helix kind,
 * secondary-structure presence, top-level EC class, ligand code), an FTS5
 * title query (`q`), and a smart-sqlite3-filter expression (`smart`) for
 * ad-hoc field queries (e.g. `year:>=2024 nb_helices:>5 title:~kinase`).
 * Also serves the legacy `/find` alias.
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

    // EXISTS-subquery filters driven by clickable stats charts. Each uses an
    // existing index (idx_pdb_helices_kind, idx_pdb_chains_ec,
    // idx_pdb_ligands_code) so no migrations are required.
    const helixKind = Number.parseInt(query.helixKind, 10);
    if (Number.isFinite(helixKind)) {
      where.push(
        `EXISTS (SELECT 1 FROM pdb_helices WHERE pdb_helices.pdb_id = pdb_entries.id AND pdb_helices.kind = ?)`,
      );
      params.push(helixKind);
    }
    if (typeof query.ecClass === 'string' && /^[1-7]$/.test(query.ecClass)) {
      where.push(
        `EXISTS (SELECT 1 FROM pdb_chains WHERE pdb_chains.pdb_id = pdb_entries.id AND pdb_chains.ec LIKE ?)`,
      );
      params.push(`${query.ecClass}.%`);
    }
    if (typeof query.ligandCode === 'string' && query.ligandCode.length > 0) {
      where.push(
        `EXISTS (SELECT 1 FROM pdb_ligands WHERE pdb_ligands.pdb_id = pdb_entries.id AND pdb_ligands.ligand_code = ?)`,
      );
      params.push(query.ligandCode);
    }
    if (typeof query.ssPresence === 'string' && query.ssPresence.length > 0) {
      const clause = SS_PRESENCE_CLAUSES[query.ssPresence];
      if (clause) where.push(clause);
    }

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

    const { clause: orderClause, params: orderParams } = buildOrderClause(
      query.order,
      query.seed,
    );

    const sql = `SELECT id FROM pdb_entries
                 ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
                 ORDER BY ${orderClause}
                 LIMIT ? OFFSET ?`;
    const ids = db
      .statement(sql)
      .all(...params, ...orderParams, limit, offset)
      .map((r) => r.id);

    const docs = readPdbDocs(db, ids);
    return reply.send({ docs, fts: useFts, smart: useSmart });
  });
}

/**
 * Translate the `order` / `seed` query parameters into the ORDER BY fragment
 * and the SQL placeholders that go with it. Unknown / missing `order` falls
 * back to ascending `id`. `random` derives an odd 32-bit multiplier from the
 * seed so the same seed always produces the same shuffle (shareable URL).
 * @param {unknown} rawOrder - The raw `order` query parameter.
 * @param {unknown} rawSeed - The raw `seed` query parameter (random only).
 * @returns {{ clause: string, params: number[] }} ORDER BY fragment and
 *   positional parameters to bind after the WHERE-clause parameters.
 */
function buildOrderClause(rawOrder, rawSeed) {
  const order = typeof rawOrder === 'string' ? rawOrder : '';
  if (order === 'random') {
    const parsedSeed = Number.parseInt(rawSeed, 10);
    const seed = Number.isFinite(parsedSeed) ? parsedSeed : 1;
    // Force the multiplier to be a positive odd 32-bit integer so it is
    // coprime with the (odd, prime) modulus — guaranteeing a permutation.
    const multiplier = ((Math.abs(seed) * 2 + 1) % RANDOM_MOD) | 0;
    return {
      clause: `(rowid * ?) % ? ASC, id ASC`,
      params: [multiplier, RANDOM_MOD],
    };
  }
  return {
    clause: ORDER_CLAUSES[order] ?? ORDER_CLAUSES.id,
    params: [],
  };
}
