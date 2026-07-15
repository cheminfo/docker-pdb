/**
 * Free-text search across every piece of help content — concepts, selection
 * grammar, API reference, colour forms and recipes. Kept free of React so it
 * can be unit-tested directly.
 *
 * All terms must match (AND), and matches in a title outrank matches in the
 * body, so searching "chain" surfaces the chain selection row before the
 * recipes that merely mention chains in passing.
 */

import { CONCEPTS } from './data/concepts.ts';
import { RECIPES } from './data/recipes.ts';
import { COLOR_FORMS, REFERENCE_GROUPS } from './data/reference.ts';
import { SELECTION_CATEGORIES } from './data/selections.ts';

/** Tabs a result can live on — the UI uses this to jump to the source. */
export type HelpTabId =
  'start' | 'basics' | 'selections' | 'reference' | 'recipes';

export interface HelpResult {
  /** Unique across the whole index. */
  id: string;
  tab: HelpTabId;
  /** Section label, shown as a tag on the result. */
  section: string;
  title: string;
  description: string;
  code?: string;
  /** Higher ranks first. Populated by `searchHelp`. */
  score: number;
}

/** Normalised, lower-cased copy of a document's fields, built once. */
interface SearchableFields {
  title: string;
  section: string;
  description: string;
  code: string;
}

/** One indexed document, plus the text actually matched against. */
type HelpDocument = Omit<HelpResult, 'score'> & {
  readonly fields: SearchableFields;
};

const TITLE_WEIGHT = 10;
const SECTION_WEIGHT = 4;
const DESCRIPTION_WEIGHT = 2;
const CODE_WEIGHT = 1;

/**
 * Words too common to discriminate between entries. Dropped from queries so
 * that "colour by chain" is not sunk by "by" — which appears in the prose of
 * unrelated entries far more often than in the ones the reader wants.
 *
 * The selection operators (`and`, `or`, `not`, `within`, `of`) are absent on
 * purpose: they are real grammar here, so "not PLP" must stay searchable.
 */
const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'by',
  'to',
  'for',
  'is',
  'it',
  'how',
  'do',
  'i',
  'my',
  'me',
  'that',
  'this',
]);

/**
 * Lower-case and fold the British spellings used in the prose onto the
 * American ones the API uses, so `color(spec)` and "coloured by chain" match
 * each other. Applied to both the index and the query.
 * @param text - Raw text.
 * @returns Normalised text.
 */
function normalize(text: string): string {
  return text.toLowerCase().replaceAll('colour', 'color');
}

/**
 * Split a query into normalised terms, dropping stopwords unless that would
 * leave nothing to search for.
 * @param query - Raw user input.
 * @returns Non-empty search terms.
 */
function tokenize(query: string): string[] {
  const terms = normalize(query)
    .split(/[^a-z0-9.:_#-]+/i)
    .filter((term) => term.length > 0);
  const meaningful = terms.filter((term) => !STOPWORDS.has(term));
  return meaningful.length > 0 ? meaningful : terms;
}

/**
 * Score one document against one term.
 * @param document - Indexed help document.
 * @param term - Normalised search term.
 * @returns Summed weight of the fields the term appears in, or 0 when absent.
 */
function scoreTerm(document: HelpDocument, term: string): number {
  const { fields } = document;
  let score = 0;
  if (fields.title.includes(term)) score += TITLE_WEIGHT;
  if (fields.section.includes(term)) score += SECTION_WEIGHT;
  if (fields.description.includes(term)) score += DESCRIPTION_WEIGHT;
  if (fields.code.includes(term)) score += CODE_WEIGHT;
  return score;
}

/**
 * Attach the normalised copy of a document's text to it.
 * @param document - Document without its searchable fields.
 * @returns The indexable document.
 */
function indexable(document: Omit<HelpResult, 'score'>): HelpDocument {
  return {
    ...document,
    fields: {
      title: normalize(document.title),
      section: normalize(document.section),
      description: normalize(document.description),
      code: normalize(document.code ?? ''),
    },
  };
}

/**
 * Drop the internal normalised fields, keeping the public result shape.
 * @param document - Indexed document that matched.
 * @param score - Its total score.
 * @returns The public result.
 */
function toResult(document: HelpDocument, score: number): HelpResult {
  const { id, tab, section, title, description, code } = document;
  return { id, tab, section, title, description, code, score };
}

/**
 * Build the flat searchable index from every content module. Runs once at
 * module load — the content is static.
 * @returns Every help document.
 */
function buildIndex(): HelpDocument[] {
  const documents: Array<Omit<HelpResult, 'score'>> = [];

  for (const concept of CONCEPTS) {
    documents.push({
      id: `concept:${concept.id}`,
      tab: 'basics',
      section: 'Programming basics',
      title: concept.title,
      description: [concept.teaser, ...concept.body, concept.gotcha ?? ''].join(
        ' ',
      ),
      code: concept.code,
    });
  }

  for (const category of SELECTION_CATEGORIES) {
    for (const row of category.rows) {
      documents.push({
        id: `selection:${category.id}:${row.expression}`,
        tab: 'selections',
        section: category.title,
        title: row.expression,
        description: row.description,
      });
    }
  }

  for (const group of REFERENCE_GROUPS) {
    for (const entry of group.entries) {
      documents.push({
        id: `method:${group.id}:${entry.signature}`,
        tab: 'reference',
        section: group.title,
        title: entry.signature,
        description: entry.description,
        code: entry.example,
      });
    }
  }

  for (const form of COLOR_FORMS) {
    documents.push({
      id: `color:${form.spec}`,
      tab: 'reference',
      section: 'Colours',
      title: form.spec,
      description: form.description,
    });
  }

  for (const recipe of RECIPES) {
    documents.push({
      id: `recipe:${recipe.id}`,
      tab: 'recipes',
      section: 'Recipes',
      title: recipe.title,
      description: recipe.goal,
      code: recipe.code,
    });
  }

  return documents.map((document) => indexable(document));
}

const HELP_INDEX = buildIndex();

/** Number of documents in the index — used by tests to catch content loss. */
export const HELP_INDEX_SIZE = HELP_INDEX.length;

/**
 * Search all help content. Every term must match somewhere in a document.
 * @param query - Raw user input; blank returns no results.
 * @returns Matching entries, best first.
 */
export function searchHelp(query: string): HelpResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const results: HelpResult[] = [];
  for (const document of HELP_INDEX) {
    let total = 0;
    let matchedEveryTerm = true;
    for (const term of terms) {
      const score = scoreTerm(document, term);
      if (score === 0) {
        matchedEveryTerm = false;
        break;
      }
      total += score;
    }
    if (matchedEveryTerm) results.push(toResult(document, total));
  }

  return results.toSorted(
    (a, b) => b.score - a.score || a.title.localeCompare(b.title),
  );
}
