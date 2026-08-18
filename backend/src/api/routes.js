/**
 * Every address the site answers, with the name and the sentence it is indexed
 * under.
 *
 * One table, read by four things: the head injector, which titles the page the
 * server hands out; the crawl path a reader with no JavaScript is given; the
 * sitemap, which lists them; and `robots.txt`, which names the sitemap. A page
 * missing from here is a page a search engine only ever sees as the home page.
 *
 * The machinery that reads it is `react-cheminfo/core`; what belongs to this
 * site is the prose below, and the entry pages `pageMeta.js` derives on top of
 * it — there are hundreds of thousands of those, so `/browse` is the page a
 * crawler walks them from rather than a table it reads them out of.
 */

/** @typedef {import('react-cheminfo/core').RouteMeta} RouteMeta */

/**
 * The seven pages of the site, in the order the sitemap lists them. `short` and
 * `note` are the labels the crawl path links each page under, where a title
 * written for a search result reads too long as a menu entry.
 * @type {readonly RouteMeta[]}
 */
export const PAGE_ROUTES = [
  {
    path: '/',
    title: 'A fast look at any Protein Data Bank entry',
    description:
      'Open any Protein Data Bank entry by its identifier and see its chains, its ligands and its assemblies at once — from a local mirror, in the browser.',
  },
  {
    path: '/browse',
    title: 'Browse the Protein Data Bank',
    description:
      'Search and filter every Protein Data Bank entry by identifier, title, method and resolution, and open any of them straight away.',
    short: 'Browse',
    note: 'search and filter every entry',
  },
  {
    path: '/scripting',
    title: 'Script a structure in the browser',
    description:
      'Run JavaScript over any Protein Data Bank entry in the page: read its chains, its ligands and its assemblies, and take the result away.',
    short: 'Scripting',
    note: 'run code over a structure',
    // Every `/scripting/<id>` is a page of this section rather than of the home
    // page. `pageMeta.js` names the entry itself where the address carries one.
    prefix: true,
  },
  {
    path: '/molecules',
    title: 'The ligands of the Protein Data Bank',
    description:
      'Every chemical component of the Protein Data Bank, searchable by structure, by formula and by the entries it appears in.',
    short: 'Ligands',
    note: 'every chemical component',
  },
  {
    path: '/stats',
    title: 'What the Protein Data Bank holds',
    description:
      'How many entries the Protein Data Bank holds, by method, by resolution and by year, counted from the mirror this site keeps.',
    short: 'Statistics',
    note: 'what the archive holds',
  },
  {
    path: '/api',
    title: 'The API — every entry as JSON',
    description:
      'Read any Protein Data Bank entry, assembly or ligand as JSON over HTTP, with the addresses and the parameters each route takes.',
    short: 'API',
    note: 'every entry as JSON',
  },
  {
    path: '/about',
    title: 'About, and what to cite',
    description:
      'What this site is, where its Protein Data Bank mirror comes from, how often it is refreshed from the wwPDB, and the papers to cite when it helped.',
  },
];

/** The site whose record names, colours and host every address is built on. */
export const SITE_ID = 'pdb';
