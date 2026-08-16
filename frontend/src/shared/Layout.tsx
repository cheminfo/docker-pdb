import type { ReactNode } from 'react';
import { CiteButton, EcosystemButton, EcosystemLinks } from 'react-cheminfo/ui';
import { Link, NavLink } from 'react-router';

import { BrandMark, Wordmark } from './Brand.tsx';
import SeedingBanner from './SeedingBanner.tsx';
import { PAPER } from './paper.ts';

interface LayoutProps {
  children: ReactNode;
}

const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/scripting', label: 'Scripting' },
  { to: '/molecules', label: 'Molecules' },
  { to: '/stats', label: 'Stats' },
  { to: '/api', label: 'API' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'About' },
] as const;

/**
 * Application shell: the header every *.cheminfo.org site carries — the brand
 * linking home, the pages next to it, and the utilities pushed right — with
 * the routed page below it.
 * @param props - Component props.
 * @param props.children - Page content rendered below the header.
 * @returns The shell element wrapping the active route.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="brand" title="pdb.cheminfo.org">
            <BrandMark />
            <Wordmark />
          </Link>
          <nav className="app-header-nav">
            {PAGES.map((page) => (
              <NavLink
                key={page.to}
                to={page.to}
                end={page.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link--active' : 'nav-link'
                }
              >
                {page.label}
              </NavLink>
            ))}
          </nav>
          <div className="app-header-actions">
            <CiteButton reference={PAPER} />
            <EcosystemButton currentSiteId="pdb" />
          </div>
        </div>
      </header>
      <SeedingBanner />
      <main className="app-main">{children}</main>
      <footer className="app-footer no-print">
        <div className="app-footer__inner">
          <EcosystemLinks currentSiteId="pdb" />
        </div>
      </footer>
    </div>
  );
}
