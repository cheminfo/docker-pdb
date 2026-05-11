import { Button, ButtonGroup, Checkbox, HTMLSelect } from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import ValueEditor from './ValueEditor.tsx';
import { operatorsFor } from './operators.ts';
import type { Clause, FilterField, OperatorId } from './types.ts';

interface ClauseEditorProps {
  /** Available fields. */
  fields: FilterField[];
  /** Initial clause to edit, or `null` to start a new clause from scratch. */
  initial: Clause | null;
  /** Called when the user clicks Apply. */
  onSubmit: (clause: Clause) => void;
  /** Called when the user clicks Cancel or dismisses the popover. */
  onCancel: () => void;
}

/**
 * Popover form that builds or edits a single {@link Clause}:
 *   1. pick a field (or leave empty for a free-text token)
 *   2. pick an operator (filtered by field type)
 *   3. enter one or more values (UI delegated to `ValueEditor`)
 *   4. optionally toggle "Negate"
 * `Apply` is disabled until the form holds at least one non-empty value.
 * @param props - Component props.
 * @param props.fields - Available field definitions.
 * @param props.initial - Clause to prefill (edit mode) or null (create).
 * @param props.onSubmit - Called with the new clause when the user applies.
 * @param props.onCancel - Called when the user cancels or dismisses.
 * @returns The editor form React element.
 */
export default function ClauseEditor({
  fields,
  initial,
  onSubmit,
  onCancel,
}: ClauseEditorProps) {
  const [fieldName, setFieldName] = useState<string>(initial?.field ?? '');
  const [rawOperator, setRawOperator] = useState<OperatorId>(
    initial?.operator ?? 'default',
  );
  const [values, setValues] = useState<string[]>(initial?.values ?? ['']);
  const [negate, setNegate] = useState<boolean>(initial?.negate ?? false);
  // Text in the multi-value TagInput's textbox that has not been committed
  // (no Enter pressed yet). Tracked here so clicking Apply mid-typing still
  // captures it instead of dropping the keystrokes on the floor.
  const [pendingInput, setPendingInput] = useState<string>('');

  const fieldDef = useMemo(
    () => fields.find((field) => field.name === fieldName),
    [fields, fieldName],
  );
  const fieldType = fieldDef?.type ?? 'string';
  const allowedOperators = useMemo(() => operatorsFor(fieldType), [fieldType]);

  // Derive the effective operator: if the raw selection is no longer valid
  // for the current field type, fall back to the first allowed one.
  const operator: OperatorId = allowedOperators.some(
    (meta) => meta.id === rawOperator,
  )
    ? rawOperator
    : (allowedOperators[0]?.id ?? 'default');

  // `between` requires exactly two value slots — pad/truncate at the read
  // boundary so editing transitions don't need a state-syncing effect.
  const effectiveValues =
    operator === 'between' ? [values[0] ?? '', values[1] ?? ''] : values;

  const canApply =
    effectiveValues.some((value) => value.trim() !== '') ||
    pendingInput.trim() !== '';

  function chooseField(next: string) {
    setFieldName(next);
  }

  function chooseOperator(next: OperatorId) {
    setRawOperator(next);
    if (next === 'between' && values.length < 2) {
      setValues([values[0] ?? '', '']);
    }
  }

  function apply() {
    let cleaned: string[];
    if (operator === 'between') {
      cleaned = effectiveValues.slice(0, 2).map((value) => value.trim());
    } else {
      const trimmedPending = pendingInput.trim();
      const merged = trimmedPending
        ? [...effectiveValues, trimmedPending]
        : effectiveValues;
      cleaned = merged.map((value) => value.trim()).filter(Boolean);
    }
    if (cleaned.length === 0) return;
    onSubmit({
      field: fieldName.trim() || null,
      operator,
      values: cleaned,
      ...(negate ? { negate: true } : {}),
    });
  }

  return (
    <div className="smart-filter-editor">
      <label className="smart-filter-editor-row">
        <span className="smart-filter-editor-label">Field</span>
        <HTMLSelect
          value={fieldName}
          onChange={(event) => chooseField(event.currentTarget.value)}
          fill
        >
          <option value="">— any field —</option>
          {fields.map((field) => (
            <option key={field.name} value={field.name}>
              {field.label ?? field.name}
              {field.description ? ` — ${field.description}` : ''}
            </option>
          ))}
        </HTMLSelect>
      </label>

      <div className="smart-filter-editor-row">
        <span className="smart-filter-editor-label">Operator</span>
        <ButtonGroup className="smart-filter-editor-ops">
          {allowedOperators.map((meta) => (
            <Button
              key={meta.id}
              size="small"
              active={operator === meta.id}
              onClick={() => chooseOperator(meta.id)}
              title={meta.description}
            >
              {meta.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="smart-filter-editor-row">
        <span className="smart-filter-editor-label">
          {operator === 'between' ? 'Range' : 'Value(s)'}
        </span>
        <ValueEditor
          fieldDef={fieldDef}
          fieldType={fieldType}
          operator={operator}
          values={effectiveValues}
          onChange={setValues}
          pendingInput={pendingInput}
          onPendingInputChange={setPendingInput}
        />
      </div>

      <div className="smart-filter-editor-footer">
        <Checkbox
          checked={negate}
          onChange={(event) => setNegate(event.currentTarget.checked)}
          label="Negate (NOT)"
        />
        <div className="smart-filter-editor-actions">
          <Button size="small" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="small"
            intent="primary"
            disabled={!canApply}
            onClick={apply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
