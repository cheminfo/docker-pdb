import type { Page, Route } from '@playwright/test';

interface DatabaseInfoResponse {
  pdb: { doc_count?: number; sizes?: { file?: number } };
  assembly: { doc_count?: number; sizes?: { file?: number } };
}

interface ViewRow<TKey> {
  key: TKey;
  value: number;
}

interface ViewResponse<TKey> {
  rows: Array<ViewRow<TKey>>;
}

interface StatsValue {
  sum: number;
  count: number;
  min: number;
  max: number;
  sumsqr: number;
}

interface StatsResponse {
  rows: Array<{ key: null; value: StatsValue }>;
}

interface PdbDoc {
  _id: string;
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

interface FindResponse {
  docs: PdbDoc[];
}

interface SyncStatusResponse {
  rsync: {
    kind: 'rsync';
    label: string;
    intervalMs: number;
    running: null;
    triggerQueued: null;
    lastAsymUnit: null;
    lastBioAssembly: null;
  };
  ccd: {
    kind: 'ccd';
    label: string;
    intervalMs: number;
    running: null;
    triggerQueued: null;
    lastRefreshedAt: null;
    bytesOnDisk: null;
    lastRefresh: null;
  };
  kinds: Array<'rsync' | 'ccd'>;
}

export const databaseInfo: DatabaseInfoResponse = {
  pdb: {
    doc_count: 224517,
    sizes: { file: 287_309_500_416 },
  },
  assembly: {
    doc_count: 224517,
    sizes: { file: 12_500_000_000 },
  },
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
  rows: [{ key: 'X-RAY DIFFRACTION', value: 2 }],
};

export const syncStatus: SyncStatusResponse = {
  rsync: {
    kind: 'rsync',
    label: 'PDB rsync',
    intervalMs: 86_400_000,
    running: null,
    triggerQueued: null,
    lastAsymUnit: null,
    lastBioAssembly: null,
  },
  ccd: {
    kind: 'ccd',
    label: 'CCD refresh',
    intervalMs: 604_800_000,
    running: null,
    triggerQueued: null,
    lastRefreshedAt: null,
    bytesOnDisk: null,
    lastRefresh: null,
  },
  kinds: ['rsync', 'ccd'],
};

const sampleDoc: PdbDoc = {
  _id: '1O8O',
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

export const findResponse: FindResponse = {
  docs: [sampleDoc, otherDoc],
};

const emptyStatsValue: StatsValue = {
  sum: 0,
  count: 100,
  min: 1,
  max: 50,
  sumsqr: 0,
};
export const rangeStatsResponse: StatsResponse = {
  rows: [{ key: null, value: emptyStatsValue }],
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
  await page.route(/\/v1\/database\/info/, (route) =>
    fulfillJson(route, databaseInfo),
  );
  await page.route(/\/stats\/byYear/, (route) => fulfillJson(route, byYear));
  await page.route(/\/stats\/byExperiment/, (route) =>
    fulfillJson(route, byExperiment),
  );
  await page.route(
    /\/stats\/(helices|sheets|ligands|residues|year)Stats/,
    (route) => fulfillJson(route, rangeStatsResponse),
  );
  await page.route(/\/v1\/sync\/status/, (route) =>
    fulfillJson(route, syncStatus),
  );
  await page.route(/\/v1\/rsync-history/, (route) =>
    fulfillJson(route, { rows: [] }),
  );
  await page.route(/\/v1\/pdbs\/jsmol/, (route) =>
    fulfillJson(route, jsmolList),
  );
  await page.route(/\/v1\/pdbs\?/, async (route) => {
    const url = new URL(route.request().url());
    const q = url.searchParams.get('q') ?? '';
    const docs = q
      ? findResponse.docs.filter((doc) =>
          doc.title.toLowerCase().includes(q.toLowerCase()),
        )
      : findResponse.docs;
    await fulfillJson(route, { docs });
  });
  await page.route(/\/v1\/pdbs\/[^/]+\/raw$/, (route) =>
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
  total: 2,
  limit: 50,
  offset: 0,
  stats: {
    screened: 2,
    verified: 2,
    screeningMs: 1,
    verificationMs: 1,
    overLimit: false,
  },
};
