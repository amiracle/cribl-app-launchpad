import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#00cccc"/>
            <path d="M2 17l10 5 10-5" stroke="#00cccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="#00cccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Cribl Launchpad</span>
        </Link>
        {!isHome && (
          <Link to="/" className="back-link">
            &larr; Back to Dashboard
          </Link>
        )}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
