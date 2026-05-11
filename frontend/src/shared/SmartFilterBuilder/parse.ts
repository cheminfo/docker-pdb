import { matchLeadingOperator } from './operators.ts';
import type { Clause, OperatorId } from './types.ts';

/**
 * Parse a smart-sqlite3-filter query string into a list of {@link Clause}.
 *
 * Mirrors the grammar implemented by the `smart-sqlite3-filter` package:
 *
 * - Tokens are separated by whitespace. Single and double quotes escape spaces.
 * - A token may start with `-` to negate it.
 * - A token of the form `field:rest` scopes the clause to one column. The
 *   field name itself may be a comma-separated list (multi-field search).
 * - The leading characters of `rest` (after the colon) may carry an operator
 *   symbol: `>=`, `<=`, `!=`, `<>`, `=`, `>`, `<`, `~`, `^`, `$`.
 * - The presence of `..` inside the value marks a range (operator `between`).
 * - Multiple values can be supplied with `,` (logical OR for the clause).
 *
 * Tokens that cannot be parsed cleanly are returned with their original text
 * preserved on `Clause.raw`, so the serializer can round-trip them verbatim.
 * @param input - The full query string (e.g. `year:>=2024 title:~kinase`).
 * @returns One clause per token, in left-to-right order.
 */
export function parse(input: string): Clause[] {
  const tokens = splitOutsideQuotes(input, /\s/);
  const clauses: Clause[] = [];
  for (const token of tokens) {
    const clause = parseToken(token);
    if (clause) clauses.push(clause);
  }
  return clauses;
}

function parseToken(rawToken: string): Clause | null {
  let token = rawToken;
  if (token === '') return null;

  let negate = false;
  if (token.startsWith('-')) {
    negate = true;
    token = token.slice(1);
  }

  const colon = token.indexOf(':');
  let field: string | null = null;
  let valuePart = token;
  if (colon !== -1) {
    field = token.slice(0, colon);
    valuePart = token.slice(colon + 1);
  }

  let operator: OperatorId;
  let rest: string;
  if (valuePart.includes('..')) {
    operator = 'between';
    rest = valuePart;
  } else {
    const match = matchLeadingOperator(valuePart);
    operator = match.operator;
    rest = match.rest;
  }

  const values = parseValues(rest, operator === 'between');
  if (values.length === 0) {
    return { field, operator: 'default', values: [], negate, raw: rawToken };
  }
  return negate
    ? { field, operator, values, negate }
    : { field, operator, values };
}

function parseValues(valuePart: string, isBetween: boolean): string[] {
  if (isBetween) {
    const parts = valuePart.split('..');
    if (parts.length > 2) {
      // More than one `..` — keep the whole thing as a single value so the
      // serializer can round-trip it; the editor treats it as 'default'.
      return [valuePart];
    }
    return [unquote(parts[0] ?? ''), unquote(parts[1] ?? '')];
  }
  return splitOutsideQuotes(valuePart, ',').map(unquote);
}

/**
 * Split a string by a delimiter while ignoring delimiters that fall inside
 * single or double quotes. Empty pieces are dropped. The matching pair of
 * quotes is preserved on each output piece — callers strip them via
 * {@link unquote} when they want the literal value.
 * @param input - Source string.
 * @param delimiter - A single character or a RegExp that matches one char.
 * @returns The pieces between delimiters.
 */
export function splitOutsideQuotes(
  input: string,
  delimiter: string | RegExp,
): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let quoteChar = '';
  let start = 0;
  const isDelim =
    typeof delimiter === 'string'
      ? (char: string) => char === delimiter
      : (char: string) => delimiter.test(char);
  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    if (inQuotes) {
      if (char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      }
      continue;
    }
    if (char === '"' || char === "'") {
      inQuotes = true;
      quoteChar = char;
      continue;
    }
    if (isDelim(char)) {
      const piece = input.slice(start, i).trim();
      if (piece) result.push(piece);
      start = i + 1;
    }
  }
  const tail = input.slice(start).trim();
  if (tail) result.push(tail);
  return result;
}

/**
 * Strip a matching pair of leading/trailing quotes (single or double) from a
 * string. Used by the parser so the in-memory value never carries its quote
 * decoration.
 * @param value - Possibly-quoted value.
 * @returns The unquoted value (or the input unchanged if no matching pair).
 */
export function unquote(value: string): string {
  if (value.length < 2) return value;
  const first = value.charAt(0);
  const last = value.at(-1) ?? '';
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}
