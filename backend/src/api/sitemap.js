/**
 * The two files a crawler fetches on its own: the sitemap listing every page,
 * and the policy naming it.
 *
 * Both are built from the site's own route table, so a page added there is
 * added to both at once, and both are written per request — the origin comes
 * from the request, so a preview host names itself rather than production.
 */

import { robotsTxt, sitemapXml } from 'react-cheminfo/core';

import { PAGE_ROUTES, SITE_ID } from './routes.js';

/**
 * The address prefixes that belong to the JSON API. They are endpoints, not
 * pages, so they are kept out of the index — `/stats/` and `/pdbs` are the API
 * routes, while `/stats` without the slash is the page.
 */
const API_PREFIXES = [
  '/v1/',
  '/pdb/',
  '/pdbs',
  '/assembly/',
  '/assemblies/',
  '/stats/',
  '/view/',
  '/find/',
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
  return sitemapXml({ site: SITE_ID, routes: PAGE_ROUTES, origin });
}

/**
 * The crawl policy: everything is open but the JSON API, and the sitemap is
 * named at the origin the request arrived on.
 * @param {string} origin - Where the site is served from.
 * @returns {string} The `robots.txt` document.
 */
export function buildRobots(origin) {
  return robotsTxt(
    { site: SITE_ID, routes: PAGE_ROUTES, origin },
    API_PREFIXES,
  );
}
