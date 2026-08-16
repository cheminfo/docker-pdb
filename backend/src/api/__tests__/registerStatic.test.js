import { join } from 'node:path';

import Fastify from 'fastify';
import { expect, onTestFinished, test } from 'vitest';

import { registerStatic } from '../registerStatic.js';

const STATIC_DIR = join(import.meta.dirname, 'data/frontend');

/**
 * A server serving the fixture bundle, closed however the test ends.
 * @returns {Promise<import('fastify').FastifyInstance>} The instance.
 */
async function testApp() {
  // eslint-disable-next-line new-cap -- Fastify is invoked as a factory, not a constructor.
  const app = Fastify();
  await registerStatic(app, { staticDir: STATIC_DIR });
  onTestFinished(() => app.close());
  return app;
}

const HTML = { accept: 'text/html' };

test('every routed address is titled and canonicalised as itself', async () => {
  const app = await testApp();
  const expected = [
    ['/', 'A fast look at any Protein Data Bank entry', '/'],
    ['/browse', 'Browse the Protein Data Bank', '/browse'],
    [
      '/scripting/1crn',
      '1CRN — the structure, and a script over it',
      '/scripting/1CRN',
    ],
  ];

  for (const [url, title, path] of expected) {
    // eslint-disable-next-line no-await-in-loop -- one server, one assertion at a time
    const response = await app.inject({ method: 'GET', url, headers: HTML });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(response.body).toContain(
      `<title>${title} — pdb.cheminfo.org</title>`,
    );
    expect(response.body).toContain(
      `<link rel="canonical" href="http://localhost:80${path}" />`,
    );
  }
});

test('the page is never served as a raw file, /index.html included', async () => {
  const app = await testApp();
  const response = await app.inject({
    method: 'GET',
    url: '/index.html',
    headers: HTML,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body).toContain('<link rel="canonical"');
  expect(response.body).not.toContain("the build's own");
});

test('the sitemap answers with every page of the site', async () => {
  const app = await testApp();
  const response = await app.inject({ method: 'GET', url: '/sitemap.xml' });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toBe(
    'application/xml; charset=utf-8',
  );
  expect(response.body).toContain('<loc>http://localhost:80/browse</loc>');
  expect(response.body.match(/<loc>/g)).toHaveLength(7);
});

test('an asset is still served as itself', async () => {
  const app = await testApp();
  const response = await app.inject({ method: 'GET', url: '/assets/app.js' });

  expect(response.statusCode).toBe(200);
  expect(response.body).toContain('console.log(1)');
});

test('an API miss is still a JSON 404', async () => {
  const app = await testApp();
  const response = await app.inject({
    method: 'GET',
    url: '/v1/nothing',
    headers: HTML,
  });

  expect(response.statusCode).toBe(404);
  expect(response.json()).toStrictEqual({ error: 'Not Found' });
});
