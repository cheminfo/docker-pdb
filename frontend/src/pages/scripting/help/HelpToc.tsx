import { Icon } from '@blueprintjs/core';

import type { TocEntry } from './toc.ts';

/**
 * A quick-navigation rail pinned to the top-left of a tab. It shows as a
 * slim stack of ticks — one per section — and expands into the full list on
 * hover or keyboard focus, so it costs no reading width until it is wanted.
 *
 * Sticky with zero height: it stays put while the panel scrolls without
 * taking any space from the content.
 */

interface HelpTocProps {
  /** Sections of the current tab, in document order. */
  entries: TocEntry[];
}

/**
 * Scroll a section into view within the scrolling tab panel.
 * @param id - DOM id of the target section.
 */
function scrollToSection(id: string): void {
  document
    .querySelector(`#${CSS.escape(id)}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Render the hover table of contents.
 * @param props - Component props.
 * @param props.entries - Sections of the current tab.
 * @returns The TOC rail, or nothing when there is only one section.
 */
export default function HelpToc({ entries }: HelpTocProps) {
  if (entries.length < 2) return null;

  return (
    <nav className="help-toc" aria-label="Jump to section">
      <div className="help-toc-inner">
        <div className="help-toc-rail" aria-hidden="true">
          <Icon icon="properties" size={12} />
          {entries.map((entry) => (
            <span key={entry.id} className="help-toc-tick" />
          ))}
        </div>
        <ul className="help-toc-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button type="button" onClick={() => scrollToSection(entry.id)}>
                {entry.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
