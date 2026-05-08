/**
 * Tiny student-friendly selection language for the Animate page. Compiles
 * to Mol* MolScript expressions (see `selectionCompiler.ts`), mirroring the
 * JSmol selection grammar that the historical teaching tool used.
 *
 * Grammar:
 *   sel := atom | "not" sel | sel "or" sel | sel "and" sel | "(" sel ")"
 *   atom := <ligandLabel>           e.g. PLP
 *         | <from>-<to>:<chain>     e.g. 108-122:A
 *         | <residue>:<chain>       e.g. 119:A
 *         | "all" | "none"
 *         | "protein" | "ligand" | "water" | "nucleic" | "polymer" | "hetero"
 *         | "within" <number> "of" sel
 *
 * Precedence: `not` binds tighter than `and`, which binds tighter than `or`.
 */

/** Predefined keyword groups that select common biochemical sets. */
export type KeywordGroup =
  | 'all'
  | 'none'
  | 'protein'
  | 'ligand'
  | 'water'
  | 'nucleic'
  | 'polymer'
  | 'hetero';

/** Parsed selection AST. Compiled to MolScript by `compileSelection`. */
export type Selection =
  | { kind: 'group'; name: KeywordGroup }
  | { kind: 'ligand'; label: string }
  | { kind: 'residueRange'; chain: string; from: number; to: number }
  | { kind: 'residue'; chain: string; index: number }
  | { kind: 'not'; expr: Selection }
  | { kind: 'and'; left: Selection; right: Selection }
  | { kind: 'or'; left: Selection; right: Selection }
  | { kind: 'within'; radius: number; expr: Selection };

const KEYWORD_GROUPS = new Set<string>([
  'all',
  'none',
  'protein',
  'ligand',
  'water',
  'nucleic',
  'polymer',
  'hetero',
]);

type Token =
  | { kind: 'range'; from: number; to: number; chain: string }
  | { kind: 'residue'; index: number; chain: string }
  | { kind: 'number'; value: number }
  | { kind: 'ident'; value: string }
  | { kind: '(' }
  | { kind: ')' };

interface Parser {
  tokens: Token[];
  position: number;
}

/**
 * Parse a selection-language string into a Selection AST.
 * @param input - Selection text written by a student.
 * @returns Parsed AST.
 */
export function parseSelection(input: string): Selection {
  const tokens = tokenize(input);
  const parser: Parser = { tokens, position: 0 };
  const expression = parseOr(parser);
  if (parser.position < tokens.length) {
    throw new Error(
      `Unexpected token at position ${parser.position} in selection: "${input}"`,
    );
  }
  return expression;
}

function parseOr(parser: Parser): Selection {
  let left = parseAnd(parser);
  while (matchKeyword(parser, 'or')) {
    const right = parseAnd(parser);
    left = { kind: 'or', left, right };
  }
  return left;
}

function parseAnd(parser: Parser): Selection {
  let left = parseNot(parser);
  while (matchKeyword(parser, 'and')) {
    const right = parseNot(parser);
    left = { kind: 'and', left, right };
  }
  return left;
}

function parseNot(parser: Parser): Selection {
  if (matchKeyword(parser, 'not')) {
    return { kind: 'not', expr: parseNot(parser) };
  }
  return parseAtom(parser);
}

function parseAtom(parser: Parser): Selection {
  const token = parser.tokens[parser.position];
  if (!token) {
    throw new Error('Unexpected end of selection');
  }

  if (token.kind === '(') {
    parser.position++;
    const inner = parseOr(parser);
    expect(parser, ')');
    return inner;
  }

  if (token.kind === 'range') {
    parser.position++;
    return {
      kind: 'residueRange',
      from: token.from,
      to: token.to,
      chain: token.chain,
    };
  }

  if (token.kind === 'residue') {
    parser.position++;
    return { kind: 'residue', index: token.index, chain: token.chain };
  }

  if (token.kind === 'ident') {
    const lower = token.value.toLowerCase();
    if (lower === 'within') {
      parser.position++;
      const radiusToken = parser.tokens[parser.position];
      if (radiusToken?.kind !== 'number') {
        throw new Error('Expected a number after "within"');
      }
      parser.position++;
      if (!matchKeyword(parser, 'of')) {
        throw new Error('Expected "of" after "within <radius>"');
      }
      return {
        kind: 'within',
        radius: radiusToken.value,
        expr: parseAtom(parser),
      };
    }
    if (KEYWORD_GROUPS.has(lower)) {
      parser.position++;
      return { kind: 'group', name: lower as KeywordGroup };
    }
    parser.position++;
    return { kind: 'ligand', label: token.value.toUpperCase() };
  }

  throw new Error(
    `Unexpected token ${describeToken(token)} at position ${parser.position}`,
  );
}

function matchKeyword(parser: Parser, keyword: string): boolean {
  const token = parser.tokens[parser.position];
  if (token?.kind === 'ident' && token.value.toLowerCase() === keyword) {
    parser.position++;
    return true;
  }
  return false;
}

function expect(parser: Parser, kind: '(' | ')'): void {
  const token = parser.tokens[parser.position];
  if (token?.kind !== kind) {
    throw new Error(`Expected '${kind}' at position ${parser.position}`);
  }
  parser.position++;
}

function describeToken(token: Token): string {
  switch (token.kind) {
    case 'number':
      return String(token.value);
    case 'ident':
      return token.value;
    case 'range':
      return `${token.from}-${token.to}:${token.chain}`;
    case 'residue':
      return `${token.index}:${token.chain}`;
    case '(':
    case ')':
      return token.kind;
    default:
      return JSON.stringify(token);
  }
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < input.length) {
    const character = input.charAt(index);
    if (/\s/.test(character)) {
      index++;
      continue;
    }
    if (character === '(' || character === ')') {
      tokens.push({ kind: character });
      index++;
      continue;
    }
    const remainder = input.slice(index);
    const range = /^(?<from>\d+)-(?<to>\d+):(?<chain>[A-Za-z0-9]+)/.exec(
      remainder,
    );
    if (range?.groups) {
      tokens.push({
        kind: 'range',
        from: Number(range.groups.from),
        to: Number(range.groups.to),
        chain: range.groups.chain ?? '',
      });
      index += range[0].length;
      continue;
    }
    const residue = /^(?<index>\d+):(?<chain>[A-Za-z0-9]+)/.exec(remainder);
    if (residue?.groups) {
      tokens.push({
        kind: 'residue',
        index: Number(residue.groups.index),
        chain: residue.groups.chain ?? '',
      });
      index += residue[0].length;
      continue;
    }
    const number = /^\d+(?:\.\d+)?/.exec(remainder);
    if (number) {
      tokens.push({ kind: 'number', value: Number(number[0]) });
      index += number[0].length;
      continue;
    }
    const ident = /^[A-Za-z_][A-Za-z0-9_]*/.exec(remainder);
    if (ident) {
      tokens.push({ kind: 'ident', value: ident[0] });
      index += ident[0].length;
      continue;
    }
    throw new Error(
      `Unexpected character at position ${index} in selection: "${character}"`,
    );
  }
  return tokens;
}
