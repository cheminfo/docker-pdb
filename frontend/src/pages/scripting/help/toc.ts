/**
 * Per-tab table of contents, derived from the same content modules the tabs
 * render. Deriving rather than hand-listing means a new recipe or reference
 * group appears in the TOC automatically and cannot drift out of sync.
 *
 * The `id` of every entry is the DOM id of the matching section, so the tab
 * components and this module must agree — they do, because both build ids
 * through the helpers below.
 */

import { CONCEPTS } from './data/concepts.ts';
import { RECIPES } from './data/recipes.ts';
import { REFERENCE_GROUPS } from './data/reference.ts';
import { SELECTION_CATEGORIES } from './data/selections.ts';
import type { HelpTabId } from './search.ts';

export interface TocEntry {
  /** DOM id of the section this entry jumps to. */
  id: string;
  title: string;
}

/**
 * DOM id for a concept card.
 * @param conceptId - The concept's id.
 * @returns The DOM id.
 */
export function conceptDomId(conceptId: string): string {
  return `help-concept-${conceptId}`;
}

/**
 * DOM id for a selection category section.
 * @param categoryId - The category's id.
 * @returns The DOM id.
 */
export function selectionDomId(categoryId: string): string {
  return `help-selection-${categoryId}`;
}

/**
 * DOM id for a reference group section.
 * @param groupId - The group's id.
 * @returns The DOM id.
 */
export function referenceDomId(groupId: string): string {
  return `help-reference-${groupId}`;
}

/**
 * DOM id for a recipe section.
 * @param recipeId - The recipe's id.
 * @returns The DOM id.
 */
export function recipeDomId(recipeId: string): string {
  return `help-recipe-${recipeId}`;
}

/** Sections of the Start tab, which is prose rather than generated content. */
export const PHILOSOPHY_SECTIONS: TocEntry[] = [
  { id: 'help-philosophy-sentence', title: 'The sentence, in code' },
  { id: 'help-philosophy-vocabulary', title: 'The four things you work with' },
  { id: 'help-philosophy-why', title: 'Why script it?' },
  { id: 'help-philosophy-rules', title: 'Three rules that save an hour' },
  { id: 'help-philosophy-first', title: 'Your first script' },
];

export const TOC_BY_TAB: Record<HelpTabId, TocEntry[]> = {
  start: PHILOSOPHY_SECTIONS,
  basics: CONCEPTS.map((concept) => ({
    id: conceptDomId(concept.id),
    title: concept.title,
  })),
  selections: SELECTION_CATEGORIES.map((category) => ({
    id: selectionDomId(category.id),
    title: category.title,
  })),
  reference: [
    ...REFERENCE_GROUPS.map((group) => ({
      id: referenceDomId(group.id),
      title: group.title,
    })),
    { id: referenceDomId('colors'), title: 'Colours' },
    { id: referenceDomId('notes'), title: 'Good to know' },
  ],
  recipes: RECIPES.map((recipe) => ({
    id: recipeDomId(recipe.id),
    title: recipe.title,
  })),
};
