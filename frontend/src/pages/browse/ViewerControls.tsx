import type {
  BackgroundName,
  ColorName,
  RepresentationName,
} from '../../shared/viewerOptions.ts';
import {
  BACKGROUND_OPTIONS,
  COLOR_OPTIONS,
  REPRESENTATION_OPTIONS,
} from '../../shared/viewerOptions.ts';

interface ViewerControlsProps {
  representation: RepresentationName;
  onRepresentationChange: (value: RepresentationName) => void;
  color: ColorName;
  onColorChange: (value: ColorName) => void;
  spin: boolean;
  onSpinToggle: () => void;
  background: BackgroundName;
  onBackgroundChange: (value: BackgroundName) => void;
  onResetView: () => void;
}

/**
 * Compact toolbar shown above the Mol* canvas. Three selects (style, color,
 * background) plus icon-only buttons for spin and reset.
 * @param props - Component props.
 * @param props.representation - Current Mol* representation preset.
 * @param props.onRepresentationChange - Called when the representation changes.
 * @param props.color - Current Mol* color theme.
 * @param props.onColorChange - Called when the color theme changes.
 * @param props.spin - Whether the auto-spin animation is on.
 * @param props.onSpinToggle - Called when the spin button is clicked.
 * @param props.background - Current background color preset.
 * @param props.onBackgroundChange - Called when the background changes.
 * @param props.onResetView - Called when the reset button is clicked.
 * @returns Control bar React element.
 */
export default function ViewerControls({
  representation,
  onRepresentationChange,
  color,
  onColorChange,
  spin,
  onSpinToggle,
  background,
  onBackgroundChange,
  onResetView,
}: ViewerControlsProps) {
  return (
    <div className="viewer-controls">
      <select
        className="viewer-control-select"
        value={representation}
        title="Style"
        aria-label="Style"
        onChange={(event) =>
          onRepresentationChange(event.target.value as RepresentationName)
        }
      >
        {REPRESENTATION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {`❖ ${option.label}`}
          </option>
        ))}
      </select>

      <select
        className="viewer-control-select"
        value={color}
        title="Color theme"
        aria-label="Color theme"
        onChange={(event) => onColorChange(event.target.value as ColorName)}
      >
        {COLOR_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {`\u{1F3A8} ${option.label}`}
          </option>
        ))}
      </select>

      <select
        className="viewer-control-select"
        value={background}
        title="Background"
        aria-label="Background"
        onChange={(event) =>
          onBackgroundChange(event.target.value as BackgroundName)
        }
      >
        {BACKGROUND_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {`◐ ${option.label}`}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={`viewer-control-icon${spin ? ' is-active' : ''}`}
        onClick={onSpinToggle}
        title={spin ? 'Stop spin' : 'Spin'}
        aria-label={spin ? 'Stop spin' : 'Spin'}
        aria-pressed={spin}
      >
        {'↻'}
      </button>

      <button
        type="button"
        className="viewer-control-icon"
        onClick={onResetView}
        title="Reset view"
        aria-label="Reset view"
      >
        {'⌂'}
      </button>
    </div>
  );
}
