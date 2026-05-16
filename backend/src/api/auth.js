import { hashPassword } from './hashPassword.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60,
};

/**
 * Seed the credentials table from env vars if it is empty.
 * Returns true if at least one credential exists after the call.
 * @param {import('../db/getDB.js').LigandsDB} db - Open database.
 * @returns {Promise<boolean>} Whether credentials are now configured.
 */
export async function seedCredentialsIfNeeded(db) {
  const { n } = db.countCredentials.get();
  if (n > 0) return true;

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return false;

  const passwordHash = await hashPassword(password);
  db.insertCredential.run(username, passwordHash);
  return true;
}

/**
 * Register auth routes: POST /auth/login, GET /auth/me, POST /auth/logout,
 * POST /auth/change-password.
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance.
 * @param {import('../db/getDB.js').LigandsDB} db - Open database.
 */
export function registerAuthRoutes(fastify, db) {
  fastify.post('/auth/login', async (request, reply) => {
    const { n } = db.countCredentials.get();
    if (n === 0) {
      return reply.code(503).send({ error: 'Auth not configured' });
    }

    const { username, password } = request.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string') {
      return reply
        .code(400)
        .send({ error: 'username and password are required' });
    }

    const credential = db.getCredentialByUsername.get(username);
    if (!credential) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const hash = await hashPassword(password);
    if (hash !== credential.passwordHash) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    void reply.setCookie('session', 'authenticated', {
      signed: true,
      ...COOKIE_OPTIONS,
    });
    return reply.send({ ok: true });
  });

  fastify.post('/auth/logout', async (_request, reply) => {
    void reply.clearCookie('session', { path: '/' });
    return reply.send({ ok: true });
  });

  fastify.get('/auth/me', async (request, reply) => {
    const { n } = db.countCredentials.get();
    if (n === 0) {
      return reply.send({ ok: true });
    }

    const sessionCookie = request.cookies.session;
    if (!sessionCookie) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    const result = request.unsignCookie(sessionCookie);
    if (!result.valid || result.value !== 'authenticated') {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    return reply.send({ ok: true });
  });

  fastify.post('/auth/change-password', async (request, reply) => {
    const sessionCookie = request.cookies.session;
    if (!sessionCookie) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    const sessionResult = request.unsignCookie(sessionCookie);
    if (!sessionResult.valid || sessionResult.value !== 'authenticated') {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = request.body ?? {};
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return reply
        .code(400)
        .send({ error: 'currentPassword and newPassword are required' });
    }

    const credential = db.getFirstCredential.get();
    if (!credential) {
      return reply.code(500).send({ error: 'No credential configured' });
    }

    const currentHash = await hashPassword(currentPassword);
    if (currentHash !== credential.passwordHash) {
      return reply.code(401).send({ error: 'Invalid current password' });
    }

    const newHash = await hashPassword(newPassword);
    db.updateCredentialPassword.run(newHash, credential.username);
    return reply.send({ ok: true });
  });
}
