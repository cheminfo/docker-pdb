import { Card } from '@blueprintjs/core';
import type { ReactNode } from 'react';

import type { AsyncState } from '../useAsync.ts';

interface PanelProps<TData> {
  title: string;
  state: AsyncState<TData>;
  errorPrefix: string;
  children: (data: TData) => ReactNode;
  /** Optional one-line description rendered under the title. */
  description?: string;
}

/**
 * Wrap an async-fetched chart with a card frame and consistent
 * loading / error placeholders. The render-prop is invoked only
 * when the underlying fetch succeeded.
 * @param props - Panel props.
 * @param props.title - Heading rendered as `<h3>` at the top of the card.
 * @param props.state - Lifecycle of the async data feeding the chart.
 * @param props.errorPrefix - Sentence prefix shown next to the error message.
 * @param props.children - Render-prop invoked with the resolved data.
 * @param props.description - Optional one-line description under the heading.
 * @returns Card React element.
 */
export default function Panel<TData>({
  title,
  state,
  errorPrefix,
  children,
  description,
}: PanelProps<TData>) {
  return (
    <Card className="panel">
      <h3>{title}</h3>
      {description ? <p className="panel-description">{description}</p> : null}
      {state.status === 'loading' ? (
        <p className="placeholder">Loading…</p>
      ) : state.status === 'error' ? (
        <p className="placeholder">
          {errorPrefix}: {state.error.message}
        </p>
      ) : (
        children(state.data)
      )}
    </Card>
  );
}
