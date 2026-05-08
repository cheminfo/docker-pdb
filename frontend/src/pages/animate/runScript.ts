import type { ScriptApi } from './helpers.ts';

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

/**
 * Compile and execute a student-written script against the helper API.
 * The script body runs as the body of an async function whose only
 * parameter is `api`, so callers can write `await api.cpk(...)` directly.
 *
 * Errors thrown during compilation or execution are returned as
 * `{ error }` rather than thrown — the caller decides how to surface them.
 * @param api - The bound helper API.
 * @param body - User-typed script source.
 * @returns Resolved promise with `{ error }` if the script failed; `{}` on success.
 */
export async function runScript(
  api: ScriptApi,
  body: string,
): Promise<{ error?: Error }> {
  let scriptFunction: (api: ScriptApi) => Promise<void>;
  try {
    scriptFunction = new AsyncFunctionConstructor('api', body) as (
      api: ScriptApi,
    ) => Promise<void>;
  } catch (error) {
    return { error: toError(error) };
  }
  try {
    await api.clear();
    await scriptFunction(api);
    return {};
  } catch (error) {
    return { error: toError(error) };
  }
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(String(value));
}
