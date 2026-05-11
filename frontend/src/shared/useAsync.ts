import { useEffect, useState } from 'react';

/** Discriminated union representing the lifecycle of an async value. */
export type AsyncState<TData> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: TData; error: undefined }
  | { status: 'error'; data: undefined; error: Error };

const initialState: AsyncState<never> = {
  status: 'loading',
  data: undefined,
  error: undefined,
};

/**
 * Run an async task on mount and expose its lifecycle as a discriminated
 * union. Pass `refreshKey` to trigger a refetch on demand (e.g. while a
 * background sync is mutating the data): each new value re-runs `task`
 * without flipping the state back to `loading`, so existing data stays
 * on screen until the refetch resolves (stale-while-revalidate). If the
 * refetch fails after a previous success, the cached data is preserved
 * rather than being replaced by an error placeholder.
 *
 * The task reference is captured by `useEffect`'s dependency array, so
 * callers should pass a stable function (e.g. defined at module scope) to
 * avoid re-running on every render.
 * @param task - Async function to run.
 * @param refreshKey - Optional sentinel; changing it re-runs `task`. The
 *   value itself is unused — only equality with the previous render matters.
 * @returns Current state of the async task: loading, success, or error.
 */
export function useAsync<TData>(
  task: () => Promise<TData>,
  refreshKey?: unknown,
): AsyncState<TData> {
  const [state, setState] = useState<AsyncState<TData>>(initialState);

  useEffect(() => {
    let cancelled = false;
    task().then(
      (data) => {
        if (!cancelled) {
          setState({ status: 'success', data, error: undefined });
        }
      },
      (error: unknown) => {
        if (!cancelled) {
          const wrapped =
            error instanceof Error ? error : new Error(String(error));
          setState((prev) =>
            prev.status === 'success'
              ? prev
              : { status: 'error', data: undefined, error: wrapped },
          );
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [task, refreshKey]);

  return state;
}
