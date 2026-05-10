import type { ReactNode } from 'react';

/** Definition of a single API endpoint card on the `/api` page. */
export interface EndpointDefinition {
  /** HTTP method — currently always `GET`. */
  method: 'GET';
  /** Endpoint path with placeholder syntax (e.g. `/v1/pdbs/<PDB-ID>`). */
  path: string;
  /** Free-form description, may include inline `<code>` tags. */
  description: ReactNode;
  /** Concrete example URL the user can click or copy. */
  example: string;
  /**
   * Pre-v1 paths still served by the same handler for backwards
   * compatibility. They are documented as obsolete; new code should use
   * `path` instead.
   */
  legacyAliases?: string[];
}

/**
 * Single source of truth for the endpoint reference shown on `/api` and
 * asserted on by the e2e test. Adding an endpoint here automatically
 * extends both the page UI and the corresponding tests.
 */
export const endpoints: EndpointDefinition[] = [
  {
    method: 'GET',
    path: '/v1/database/info',
    description:
      'JSON document with the asym-unit and bio-assembly entry counts and the total decompressed size of each archive.',
    example: '/v1/database/info',
  },
  {
    method: 'GET',
    path: '/v1/pdbs/<PDB-ID>',
    description:
      'Parsed JSON metadata: residues, chains, helices, sheets, formulas, isoelectric point, amino-acid percentages, omega-bond summary.',
    example: '/v1/pdbs/5ABY',
    legacyAliases: ['/pdb/<PDB-ID>'],
  },
  {
    method: 'GET',
    path: '/v1/pdbs/<PDB-ID>/raw',
    description:
      'Original asymmetric-unit PDB file (text, gunzipped on the fly).',
    example: '/v1/pdbs/5ABY/raw',
  },
  {
    method: 'GET',
    path: '/v1/assemblies/<PDB-ID>/raw',
    description: 'Biological-assembly PDB file (text, gunzipped on the fly).',
    example: '/v1/assemblies/101D/raw',
  },
  {
    method: 'GET',
    path: '/v1/assemblies/<PDB-ID>/image/<size>',
    description: (
      <>
        Rendered PyMol image of the biological assembly. Available sizes:{' '}
        <code>100x100</code>, <code>200x200</code>, <code>400x400</code>.
      </>
    ),
    example: '/v1/assemblies/101D/image/400x400',
    legacyAliases: ['/assembly/<PDB-ID>/<size>'],
  },
  {
    method: 'GET',
    path: '/v1/pdbs',
    description: (
      <>
        Search parsed metadata. Supports <code>q</code> (FTS title match),
        <code> methods</code>, <code>helicesMin</code>/<code>helicesMax</code>,
        <code> sheetsMin</code>/<code>sheetsMax</code>, <code>residuesMin</code>
        /<code>residuesMax</code>, <code>ligandsMin</code>/
        <code>ligandsMax</code>, <code>yearMin</code>/<code>yearMax</code>, plus{' '}
        <code>limit</code>/<code>offset</code>.
      </>
    ),
    example: '/v1/pdbs?q=hemoglobin&yearMin=2015&limit=10',
  },
  {
    method: 'GET',
    path: '/v1/pdbs/jsmol',
    description:
      'Curated list of teaching-friendly entries (one peptidic sequence, ≥1 helix and 1 sheet, a small ligand). Returns full parsed docs.',
    example: '/v1/pdbs/jsmol',
    legacyAliases: ['/view/jsmol'],
  },
  {
    method: 'GET',
    path: '/v1/stats/<view>',
    description: (
      <>
        Aggregated statistics. Available views: <code>byYear</code>,{' '}
        <code>byExperiment</code>, <code>aminoAcidFreq</code>,{' '}
        <code>nucleicBaseFreq</code>, <code>moleculeType</code>,{' '}
        <code>helicesVsSheets</code>, <code>ligandFrequency</code>,{' '}
        <code>methodByYear</code>, <code>omegaSummary</code>,{' '}
        <code>pairFrequency</code>, …
      </>
    ),
    example: '/v1/stats/byYear',
    legacyAliases: ['/stats/<view>'],
  },
  {
    method: 'GET',
    path: '/v1/rsync-history',
    description:
      'Rsync-run history. Filter with type=asymUnit|bioAssembly and limit=N.',
    example: '/v1/rsync-history?type=asymUnit&limit=5',
  },
  {
    method: 'GET',
    path: '/v1/ligands',
    description: (
      <>
        Substructure search over the CCD. Pass{' '}
        <code>substructure=&lt;idCode&gt;</code> for an OCL fingerprint screen +
        verification, <code>codes=ATP,HEM</code> for a batch lookup, or no
        parameters for the most-used ligands.
      </>
    ),
    example: '/v1/ligands?limit=20',
  },
  {
    method: 'GET',
    path: '/v1/ligands/<CODE>',
    description:
      'Full record for one ligand: name, formula, molecular weight, atom count, OCL idCode, packed coordinates, and number of PDB entries it appears in.',
    example: '/v1/ligands/HEM',
  },
  {
    method: 'GET',
    path: '/v1/ligands/<CODE>/pdbs',
    description: (
      <>
        Paginated list of PDB entries containing the ligand, with per-entry copy
        count. Supports <code>limit</code> and <code>offset</code>.
      </>
    ),
    example: '/v1/ligands/HEM/pdbs?limit=20',
  },
];
