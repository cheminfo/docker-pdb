import { useMemo } from 'react';

import DualRangeSlider from '../../shared/DualRangeSlider.tsx';
import type { RangeStats } from '../../shared/api/client.ts';

import SearchBox from './SearchBox.tsx';
import type { FilterBounds, FilterState, RangeFilter } from './filters.ts';
import { emptyFilterState } from './filters.ts';

interface FilterPanelProps {
  /** Free-text query (controlled by the parent). */
  query: string;
  /** Called when the user types into the search box. */
  onQueryChange: (value: string) => void;
  /** Total number of results matching the current filter+query. */
  matchCount: number;
  /** Total number of documents in the database (for the "N / total" hint). */
  totalCount: number;
  /** Methods present in the database, with the doc count for each. */
  methodCounts: Array<[string, number]>;
  /** DB-wide stats used to size the slider tracks. */
  stats?: RangeStats;
  /** Current filter state. */
  filters: FilterState;
  /** Called whenever the user changes any filter control. */
  onChange: (filters: FilterState) => void;
}

/**
 * Filter sidebar (leftmost browse column). Hosts the keyword search input,
 * a multi-select on experimental method, and dual-range sliders for the
 * numeric filters. The state lives in the parent so all controls drive a
 * single Mango query.
 * @param props - Component props.
 * @param props.query - Current free-text query.
 * @param props.onQueryChange - Called when the search input changes.
 * @param props.matchCount - Number of results currently matching.
 * @param props.totalCount - Total entries in the database.
 * @param props.methodCounts - DB-wide tally of `experiment` values.
 * @param props.stats - DB-wide numeric stats; defines slider bounds.
 * @param props.filters - Current filter state.
 * @param props.onChange - Called whenever a filter control changes.
 * @returns Filter panel React element.
 */
export default function FilterPanel({
  query,
  onQueryChange,
  matchCount,
  totalCount,
  methodCounts,
  stats,
  filters,
  onChange,
}: FilterPanelProps) {
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
    return {
      helices: { min: 0, max: 0 },
      sheets: { min: 0, max: 0 },
      ligands: { min: 0, max: 0 },
      residues: { min: 0, max: 0 },
      year: { min: 1970, max: new Date().getFullYear() },
    };
  }, [stats]);

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
    query.trim() !== '' ||
    filters.methods.size > 0 ||
    hasRange(filters.helices) ||
    hasRange(filters.sheets) ||
    hasRange(filters.ligands) ||
    hasRange(filters.residues) ||
    hasRange(filters.year);

  function reset() {
    onQueryChange('');
    onChange(emptyFilterState);
  }

  return (
    <div className="filter-panel panel">
      <div className="filter-panel-header">
        <h3>Filters</h3>
        <span className="filter-panel-count">
          {matchCount} / {totalCount}
        </span>
        {isActive && (
          <button
            type="button"
            className="filter-reset"
            onClick={reset}
            title="Clear all filters"
            aria-label="Clear all filters"
          >
            ×
          </button>
        )}
      </div>

      <SearchBox value={query} onChange={onQueryChange} />

      <div className="filter-group">
        <div className="filter-group-label">Method</div>
        {(() => {
          const visibleMethods = methodCounts.filter(
            ([method, count]) => count >= 100 || filters.methods.has(method),
          );
          if (visibleMethods.length === 0) {
            return <p className="placeholder">No method data.</p>;
          }
          return visibleMethods.map(([method, count]) => (
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
          ));
        })()}
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
 * A range filter row: dual-thumb slider + numeric inputs for exact entry.
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
