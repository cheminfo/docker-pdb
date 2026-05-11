import type { ShapePrimitiveSpec } from './helpers.ts';

/**
 * Resolved internal form of {@link ShapePrimitiveSpec} — script-friendly
 * defaults (CSS color → hex, default radii) are baked in so the lazy-loaded
 * Mol* shape module can render the primitive verbatim.
 */
export interface ResolvedShapePrimitive {
  kind: 'cylinder' | 'arrow' | 'sphere' | 'text';
  from?: readonly [number, number, number];
  to?: readonly [number, number, number];
  center?: readonly [number, number, number];
  position?: readonly [number, number, number];
  text?: string;
  size?: number;
  bold?: boolean;
  italic?: boolean;
  radius?: number;
  colorHex: number;
  label?: string;
  headLength?: number;
  headRadius?: number;
}

const SHAPE_DEFAULT_RADIUS = 0.4;
const SHAPE_DEFAULT_COLOR_HEX = 0x88_88_88;

/**
 * Normalize a script-supplied shape spec into the verbatim primitive the
 * lazy-loaded Mol* shape module expects. Resolves CSS colors to hex and
 * applies default radii.
 * @param spec - Script-supplied primitive.
 * @param colorModule - Lazy-imported Mol* color module (unused at this layer
 *   but kept in the signature for future alpha/blending support).
 * @param colorModule.Color
 * @returns Resolved primitive ready for the shape renderer.
 */
export function resolveShapePrimitive(
  spec: ShapePrimitiveSpec,
  colorModule: { Color: (hex: number) => unknown },
): ResolvedShapePrimitive {
  const colorHex =
    spec.color === undefined
      ? SHAPE_DEFAULT_COLOR_HEX
      : (parseCssColorToHex(spec.color) ?? SHAPE_DEFAULT_COLOR_HEX);
  void colorModule;
  if (spec.kind === 'text') {
    return {
      kind: 'text',
      position: spec.position,
      text: spec.text,
      size: spec.size,
      bold: spec.bold,
      italic: spec.italic,
      colorHex,
      label: spec.label,
    };
  }
  const radius = spec.radius ?? SHAPE_DEFAULT_RADIUS;
  if (spec.kind === 'sphere') {
    return {
      kind: 'sphere',
      center: spec.center,
      radius,
      colorHex,
      label: spec.label,
    };
  }
  if (spec.kind === 'arrow') {
    return {
      kind: 'arrow',
      from: spec.from,
      to: spec.to,
      radius,
      colorHex,
      label: spec.label,
      headLength: spec.headLength,
      headRadius: spec.headRadius,
    };
  }
  return {
    kind: 'cylinder',
    from: spec.from,
    to: spec.to,
    radius,
    colorHex,
    label: spec.label,
  };
}

/**
 * Parse a CSS color string into a 24-bit RGB integer. Recognises `#rgb` and
 * `#rrggbb` directly; falls back to a hidden DOM probe + `getComputedStyle`
 * for named colors when a `document` is available.
 * @param name - CSS color string.
 * @returns 24-bit RGB integer, or `null` if the color cannot be resolved.
 */
function parseCssColorToHex(name: string): number | null {
  const trimmed = name.trim();
  // eslint-disable-next-line prefer-named-capture-group -- short hex match
  const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
  if (hexMatch) {
    const value = hexMatch[1];
    if (value === undefined) return null;
    if (value.length === 3) {
      const r = Number.parseInt(`${value[0]}${value[0]}`, 16);
      const g = Number.parseInt(`${value[1]}${value[1]}`, 16);
      const b = Number.parseInt(`${value[2]}${value[2]}`, 16);
      return (r << 16) | (g << 8) | b;
    }
    return Number.parseInt(value, 16);
  }
  if (typeof document === 'undefined') return null;
  const probe = document.createElement('div');
  probe.style.color = trimmed;
  document.body.append(probe);
  const computed = globalThis.getComputedStyle(probe).color;
  probe.remove();
  // eslint-disable-next-line prefer-named-capture-group -- 3-channel rgb match
  const rgbMatch = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(computed);
  if (!rgbMatch) return null;
  const r = Number.parseInt(rgbMatch[1] ?? '0', 10);
  const g = Number.parseInt(rgbMatch[2] ?? '0', 10);
  const b = Number.parseInt(rgbMatch[3] ?? '0', 10);
  return (r << 16) | (g << 8) | b;
}
