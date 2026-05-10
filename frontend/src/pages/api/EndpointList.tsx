import { Button, ButtonGroup } from '@blueprintjs/core';
import { useState } from 'react';

import EndpointPreview from './EndpointPreview.tsx';
import { endpoints } from './endpoints.tsx';

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
              <ButtonGroup className="endpoint-actions">
                <Button
                  size="small"
                  icon={isCopied ? 'tick' : 'duplicate'}
                  onClick={() => {
                    void handleCopy(endpoint.example);
                  }}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  size="small"
                  icon={isOpen ? 'chevron-up' : 'play'}
                  onClick={() =>
                    setOpenExample(isOpen ? null : endpoint.example)
                  }
                >
                  {isOpen ? 'Hide' : 'Test'}
                </Button>
              </ButtonGroup>
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
