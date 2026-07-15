/**
 * A very small JavaScript tokenizer, just good enough to colour the help's
 * code samples. It is not a parser and does not try to be: the samples are a
 * fixed subset we author ourselves (comments, strings, numbers, keywords and
 * calls), so a single left-to-right scan covers them.
 *
 * Deliberately hand-rolled rather than pulling in a highlighter: the samples
 * are tiny and trusted, this returns data (so the renderer stays plain React
 * with no `dangerouslySetInnerHTML`), and it keeps the palette under our
 * control on the dark background. Kept free of React so it can be tested.
 */

export type TokenKind =
  'comment' | 'string' | 'number' | 'keyword' | 'function' | 'plain';

export interface Token {
  kind: TokenKind;
  value: string;
}

const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'new',
  'function',
  'return',
  'for',
  'while',
  'if',
  'else',
  'of',
  'in',
  'await',
  'async',
  'true',
  'false',
  'null',
  'undefined',
]);

/**
 * Comments and strings come first so that `//` inside a string is not read as
 * a comment, and an apostrophe inside a comment does not open a string.
 */
const TOKEN_PATTERN = new RegExp(
  [
    String.raw`(?<comment>\/\/[^\n]*)`,
    String.raw`(?<string>'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")`,
    String.raw`(?<number>\b\d+(?:\.\d+)?\b)`,
    String.raw`(?<word>\b[A-Za-z_$][\w$]*\b)`,
  ].join('|'),
  'g',
);

/**
 * Split code into coloured tokens.
 * @param code - The sample to tokenize.
 * @returns Tokens in source order; concatenating their values restores `code`.
 */
export function highlightCode(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  TOKEN_PATTERN.lastIndex = 0;
  let match = TOKEN_PATTERN.exec(code);
  while (match !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: 'plain', value: code.slice(lastIndex, match.index) });
    }
    tokens.push(classify(match, code));
    lastIndex = match.index + match[0].length;
    match = TOKEN_PATTERN.exec(code);
  }

  if (lastIndex < code.length) {
    tokens.push({ kind: 'plain', value: code.slice(lastIndex) });
  }
  return tokens;
}

/**
 * Turn one regex match into a token.
 * @param match - The match produced by `TOKEN_PATTERN`.
 * @param code - The full sample, used to look ahead past a word.
 * @returns The classified token.
 */
function classify(match: RegExpExecArray, code: string): Token {
  const { comment, string, number, word } = match.groups ?? {};

  if (comment !== undefined) return { kind: 'comment', value: comment };
  if (string !== undefined) return { kind: 'string', value: string };
  if (number !== undefined) return { kind: 'number', value: number };
  if (word !== undefined) {
    if (KEYWORDS.has(word)) return { kind: 'keyword', value: word };
    return { kind: isCall(code, match.index + word.length), value: word };
  }
  return { kind: 'plain', value: match[0] };
}

/**
 * A word is a call when the next non-space character is an opening paren.
 * @param code - The full sample.
 * @param from - Index just past the word.
 * @returns `'function'` for a call, `'plain'` otherwise.
 */
function isCall(code: string, from: number): TokenKind {
  for (let index = from; index < code.length; index++) {
    const char = code[index];
    if (char === ' ') continue;
    return char === '(' ? 'function' : 'plain';
  }
  return 'plain';
}
