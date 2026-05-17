import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Poll a background-job status endpoint while the job is running.
 * Starts an immediate fetch on `startPolling()`, then re-polls every
 * `intervalMs` until the response has `state.running === false` (or until
 * `stopPolling()` is called). Cleans up the timer on unmount.
 * @param fetchStatus - Async function that returns `{ state: T | null }`.
 * @param intervalMs - Re-poll interval in milliseconds while the job is running.
 * @returns `{ state, startPolling, stopPolling }` — current job state and
 *   controls to start / cancel polling.
 */
export function useJobPoller<T extends { running: boolean }>(
  fetchStatus: () => Promise<{ state: T | null }>,
  intervalMs: number,
): { state: T | null; startPolling: () => void; stopPolling: () => void } {
  const [state, setState] = useState<T | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    const tick = () => {
      fetchStatus().then(
        ({ state: nextState }) => {
          setState(nextState);
          if (nextState?.running) {
            timer.current = setTimeout(tick, intervalMs);
          }
        },
        () => {
          timer.current = setTimeout(tick, intervalMs);
        },
      );
    };
    tick();
  }, [fetchStatus, intervalMs, stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  return { state, startPolling, stopPolling };
}
