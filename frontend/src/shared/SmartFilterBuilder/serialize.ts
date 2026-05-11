import { operatorById } from './operators.ts';
import type { Clause } from './types.ts';

/**
 * Render a list of {@link Clause} into a canonical smart-sqlite3-filter
 * query string. Multiple clauses are joined with spaces (logical AND on the
 * backend); within a clause multiple values are joined with `,` (logical OR).
 *
 * Values that contain whitespace, commas, colons, leading operator symbols,
 * or the `..` range marker are wrapped in double quotes so the upstream
 * parser puts them back into one piece. The serializer never emits a quote
 * inside a quoted value — values containing literal `"` are wrapped in
 * single quotes instead (and vice versa). If both quote characters appear in
 * the same value, the value is double-quoted with the embedded `"` swapped
 * to `'` as a last-resort fallback.
 * @param clauses - Clauses to render.
 * @returns The full filter string. Empty input yields an empty string.
 */
export function serialize(clauses: Clause[]): string {
  return clauses.map(serializeClause).filter(Boolean).join(' ');
}

/**
 * Render a single clause. Exported for unit tests and for the chip component
 * (which uses it to preview the canonical form on hover).
 * @param clause - Clause to render.
 * @returns The canonical token, or `''` when the clause carries no values.
 */
export function serializeClause(clause: Clause): string {
  if (clause.raw !== undefined) return clause.raw;
  if (clause.values.length === 0) return '';

  const prefix = clause.negate ? '-' : '';
  const fieldPart = clause.field ? `${clause.field}:` : '';
  const meta = operatorById(clause.operator);

  if (clause.operator === 'between') {
    const [low = '', high = ''] = clause.values;
    return `${prefix}${fieldPart}${quoteIfNeeded(low)}..${quoteIfNeeded(high)}`;
  }

  const joinedValues = clause.values.map(quoteIfNeeded).join(',');
  return `${prefix}${fieldPart}${meta.symbol}${joinedValues}`;
}

/**
 * Wrap a value in quotes when the smart-sqlite3-filter parser would
 * otherwise split it on whitespace or on a comma. Numeric and bare-word
 * values pass through untouched.
 * @param value - Raw value.
 * @returns Value, possibly quoted.
 */
export function quoteIfNeeded(value: string): string {
  if (value === '') return '""';
  if (!needsQuoting(value)) return value;
  if (!value.includes('"')) return `"${value}"`;
  if (!value.includes("'")) return `'${value}'`;
  return `"${value.replaceAll('"', "'")}"`;
}

function needsQuoting(value: string): boolean {
  if (/\s/.test(value)) return true;
  if (value.includes(',')) return true;
  if (value.includes('..')) return true;
  // Leading operator-like prefix would be misparsed as an operator.
  if (/^[<>=!~^$-]/.test(value)) return true;
  return false;
}
