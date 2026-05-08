import { useEffect, useState } from 'react';

/**
 * Return a debounced echo of `value`. Updates lag behind by `delayMs` so
 * rapid edits (typing in a search box, dragging a slider) don't trigger a
 * downstream side effect on every keystroke.
 * @param value - Source value.
 * @param delayMs - How long to wait before mirroring the new value.
 * @returns The debounced value.
 */
export function useDebouncedValue<TValue>(
  value: TValue,
  delayMs: number,
): TValue {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}
