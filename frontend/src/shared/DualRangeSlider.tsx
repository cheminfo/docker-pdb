interface DualRangeSliderProps {
  /** Lower data bound shown at the left edge of the track. */
  min: number;
  /** Upper data bound shown at the right edge of the track. */
  max: number;
  /** Currently selected lower value (or `null` to mean "no lower bound"). */
  valueMin: number | null;
  /** Currently selected upper value (or `null` to mean "no upper bound"). */
  valueMax: number | null;
  /** Called when either thumb moves. */
  onChange: (range: { min: number | null; max: number | null }) => void;
}

/**
 * Two overlapped `<input type="range">` controls forming a dual-thumb slider.
 * The active range between the thumbs is highlighted in the accent color.
 * @param props - Component props.
 * @param props.min - Data lower bound (track start).
 * @param props.max - Data upper bound (track end).
 * @param props.valueMin - Currently selected lower value, or `null` for "no constraint".
 * @param props.valueMax - Currently selected upper value, or `null` for "no constraint".
 * @param props.onChange - Called with the new {min, max} when a thumb moves.
 * @returns The slider element.
 */
export default function DualRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: DualRangeSliderProps) {
  if (max <= min) {
    return <div className="dual-slider dual-slider--empty" />;
  }
  const effMin = valueMin ?? min;
  const effMax = valueMax ?? max;
  const span = max - min;
  const minPercent = ((Math.max(min, effMin) - min) / span) * 100;
  const maxPercent = ((Math.min(max, effMax) - min) / span) * 100;

  return (
    <div className="dual-slider">
      <div className="dual-slider-track" />
      <div
        className="dual-slider-fill"
        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={effMin}
        onChange={(event) => {
          const next = Math.min(Number(event.target.value), effMax);
          onChange({
            min: next === min ? null : next,
            max: valueMax,
          });
        }}
        className="dual-slider-input dual-slider-input--low"
        aria-label="Lower bound"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={effMax}
        onChange={(event) => {
          const next = Math.max(Number(event.target.value), effMin);
          onChange({
            min: valueMin,
            max: next === max ? null : next,
          });
        }}
        className="dual-slider-input dual-slider-input--high"
        aria-label="Upper bound"
      />
    </div>
  );
}
