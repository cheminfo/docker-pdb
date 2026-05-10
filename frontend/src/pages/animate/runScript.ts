import type { Delay, MolStarConstructor } from './MolStar.ts';
import type { ScriptApi } from './helpers.ts';
import { rewriteAwait } from './rewriteAwait.ts';

// Reach for the AsyncFunction constructor without lint complaining about an
// empty arrow body. Native AsyncFunction is not in lib.dom.d.ts so we resolve
// it via the prototype of an async placeholder that has a real return.
async function asyncPlaceholder(): Promise<void> {
  return undefined;
}
const AsyncFunctionConstructor = Object.getPrototypeOf(asyncPlaceholder)
  .constructor as new (
  ...args: string[]
) => (...callArgs: unknown[]) => unknown;

type ScriptFunction = (
  text: string,
  MolStar: MolStarConstructor,
  delay: Delay,
) => Promise<void>;

/**
 * Bundle of values the runner needs to execute a script.
 */
export interface RunScriptParams {
  /** Internal renderer used to clear state before each run. */
  api: ScriptApi;
  /** Raw PDB text of the loaded structure, injected as `text`. */
  text: string;
  /** `MolStar` class injected as a script global. */
  MolStar: MolStarConstructor;
  /** `delay` injected as a script global. */
  delay: Delay;
  /** User-typed script source. */
  body: string;
}

/**
 * Compile and execute a student-written script. The script body runs as the
 * body of an async function with three parameters wired up as globals: `text`
 * (raw PDB text), `MolStar` (constructor class — `new MolStar()` returns the
 * viewer) and `delay` (`delay(2)` to pause).
 *
 * Before evaluation, `rewriteAwait` injects `await` in front of every call
 * to a `Promise`-returning method, so users write linear synchronous-looking
 * code. Errors thrown during compilation or execution are returned as
 * `{ error }` rather than thrown — the caller decides how to surface them.
 * @param params - Runner inputs.
 * @returns Resolved promise with `{ error }` if the script failed; `{}` on success.
 */
export async function runScript(
  params: RunScriptParams,
): Promise<{ error?: Error }> {
  let scriptFunction: ScriptFunction;
  try {
    scriptFunction = new AsyncFunctionConstructor(
      'text',
      'MolStar',
      'delay',
      rewriteAwait(params.body),
    ) as ScriptFunction;
  } catch (error) {
    return { error: toError(error) };
  }
  try {
    await params.api.clear();
    await scriptFunction(params.text, params.MolStar, params.delay);
    return {};
  } catch (error) {
    return { error: toError(error) };
  }
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(String(value));
}
