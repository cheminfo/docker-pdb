/**
 * Emulate the legacy CouchDB view `assembly/_design/query/_view/pdbsize`.
 *
 * The original CouchDB map emitted the `.pdb1` attachment byte-length as the
 * key (or `null` when the attachment was absent). SQLite stores the same value
 * in `pdb_entries.assembly_size`.
 *
 * Supported query-param combinations (matching CouchDB range semantics where
 * `null` sorts before any number):
 *
 *   ?startkey=null&endkey=null   → rows where assembly_size IS NULL
 *   ?startkey=2000000            → rows where assembly_size >= 2000000
 *   ?startkey=1000000&endkey=5000000 → rows within the numeric range
 *   (no params)                  → all rows, NULLs first (SQLite ASC default)
 */

/**
 * Parse a single CouchDB-style key string (`"null"`, an integer, or absent).
 * @param {string | undefined} raw - Raw query-param value.
 * @returns {'null' | number | undefined} Parsed key.
 */
function parseKey(raw) {
  if (raw === undefined) return undefined;
  if (raw === 'null') return 'null';
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Register `GET /assembly/_design/query/_view/pdbsize` — the CouchDB legacy
 * view emulation that returns each PDB entry's assembly size.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function registerGetAssemblyPdbsizeViewRoute(fastify, db) {
  fastify.get('/assembly/_design/query/_view/pdbsize', (request, reply) => {
    const startkey = parseKey(request.query.startkey);
    const endkey = parseKey(request.query.endkey);

    const startIsNull = startkey === 'null';
    const endIsNull = endkey === 'null';
    const startIsNum = typeof startkey === 'number';
    const endIsNum = typeof endkey === 'number';

    let where = '';
    const params = [];

    if (startIsNull && endIsNull) {
      where = 'WHERE assembly_size IS NULL';
    } else if (startIsNull && endIsNum) {
      where = 'WHERE assembly_size IS NULL OR assembly_size <= ?';
      params.push(endkey);
    } else if (startIsNum && endIsNum) {
      where = 'WHERE assembly_size >= ? AND assembly_size <= ?';
      params.push(startkey, endkey);
    } else if (startIsNum) {
      where = 'WHERE assembly_size >= ?';
      params.push(startkey);
    }

    const totalRow = db.countPdbEntries.get();
    const totalRows = totalRow ? Number(totalRow.n) : 0;

    const rows = db
      .statement(
        `SELECT id, assembly_size FROM pdb_entries ${where} ORDER BY assembly_size ASC`,
      )
      .all(...params)
      .map((row) => ({
        id: row.id,
        key: row.assembly_size ?? null,
        value: null,
      }));

    const body = {
      offset: 0,
      rows,
      // eslint-disable-next-line camelcase -- CouchDB legacy response envelope
      total_rows: totalRows,
    };
    return reply.send(body);
  });
}
