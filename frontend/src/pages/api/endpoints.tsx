import type { ReactNode } from 'react';

/** Definition of a single API endpoint card on the `/api` page. */
export interface EndpointDefinition {
  /** HTTP method — currently always `GET`. */
  method: 'GET';
  /** Endpoint path with placeholder syntax (e.g. `/pdb/<PDB-ID>`). */
  path: string;
  /** Free-form description, may include inline `<code>` tags. */
  description: ReactNode;
  /** Concrete example URL the user can click or copy. */
  example: string;
}

/**
 * Single source of truth for the endpoint reference shown on `/api` and
 * asserted on by the e2e test. Adding an endpoint here automatically
 * extends both the page UI and the corresponding tests.
 */
export const endpoints: EndpointDefinition[] = [
  {
    method: 'GET',
    path: '/pdb/<PDB-ID>',
    description:
      'JSON document with parsed properties: residues, chains, helices, sheets, formulas, isoelectric point, amino-acid percentages.',
    example: '/pdb/5ABY',
  },
  {
    method: 'GET',
    path: '/pdb/<PDB-ID>/<PDB-ID>.pdb',
    description: 'Original asymmetric-unit PDB file (text).',
    example: '/pdb/5ABY/5ABY.pdb',
  },
  {
    method: 'GET',
    path: '/assembly/<PDB-ID>/<PDB-ID>.pdb1',
    description: 'Biological-assembly PDB file (text).',
    example: '/assembly/101D/101D.pdb1',
  },
  {
    method: 'GET',
    path: '/assembly/<PDB-ID>/<size>.png',
    description: (
      <>
        Rendered PyMol image of the biological assembly. Available sizes:{' '}
        <code>100x100</code>, <code>200x200</code>, <code>400x400</code>.
      </>
    ),
    example: '/assembly/101D/400x400.png',
  },
  {
    method: 'GET',
    path: '/view/<view-name>',
    description: (
      <>
        Query a CouchDB view in <code>_design/query</code>. The{' '}
        <code>jsmol</code> view returns proteins with one peptidic sequence, ≥1
        helix and 1 sheet, and a small ligand.
      </>
    ),
    example: '/view/jsmol?include_docs=true',
  },
  {
    method: 'GET',
    path: '/stats/<view-name>',
    description: (
      <>
        Aggregated statistics in <code>_design/stats</code>. Use{' '}
        <code>?group=true</code> to break results down by key. Available views:{' '}
        <code>byYear</code>, <code>byExperiment</code>.
      </>
    ),
    example: '/stats/byYear?group=true',
  },
];
