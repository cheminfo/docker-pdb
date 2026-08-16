import { expect, test } from 'vitest';

import { injectTrackingScript } from '../injectTrackingScript.js';

const PAGE = '<html><head><title>pdb</title></head><body></body></html>';
const SNIPPET = '<script defer src="https://example.org/s.js"></script>';

test('the snippet goes at the end of the head', () => {
  const html = injectTrackingScript(PAGE, SNIPPET);

  expect(html).toContain(SNIPPET);
  expect(html.indexOf(SNIPPET)).toBeLessThan(html.indexOf('</head>'));
});

test('nothing is loaded when the deployment measures nothing', () => {
  expect(injectTrackingScript(PAGE, undefined)).toBe(PAGE);
  expect(injectTrackingScript(PAGE, '')).toBe(PAGE);
  expect(injectTrackingScript(PAGE, ' '.repeat(3))).toBe(PAGE);
});

test('the snippet is taken exactly as the operator wrote it', () => {
  const raw = '<script src="https://x/s.js" data-website-id="a&b"></script>';

  expect(injectTrackingScript(PAGE, raw)).toContain('data-website-id="a&b"');
});

test('a page already carrying it is not given a second one', () => {
  const once = injectTrackingScript(PAGE, SNIPPET);

  expect(injectTrackingScript(once, SNIPPET)).toBe(once);
});

test('a page with no head still gets it', () => {
  expect(injectTrackingScript('<p>nothing</p>', SNIPPET)).toContain(SNIPPET);
});
