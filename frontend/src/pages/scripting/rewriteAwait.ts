/**
 * Source-to-source rewrite that lets students write the Scripting API without
 * `await`. The runner parses the script, finds every call to a method (or
 * global) that returns a `Promise`, and inserts `await ` in front of each
 * one. The transform is idempotent — calls already preceded by `await` are
 * left alone, so `await delay(2)` keeps working for users who type it.
 *
 * The set of "should-be-awaited" callees is an explicit allowlist (see
 * `ASYNC_METHOD_NAMES` and `ASYNC_GLOBAL_NAMES`). When `MolStar.ts` adds a
 * new `Promise`-returning method, add its name here too.
 *
 * Calls inside non-async function/arrow bodies are left alone — auto-
 * inserting `await` there would be a syntax error, and the linear scripts
 * the editor is designed for never need that nesting.
 */
import type { CallExpression, Node } from 'acorn';
import { parse } from 'acorn';
import { ancestor } from 'acorn-walk';

const ASYNC_METHOD_NAMES = new Set<string>([
  'clear',
  'color',
  'contactsWith',
  'createModel',
  'diameter',
  'distance',
  'dots',
  'focus',
  'hideDefaults',
  'label',
  'radius',
  'resetCamera',
  'rotate',
  'selectionHalos',
  'showDefaults',
  'spin',
  'switchModel',
  'zoom',
]);

const ASYNC_GLOBAL_NAMES = new Set<string>(['delay']);

/**
 * Insert `await` before every call to a known async API method/global in
 * `source`. Returns the original source unchanged if it cannot be parsed —
 * the runner will then surface the syntax error from the real evaluation.
 * @param source - User-typed script.
 * @returns Rewritten script, ready to be wrapped in `new AsyncFunction(...)`.
 */
export function rewriteAwait(source: string): string {
  let ast: Node;
  try {
    ast = parse(source, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
    });
  } catch {
    return source;
  }

  const positionSet = new Set<number>();
  ancestor(ast, {
    CallExpression(node, _state, ancestors) {
      if (shouldAwait(node, ancestors)) positionSet.add(node.start);
    },
  });
  if (positionSet.size === 0) return source;

  // Dedupe by source position so a chain like
  // `cys.bonds.diameter(0.4).color({...})` — whose inner and outer calls
  // share the same start offset (the leftmost identifier of the chain) —
  // gets a single `await` rather than `await await …`.
  const positions = [...positionSet].toSorted((a, b) => b - a);
  let output = source;
  for (const position of positions) {
    output = `${output.slice(0, position)}await ${output.slice(position)}`;
  }
  return output;
}

function shouldAwait(
  node: CallExpression,
  ancestors: readonly Node[],
): boolean {
  const parent = ancestors.at(-2);
  if (parent?.type === 'AwaitExpression') return false;

  for (let index = ancestors.length - 2; index >= 0; index--) {
    const candidate = ancestors[index];
    if (!candidate) continue;
    if (
      [
        'FunctionExpression',
        'FunctionDeclaration',
        'ArrowFunctionExpression',
      ].includes(candidate.type)
    ) {
      if (!('async' in candidate && candidate.async)) return false;
      break;
    }
  }

  if (node.callee.type === 'Identifier') {
    return ASYNC_GLOBAL_NAMES.has(node.callee.name);
  }
  if (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.property.type === 'Identifier'
  ) {
    return ASYNC_METHOD_NAMES.has(node.callee.property.name);
  }
  return false;
}
