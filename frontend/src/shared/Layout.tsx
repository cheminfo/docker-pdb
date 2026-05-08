import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Application shell with a top navigation bar (brand, logo, page links).
 * @param props - Component props.
 * @param props.children - Page content rendered below the nav bar.
 * @returns The shell element wrapping the active route.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <nav className="topnav">
        <div className="topnav-inner">
          <NavLink to="/" end className="topnav-brand">
            <img src="/logo.svg" alt="" className="topnav-logo" />
            <span>
              PDB <em>quick</em> View
            </span>
          </NavLink>
          <div className="topnav-links">
            <NavLink to="/" end className="topnav-link">
              Home
            </NavLink>
            <NavLink to="/browse" className="topnav-link">
              Browse
            </NavLink>
            <NavLink to="/animate" className="topnav-link">
              Animate
            </NavLink>
            <NavLink to="/molecules" className="topnav-link">
              Molecules
            </NavLink>
            <NavLink to="/stats" className="topnav-link">
              Stats
            </NavLink>
            <NavLink to="/omega" className="topnav-link">
              Omega
            </NavLink>
            <NavLink to="/api" className="topnav-link">
              API
            </NavLink>
            <NavLink to="/about" className="topnav-link">
              About
            </NavLink>
          </div>
        </div>
      </nav>
      <main className="app-main">{children}</main>
    </div>
  );
}
