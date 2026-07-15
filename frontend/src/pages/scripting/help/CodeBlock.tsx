import { Button } from '@blueprintjs/core';
import { useEffect, useMemo, useState } from 'react';

import { highlightCode } from './highlight.ts';

/**
 * A syntax-coloured code sample with a copy button. Every example in the help
 * is meant to be pasted into the editor and run, so copying is the primary
 * action rather than an afterthought.
 */

interface CodeBlockProps {
  /** The code to display. */
  children: string;
}

/**
 * Render a copyable code sample.
 * @param props - Component props.
 * @param props.children - The code to display.
 * @returns Code block element.
 */
export default function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => highlightCode(children), [children]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  function handleCopy() {
    navigator.clipboard.writeText(children).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  }

  return (
    <div className="help-code">
      <pre>
        {tokens.map((token, index) => (
          // Tokens are positional and the list is static per sample, so the
          // index is a stable key here.
          // eslint-disable-next-line react/no-array-index-key -- positional tokens
          <span key={index} className={`tok-${token.kind}`}>
            {token.value}
          </span>
        ))}
      </pre>
      <Button
        className="help-code-copy"
        icon={copied ? 'tick' : 'duplicate'}
        variant="minimal"
        size="small"
        onClick={handleCopy}
        aria-label="Copy code"
        title="Copy to clipboard"
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}
