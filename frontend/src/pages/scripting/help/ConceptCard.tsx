import { Collapse, Icon } from '@blueprintjs/core';

import CodeBlock from './CodeBlock.tsx';
import RichText from './RichText.tsx';
import type { Concept } from './data/concepts.ts';
import { conceptDomId } from './toc.ts';

/**
 * One collapsible programming concept. Collapsed, it is a one-line reminder;
 * expanded, it explains the idea and shows a small example. Readers who
 * already know what a variable is never scroll past the explanation.
 *
 * Controlled by the parent so that "expand all" can drive every card at once.
 */

interface ConceptCardProps {
  concept: Concept;
  /** Whether the card is expanded. */
  isOpen: boolean;
  /** Called when the header is clicked. */
  onToggle: (id: string) => void;
}

/**
 * Render a collapsible concept card.
 * @param props - Component props.
 * @param props.concept - The concept to render.
 * @param props.isOpen - Whether the card is expanded.
 * @param props.onToggle - Called with the concept id when the header is clicked.
 * @returns Concept card element.
 */
export default function ConceptCard({
  concept,
  isOpen,
  onToggle,
}: ConceptCardProps) {
  return (
    <div
      className="help-concept"
      id={conceptDomId(concept.id)}
      data-open={isOpen}
    >
      <button
        type="button"
        className="help-concept-header"
        onClick={() => onToggle(concept.id)}
        aria-expanded={isOpen}
      >
        <Icon
          icon={isOpen ? 'chevron-down' : 'chevron-right'}
          size={12}
          className="help-concept-chevron"
        />
        <span className="help-concept-title">{concept.title}</span>
        <span className="help-concept-teaser">{concept.teaser}</span>
      </button>

      <Collapse isOpen={isOpen}>
        <div className="help-concept-body">
          {concept.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>
              <RichText>{paragraph}</RichText>
            </p>
          ))}
          {concept.code && <CodeBlock>{concept.code}</CodeBlock>}
          {concept.gotcha && (
            <p className="help-gotcha">
              <Icon icon="warning-sign" size={12} intent="warning" />
              <span>
                <RichText>{concept.gotcha}</RichText>
              </span>
            </p>
          )}
        </div>
      </Collapse>
    </div>
  );
}
