import type { ReactNode } from 'react';

/**
 * Render the light inline markup the help content is written in: `` `code` ``,
 * `**bold**` and `*emphasis*`. Deliberately tiny — the content files are
 * prose with a few technical terms in them, not documents.
 */

interface RichTextProps {
  /** Source text, possibly containing inline markup. */
  children: string;
}

const INLINE_PATTERN =
  /`(?<code>[^`]+)`|\*\*(?<bold>[^*]+)\*\*|\*(?<emphasis>[^*]+)\*/g;

/**
 * Render a string with inline code / bold / emphasis markup.
 * @param props - Component props.
 * @param props.children - Source text.
 * @returns Formatted inline content.
 */
export default function RichText({ children }: RichTextProps) {
  return <>{renderInline(children)}</>;
}

/**
 * Split source text into plain runs and marked-up runs.
 * @param source - Text to format.
 * @returns Alternating strings and elements.
 */
function renderInline(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  INLINE_PATTERN.lastIndex = 0;
  let match = INLINE_PATTERN.exec(source);
  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(source.slice(lastIndex, match.index));
    }
    const { code, bold, emphasis } = match.groups ?? {};
    if (code !== undefined) {
      nodes.push(<code key={key++}>{code}</code>);
    } else if (bold !== undefined) {
      nodes.push(<strong key={key++}>{bold}</strong>);
    } else if (emphasis !== undefined) {
      nodes.push(<em key={key++}>{emphasis}</em>);
    }
    lastIndex = match.index + match[0].length;
    match = INLINE_PATTERN.exec(source);
  }

  if (lastIndex < source.length) nodes.push(source.slice(lastIndex));
  return nodes;
}
