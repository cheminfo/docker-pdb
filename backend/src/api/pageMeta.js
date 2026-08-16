const SITE_NAME = 'pdb.cheminfo.org';

/**
 * @typedef {object} PageMeta
 * @property {string} title What the tab, the search result and the shared card
 * are titled.
 * @property {string} description The line under the title in a search result
 * and a shared card.
 * @property {string} canonicalPath The address this page is indexed under, so
 * the query strings the tool writes do not read as new pages.
 */

/**
 * Give the served page the title, the description and the canonical address of
 * the route it is answering, and the card a link to it unfurls into. A crawler
 * that does not run scripts sees the right page rather than the home page's.
 * @param {string} html - The built page.
 * @param {{ url: string, origin: string }} options - The address asked for and
 * where the site is served from, e.g. `https://pdb.cheminfo.org`.
 * @returns {string} The page, with its head rewritten for that route.
 */
export function injectPageMeta(html, options) {
  const { url, origin } = options;
  const meta = pageMetaFor(url);
  const title = `${meta.title} — ${SITE_NAME}`;
  const canonical = `${trimTrailingSlash(origin)}${meta.canonicalPath}`;

  const head = [
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttribute(`${trimTrailingSlash(origin)}/og.png`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n');

  return insertBeforeHeadEnd(
    replaceDescription(replaceTitle(html, title), meta.description),
    head,
  );
}

/**
 * The page an address opens. An address this site does not know opens the home
 * page, as the frontend router does, and is indexed as the home page rather
 * than under its own name.
 * @param {string} url - The address asked for, query string included.
 * @returns {PageMeta} The title, description and canonical path of that page.
 */
export function pageMetaFor(url) {
  const pathname = trimTrailingSlash(url.split('?', 1)[0] ?? '/') || '/';
  const [, first, second] = pathname.split('/');

  if (first === 'browse') {
    return {
      title: 'Browse the Protein Data Bank',
      description:
        'Search and filter every Protein Data Bank entry by identifier, title, method and resolution, and open any of them straight away.',
      canonicalPath: '/browse',
    };
  }

  if (first === 'scripting') {
    // An entry is a page of its own: a structure somebody links to by its id.
    const pdbId = second?.toUpperCase();
    return pdbId
      ? {
          title: `${pdbId} — the structure, and a script over it`,
          description: `Open Protein Data Bank entry ${pdbId}, look at its chains, ligands and assemblies, and run a script over the structure in the browser.`,
          canonicalPath: `/scripting/${pdbId}`,
        }
      : {
          title: 'Script a structure in the browser',
          description:
            'Run JavaScript over any Protein Data Bank entry in the page: read its chains, its ligands and its assemblies, and take the result away.',
          canonicalPath: '/scripting',
        };
  }

  if (first === 'molecules') {
    return {
      title: 'The ligands of the Protein Data Bank',
      description:
        'Every chemical component of the Protein Data Bank, searchable by structure, by formula and by the entries it appears in.',
      canonicalPath: '/molecules',
    };
  }

  if (first === 'stats') {
    return {
      title: 'What the Protein Data Bank holds',
      description:
        'How many entries the Protein Data Bank holds, by method, by resolution and by year, counted from the mirror this site keeps.',
      canonicalPath: '/stats',
    };
  }

  if (first === 'api') {
    return {
      title: 'The API — every entry as JSON',
      description:
        'Read any Protein Data Bank entry, assembly or ligand as JSON over HTTP, with the addresses and the parameters each route takes.',
      canonicalPath: '/api',
    };
  }

  if (first === 'about') {
    return {
      title: 'About, and what to cite',
      description:
        'What this site is, where its data comes from, how often it is refreshed, and the work to cite when it helped.',
      canonicalPath: '/about',
    };
  }

  return {
    title: 'A fast look at any Protein Data Bank entry',
    description:
      'Open any Protein Data Bank entry by its identifier and see its chains, its ligands and its assemblies at once — from a local mirror, in the browser.',
    canonicalPath: '/',
  };
}

function replaceTitle(html, title) {
  const replacement = `<title>${escapeText(title)}</title>`;
  return html.includes('<title>')
    ? html.replace(/<title>[\s\S]*?<\/title>/, replacement)
    : insertBeforeHeadEnd(html, replacement);
}

function replaceDescription(html, description) {
  const replacement = `<meta name="description" content="${escapeAttribute(description)}" />`;
  const existing = /<meta[^>]*name="description"[^>]*>/;
  return existing.test(html)
    ? html.replace(existing, replacement)
    : insertBeforeHeadEnd(html, replacement);
}

function insertBeforeHeadEnd(html, addition) {
  const head = html.lastIndexOf('</head>');
  if (head === -1) return `${html}\n${addition}\n`;
  return `${html.slice(0, head)}${addition}\n${html.slice(head)}`;
}

function trimTrailingSlash(value) {
  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
}

/**
 * The origin comes from the Host header, so it is never trusted.
 * @param {string} value - What is being written into an attribute.
 * @returns {string} The escaped value.
 */
function escapeAttribute(value) {
  return escapeText(value).replaceAll('"', '&quot;');
}

function escapeText(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
