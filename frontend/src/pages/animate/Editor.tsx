import type { Monaco } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type { editor as monacoEditor } from 'monaco-editor';

import { configureMonaco } from './monacoSetup.ts';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  /**
   * CSS height for the editor frame. Pass `'100%'` (combined with the
   * `editor-fill` class on a sized parent) to make the editor stretch.
   * @default '260px'
   */
  height?: string;
}

configureMonaco();

/**
 * Monaco-based JavaScript editor used on the Animate page. Loads the
 * Monaco bundle locally (no CDN), wires the script-facing globals
 * (`text`, `delay`, `MolStar`) as an ambient `.d.ts`, and turns on the
 * full TypeScript Language Service so users get on-the-fly syntax and
 * type errors plus VSCode-quality autocomplete and hover docs.
 * @param props - Component props.
 * @param props.value - Current script source.
 * @param props.onChange - Called with the new source on every keystroke.
 * @param props.height - CSS height for the editor frame.
 * @returns The editor element.
 */
export default function Editor({
  value,
  onChange,
  height = '260px',
}: EditorProps) {
  return (
    <MonacoEditor
      value={value}
      defaultLanguage="typescript"
      defaultPath="file:///script.ts"
      height={height}
      theme="vs"
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        fontSize: 13,
        tabSize: 2,
        renderLineHighlight: 'line',
        fixedOverflowWidgets: true,
      }}
      onChange={(next) => onChange(next ?? '')}
      onMount={handleMount}
    />
  );
}

function handleMount(
  editor: monacoEditor.IStandaloneCodeEditor,
  monaco: Monaco,
) {
  // Monaco's default trigger-suggest binding on macOS is Cmd+I; bind the
  // physical Ctrl+Space too so users with the macOS Input Sources shortcut
  // disabled can use the same chord they'd use on Linux/Windows.
  // KeyMod.WinCtrl maps to the literal Ctrl key on macOS (CtrlCmd is Cmd).
  editor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.Space, () => {
    editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
  });
}
