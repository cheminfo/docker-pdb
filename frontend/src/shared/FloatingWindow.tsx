import { Button } from '@blueprintjs/core';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useCallback, useState } from 'react';

interface FloatingWindowProps {
  /** Title displayed in the window header. */
  title: string;
  /** Called when the user clicks the close button. */
  onClose: () => void;
  /** Window body content. */
  children: ReactNode;
  /**
   * Initial width in pixels.
   * @default 640
   */
  initialWidth?: number;
  /**
   * Initial height in pixels.
   * @default 520
   */
  initialHeight?: number;
  /**
   * Initial left position (pixels from viewport left).
   * @default 80
   */
  initialX?: number;
  /**
   * Initial top position (pixels from viewport top).
   * @default 80
   */
  initialY?: number;
  /**
   * Minimum width in pixels.
   * @default 280
   */
  minWidth?: number;
  /**
   * Minimum height in pixels.
   * @default 180
   */
  minHeight?: number;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

/**
 * Position-fixed floating panel that the user can move (drag the header) and
 * resize (drag the bottom-right corner). Use it for transient secondary
 * content — help text, settings, etc. — that should not displace the page
 * layout. Rendered inline, on top of the page via a high `z-index`.
 * @param props - Component props.
 * @param props.title - Title displayed in the window header.
 * @param props.onClose - Called when the user clicks the close button.
 * @param props.children - Window body content.
 * @param props.initialWidth - Initial width in pixels.
 * @param props.initialHeight - Initial height in pixels.
 * @param props.initialX - Initial left position in pixels.
 * @param props.initialY - Initial top position in pixels.
 * @param props.minWidth - Minimum width in pixels.
 * @param props.minHeight - Minimum height in pixels.
 * @returns Floating window element.
 */
export default function FloatingWindow({
  title,
  onClose,
  children,
  initialWidth = 640,
  initialHeight = 520,
  initialX = 80,
  initialY = 80,
  minWidth = 280,
  minHeight = 180,
}: FloatingWindowProps) {
  const [position, setPosition] = useState<Position>({
    x: initialX,
    y: initialY,
  });
  const [size, setSize] = useState<Size>({
    width: initialWidth,
    height: initialHeight,
  });

  const handleHeaderMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      if ((event.target as HTMLElement).closest('.floating-window-close')) {
        return;
      }
      event.preventDefault();
      const startX = event.clientX;
      const startY = event.clientY;
      const startPosition = position;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';

      const handleMove = (moveEvent: MouseEvent) => {
        const nextX = Math.max(
          0,
          Math.min(
            window.innerWidth - 40,
            startPosition.x + (moveEvent.clientX - startX),
          ),
        );
        const nextY = Math.max(
          0,
          Math.min(
            window.innerHeight - 40,
            startPosition.y + (moveEvent.clientY - startY),
          ),
        );
        setPosition({ x: nextX, y: nextY });
      };

      const handleUp = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [position],
  );

  const handleResizeMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const startY = event.clientY;
      const startSize = size;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';

      const handleMove = (moveEvent: MouseEvent) => {
        const nextWidth = Math.max(
          minWidth,
          startSize.width + (moveEvent.clientX - startX),
        );
        const nextHeight = Math.max(
          minHeight,
          startSize.height + (moveEvent.clientY - startY),
        );
        setSize({ width: nextWidth, height: nextHeight });
      };

      const handleUp = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [size, minWidth, minHeight],
  );

  return (
    <div
      className="floating-window"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      role="dialog"
      aria-label={title}
    >
      <div
        className="floating-window-header"
        onMouseDown={handleHeaderMouseDown}
      >
        <span className="floating-window-title">{title}</span>
        <Button
          icon="cross"
          variant="minimal"
          size="small"
          className="floating-window-close"
          onClick={onClose}
          aria-label="Close"
        />
      </div>
      <div className="floating-window-body">{children}</div>
      <div
        className="floating-window-resize"
        onMouseDown={handleResizeMouseDown}
        aria-hidden
      />
    </div>
  );
}
