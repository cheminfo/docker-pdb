/**
 * Translate the script-facing `ColorSpec` into Mol* representation
 * parameters. We accept three shapes:
 *
 *   - a CSS color name or hex string  (e.g. 'limegreen', '#ff0080')
 *   - `{ by: 'chain' | 'element' | 'structure' | … }` for built-in themes
 *   - `{ color: ColorSpec, alpha: number }` for translucent variants
 */

/** Mol* built-in color theme names, exposed through a friendlier alias. */
export type ColorBy =
  | 'chain'
  | 'element'
  | 'structure'
  | 'residue'
  | 'sequence'
  | 'hydrophobicity'
  | 'secondary-structure'
  | 'molecule-type'
  | 'uniform';

const COLOR_BY_TO_THEME: Record<ColorBy, string> = {
  chain: 'chain-id',
  element: 'element-symbol',
  structure: 'secondary-structure',
  'secondary-structure': 'secondary-structure',
  residue: 'residue-name',
  sequence: 'sequence-id',
  hydrophobicity: 'hydrophobicity',
  'molecule-type': 'molecule-type',
  uniform: 'uniform',
};

/** Color expression accepted by the script-facing helpers. */
export type ColorSpec =
  | string
  | { by: ColorBy }
  | { color: string | { by: ColorBy }; alpha: number };

/** Mol* representation parameters derived from a `ColorSpec`. */
export interface ColorParams {
  type: string;
  color?: string;
  colorParams?: Record<string, unknown>;
  typeParams?: Record<string, unknown>;
}

/**
 * Normalize a `ColorSpec` into Mol* representation parameters.
 * @param representationType - Mol* representation type (e.g. `'cartoon'`).
 * @param spec - Caller-provided color specification, or `undefined` to use Mol* defaults.
 * @param colorModule - Mol*'s `mol-util/color/color` module (lazy-loaded by the caller).
 * @param colorModule.Color - Mol*'s `Color` constructor: `Color(hex) => Color` (the type is a branded integer).
 * @returns Normalized representation parameters.
 */
export function buildColorParams(
  representationType: string,
  spec: ColorSpec | undefined,
  colorModule: { Color: (hex: number) => unknown },
): ColorParams {
  const result: ColorParams = { type: representationType };

  if (!spec) return result;

  if (typeof spec === 'object' && 'color' in spec) {
    Object.assign(
      result,
      buildColorParams(representationType, spec.color, colorModule),
    );
    result.typeParams = { alpha: spec.alpha };
    return result;
  }

  if (typeof spec === 'object' && 'by' in spec) {
    result.color = COLOR_BY_TO_THEME[spec.by];
    return result;
  }

  const hex = parseCssColorToHex(spec);
  if (hex !== null) {
    result.color = 'uniform';
    // The Mol* color module exports `Color` as a function-style constructor;
    // the eslint `new-cap` rule trips on the uppercase name even though no
    // `new` is intended.
    // eslint-disable-next-line new-cap -- Mol* exports `Color` as a callable factory
    result.colorParams = { value: colorModule.Color(hex) };
  }
  return result;
}

/**
 * Parse a CSS color name or hex string into a 24-bit integer for Mol*'s
 * `Color.fromHex`. Returns `null` if the value is not recognized.
 * @param value - CSS color name or hex string.
 * @returns 24-bit integer, or `null` if unrecognized.
 */
export function parseCssColorToHex(value: string): number | null {
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith('#')) {
    const hex = normalized.slice(1);
    if (/^[0-9a-f]{6}$/.test(hex)) return Number.parseInt(hex, 16);
    const shortMatch = /^(?<r>[0-9a-f])(?<g>[0-9a-f])(?<b>[0-9a-f])$/.exec(hex);
    if (shortMatch?.groups) {
      const { r, g, b } = shortMatch.groups;
      return Number.parseInt(`${r}${r}${g}${g}${b}${b}`, 16);
    }
    return null;
  }
  return CSS_NAMED_COLORS[normalized] ?? null;
}

/**
 * Subset of CSS named colors needed by the JSmol-port scenes. Extended
 * lazily — every color used in a scene must appear here.
 */
const CSS_NAMED_COLORS: Record<string, number> = {
  black: 0x000000,
  white: 0xffffff,
  red: 0xff0000,
  green: 0x008000,
  blue: 0x0000ff,
  yellow: 0xffff00,
  cyan: 0x00ffff,
  magenta: 0xff00ff,
  orange: 0xffa500,
  purple: 0x800080,
  pink: 0xffc0cb,
  gray: 0x808080,
  grey: 0x808080,
  lightgray: 0xd3d3d3,
  lightgrey: 0xd3d3d3,
  limegreen: 0x32cd32,
  lime: 0x00ff00,
  navy: 0x000080,
  teal: 0x008080,
  brown: 0xa52a2a,
  gold: 0xffd700,
  salmon: 0xfa8072,
  skyblue: 0x87ceeb,
};
