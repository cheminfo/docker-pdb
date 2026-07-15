/**
 * The selection grammar, grouped by what the reader is trying to do rather
 * than by parser rule. Mirrors `selectionParser.ts` — keep in sync when the
 * grammar changes. Rendered by `HelpSelections.tsx`, indexed by `search.ts`.
 */

export interface SelectionRow {
  expression: string;
  description: string;
}

export interface SelectionCategory {
  id: string;
  title: string;
  /** Why you would reach for this family of expressions. */
  intro: string;
  rows: SelectionRow[];
}

export const SELECTION_CATEGORIES: SelectionCategory[] = [
  {
    id: 'groups',
    title: 'Whole biochemical groups',
    intro:
      'The everyday vocabulary. These read exactly as you would say them out loud, and cover most scenes.',
    rows: [
      { expression: 'all', description: 'every atom in the structure' },
      { expression: 'none', description: 'no atoms (an empty selection)' },
      { expression: 'protein', description: 'all amino-acid residues' },
      {
        expression: 'ligand',
        description: 'non-polymer, non-water entities — the small molecules (PLP, HEM, …)',
      },
      { expression: 'water', description: 'every water molecule' },
      { expression: 'nucleic', description: 'DNA and RNA residues' },
      {
        expression: 'polymer',
        description: 'protein + nucleic acid — anything that is a chain',
      },
      { expression: 'hetero', description: 'everything that is not a polymer' },
      {
        expression: 'backbone',
        description: 'protein backbone atoms only (N, CA, C, O, OXT, H, HA)',
      },
      {
        expression: 'sidechain',
        description: 'protein atoms that are not backbone — the R groups',
      },
    ],
  },
  {
    id: 'secondary',
    title: 'Secondary structure',
    intro:
      'Read straight from the HELIX and SHEET records in the file. If the file declares none, these select nothing — that is the usual reason a helix scene comes up empty.',
    rows: [
      { expression: 'helix', description: 'every residue covered by a HELIX record' },
      { expression: 'sheet', description: 'every residue covered by a SHEET record' },
    ],
  },
  {
    id: 'names',
    title: 'By residue, atom or element name',
    intro:
      'Pick things by what they are called. Square brackets around a residue code are optional — they just help the eye.',
    rows: [
      { expression: 'PLP', description: 'every residue whose 3-letter code is PLP' },
      { expression: '[CYS]', description: 'bracketed residue code — identical to CYS' },
      { expression: '[H2O]', description: 'all waters, by name' },
      { expression: '.CA', description: 'every atom named CA (the α-carbons)' },
      {
        expression: '[CYS].CA',
        description: 'the CA atom of every cysteine — a residue and an atom together',
      },
      { expression: 'CYS.SG', description: 'the SG (thiol sulfur) of every cysteine' },
      { expression: '_C', description: 'every carbon atom (underscore = element symbol)' },
      { expression: '_Fe', description: 'every iron atom' },
    ],
  },
  {
    id: 'position',
    title: 'By chain and residue number',
    intro:
      'A colon separates the residue part from the chain part. Read `108-122:A` as “residues 108 through 122, on chain A”.',
    rows: [
      { expression: ':A', description: 'everything on chain A' },
      { expression: '119:A', description: 'residue 119 of chain A' },
      { expression: '108-122:A', description: 'residues 108 through 122 of chain A (inclusive)' },
    ],
  },
  {
    id: 'distance',
    title: 'By distance — the one that earns its keep',
    intro:
      '“Everything near the ligand” is the question you actually ask at the bench, and it is impossible to answer reliably by clicking. Distances are in ångströms and measured atom-to-atom.',
    rows: [
      {
        expression: 'within 3.5 of PLP',
        description: 'every atom within 3.5 Å of any PLP atom — PLP itself included',
      },
      {
        expression: 'within 5 of HEM and not HEM',
        description: 'the pocket around HEM, with HEM itself excluded',
      },
      {
        expression: 'protein and within 5 of HEM',
        description: 'only the protein atoms lining the haem pocket',
      },
    ],
  },
  {
    id: 'combining',
    title: 'Combining with and / or / not',
    intro:
      'These behave exactly like the English words. `and` narrows, `or` widens, `not` inverts, and parentheses group — same as in a chemical formula. `not` binds tightest, then `and`, then `or`.',
    rows: [
      { expression: 'not PLP', description: 'everything except PLP residues' },
      { expression: 'protein and not water', description: 'protein, with water excluded' },
      { expression: ':A or :B', description: 'chain A together with chain B' },
      {
        expression: '(108-122:A or 130-140:A) and not water',
        description: 'two ranges taken together, minus any water',
      },
      {
        expression: 'protein and backbone and :A',
        description: 'stack as many conditions as you like',
      },
    ],
  },
];
