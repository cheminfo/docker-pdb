import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { SCRIPT_API_DTS } from './scriptApiDts.ts';

let configured = false;

/**
 * Wire Monaco for the Animate page: install local workers (no CDN),
 * point `@monaco-editor/react` at the bundled `monaco-editor`, enable
 * JavaScript syntax + semantic diagnostics on the fly, and register
 * the script-facing globals (`text`, `delay`, `MolStar`) as an extra lib
 * so autocomplete and type checking know about them.
 *
 * Idempotent — safe to call from every Editor mount.
 */
export function configureMonaco(): void {
  if (configured) return;
  configured = true;

  globalThis.MonacoEnvironment = {
    getWorker(_workerId, label) {
      if (label === 'typescript' || label === 'javascript') {
        return new TsWorker();
      }
      return new EditorWorker();
    },
  };

  loader.config({ monaco });

  monaco.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.typescript.ScriptTarget.ES2020,
    module: monaco.typescript.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    strict: false,
    noLib: false,
  });

  monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    // 1375/1378: top-level `await` not allowed in a script.
    // 1108: `return` outside a function. The runtime wraps the body in an
    //       async function, so both forms are legal at runtime.
    diagnosticCodesToIgnore: [1108, 1375, 1378],
  });

  monaco.typescript.typescriptDefaults.addExtraLib(
    SCRIPT_API_DTS,
    'file:///scriptApi.d.ts',
  );
}
