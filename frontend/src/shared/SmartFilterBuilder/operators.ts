import type { FilterFieldType, OperatorId } from './types.ts';

/** Static metadata for one operator id. */
export interface OperatorMeta {
  id: OperatorId;
  /**
   * Operator symbol as it appears in the canonical filter string (e.g. `>=`,
   * `~`, `..`). Empty string for `default`; the serializer special-cases
   * `between` and emits `..` between its two values rather than as a prefix.
   */
  symbol: string;
  /** Compact symbol shown on operator buttons (e.g. `≥`, `…`). */
  label: string;
  /** Long form used in tooltips and the operator picker. */
  description: string;
  /** Field types this operator can be applied to. */
  appliesTo: FilterFieldType[];
  /** When true the operator takes a `[low, high]` pair (only `between`). */
  takesRange?: boolean;
}

export const OPERATORS: OperatorMeta[] = [
  {
    id: 'default',
    symbol: '',
    label: ':',
    description:
      'matches (case-insensitive contains for text, fuzzy for numbers)',
    appliesTo: ['number', 'string', 'enum', 'boolean'],
  },
  {
    id: 'eq',
    symbol: '=',
    label: '=',
    description: 'exact match (case-sensitive for text)',
    appliesTo: ['number', 'string', 'enum', 'boolean'],
  },
  {
    id: 'neq',
    symbol: '!=',
    label: '≠',
    description: 'not equal to any of the values',
    appliesTo: ['number', 'string', 'enum', 'boolean'],
  },
  {
    id: 'gt',
    symbol: '>',
    label: '>',
    description: 'greater than',
    appliesTo: ['number'],
  },
  {
    id: 'gte',
    symbol: '>=',
    label: '≥',
    description: 'greater than or equal',
    appliesTo: ['number'],
  },
  {
    id: 'lt',
    symbol: '<',
    label: '<',
    description: 'less than',
    appliesTo: ['number'],
  },
  {
    id: 'lte',
    symbol: '<=',
    label: '≤',
    description: 'less than or equal',
    appliesTo: ['number'],
  },
  {
    id: 'between',
    symbol: '..',
    label: '…',
    description: 'between two values (inclusive)',
    appliesTo: ['number'],
    takesRange: true,
  },
  {
    id: 'startsWith',
    symbol: '^',
    label: 'starts',
    description: 'starts with',
    appliesTo: ['string', 'enum'],
  },
  {
    id: 'endsWith',
    symbol: '$',
    label: 'ends',
    description: 'ends with',
    appliesTo: ['string', 'enum'],
  },
  {
    id: 'contains',
    symbol: '~',
    label: '~',
    description: 'contains substring (case-insensitive)',
    appliesTo: ['string', 'enum'],
  },
];

const BY_ID = new Map(OPERATORS.map((meta) => [meta.id, meta]));

// Longest-first so that `>=` is matched before `>`, `<=` before `<`, etc.
// `<>` is a synonym of `!=` accepted by smart-sqlite3-filter — we map it onto
// the same id at parse time and always serialize back to the canonical `!=`.
const PARSE_TABLE: Array<{ symbol: string; id: OperatorId }> = [
  ...OPERATORS.filter((meta) => meta.symbol !== '' && meta.symbol !== '..').map(
    (meta) => ({ symbol: meta.symbol, id: meta.id }),
  ),
  { symbol: '<>', id: 'neq' as OperatorId },
].toSorted((a, b) => b.symbol.length - a.symbol.length);

/**
 * Operator metadata for a given id. Throws on unknown ids — these are an
 * internal invariant of the builder, never user input.
 * @param id - Operator id.
 * @returns Metadata record.
 */
export function operatorById(id: OperatorId): OperatorMeta {
  const meta = BY_ID.get(id);
  if (!meta) throw new Error(`Unknown operator id: ${id}`);
  return meta;
}

/**
 * Operators applicable to a given field type, in menu order.
 * @param type - Field data type.
 * @returns Operators that accept this type.
 */
export function operatorsFor(type: FilterFieldType): OperatorMeta[] {
  return OPERATORS.filter((meta) => meta.appliesTo.includes(type));
}

/**
 * Parser-side: find the operator whose symbol prefixes a value string. The
 * order matters because `>=` must be tried before `>`. `between` is detected
 * separately (presence of `..` inside the value).
 * @param value - The value half of a `field:value` token, after the `:`.
 * @returns The matching operator (defaults to `default`) and the remaining
 *   string with the operator symbol consumed.
 */
export function matchLeadingOperator(value: string): {
  operator: OperatorId;
  rest: string;
} {
  for (const entry of PARSE_TABLE) {
    if (value.startsWith(entry.symbol)) {
      return { operator: entry.id, rest: value.slice(entry.symbol.length) };
    }
  }
  return { operator: 'default', rest: value };
}
