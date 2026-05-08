import type { ResidueDihedrals } from './ramachandran.ts';

/** Active Ramachandran overlay. `null` when nothing is currently shown. */
export interface RamachandranEntry {
  residues: ResidueDihedrals[];
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  highlight: Set<string>;
}

interface RamachandranOverlayProps {
  entry: RamachandranEntry | null;
}

const PANEL = 200;
const PADDING = 30;
const GAP = 18;
const TITLE_HEIGHT = 22;

const CIS_THRESHOLD = 30;
const TRANS_THRESHOLD = 150;
const COLOR_TRANS = '#2e7d32';
const COLOR_CIS = '#c62828';
const COLOR_OTHER = '#9e9e9e';
const COLOR_HIGHLIGHT = '#1d4ed8';

/**
 * SVG overlay rendered on top of the Mol* canvas. Shows the standard
 * Ramachandran (φ × ψ) plus an ω plot rotated 90° about the y-axis (so ω
 * runs vertically against residue index) — the latter makes cis vs trans
 * peptide bonds immediately visible.
 * @param props - Component props.
 * @param props.entry - Active overlay entry, or `null` to render nothing.
 * @returns SVG overlay, or `null` when there is nothing to display.
 */
export default function RamachandranOverlay(props: RamachandranOverlayProps) {
  const { entry } = props;
  if (!entry) return null;

  const width = PADDING * 2 + PANEL * 2 + GAP;
  const height = PADDING * 2 + PANEL + TITLE_HEIGHT;
  const left = PADDING;
  const right = PADDING + PANEL + GAP;
  const top = PADDING + TITLE_HEIGHT - 4;

  const xToCoord = (deg: number) => ((deg + 180) / 360) * PANEL;
  const yToCoord = (deg: number) => PANEL - ((deg + 180) / 360) * PANEL;
  const indexToCoord = (index: number, total: number) =>
    total <= 1 ? PANEL / 2 : (index / (total - 1)) * PANEL;

  return (
    <div className={`ramachandran-overlay ramachandran-${entry.position}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width={width}
          height={height}
          fill="rgba(255,255,255,0.9)"
          rx={6}
        />
        <PanelFrame
          x={left}
          y={top}
          title="Ramachandran (φ × ψ)"
          xLabel="φ"
          yLabel="ψ"
        />
        {entry.residues.map((residue) => {
          if (residue.phi === null || residue.psi === null) return null;
          const highlighted = isHighlighted(residue, entry.highlight);
          return (
            <circle
              key={`rama-${residue.chainId}-${residue.resNum}-${residue.iCode}`}
              cx={left + xToCoord(residue.phi)}
              cy={top + yToCoord(residue.psi)}
              r={highlighted ? 3.2 : 1.8}
              fill={highlighted ? COLOR_HIGHLIGHT : dotColor(residue.omega)}
              fillOpacity={highlighted ? 1 : 0.85}
              stroke={highlighted ? 'white' : 'none'}
              strokeWidth={highlighted ? 0.8 : 0}
            />
          );
        })}
        <PanelFrame
          x={right}
          y={top}
          title="ω (cis / trans)"
          xLabel="residue index"
          yLabel="ω"
          yTickLabels={['180', '0', '-180']}
          xTickLabels={['1', `${entry.residues.length}`]}
        />
        <line
          x1={right}
          y1={top + yToCoord(180)}
          x2={right + PANEL}
          y2={top + yToCoord(180)}
          stroke={COLOR_TRANS}
          strokeWidth={0.4}
          strokeDasharray="3 3"
        />
        <line
          x1={right}
          y1={top + yToCoord(-180)}
          x2={right + PANEL}
          y2={top + yToCoord(-180)}
          stroke={COLOR_TRANS}
          strokeWidth={0.4}
          strokeDasharray="3 3"
        />
        <line
          x1={right}
          y1={top + yToCoord(0)}
          x2={right + PANEL}
          y2={top + yToCoord(0)}
          stroke={COLOR_CIS}
          strokeWidth={0.4}
          strokeDasharray="3 3"
        />
        {entry.residues.map((residue, index) => {
          if (residue.omega === null) return null;
          const highlighted = isHighlighted(residue, entry.highlight);
          return (
            <circle
              key={`om-${residue.chainId}-${residue.resNum}-${residue.iCode}`}
              cx={right + indexToCoord(index, entry.residues.length)}
              cy={top + yToCoord(residue.omega)}
              r={highlighted ? 3.2 : 1.8}
              fill={highlighted ? COLOR_HIGHLIGHT : dotColor(residue.omega)}
              fillOpacity={highlighted ? 1 : 0.85}
              stroke={highlighted ? 'white' : 'none'}
              strokeWidth={highlighted ? 0.8 : 0}
            />
          );
        })}
        <Legend x={left} y={height - 10} />
      </svg>
    </div>
  );
}

function dotColor(omega: number | null): string {
  if (omega === null) return COLOR_OTHER;
  if (Math.abs(omega) > TRANS_THRESHOLD) return COLOR_TRANS;
  if (Math.abs(omega) < CIS_THRESHOLD) return COLOR_CIS;
  return COLOR_OTHER;
}

function isHighlighted(
  residue: ResidueDihedrals,
  highlight: Set<string>,
): boolean {
  if (highlight.size === 0) return false;
  return highlight.has(`${residue.resNum}:${residue.chainId}`);
}

interface PanelFrameProps {
  x: number;
  y: number;
  title: string;
  xLabel: string;
  yLabel: string;
  xTickLabels?: [string, string];
  yTickLabels?: [string, string, string];
}

function PanelFrame(props: PanelFrameProps) {
  const {
    x,
    y,
    title,
    xLabel,
    yLabel,
    xTickLabels = ['-180', '180'],
    yTickLabels = ['180', '0', '-180'],
  } = props;
  return (
    <g>
      <text x={x} y={y - 8} fontSize={11} fontWeight={600} fill="#222">
        {title}
      </text>
      <rect
        x={x}
        y={y}
        width={PANEL}
        height={PANEL}
        fill="white"
        stroke="#888"
        strokeWidth={0.7}
      />
      <line
        x1={x + PANEL / 2}
        y1={y}
        x2={x + PANEL / 2}
        y2={y + PANEL}
        stroke="#ccc"
        strokeWidth={0.5}
        strokeDasharray="2 2"
      />
      <line
        x1={x}
        y1={y + PANEL / 2}
        x2={x + PANEL}
        y2={y + PANEL / 2}
        stroke="#ccc"
        strokeWidth={0.5}
        strokeDasharray="2 2"
      />
      <text
        x={x + PANEL / 2}
        y={y + PANEL + 18}
        fontSize={10}
        textAnchor="middle"
        fill="#444"
      >
        {xLabel}
      </text>
      <text
        x={x - 18}
        y={y + PANEL / 2 + 3}
        fontSize={10}
        textAnchor="end"
        fill="#444"
      >
        {yLabel}
      </text>
      <text
        x={x}
        y={y + PANEL + 10}
        fontSize={9}
        textAnchor="middle"
        fill="#666"
      >
        {xTickLabels[0]}
      </text>
      <text
        x={x + PANEL}
        y={y + PANEL + 10}
        fontSize={9}
        textAnchor="middle"
        fill="#666"
      >
        {xTickLabels[1]}
      </text>
      <text x={x - 4} y={y + 4} fontSize={9} textAnchor="end" fill="#666">
        {yTickLabels[0]}
      </text>
      <text
        x={x - 4}
        y={y + PANEL / 2 + 3}
        fontSize={9}
        textAnchor="end"
        fill="#666"
      >
        {yTickLabels[1]}
      </text>
      <text x={x - 4} y={y + PANEL} fontSize={9} textAnchor="end" fill="#666">
        {yTickLabels[2]}
      </text>
    </g>
  );
}

function Legend({ x, y }: { x: number; y: number }) {
  return (
    <g fontSize={9} fill="#444">
      <circle cx={x + 4} cy={y - 3} r={2.4} fill={COLOR_TRANS} />
      <text x={x + 12} y={y}>
        trans
      </text>
      <circle cx={x + 50} cy={y - 3} r={2.4} fill={COLOR_CIS} />
      <text x={x + 58} y={y}>
        cis
      </text>
      <circle cx={x + 86} cy={y - 3} r={2.4} fill={COLOR_HIGHLIGHT} />
      <text x={x + 94} y={y}>
        highlight
      </text>
    </g>
  );
}
