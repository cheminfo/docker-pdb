import { Icon } from '@blueprintjs/core';

import type { LigandSort, LigandSortColumn } from '../../shared/api/types.ts';

interface LigandSortableHeaderProps {
  /** Column this header sorts on. */
  column: LigandSortColumn;
  /** Header text. */
  label: string;
  /** Active sort, or `null` for the default ranking. */
  sort: LigandSort | null;
  /** Called with the next sort state, or `null` to restore the default. */
  onSortChange: (sort: LigandSort | null) => void;
  /** Right-align the header, for numeric columns. */
  numeric?: boolean;
}

/**
 * A sortable column header cycling through three states: ascending →
 * descending → unsorted (the default ranking). Sorting happens on the server,
 * so it orders every match rather than just the visible page.
 * @param props - Component props.
 * @param props.column - Column this header sorts on.
 * @param props.label - Header text.
 * @param props.sort - Active sort, or `null`.
 * @param props.onSortChange - Sort-change handler.
 * @param props.numeric - Right-align for numeric columns.
 * @returns A `<th>` element.
 */
export default function LigandSortableHeader({
  column,
  label,
  sort,
  onSortChange,
  numeric = false,
}: LigandSortableHeaderProps) {
  const active = sort?.column === column ? sort.direction : null;
  const next: LigandSort | null =
    active === null
      ? { column, direction: 'asc' }
      : active === 'asc'
        ? { column, direction: 'desc' }
        : null;
  const icon =
    active === 'asc'
      ? 'caret-up'
      : active === 'desc'
        ? 'caret-down'
        : 'double-caret-vertical';
  return (
    <th className={numeric ? 'num sortable' : 'sortable'}>
      <button
        type="button"
        className={active ? 'ligand-sort is-active' : 'ligand-sort'}
        onClick={() => onSortChange(next)}
        title={
          next === null
            ? `Stop sorting by ${label}`
            : `Sort by ${label} ${next.direction === 'asc' ? 'ascending' : 'descending'}`
        }
      >
        <span>{label}</span>
        <Icon icon={icon} size={12} />
      </button>
    </th>
  );
}
