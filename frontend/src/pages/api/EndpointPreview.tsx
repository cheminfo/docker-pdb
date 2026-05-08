import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { useEffect, useState } from 'react';

interface EndpointPreviewProps {
  url: string;
}

type LoadedPreview =
  | { kind: 'json'; text: string }
  | { kind: 'image'; objectUrl: string }
  | { kind: 'text'; text: string };

type PreviewState =
  | { status: 'loading' }
  | { status: 'ready'; data: LoadedPreview }
  | { status: 'error'; message: string };

/**
 * Fetch and render an inline preview of an API endpoint response.
 * JSON is pretty-printed with CodeMirror syntax highlighting, PNG bodies
 * render as an image, everything else falls back to a plain text block.
 * The parent should pass a stable `key={url}` so the component remounts
 * fresh when the URL changes, instead of resetting state in an effect.
 * @param props - Component props.
 * @param props.url - Relative URL to fetch (e.g. `/pdb/5ABY`).
 * @returns Preview React element.
 */
export default function EndpointPreview({ url }: EndpointPreviewProps) {
  const [state, setState] = useState<PreviewState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    let createdObjectUrl: string | null = null;

    async function load() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type') ?? '';
        let data: LoadedPreview;
        if (contentType.includes('application/json')) {
          const text = await response.text();
          data = { kind: 'json', text: prettyJson(text) };
        } else if (contentType.startsWith('image/')) {
          const blob = await response.blob();
          createdObjectUrl = URL.createObjectURL(blob);
          data = { kind: 'image', objectUrl: createdObjectUrl };
        } else {
          data = { kind: 'text', text: await response.text() };
        }
        if (!cancelled) setState({ status: 'ready', data });
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
      if (createdObjectUrl) URL.revokeObjectURL(createdObjectUrl);
    };
  }, [url]);

  if (state.status === 'loading') {
    return <div className="endpoint-preview-status">Loading…</div>;
  }
  if (state.status === 'error') {
    return (
      <div className="endpoint-preview-status endpoint-preview-error">
        {state.message}
      </div>
    );
  }
  const { data } = state;
  if (data.kind === 'json') {
    return (
      <CodeMirror
        className="endpoint-preview-code"
        value={data.text}
        extensions={[json()]}
        editable={false}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
        }}
      />
    );
  }
  if (data.kind === 'image') {
    return (
      <img className="endpoint-preview-image" src={data.objectUrl} alt={url} />
    );
  }
  return <pre className="endpoint-preview-text">{data.text}</pre>;
}

/**
 * Try to pretty-print a JSON string; return the original text if parsing fails.
 * @param text - Raw response body.
 * @returns Indented JSON, or the original input on parse failure.
 */
function prettyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}
