import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';

const ungzip = promisify(gunzip);

/**
 * Stream a gzipped `.pdb`-flavored archive back to the client, decompressing
 * on the fly. Returns 404 when `file` is null. The original `.gz` on disk is
 * the single source of truth — no decompressed copy is ever persisted.
 * @param {import('fastify').FastifyReply} reply - Outgoing Fastify reply.
 * @param {{ path: string } | null} file - Resolved file from `findAsymUnitFile` / `findAssemblyFile`.
 * @returns {Promise<import('fastify').FastifyReply>} The reply, after sending.
 */
export async function sendRawPdbFile(reply, file) {
  if (!file) return reply.code(404).send({ error: 'not_found' });
  const buffer = await ungzip(await readFile(file.path));
  return reply.header('content-type', 'chemical/x-pdb').send(buffer);
}
