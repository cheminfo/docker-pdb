import type { Page, Route } from '@playwright/test';

interface DatabaseInfo {
  doc_count: number;
  disk_size?: number;
  sizes?: { file?: number };
}

interface ViewRow<TKey> {
  key: TKey;
  value: number;
}

interface ViewResponse<TKey> {
  rows: Array<ViewRow<TKey>>;
}

interface PdbDoc {
  _id: string;
  _rev: string;
  title: string;
  year?: number;
  experiment?: string;
  nbResidues: number;
  nbChains: number;
  nbModifiedResidues: number;
  helices: Array<{ chain: string; from: number; to: number; kind: number }>;
  sheets: Array<{ chain: string; from: number; to: number }>;
  formula: Array<{
    label: string;
    mf: string;
    mw: string;
    number: number;
    name?: string;
  }>;
  chain: Record<string, { nbResidues: number; molecule?: string }>;
}

interface PdbViewResponse {
  total_rows: number;
  offset: number;
  rows: Array<{ id: string; key: null; value: null; doc: PdbDoc }>;
}

export const pdbInfo: DatabaseInfo = {
  doc_count: 224517,
  sizes: { file: 287_309_500_416 },
};

export const assemblyInfo: DatabaseInfo = {
  doc_count: 224517,
  sizes: { file: 12_500_000_000 },
};

export const byYear: ViewResponse<number> = {
  rows: [
    { key: 1976, value: 1 },
    { key: 2000, value: 2543 },
    { key: 2010, value: 8210 },
    { key: 2020, value: 13987 },
    { key: 2024, value: 15123 },
  ],
};

export const byExperiment: ViewResponse<string> = {
  rows: [
    { key: 'X-RAY DIFFRACTION', value: 180000 },
    { key: 'SOLUTION NMR', value: 14000 },
    { key: 'ELECTRON MICROSCOPY', value: 25000 },
  ],
};

const sampleDoc: PdbDoc = {
  _id: '1O8O',
  _rev: '1-abc',
  title: 'Sample structure for tests',
  year: 2003,
  experiment: 'X-RAY DIFFRACTION',
  nbResidues: 501,
  nbChains: 3,
  nbModifiedResidues: 0,
  helices: [{ chain: 'A', from: 10, to: 25, kind: 1 }],
  sheets: [{ chain: 'A', from: 40, to: 48 }],
  formula: [
    { label: 'HEM', mf: 'C34H32FeN4O4', mw: '616.5', number: 2, name: 'Heme' },
  ],
  chain: { A: { nbResidues: 167, molecule: 'Sample protein' } },
};

const otherDoc: PdbDoc = {
  ...sampleDoc,
  _id: '3QK2',
  _rev: '1-def',
  title: 'Another lactamase structure',
  year: 2011,
  nbResidues: 320,
  nbChains: 2,
  chain: { A: { nbResidues: 160, molecule: 'Beta-lactamase' } },
};

export const jsmolList: PdbViewResponse = {
  total_rows: 2,
  offset: 0,
  rows: [
    { id: sampleDoc._id, key: null, value: null, doc: sampleDoc },
    { id: otherDoc._id, key: null, value: null, doc: otherDoc },
  ],
};

const samplePdbText = `HEADER    SAMPLE STRUCTURE
TITLE     SAMPLE STRUCTURE FOR TESTS
COMPND    MOL_ID: 1;
SOURCE    MOL_ID: 1;
END
`;

function fulfillJson(route: Route, body: unknown) {
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/**
 * Install all API mocks the frontend relies on so e2e tests do not need a real
 * backend. Call once at the start of each test (or via a beforeEach hook)
 * before navigating with `page.goto`.
 * @param page - Playwright page instance for the test.
 */
export async function mockApi(page: Page): Promise<void> {
  await page.route(/\/pdb\/?$/, (route) => fulfillJson(route, pdbInfo));
  await page.route(/\/assembly\/?$/, (route) => fulfillJson(route, assemblyInfo));
  await page.route(/\/stats\/byYear/, (route) => fulfillJson(route, byYear));
  await page.route(/\/stats\/byExperiment/, (route) =>
    fulfillJson(route, byExperiment),
  );
  await page.route(/\/view\/jsmol/, (route) => fulfillJson(route, jsmolList));
  await page.route(/\/pdb\/[^/]+\/[^/]+\.pdb$/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/plain',
      body: samplePdbText,
    }),
  );
  await page.route(/\/v1\/ligands/, (route) =>
    fulfillJson(route, ligandSearchResponse),
  );
}

const ligandSearchResponse = {
  ligands: [
    {
      code: 'ATP',
      name: 'ADENOSINE TRIPHOSPHATE',
      mf: 'C10H16N5O13P3',
      mw: 507.18,
      idCode: 'gFp@DiTt@@@', // benzene placeholder, valid OCL idcode
      coordinates: '!B@k\\Bb@C~@OxBb@',
      nbPdbs: 1842,
    },
    {
      code: 'HEM',
      name: 'PROTOPORPHYRIN IX CONTAINING FE',
      mf: 'C34H32FeN4O4',
      mw: 616.49,
      idCode: 'gFp@DiTt@@@',
      coordinates: '!B@k\\Bb@C~@OxBb@',
      nbPdbs: 967,
    },
  ],
  stats: {
    screened: 2,
    verified: 2,
    screeningMs: 1,
    verificationMs: 1,
    overLimit: false,
  },
};
