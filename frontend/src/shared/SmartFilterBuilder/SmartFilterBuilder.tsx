import { Button, Icon, Popover } from '@blueprintjs/core';
import type { Ref } from 'react';
import { useMemo, useState } from 'react';

import ClauseChip from './ClauseChip.tsx';
import ClauseEditor from './ClauseEditor.tsx';
import { parse } from './parse.ts';
import { serialize } from './serialize.ts';
import type { Clause, FilterField } from './types.ts';

interface SmartFilterBuilderProps {
  /**
   * Available fields. The shape comes from the consumer; the builder
   * itself has no project-specific knowledge.
   */
  fields: FilterField[];
  /**
   * Current filter expression in canonical smart-sqlite3-filter syntax.
   * Round-trips losslessly through the chip representation.
   */
  value: string;
  /** Called with the new canonical string whenever the chips change. */
  onChange: (next: string) => void;
  /**
   * Optional label rendered to the left of the chips. Pass an empty string
   * (or omit) to hide it entirely.
   */
  label?: string;
  /** Label for the "add filter" button. */
  addLabel?: string;
  /** Optional className appended to the outer wrapper. */
  className?: string;
}

type EditorTarget = { kind: 'new' } | { kind: 'edit'; index: number } | null;

/**
 * Visual builder for a `smart-sqlite3-filter` query string. Each clause is
 * rendered as a chip; the user adds, edits, or removes chips through a
 * popover form. The component is fully controlled — pass the canonical
 * string in, get it back via `onChange`.
 *
 * Designed to be portable: the only project-specific input is the `fields`
 * prop. No backend, project, or routing knowledge leaks into this component;
 * it is a candidate to publish alongside `smart-sqlite3-filter` itself.
 * @param props - Component props.
 * @param props.fields - Field schema list.
 * @param props.value - Current canonical filter string.
 * @param props.onChange - Called when the user changes any clause.
 * @param props.label - Optional label rendered before the chips.
 * @param props.addLabel - Label of the "+ Add filter" button.
 * @param props.className - Optional className appended to the wrapper.
 * @returns The builder React element.
 */
export default function SmartFilterBuilder({
  fields,
  value,
  onChange,
  label,
  addLabel = 'Add filter',
  className,
}: SmartFilterBuilderProps) {
  const clauses = useMemo(() => parse(value), [value]);
  const [target, setTarget] = useState<EditorTarget>(null);

  function commit(next: Clause[]) {
    onChange(serialize(next));
  }

  function addClause(clause: Clause) {
    commit([...clauses, clause]);
    setTarget(null);
  }

  function updateClause(index: number, clause: Clause) {
    const next = clauses.slice();
    next[index] = clause;
    commit(next);
    setTarget(null);
  }

  function removeClause(index: number) {
    commit(clauses.filter((_, i) => i !== index));
  }

  function clear() {
    commit([]);
  }

  const editingClause =
    target?.kind === 'edit' ? (clauses[target.index] ?? null) : null;

  return (
    <div
      className={['smart-filter-builder', className].filter(Boolean).join(' ')}
    >
      {label && <div className="smart-filter-builder-label">{label}</div>}
      <div className="smart-filter-chips">
        {clauses.map((clause, index) => (
          <ClauseChip
            // eslint-disable-next-line react/no-array-index-key -- clauses are ordered, no stable id
            key={index}
            clause={clause}
            fields={fields}
            active={target?.kind === 'edit' && target.index === index}
            onClick={() => setTarget({ kind: 'edit', index })}
            onRemove={() => removeClause(index)}
          />
        ))}

        <Popover
          isOpen={target !== null}
          onClose={() => setTarget(null)}
          placement="bottom-start"
          minimal
          content={
            target !== null ? (
              <ClauseEditor
                fields={fields}
                initial={editingClause}
                onSubmit={(clause) => {
                  if (target.kind === 'edit') {
                    updateClause(target.index, clause);
                  } else {
                    addClause(clause);
                  }
                }}
                onCancel={() => setTarget(null)}
              />
            ) : undefined
          }
          renderTarget={({ isOpen, ref, ...targetProps }) => (
            <Button
              {...targetProps}
              ref={ref as Ref<HTMLButtonElement>}
              icon="plus"
              size="small"
              variant="minimal"
              active={isOpen && target?.kind === 'new'}
              onClick={() => setTarget({ kind: 'new' })}
              className="smart-filter-add"
            >
              {addLabel}
            </Button>
          )}
        />

        {clauses.length > 0 && (
          <Button
            icon="cross"
            size="small"
            variant="minimal"
            onClick={clear}
            title="Clear all clauses"
            aria-label="Clear all clauses"
            className="smart-filter-clear"
          />
        )}

        {clauses.length === 0 && (
          <span className="smart-filter-hint">
            <Icon icon="info-sign" size={12} />
            <span>
              Click <strong>Add filter</strong> to compose a query.
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
