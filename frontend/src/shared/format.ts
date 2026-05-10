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

const decimalFormatters = new Map<number, Intl.NumberFormat>();

/**
 * Format a number with thousands separators and a fixed number of fractional
 * digits. Pass `decimals = 0` (or omit it) for plain integer formatting.
 * Backed by cached `Intl.NumberFormat` instances.
 * @param value - Number to format.
 * @param decimals - Number of fractional digits to display. Defaults to `0`.
 * @returns Locale-formatted string (en-US).
 */
export function formatNumber(value: number, decimals = 0): string {
  if (decimals === 0) return integerFormatter.format(value);
  let formatter = decimalFormatters.get(decimals);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    decimalFormatters.set(decimals, formatter);
  }
  return formatter.format(value);
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const relativeFormatter = new Intl.RelativeTimeFormat('en-US', {
  numeric: 'auto',
});

/**
 * Format an ISO timestamp as a short, locale-aware date+time, e.g.
 * `Apr 12, 2026, 14:23`. Returns an en-dash when the input is missing or
 * unparseable.
 * @param value - ISO timestamp.
 * @returns Formatted date+time, or `–`.
 */
export function formatDateTime(value: string | undefined): string {
  if (!value) return '–';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '–';
  return dateTimeFormatter.format(date);
}

/**
 * Format the gap between an ISO timestamp and now as a human-readable
 * relative phrase such as "5 hours ago" or "yesterday". Returns an empty
 * string when the input is missing or unparseable.
 * @param value - ISO timestamp.
 * @returns Relative phrase ("5 hours ago", "yesterday", "in 3 days", …).
 */
export function formatRelative(value: string | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = date.getTime() - Date.now();
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 365 * 24 * 3600 * 1000],
    ['month', 30 * 24 * 3600 * 1000],
    ['day', 24 * 3600 * 1000],
    ['hour', 3600 * 1000],
    ['minute', 60 * 1000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms) {
      return relativeFormatter.format(Math.round(diffMs / ms), unit);
    }
  }
  return relativeFormatter.format(Math.round(diffMs / 1000), 'second');
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
