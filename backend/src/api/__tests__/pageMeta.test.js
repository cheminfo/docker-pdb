import { expect, test } from 'vitest';

import { injectPageMeta, pageMetaFor } from '../pageMeta.js';
import { SITEMAP_PATHS, buildSitemap } from '../sitemap.js';

const PAGE = `<!doctype html><html lang="en"><head><title>pdb</title>
<meta name="description" content="the build's own" /></head><body></body></html>`;

test('each page is titled and described on its own', () => {
  expect(pageMetaFor('/browse').title).toBe('Browse the Protein Data Bank');
  expect(pageMetaFor('/molecules').title).toBe(
    'The ligands of the Protein Data Bank',
  );
  expect(pageMetaFor('/stats').title).toBe('What the Protein Data Bank holds');
  expect(pageMetaFor('/api').title).toBe('The API — every entry as JSON');
  expect(pageMetaFor('/about').title).toBe('About, and what to cite');
  expect(pageMetaFor('/').title).toBe(
    'A fast look at any Protein Data Bank entry',
  );

  const descriptions = new Set(
    SITEMAP_PATHS.map((path) => pageMetaFor(path).description),
  );

  expect(descriptions.size).toBe(SITEMAP_PATHS.length);
});

test('an entry is a page of its own, named by its identifier', () => {
  const meta = pageMetaFor('/scripting/1crn');

  expect(meta.title).toBe('1CRN — the structure, and a script over it');
  expect(meta.description).toContain('entry 1CRN');
  expect(meta.canonicalPath).toBe('/scripting/1CRN');
});

test('an address the site does not know is the home page', () => {
  expect(pageMetaFor('/nowhere')).toStrictEqual(pageMetaFor('/'));
});

test('a query string never reaches the canonical address', () => {
  expect(pageMetaFor('/browse?method=X-RAY&page=4').canonicalPath).toBe(
    '/browse',
  );
  expect(pageMetaFor('/stats/').canonicalPath).toBe('/stats');
});

test('the served page carries that page, not the build', () => {
  const html = injectPageMeta(PAGE, {
    url: '/browse',
    origin: 'https://pdb.cheminfo.org',
  });

  expect(html).toContain(
    '<title>Browse the Protein Data Bank — pdb.cheminfo.org</title>',
  );
  expect(html).not.toContain("the build's own");
  expect(html).toContain(
    '<link rel="canonical" href="https://pdb.cheminfo.org/browse" />',
  );
  expect(html).toContain(
    '<meta property="og:image" content="https://pdb.cheminfo.org/og.png" />',
  );
  expect(html.indexOf('rel="canonical"')).toBeLessThan(html.indexOf('</head>'));
});

test('the host is never trusted', () => {
  const html = injectPageMeta(PAGE, {
    url: '/',
    origin: 'https://evil"><script>alert(1)</script>',
  });

  expect(html).not.toContain('<script>alert(1)</script>');
  expect(html).toContain('&quot;&gt;&lt;script&gt;');
});

test('the sitemap lists every page, and only pages', () => {
  const xml = buildSitemap('https://pdb.cheminfo.org');

  expect(xml).toContain('<loc>https://pdb.cheminfo.org/</loc>');
  expect(xml).toContain('<loc>https://pdb.cheminfo.org/browse</loc>');
  expect(xml.match(/<loc>/g)).toHaveLength(7);

  for (const path of SITEMAP_PATHS) {
    expect(pageMetaFor(path).canonicalPath).toBe(path);
  }
});
