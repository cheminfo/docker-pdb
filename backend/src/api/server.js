import cors from '@fastify/cors';
import Fastify from 'fastify';

import { getLigandsDB } from '../db/getDB.js';

import { registerStatic, resolveStaticDir } from './registerStatic.js';
import { v1 } from './v1/v1.js';

/**
 * Build a Fastify instance exposing the docker-pdb HTTP API. Wired up here
 * (rather than registered globally) so tests can inject an in-memory DB
 * and run requests with `app.inject()` instead of opening a port.
 *
 * Everything is served from sqlite + the on-disk rsync tree under `/v1/...`.
 * Four legacy paths are kept as aliases so existing third-party callers keep
 * working: `/pdb/<id>`, `/assembly/<id>/<size>`, `/stats/<view>`, and
 * `/view/jsmol`.
 *
 * When `staticDir` is provided, the React/Vite bundle is also served from
 * the same Fastify instance with an SPA fallback. Tests omit it so they
 * don't depend on a built bundle being on disk.
 * @param {{ db: import('../db/getDB.js').LigandsDB, logger?: boolean, staticDir?: string }} options - Wiring options.
 * @returns {Promise<import('fastify').FastifyInstance>} A Fastify app ready to listen or be injected.
 */
export async function buildApp({ db, logger = false, staticDir }) {
  // eslint-disable-next-line new-cap -- Fastify is invoked as a factory, not a constructor.
  const app = Fastify({ logger });
  await app.register(cors, { origin: true });

  v1(app, db);
  if (staticDir) {
    await registerStatic(app, { staticDir });
  }

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  const db = await getLigandsDB();
  const staticDir = resolveStaticDir();
  const app = await buildApp({ db, logger: true, staticDir });
  if (!staticDir) {
    app.log.warn(
      'No frontend bundle found — set STATIC_DIR or build the frontend.',
    );
  }
  try {
    await app.listen({ host, port });
  } catch (error) {
    app.log.error({ error }, 'API server failed to start');
    // eslint-disable-next-line unicorn/no-process-exit -- CLI entry point.
    process.exit(1);
  }
}
