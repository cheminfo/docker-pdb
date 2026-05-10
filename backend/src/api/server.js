import cors from '@fastify/cors';
import Fastify from 'fastify';

import { getLigandsDB } from '../db/getDB.js';

import { v1 } from './v1/v1.js';

/**
 * Build a Fastify instance exposing the docker-pdb HTTP API. Wired up here
 * (rather than registered globally) so tests can inject an in-memory DB
 * and run requests with `app.inject()` instead of opening a port.
 *
 * The API replaces every CouchDB-proxied path that the frontend used to
 * call. Everything is served from sqlite + the on-disk rsync tree under
 * `/v1/...`. Four legacy paths are kept as aliases so existing third-party
 * callers keep working: `/pdb/<id>`, `/assembly/<id>/<size>`,
 * `/stats/<view>`, and `/view/jsmol`.
 * @param {{ db: import('../db/getDB.js').LigandsDB, logger?: boolean }} options - Wiring options.
 * @returns {Promise<import('fastify').FastifyInstance>} A Fastify app ready to listen or be injected.
 */
export async function buildApp({ db, logger = false }) {
  // eslint-disable-next-line new-cap -- Fastify is invoked as a factory, not a constructor.
  const app = Fastify({ logger });
  await app.register(cors, { origin: true });

  v1(app, db);

  return app;
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
