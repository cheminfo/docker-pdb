/** Every address the frontend routes itself, as the sitemap lists them. */
export const SITEMAP_PATHS = [
  '/',
  '/browse',
  '/scripting',
  '/molecules',
  '/stats',
  '/api',
  '/about',
];

/**
 * The sitemap, listing every page of the site as an absolute address. The
 * entries themselves are not listed: there are hundreds of thousands of them,
 * and `/browse` is the page a crawler walks them from.
 * @param {string} origin - Where the site is served from, e.g.
 * `https://pdb.cheminfo.org`.
 * @returns {string} The XML document.
 */
export function buildSitemap(origin) {
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  const urls = SITEMAP_PATHS.map(
    (path) => `  <url><loc>${escapeText(`${base}${path}`)}</loc></url>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * The origin comes from the Host header, so it is never trusted.
 * @param {string} value - What is being written into the document.
 * @returns {string} The escaped value.
 */
function escapeText(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
