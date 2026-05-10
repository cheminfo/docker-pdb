import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';

interface SplitterProps {
  /** Content rendered in the left pane. */
  left: ReactNode;
  /** Content rendered in the right pane. */
  right: ReactNode;
  /**
   * Initial fraction (0–1) of the container width given to the left pane.
   * @default 0.6
   */
  defaultLeftFraction?: number;
  /**
   * Lower bound for the left fraction while dragging.
   * @default 0.2
   */
  minLeftFraction?: number;
  /**
   * Upper bound for the left fraction while dragging.
   * @default 0.8
   */
  maxLeftFraction?: number;
}

/**
 * Two-pane horizontal splitter with a draggable vertical divider. The two
 * panes share the container width according to a fraction the user can adjust
 * by dragging the handle. The component is uncontrolled; the position lives
 * in local state.
 * @param props - Component props.
 * @param props.left - Content rendered in the left pane.
 * @param props.right - Content rendered in the right pane.
 * @param props.defaultLeftFraction - Initial fraction (0–1) of the container
 *   width given to the left pane.
 * @param props.minLeftFraction - Lower bound for the left fraction.
 * @param props.maxLeftFraction - Upper bound for the left fraction.
 * @returns Splitter container element.
 */
export default function Splitter({
  left,
  right,
  defaultLeftFraction = 0.6,
  minLeftFraction = 0.2,
  maxLeftFraction = 0.8,
}: SplitterProps) {
  const [leftFraction, setLeftFraction] = useState(defaultLeftFraction);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const handleMove = (moveEvent: MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0) return;
        const fraction = (moveEvent.clientX - rect.left) / rect.width;
        const clamped = Math.max(
          minLeftFraction,
          Math.min(maxLeftFraction, fraction),
        );
        setLeftFraction(clamped);
      };

      const handleUp = () => {
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [minLeftFraction, maxLeftFraction],
  );

  return (
    <div ref={containerRef} className="splitter">
      <div className="splitter-pane" style={{ flexGrow: leftFraction }}>
        {left}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        className="splitter-handle"
        onMouseDown={handleMouseDown}
      />
      <div className="splitter-pane" style={{ flexGrow: 1 - leftFraction }}>
        {right}
      </div>
    </div>
  );
}
