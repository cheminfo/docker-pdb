import { serializeClause } from '../../shared/SmartFilterBuilder/serialize.ts';
import type { Clause } from '../../shared/SmartFilterBuilder/types.ts';

/** Raw text of the filter fields, as typed in the left panel. */
export interface LigandFilterDraft {
  code: string;
  name: string;
  mf: string;
  mwMin: string;
  mwMax: string;
}

/** A draft with every field cleared. */
export const EMPTY_FILTER_DRAFT: LigandFilterDraft = {
  code: '',
  name: '',
  mf: '',
  mwMin: '',
  mwMax: '',
};

/**
 * Turn the raw field text into a `smart-sqlite3-filter` query string, which the
 * backend compiles to SQL and hands to the structure search as its candidate
 * set. Blank fields are dropped, and molecular weights that are not finite
 * numbers are ignored.
 *
 * Clauses are rendered through the shared serializer rather than concatenated,
 * so values needing quotes (spaces, commas, a leading operator character) round
 * -trip instead of corrupting the query.
 * @param draft - Raw filter-field text.
 * @returns The canonical filter string; empty when no field is set.
 */
export function toSmartQuery(draft: LigandFilterDraft): string {
  const clauses: Clause[] = [];
  for (const field of ['code', 'name', 'mf'] as const) {
    const value = draft[field].trim();
    if (value) clauses.push({ field, operator: 'contains', values: [value] });
  }
  const mwClause = toMwClause(draft);
  if (mwClause) clauses.push(mwClause);
  return clauses.map((clause) => serializeClause(clause)).join(' ');
}

/**
 * Whether any field of the draft carries a value.
 * @param draft - Raw filter-field text.
 * @returns `true` when at least one filter is set.
 */
export function hasLigandFilters(draft: LigandFilterDraft): boolean {
  return Object.values(draft).some((value) => value.trim().length > 0);
}

/**
 * Build the molecular-weight clause from whichever bounds were filled in:
 * both give a range, one gives an open-ended comparison.
 * @param draft - Raw filter-field text.
 * @returns The clause, or `null` when neither bound is a finite number.
 */
function toMwClause(draft: LigandFilterDraft): Clause | null {
  const min = Number.parseFloat(draft.mwMin);
  const max = Number.parseFloat(draft.mwMax);
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);
  if (hasMin && hasMax) {
    return {
      field: 'mw',
      operator: 'between',
      values: [String(min), String(max)],
    };
  }
  if (hasMin) return { field: 'mw', operator: 'gte', values: [String(min)] };
  if (hasMax) return { field: 'mw', operator: 'lte', values: [String(max)] };
  return null;
}
