import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const EXTENSIONS = [javascript({ jsx: false, typescript: false })];

/**
 * CodeMirror-based JavaScript editor used on the Animate page. Wraps the
 * `@uiw/react-codemirror` component with the JavaScript language extension
 * and a fixed monospace size so every scene editor looks identical.
 * @param props - Component props.
 * @param props.value - Current script source.
 * @param props.onChange - Called with the new source on every keystroke.
 * @param props.height - CSS height for the editor frame (default `260px`).
 * @returns The editor element.
 */
export default function Editor({
  value,
  onChange,
  height = '260px',
}: EditorProps) {
  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={EXTENSIONS}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        bracketMatching: true,
        autocompletion: false,
        foldGutter: true,
      }}
      onChange={onChange}
    />
  );
}
