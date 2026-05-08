export type RepresentationName =
  | 'auto'
  | 'polymer-cartoon'
  | 'molecular-surface'
  | 'atomic-detail'
  | 'illustrative';

export type ColorName =
  | 'chain-id'
  | 'element-symbol'
  | 'hydrophobicity'
  | 'residue-name'
  | 'secondary-structure'
  | 'sequence-id'
  | 'uniform';

export type BackgroundName = 'white' | 'black' | 'gray' | 'navy' | 'cream';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const REPRESENTATION_OPTIONS: Array<SelectOption<RepresentationName>> = [
  { value: 'auto', label: 'Auto' },
  { value: 'polymer-cartoon', label: 'Cartoon' },
  { value: 'molecular-surface', label: 'Surface' },
  { value: 'atomic-detail', label: 'Ball-and-stick' },
  { value: 'illustrative', label: 'Illustrative' },
];

export const COLOR_OPTIONS: Array<SelectOption<ColorName>> = [
  { value: 'chain-id', label: 'By chain' },
  { value: 'element-symbol', label: 'By element' },
  { value: 'hydrophobicity', label: 'Hydrophobicity' },
  { value: 'residue-name', label: 'By residue' },
  { value: 'secondary-structure', label: 'Secondary structure' },
  { value: 'sequence-id', label: 'Rainbow (sequence)' },
  { value: 'uniform', label: 'Uniform' },
];

export const BACKGROUND_OPTIONS: Array<SelectOption<BackgroundName>> = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'gray', label: 'Gray' },
  { value: 'navy', label: 'Navy' },
  { value: 'cream', label: 'Cream' },
];

export const BACKGROUND_HEX: Record<BackgroundName, number> = {
  white: 0xffffff,
  black: 0x000000,
  gray: 0x222222,
  navy: 0x0b1a3a,
  cream: 0xfaf6ec,
};

export const DEFAULT_REPRESENTATION: RepresentationName = 'auto';
export const DEFAULT_COLOR: ColorName = 'chain-id';
export const DEFAULT_BACKGROUND: BackgroundName = 'white';
