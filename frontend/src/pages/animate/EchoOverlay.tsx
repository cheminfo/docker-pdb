/** Single text overlay rendered on top of the Mol* canvas (`api.echo`). */
export interface EchoEntry {
  text: string;
  position: 'top' | 'middle' | 'bottom';
  size: number;
  bold: boolean;
  italic: boolean;
  color: string;
}

interface EchoOverlayProps {
  entry: EchoEntry | null;
}

/**
 * HTML overlay layer rendered on top of the Mol* canvas. Mol* has no
 * built-in `echo` text primitive, so the page draws the overlay itself
 * absolutely-positioned over the viewer container.
 * @param props - Component props.
 * @param props.entry - Active echo entry, or `null` to render nothing.
 * @returns Overlay element, or `null` when there is nothing to display.
 */
export default function EchoOverlay({ entry }: EchoOverlayProps) {
  if (!entry) return null;
  const verticalAnchor =
    entry.position === 'bottom'
      ? { bottom: '16px' }
      : entry.position === 'middle'
        ? { top: '50%', transform: 'translate(-50%, -50%)' }
        : { top: '16px' };
  const style = {
    position: 'absolute' as const,
    left: '50%',
    transform: entry.position === 'middle' ? undefined : 'translateX(-50%)',
    fontSize: `${entry.size}px`,
    fontWeight: entry.bold ? 700 : 400,
    fontStyle: entry.italic ? 'italic' : 'normal',
    color: entry.color,
    pointerEvents: 'none' as const,
    fontFamily: 'serif',
    textShadow: '0 1px 2px rgba(255,255,255,0.6)',
    textAlign: 'center' as const,
    width: 'max-content',
    maxWidth: '90%',
    ...verticalAnchor,
  };
  return <div style={style}>{entry.text}</div>;
}
