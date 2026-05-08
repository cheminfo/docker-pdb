import { useState } from 'react';

interface SearchBoxProps {
  /** Current value of the input. */
  value: string;
  /** Called when the user types or clears the input. */
  onChange: (value: string) => void;
  /** Number of results currently matching, shown as a hint to the right. */
  matchCount: number;
  /** Total number of entries in the list, shown alongside the match count. */
  totalCount: number;
}

interface Example {
  query: string;
  description: string;
}

const examples: Example[] = [
  {
    query: 'lactamase',
    description: 'matches a word anywhere in the document',
  },
  { query: 'title:lactamase', description: 'matches only inside the title' },
  { query: 'nbResidues:>=200', description: 'numeric comparison' },
  { query: 'nbResidues:200..400', description: 'numeric range' },
  { query: 'nbChains:=1', description: 'strict equality' },
  { query: 'year:>=2020', description: 'recent structures only' },
  { query: '-experiment:NMR', description: 'exclude an experimental method' },
  {
    query: 'helices.kind:=1',
    description: 'documents with at least one alpha helix',
  },
];

/**
 * Search input bar with an inline help popover that lists smart-array-filter
 * syntax examples for the fields exposed in the PDB browse table.
 * @param props - Component props.
 * @param props.value - Current input value (controlled).
 * @param props.onChange - Called when the input value changes.
 * @param props.matchCount - Number of results currently matching the query.
 * @param props.totalCount - Total number of entries in the source list.
 * @returns The search bar React element.
 */
export default function SearchBox({
  value,
  onChange,
  matchCount,
  totalCount,
}: SearchBoxProps) {
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
      <span className="searchbox-count">
        {matchCount} / {totalCount}
      </span>
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
            Type one or more keywords separated by spaces. All keywords must
            match (AND). Prefix a keyword with <code>-</code> to exclude.
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
            Searchable fields: <code>title</code>, <code>year</code>,
            <code> experiment</code>, <code>nbChains</code>,
            <code> nbResidues</code>, <code>helices.kind</code>,
            <code> sheets.from</code>, <code>formula.mf</code>,
            <code> formula.name</code>, <code>chain.A.molecule</code>, …
          </p>
        </div>
      )}
    </div>
  );
}
