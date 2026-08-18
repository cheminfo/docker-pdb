import { Button, HTMLTable, InputGroup, PopoverNext } from '@blueprintjs/core';
import type { Ref } from 'react';

interface SearchBoxProps {
  /** Current value of the input. */
  value: string;
  /** Called when the user types or clears the input. */
  onChange: (value: string) => void;
}

interface Example {
  query: string;
  description: string;
}

const ftsExamples: Example[] = [
  {
    query: 'lactamase',
    description: 'matches anywhere in the title',
  },
  {
    query: 'human lactamase',
    description: 'both words must appear in the title (any order)',
  },
  {
    query: 'kinase inhibitor',
    description: 'multi-word AND search',
  },
];

/**
 * Free-text title-search input (FTS5 against the `title` column). Structured
 * field filters live in the `SmartFilterBuilder` rendered below; the two
 * compose at the backend via AND.
 * @param props - Component props.
 * @param props.value - Current input value (controlled).
 * @param props.onChange - Called when the input value changes.
 * @returns The search bar React element.
 */
export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <InputGroup
      type="search"
      leftIcon="search"
      placeholder="Search titles…"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      autoComplete="off"
      rightElement={
        <PopoverNext
          placement="bottom-end"
          content={<HelpContent />}
          renderTarget={({ isOpen, ref, ...targetProps }) => (
            <Button
              {...targetProps}
              ref={ref as Ref<HTMLButtonElement>}
              icon="help"
              variant="minimal"
              active={isOpen}
              aria-label="Search syntax help"
            />
          )}
        />
      }
    />
  );
}

function HelpContent() {
  return (
    <div className="searchbox-help">
      <p>
        <strong>Title search</strong> runs an FTS5 full-text query against the
        <code>title</code> column, case-insensitively. Type one or more words
        separated by spaces; every word must appear in the title (in any order).
      </p>
      <HTMLTable compact>
        <thead>
          <tr>
            <th>Example</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          {ftsExamples.map((example) => (
            <tr key={example.query}>
              <td>
                <code>{example.query}</code>
              </td>
              <td>{example.description}</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
      <p className="searchbox-help-fields">
        For structured filters on any column (year, experiment, residues,
        helices, …) use the <strong>Field filters</strong> builder below.
      </p>
    </div>
  );
}
