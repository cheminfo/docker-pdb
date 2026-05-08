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
 * Run an async task once on mount and expose its lifecycle as a
 * discriminated union. The task reference is captured by `useEffect`'s
 * dependency array, so callers should pass a stable function (e.g. defined at
 * module scope) to avoid re-running on every render.
 * @param task - Async function to run on mount.
 * @returns Current state of the async task: loading, success, or error.
 */
export function useAsync<TData>(task: () => Promise<TData>): AsyncState<TData> {
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
          setState({
            status: 'error',
            data: undefined,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [task]);

  return state;
}
