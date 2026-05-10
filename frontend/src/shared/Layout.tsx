import { Navbar, Tab, Tabs } from '@blueprintjs/core';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface LayoutProps {
  children: ReactNode;
}

const NAV_TABS = [
  { id: '/', label: 'Home' },
  { id: '/browse', label: 'Browse' },
  { id: '/scripting', label: 'Scripting' },
  { id: '/molecules', label: 'Molecules' },
  { id: '/stats', label: 'Stats' },
  { id: '/omega', label: 'Omega' },
  { id: '/api', label: 'API' },
  { id: '/settings', label: 'Settings' },
  { id: '/about', label: 'About' },
] as const;

/**
 * Application shell with a Blueprint Navbar (brand + tabs) and the routed page below it.
 * @param props - Component props.
 * @param props.children - Page content rendered below the nav bar.
 * @returns The shell element wrapping the active route.
 */
export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab =
    NAV_TABS.find(
      (tab) => tab.id !== '/' && location.pathname.startsWith(tab.id),
    )?.id ?? '/';

  return (
    <div className="app-shell">
      <Navbar className="topnav">
        <Navbar.Group>
          <Navbar.Heading className="topnav-brand">
            <img src="/logo.svg" alt="" className="topnav-logo" />
            <span>
              PDB <em>quick</em> View
            </span>
          </Navbar.Heading>
          <Navbar.Divider />
          <Tabs
            id="topnav-tabs"
            selectedTabId={activeTab}
            onChange={(tabId) => {
              void navigate(tabId as string);
            }}
            size="large"
          >
            {NAV_TABS.map((tab) => (
              <Tab key={tab.id} id={tab.id} title={tab.label} />
            ))}
          </Tabs>
        </Navbar.Group>
      </Navbar>
      <main className="app-main">{children}</main>
    </div>
  );
}
