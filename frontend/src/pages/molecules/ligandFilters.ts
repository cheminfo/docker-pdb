import type { LigandFilters } from '../../shared/api/types.ts';

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
 * Convert the raw field text into the API filter object, dropping blank
 * fields and molecular weights that are not finite numbers.
 * @param draft - Raw filter-field text.
 * @returns Filters ready to send to `GET /v1/ligands`.
 */
export function toLigandFilters(draft: LigandFilterDraft): LigandFilters {
  const filters: LigandFilters = {};
  if (draft.code.trim()) filters.code = draft.code.trim();
  if (draft.name.trim()) filters.name = draft.name.trim();
  if (draft.mf.trim()) filters.mf = draft.mf.trim();
  const mwMin = Number.parseFloat(draft.mwMin);
  if (Number.isFinite(mwMin)) filters.mwMin = mwMin;
  const mwMax = Number.parseFloat(draft.mwMax);
  if (Number.isFinite(mwMax)) filters.mwMax = mwMax;
  return filters;
}

/**
 * Whether any field of the draft carries a value.
 * @param draft - Raw filter-field text.
 * @returns `true` when at least one filter is set.
 */
export function hasLigandFilters(draft: LigandFilterDraft): boolean {
  return Object.values(draft).some((value) => value.trim().length > 0);
}
