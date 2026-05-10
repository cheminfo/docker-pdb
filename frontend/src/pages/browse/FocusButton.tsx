import { Button } from '@blueprintjs/core';

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
    <Button
      icon="locate"
      variant="minimal"
      size="small"
      active={isActive}
      aria-label={label}
      title={isActive ? 'Click to clear selection' : label}
      onClick={onClick}
    />
  );
}
