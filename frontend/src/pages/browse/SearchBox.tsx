import { useState } from 'react';

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

const examples: Example[] = [
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
 * Search input bar with an inline help popover that lists smart-array-filter
 * syntax examples for the fields exposed in the PDB browse table.
 * @param props - Component props.
 * @param props.value - Current input value (controlled).
 * @param props.onChange - Called when the input value changes.
 * @returns The search bar React element.
 */
export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <div className="searchbox">
      <input
        type="search"
        className="searchbox-input"
        placeholder="Filter… (e.g. nbResidues:>=200)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        autoComplete="off"
      />
      <button
        type="button"
        className="searchbox-help-button"
        onClick={() => setHelpOpen((open) => !open)}
        aria-expanded={helpOpen}
        aria-label="Search syntax help"
      >
        ?
      </button>
      {helpOpen && (
        <div className="searchbox-help">
          <p>
            Free-text search runs against the entry <code>title</code> only,
            case-insensitively. Type one or more words separated by spaces;
            every word must appear in the title (in any order).
          </p>
          <table>
            <thead>
              <tr>
                <th>Example</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((example) => (
                <tr key={example.query}>
                  <td>
                    <code>{example.query}</code>
                  </td>
                  <td>{example.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="searchbox-help-fields">
            Use the controls below the search box to filter by experimental
            method, number of helices / sheets / ligands / residues, and year.
          </p>
        </div>
      )}
    </div>
  );
}
