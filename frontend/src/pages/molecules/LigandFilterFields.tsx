import { Button, FormGroup, InputGroup } from '@blueprintjs/core';

import type { LigandFilterDraft } from './ligandFilters.ts';
import { hasLigandFilters } from './ligandFilters.ts';

interface LigandFilterFieldsProps {
  /** Current text of every filter field. */
  draft: LigandFilterDraft;
  /** Called with the whole draft whenever one field changes. */
  onChange: (draft: LigandFilterDraft) => void;
}

const TEXT_FIELDS: Array<{
  key: 'code' | 'name' | 'mf';
  label: string;
  placeholder: string;
}> = [
  { key: 'code', label: 'Code', placeholder: 'ATP' },
  { key: 'name', label: 'Name', placeholder: 'adenosine' },
  { key: 'mf', label: 'MF', placeholder: 'C10H16N5' },
];

/**
 * Attribute-filter form shown under the structure editor. Text fields match
 * as case-insensitive substrings; the two MW fields bound the molecular
 * weight. Filters compose with the active structure query.
 * @param props - Component props.
 * @param props.draft - Current text of every filter field.
 * @param props.onChange - Draft-change handler.
 * @returns Filter-form React element.
 */
export default function LigandFilterFields({
  draft,
  onChange,
}: LigandFilterFieldsProps) {
  return (
    <div className="molecules-filters">
      <div className="molecules-filters-header">
        <h3>Filters</h3>
        <Button
          variant="minimal"
          size="small"
          onClick={() =>
            onChange({ code: '', name: '', mf: '', mwMin: '', mwMax: '' })
          }
          disabled={!hasLigandFilters(draft)}
        >
          Reset
        </Button>
      </div>
      {TEXT_FIELDS.map(({ key, label, placeholder }) => (
        <FormGroup key={key} label={label} inline>
          <InputGroup
            size="small"
            value={draft[key]}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            onValueChange={(value) => onChange({ ...draft, [key]: value })}
          />
        </FormGroup>
      ))}
      <FormGroup label="MW" inline>
        <div className="molecules-filters-range">
          <InputGroup
            size="small"
            type="number"
            value={draft.mwMin}
            placeholder="min"
            onValueChange={(value) => onChange({ ...draft, mwMin: value })}
          />
          <InputGroup
            size="small"
            type="number"
            value={draft.mwMax}
            placeholder="max"
            onValueChange={(value) => onChange({ ...draft, mwMax: value })}
          />
        </div>
      </FormGroup>
    </div>
  );
}
