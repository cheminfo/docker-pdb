/**
 * Put the analytics snippet at the end of the `<head>` of a page. The snippet
 * belongs to the deployment rather than to the build, so it arrives as an
 * environment variable and is taken exactly as written: it is operator input,
 * never a visitor's, so it is not escaped, parsed or rebuilt from parts.
 * @param {string} html - The page.
 * @param {string} [snippet] - The provider's `<script>` tag, when there is one.
 * @returns {string} The page, with the snippet in its head.
 */
export function injectTrackingScript(html, snippet) {
  const script = snippet?.trim();
  if (!script || html.includes(script)) return html;

  const head = html.lastIndexOf('</head>');
  if (head === -1) return `${html}\n${script}\n`;
  return `${html.slice(0, head)}${script}\n${html.slice(head)}`;
}
