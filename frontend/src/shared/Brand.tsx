/** The three nodes of the mark, in the 32×32 box. */
const NODES = [
  { cx: 9.2, cy: 12.4, ligand: false },
  { cx: 22, cy: 15.4, ligand: false },
  { cx: 15.6, cy: 23, ligand: true },
] as const;

export interface BrandMarkProps {
  /**
   * Edge of the square the mark is drawn in, in pixels.
   * @default 26
   */
  size?: number;
}

/**
 * The mark: three residues joined into a site, with the one that binds set in
 * the second brand colour. It is the geometry `react-cheminfo` draws for this
 * site in the ecosystem menu, and the geometry `public/favicon.svg` and
 * `public/logo.svg` repeat with literal colours, because a file served on its
 * own cannot read the page's custom properties.
 * @param props - The mark size.
 * @param props.size - Edge of the square the mark is drawn in, in pixels.
 * @returns The mark, as an inline SVG.
 */
export function BrandMark(props: BrandMarkProps) {
  const { size = 26 } = props;

  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="7" fill="var(--brand)" />
      <path
        d="M9.2 12.4 22 15.4 15.6 23Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.85"
      />
      {NODES.map((node) => (
        <circle
          key={`${node.cx},${node.cy}`}
          cx={node.cx}
          cy={node.cy}
          r="3.1"
          fill={node.ligand ? 'var(--brand-alt)' : '#ffffff'}
        />
      ))}
    </svg>
  );
}

export interface WordmarkProps {
  /**
   * Extra class names, for sizing or spacing at the place it is used.
   * @default undefined
   */
  className?: string;
}

/**
 * The name, in the two colours this site owns. The address is the name here,
 * so it stays lowercase and the `.org` is never written.
 *
 * The mark's amber sits at 1.7:1 on white, far short of what text needs, so
 * the second half is set in a darkened one of the same hue.
 * @param props - The wordmark options.
 * @param props.className - Extra class names, for sizing or spacing.
 * @returns The site name, in its two colours.
 */
export function Wordmark(props: WordmarkProps) {
  const { className } = props;

  return (
    <span className={className ? `wordmark ${className}` : 'wordmark'}>
      <span className="wordmark__lead">pdb</span>
      <span className="wordmark__dot">.</span>
      <span className="wordmark__alt">cheminfo</span>
    </span>
  );
}
