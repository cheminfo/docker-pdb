import { Button, HTMLTable, InputGroup, Popover } from '@blueprintjs/core';
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

const smartExamples: Example[] = [
  {
    query: 'year:>=2024',
    description: 'numeric comparison (>, >=, <, <=, =, !=)',
  },
  {
    query: 'year:2020..2023',
    description: 'numeric range',
  },
  {
    query: 'experiment:X-RAY DIFFRACTION,SOLUTION NMR',
    description: 'OR-list of values for the same field',
  },
  {
    query: 'nb_helices:>5 nb_ligands:>=2',
    description: 'space-separated AND across fields',
  },
  {
    query: 'title:~kinase year:>=2024',
    description: 'title contains "kinase" AND year ≥ 2024',
  },
  {
    query: 'title:^Crystal',
    description: 'title starts with "Crystal" (^ start, $ end, ~ contains)',
  },
];

/**
 * Search input bar with an inline help popover that lists smart-array-filter
 * syntax examples for the fields exposed in the PDB browse table.
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
      placeholder="Filter… (e.g. nbResidues:>=200)"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      autoComplete="off"
      rightElement={
        <Popover
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
        <strong>Free-text title search</strong> runs against the entry{' '}
        <code>title</code> only, case-insensitively. Type one or more words
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
      <p>
        <strong>Field expressions</strong> — as soon as the input contains a{' '}
        <code>:</code>, the query is parsed by <code>smart-sqlite3-filter</code>{' '}
        and evaluated against the <code>pdb_entries</code> columns (
        <code>id</code>, <code>title</code>, <code>experiment</code>,{' '}
        <code>year</code>, <code>nb_residues</code>, <code>nb_chains</code>,{' '}
        <code>nb_helices</code>, <code>nb_sheets</code>, <code>nb_ligands</code>
        , …).
      </p>
      <HTMLTable compact>
        <thead>
          <tr>
            <th>Example</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          {smartExamples.map((example) => (
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
        The structured controls below the search box (method, helices, sheets,
        ligands, residues, year) compose with both modes via AND.
      </p>
    </div>
  );
}
