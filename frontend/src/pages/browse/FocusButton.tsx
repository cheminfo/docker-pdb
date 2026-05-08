interface FocusButtonProps {
  /** Whether the parent row is currently the focused selection. */
  isActive: boolean;
  /** Accessible label and tooltip for the button. */
  label: string;
  /** Toggle handler — focus the row, or clear when it is already active. */
  onClick: () => void;
}

/**
 * Tiny icon button used in the side-panel tables (ligands / helices /
 * sheets). Clicking focuses the corresponding element in the 3D viewer and
 * persists its highlight; clicking the active row clears the selection.
 * @param props - Component props.
 * @param props.isActive - Whether the parent row is currently the focused selection.
 * @param props.label - Accessible label and tooltip for the button.
 * @param props.onClick - Toggle handler — focus the row, or clear when it is already active.
 * @returns Crosshair-style icon button.
 */
export default function FocusButton({
  isActive,
  label,
  onClick,
}: FocusButtonProps) {
  return (
    <button
      type="button"
      className={isActive ? 'focus-button is-active' : 'focus-button'}
      aria-label={label}
      aria-pressed={isActive}
      title={isActive ? 'Click to clear selection' : label}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="8" cy="8" r="2.2" fill="currentColor" />
        <circle
          cx="8"
          cy="8"
          r="5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="8"
          y1="0.5"
          x2="8"
          y2="2.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="8"
          y1="13.5"
          x2="8"
          y2="15.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="0.5"
          y1="8"
          x2="2.5"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="13.5"
          y1="8"
          x2="15.5"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </button>
  );
}
