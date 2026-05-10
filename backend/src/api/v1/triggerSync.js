import {
  SYNC_KINDS,
  readRunning,
  readTrigger,
  setTrigger,
} from '../../syncControl.js';

/**
 * Register `POST /v1/sync/trigger` — drop a marker file in `data/control/`
 * so the matching cron loop wakes on its next poll. Idempotent: a second
 * click while one is queued does nothing harmful. If a run is already in
 * flight the API returns `already-running` and refuses to queue another;
 * the UI disables the button in that case.
 *
 * Body / query: `{ kind: 'rsync' | 'ccd' }`. Returns the post-trigger
 * sync state so the UI can update without a follow-up `/v1/sync/status`.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 */
export function registerTriggerSyncRoute(fastify) {
  fastify.post('/v1/sync/trigger', async (request, reply) => {
    const kind = readKind(request);
    if (!kind) {
      return reply
        .code(400)
        .send({ error: `kind must be one of: ${SYNC_KINDS.join(', ')}` });
    }

    const running = readRunning(kind);
    if (running) {
      return reply.send({
        kind,
        status: 'already-running',
        running,
      });
    }

    const existing = readTrigger(kind);
    if (existing) {
      return reply.send({
        kind,
        status: 'already-queued',
        triggerQueued: existing,
      });
    }

    await setTrigger(kind, { source: 'api' });
    return reply.send({
      kind,
      status: 'queued',
      triggerQueued: readTrigger(kind),
    });
  });
}

function readKind(request) {
  const fromBody =
    request.body && typeof request.body === 'object'
      ? request.body.kind
      : undefined;
  const fromQuery =
    request.query && typeof request.query === 'object'
      ? request.query.kind
      : undefined;
  const candidate = fromBody ?? fromQuery;
  return SYNC_KINDS.includes(candidate) ? candidate : null;
}
