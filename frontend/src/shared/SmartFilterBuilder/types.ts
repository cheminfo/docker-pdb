/**
 * Data types accepted by a smart-sqlite3-filter field. The chosen type drives
 * the operator menu and the value editor in the builder UI.
 */
export type FilterFieldType = 'number' | 'string' | 'enum' | 'boolean';

/**
 * Schema-like description of one filterable column. The list of these is the
 * single source of project-specific knowledge the builder needs — everything
 * else (parser, serializer, chip rendering) is generic.
 */
export interface FilterField {
  /**
   * Field name as it appears in the canonical filter string (e.g. `year`,
   * `nb_helices`, or a dotted JSON path like `bson.title`).
   */
  name: string;
  /**
   * Human label shown in the field picker. Defaults to {@link name}.
   */
  label?: string;
  /**
   * Data type. Drives the operator menu and the value editor.
   */
  type: FilterFieldType;
  /**
   * For `enum` fields: the allowed values, in display order. Also used to
   * populate suggestions for `string` fields when present.
   */
  options?: string[];
  /**
   * For `number` fields: a hint shown next to the value input (lower bound).
   */
  min?: number;
  /**
   * For `number` fields: a hint shown next to the value input (upper bound).
   */
  max?: number;
  /**
   * Optional one-line description shown in the field picker dropdown.
   */
  description?: string;
}

/**
 * Stable identifier for each supported operator. The string symbol that is
 * emitted in the canonical filter string lives in `operators.ts`.
 */
export type OperatorId =
  | 'default'
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'startsWith'
  | 'endsWith'
  | 'contains';

/**
 * One filter clause. The builder stores a list of these; the serializer turns
 * them back into the canonical smart-sqlite3-filter string.
 */
export interface Clause {
  /**
   * Field name as it appears in the filter string, or `null` for a free-text
   * clause (no field prefix — searches across the default fields).
   */
  field: string | null;
  /**
   * Chosen operator. `'default'` means "no explicit operator" (the library's
   * type-dependent default applies: contains-ish for strings, exact-ish for
   * numbers).
   */
  operator: OperatorId;
  /**
   * One or more values. Length 2 when `operator === 'between'` (low, high);
   * length ≥ 1 otherwise. Multiple values form an OR list.
   */
  values: string[];
  /**
   * If true the clause is negated (smart-sqlite3-filter prefix `-`).
   * @default false
   */
  negate?: boolean;
  /**
   * Raw token preserved verbatim when the parser cannot make sense of it.
   * When present, the serializer emits this string instead of re-deriving
   * one from `field` / `operator` / `values`, so a paste-and-edit cycle
   * never silently corrupts the user's input.
   */
  raw?: string;
}
