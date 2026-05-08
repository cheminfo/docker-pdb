import { useMemo } from 'react';

import type { RangeStats } from '../../shared/api/client.ts';
import type { PdbDoc } from '../../shared/api/types.ts';

import DualRangeSlider from './DualRangeSlider.tsx';
import type { FilterBounds, FilterState, RangeFilter } from './filters.ts';
import { computeBounds, emptyFilterState, methodCounts } from './filters.ts';

interface FilterPanelProps {
  /** All documents (used to compute available methods and counts). */
  docs: PdbDoc[];
  /**
   * DB-wide min/max statistics fetched from CouchDB `_stats` views. When
   * present, these define the slider bounds; otherwise the component falls
   * back to extents computed from `docs`.
   */
  stats?: RangeStats;
  /** Current filter state. */
  filters: FilterState;
  /** Called with a new filter state when the user changes any control. */
  onChange: (filters: FilterState) => void;
}

/**
 * Filter sidebar (leftmost browse column). Lets the user narrow the PDB
 * list by experimental method (multi-select) and by numeric ranges on
 * helices, sheets, ligands, residues, and year.
 * @param props - Component props.
 * @param props.docs - All documents — used to derive method counts.
 * @param props.stats - DB-wide min/max statistics from CouchDB; defines slider bounds when present.
 * @param props.filters - Current filter state.
 * @param props.onChange - Called whenever the user changes any control.
 * @returns Filter panel React element.
 */
export default function FilterPanel({
  docs,
  stats,
  filters,
  onChange,
}: FilterPanelProps) {
  const methods = useMemo(() => {
    const counts = methodCounts(docs);
    return [...counts.entries()].toSorted(
      ([, leftCount], [, rightCount]) => rightCount - leftCount,
    );
  }, [docs]);

  const bounds = useMemo<FilterBounds>(() => {
    if (stats) {
      return {
        helices: { min: stats.helices.min, max: stats.helices.max },
        sheets: { min: stats.sheets.min, max: stats.sheets.max },
        ligands: { min: stats.ligands.min, max: stats.ligands.max },
        residues: { min: stats.residues.min, max: stats.residues.max },
        year: { min: stats.year.min, max: stats.year.max },
      };
    }
    return computeBounds(docs);
  }, [docs, stats]);

  function toggleMethod(method: string) {
    const next = new Set(filters.methods);
    if (next.has(method)) {
      next.delete(method);
    } else {
      next.add(method);
    }
    onChange({ ...filters, methods: next });
  }

  function setRange(
    key: keyof Omit<FilterState, 'methods'>,
    range: RangeFilter,
  ) {
    onChange({ ...filters, [key]: range });
  }

  const isActive =
    filters.methods.size > 0 ||
    hasRange(filters.helices) ||
    hasRange(filters.sheets) ||
    hasRange(filters.ligands) ||
    hasRange(filters.residues) ||
    hasRange(filters.year);

  return (
    <div className="filter-panel panel">
      <div className="filter-panel-header">
        <h3>Filters</h3>
        {isActive && (
          <button
            type="button"
            className="filter-reset"
            onClick={() => onChange(emptyFilterState)}
          >
            Reset
          </button>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-group-label">Method</div>
        {methods.length === 0 ? (
          <p className="placeholder">No method data.</p>
        ) : (
          methods.map(([method, count]) => (
            <label key={method} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.methods.has(method)}
                onChange={() => toggleMethod(method)}
              />
              <span className="filter-method-name" title={method}>
                {prettyMethod(method)}
              </span>
              <span className="filter-method-count">{count}</span>
            </label>
          ))
        )}
      </div>

      <RangeRow
        label="Helices"
        range={filters.helices}
        bounds={bounds.helices}
        onChange={(range) => setRange('helices', range)}
      />
      <RangeRow
        label="Sheets"
        range={filters.sheets}
        bounds={bounds.sheets}
        onChange={(range) => setRange('sheets', range)}
      />
      <RangeRow
        label="Ligands"
        range={filters.ligands}
        bounds={bounds.ligands}
        onChange={(range) => setRange('ligands', range)}
      />
      <RangeRow
        label="Residues"
        range={filters.residues}
        bounds={bounds.residues}
        onChange={(range) => setRange('residues', range)}
      />
      <RangeRow
        label="Year"
        range={filters.year}
        bounds={bounds.year}
        onChange={(range) => setRange('year', range)}
      />
    </div>
  );
}

interface RangeRowProps {
  label: string;
  range: RangeFilter;
  bounds: { min: number; max: number };
  onChange: (range: RangeFilter) => void;
}

/**
 * A range filter row: dual-thumb slider on top, displaying the current
 * selected min/max values, plus a pair of numeric inputs underneath for
 * exact entry. The slider track spans the data-derived `bounds`.
 * @param props - Component props.
 * @param props.label - Label shown above the controls.
 * @param props.range - Current selected range.
 * @param props.bounds - Data-derived [min, max] of the field.
 * @param props.onChange - Called when min or max changes.
 * @returns Range row element.
 */
function RangeRow({ label, range, bounds, onChange }: RangeRowProps) {
  const showSlider = bounds.max > bounds.min;
  const display = formatRange(range, bounds);
  return (
    <div className="filter-group">
      <div className="filter-group-row">
        <span className="filter-group-label">{label}</span>
        <span className="filter-range-value">{display}</span>
      </div>
      {showSlider && (
        <DualRangeSlider
          min={bounds.min}
          max={bounds.max}
          valueMin={range.min}
          valueMax={range.max}
          onChange={(next) => onChange(next)}
        />
      )}
      <div className="filter-range">
        <input
          type="number"
          className="filter-range-input"
          placeholder={String(bounds.min)}
          value={range.min ?? ''}
          onChange={(event) =>
            onChange({ ...range, min: parseValue(event.target.value) })
          }
        />
        <span className="filter-range-sep">–</span>
        <input
          type="number"
          className="filter-range-input"
          placeholder={String(bounds.max)}
          value={range.max ?? ''}
          onChange={(event) =>
            onChange({ ...range, max: parseValue(event.target.value) })
          }
        />
      </div>
    </div>
  );
}

function formatRange(
  range: RangeFilter,
  bounds: { min: number; max: number },
): string {
  const lo = range.min ?? bounds.min;
  const hi = range.max ?? bounds.max;
  return `${lo} – ${hi}`;
}

function parseValue(raw: string): number | null {
  const value = Number(raw);
  return raw.trim() === '' || !Number.isFinite(value) ? null : value;
}

function hasRange(range: RangeFilter): boolean {
  return range.min !== null || range.max !== null;
}

function prettyMethod(method: string): string {
  return method
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      const first = word.charAt(0);
      return first ? first.toUpperCase() + word.slice(1) : word;
    })
    .join(' ');
}
