import { Tag } from '@blueprintjs/core';
import { useMemo } from 'react';

import { operatorById } from './operators.ts';
import { serializeClause } from './serialize.ts';
import type { Clause, FilterField } from './types.ts';

interface ClauseChipProps {
  /** The clause to display. */
  clause: Clause;
  /** Field schema, used to render the human-friendly label. */
  fields: FilterField[];
  /** Called when the user clicks the chip body (to open the editor). */
  onClick: () => void;
  /** Called when the user clicks the `×` remove button on the chip. */
  onRemove: () => void;
  /** Optional emphasized state (e.g. while the editor is open). */
  active?: boolean;
}

/**
 * Visual chip that renders one filter clause. Clicking the body opens the
 * editor; clicking the `×` removes it. The chip falls back gracefully when
 * the clause was preserved verbatim (raw token the parser couldn't decode).
 * @param props - Component props.
 * @param props.clause - The clause to render.
 * @param props.fields - Field schema (resolves field name → label).
 * @param props.onClick - Called when the user clicks the chip body.
 * @param props.onRemove - Called when the user clicks the remove button.
 * @param props.active - When true, render the chip in an emphasized state.
 * @returns The chip React element.
 */
export default function ClauseChip({
  clause,
  fields,
  onClick,
  onRemove,
  active = false,
}: ClauseChipProps) {
  const tooltip = useMemo(() => serializeClause(clause), [clause]);
  const fieldDef = clause.field
    ? fields.find((field) => field.name === clause.field)
    : undefined;
  const fieldLabel = fieldDef?.label ?? clause.field ?? '(any field)';

  return (
    <Tag
      interactive
      intent={active ? 'primary' : 'none'}
      onClick={onClick}
      onRemove={(event) => {
        event.stopPropagation();
        onRemove();
      }}
      className="smart-filter-chip"
      title={tooltip}
    >
      <ChipContent clause={clause} fieldLabel={fieldLabel} />
    </Tag>
  );
}

interface ChipContentProps {
  clause: Clause;
  fieldLabel: string;
}

function ChipContent({ clause, fieldLabel }: ChipContentProps) {
  if (clause.raw !== undefined && clause.values.length === 0) {
    return (
      <span className="smart-filter-chip-raw">
        {clause.negate && <span className="smart-filter-chip-neg">NOT </span>}
        <code>{clause.raw}</code>
      </span>
    );
  }
  const meta = operatorById(clause.operator);
  const opLabel = meta.id === 'default' ? ':' : meta.label;
  return (
    <span className="smart-filter-chip-body">
      {clause.negate && <span className="smart-filter-chip-neg">NOT </span>}
      <span className="smart-filter-chip-field">{fieldLabel}</span>
      <span className="smart-filter-chip-op">{opLabel}</span>
      <span className="smart-filter-chip-value">{formatValues(clause)}</span>
    </span>
  );
}

function formatValues(clause: Clause): string {
  if (clause.operator === 'between') {
    const [low = '?', high = '?'] = clause.values;
    return `${low} … ${high}`;
  }
  if (clause.values.length === 0) return '';
  if (clause.values.length === 1) return clause.values[0] ?? '';
  return clause.values.join(', ');
}
