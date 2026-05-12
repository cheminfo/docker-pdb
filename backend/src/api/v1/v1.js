import { registerGetAssemblyImageRoute } from './getAssemblyImage.js';
import { registerGetAssemblyRawRoute } from './getAssemblyRaw.js';
import { registerGetCcdHistoryRoute } from './getCcdHistory.js';
import { registerGetDatabaseInfoRoute } from './getDatabaseInfo.js';
import { registerGetDiagnosticsRoute } from './getDiagnostics.js';
import { registerGetJsmolPdbsRoute } from './getJsmolPdbs.js';
import { registerGetLigandByCodeRoute } from './getLigandByCode.js';
import { registerGetLigandPdbsRoute } from './getLigandPdbs.js';
import { registerGetLigandsRoute } from './getLigands.js';
import { registerGetPairFrequencyStatsRoute } from './getPairFrequencyStats.js';
import { registerGetPdbByIdRoute } from './getPdbById.js';
import { registerGetPdbRawRoute } from './getPdbRaw.js';
import { registerGetPdbsRoute } from './getPdbs.js';
import { registerGetRsyncHistoryRoute } from './getRsyncHistory.js';
import { registerGetStatsByViewRoute } from './getStatsByView.js';
import { registerGetSyncStatusRoute } from './getSyncStatus.js';
import { registerTriggerSyncRoute } from './triggerSync.js';

/**
 * Register every v1 API route on the Fastify instance.
 *
 * Each helper registers exactly one route family. Four legacy paths
 * (`/pdb/<id>`, `/assembly/<id>/<size>`, `/stats/<view>`, `/view/jsmol`)
 * are registered alongside their v1 counterparts inside the corresponding
 * endpoint file so existing third-party callers keep working.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../../db/getDB.js').LigandsDB} db - Open ligands database.
 */
export function v1(fastify, db) {
  registerGetLigandsRoute(fastify, db);
  registerGetLigandByCodeRoute(fastify, db);
  registerGetLigandPdbsRoute(fastify, db);
  registerGetDatabaseInfoRoute(fastify, db);
  registerGetPdbByIdRoute(fastify, db);
  registerGetPdbRawRoute(fastify);
  registerGetPdbsRoute(fastify, db);
  registerGetJsmolPdbsRoute(fastify, db);
  registerGetAssemblyRawRoute(fastify);
  registerGetAssemblyImageRoute(fastify);
  registerGetPairFrequencyStatsRoute(fastify, db);
  registerGetStatsByViewRoute(fastify, db);
  registerGetRsyncHistoryRoute(fastify, db);
  registerGetCcdHistoryRoute(fastify, db);
  registerGetSyncStatusRoute(fastify, db);
  registerTriggerSyncRoute(fastify);
  registerGetDiagnosticsRoute(fastify, db);
}
