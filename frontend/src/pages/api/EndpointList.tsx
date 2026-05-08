import type { ReactNode } from 'react';
import { useState } from 'react';

import EndpointPreview from './EndpointPreview.tsx';

interface Endpoint {
  method: 'GET';
  path: string;
  description: ReactNode;
  example: string;
}

const endpoints: Endpoint[] = [
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

/**
 * Render the API endpoint reference list with inline copy and test controls.
 * @returns List of endpoint cards.
 */
export default function EndpointList() {
  const [openExample, setOpenExample] = useState<string | null>(null);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  async function handleCopy(example: string) {
    try {
      await navigator.clipboard.writeText(toAbsoluteUrl(example));
      setCopiedExample(example);
      setTimeout(() => {
        setCopiedExample((current) => (current === example ? null : current));
      }, 1500);
    } catch {
      // Clipboard API can be blocked (insecure context, permission denied);
      // fail silently rather than surfacing a noisy error.
    }
  }

  return (
    <div>
      {endpoints.map((endpoint) => {
        const isOpen = openExample === endpoint.example;
        const isCopied = copiedExample === endpoint.example;
        return (
          <div key={endpoint.path} className="endpoint">
            <code className="path">
              {endpoint.method} {endpoint.path}
            </code>
            <p>{endpoint.description}</p>
            <div className="endpoint-row">
              <a className="example" href={endpoint.example}>
                {endpoint.example}
              </a>
              <div className="endpoint-actions">
                <button
                  type="button"
                  className="endpoint-button"
                  onClick={() => {
                    void handleCopy(endpoint.example);
                  }}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  type="button"
                  className="endpoint-button"
                  onClick={() =>
                    setOpenExample(isOpen ? null : endpoint.example)
                  }
                >
                  {isOpen ? 'Hide' : 'Test'}
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="endpoint-preview">
                <EndpointPreview
                  key={endpoint.example}
                  url={endpoint.example}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Resolve a relative API path to an absolute URL based on the current origin,
 * so the value placed on the clipboard is directly usable from any tool.
 * @param path - Relative API path.
 * @returns Absolute URL string.
 */
function toAbsoluteUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  return new URL(path, window.location.origin).toString();
}
