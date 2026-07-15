import { Button, InputGroup, Tab, Tabs } from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import HelpBasics from './HelpBasics.tsx';
import HelpPhilosophy from './HelpPhilosophy.tsx';
import HelpRecipes from './HelpRecipes.tsx';
import HelpReference from './HelpReference.tsx';
import HelpSearchResults from './HelpSearchResults.tsx';
import HelpSelections from './HelpSelections.tsx';
import type { HelpTabId } from './search.ts';
import { searchHelp } from './search.ts';

/**
 * The scripting user guide, shown in the Help floating window.
 *
 * Two audiences, one panel: `Start` and `Basics` teach the mental model and
 * the programming ideas to someone who has never scripted, while
 * `Selections`, `Reference` and `Recipes` are the lookup material. Search
 * spans all of them, because a reader who knows what they want should not
 * have to guess which tab it lives on.
 */

/**
 * Render the scripting user guide.
 * @returns The help panel.
 */
export default function ScriptingHelp() {
  const [query, setQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<HelpTabId>('start');

  const trimmedQuery = query.trim();
  const results = useMemo(() => searchHelp(trimmedQuery), [trimmedQuery]);
  const isSearching = trimmedQuery.length > 0;

  return (
    <div className="scripting-help">
      <div className="help-search">
        <InputGroup
          leftIcon="search"
          placeholder="Search the guide — try “colour by chain”, “distance”, “zoom”…"
          value={query}
          onValueChange={setQuery}
          round
          rightElement={
            query.length > 0 ? (
              <Button
                icon="cross"
                variant="minimal"
                size="small"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              />
            ) : undefined
          }
        />
      </div>

      {isSearching ? (
        <HelpSearchResults query={trimmedQuery} results={results} />
      ) : (
        <Tabs
          id="scripting-help-tabs"
          selectedTabId={selectedTab}
          onChange={(tabId) => setSelectedTab(tabId as HelpTabId)}
          className="help-tabs"
          renderActiveTabPanelOnly
        >
          <Tab id="start" title="Start here" panel={<HelpPhilosophy />} />
          <Tab id="basics" title="Basics" panel={<HelpBasics />} />
          <Tab id="selections" title="Selections" panel={<HelpSelections />} />
          <Tab id="reference" title="Reference" panel={<HelpReference />} />
          <Tab id="recipes" title="Recipes" panel={<HelpRecipes />} />
        </Tabs>
      )}
    </div>
  );
}
