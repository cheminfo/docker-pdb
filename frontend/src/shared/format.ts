const integerFormatter = new Intl.NumberFormat('en-US');

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/**
 * Format an integer with thousands separators.
 * @param value - Integer to format.
 * @returns The integer formatted with thousands separators (en-US locale).
 */
export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

/**
 * Format a byte count as a human-readable size.
 * Returns an en-dash when the value is missing or non-positive.
 * @param bytes - Raw byte count.
 * @returns Human-readable size with unit, or `–` when the input is missing.
 */
export function formatBytes(bytes: number | undefined): string {
  if (!Number.isFinite(bytes) || bytes === undefined || bytes <= 0) {
    return '–';
  }
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const decimals = value >= 100 ? 0 : 1;
  return `${value.toFixed(decimals)} ${BYTE_UNITS[unitIndex]}`;
}
