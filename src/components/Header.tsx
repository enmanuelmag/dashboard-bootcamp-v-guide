import { Link } from '@tanstack/react-router';
import { useAppStore } from '#/store';
import { Button, useMantineColorScheme } from '@mantine/core';
import React from 'react';

export default function Header() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const { setColorScheme } = useMantineColorScheme();

  React.useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          {theme === 'light' && (
            <Button
              size="xs"
              color="orange"
              onClick={() => {
                setTheme('dark');
              }}
            >
              Light
            </Button>
          )}
          {theme === 'dark' && (
            <Button
              size="xs"
              color="dark"
              onClick={() => {
                setTheme('light');
              }}
            >
              Dark
            </Button>
          )}
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
          <Link
            to="/form/$candidateId"
            params={{
              candidateId: 'new',
            }}
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Form
          </Link>
          <Link
            to="/demo/class-func"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Class vs Func
          </Link>
          <Link
            to="/demo/query-flow"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Query Flow
          </Link>
          <Link
            to="/demo/lifecycle"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Lifecycle
          </Link>
          <Link
            to="/demo/layout-effect"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Layout Effect
          </Link>
          <Link
            to="/demo/memo-hoc"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Memo & HOC
          </Link>
          <Link
            to="/demo/use-callback"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            useCallback
          </Link>
          <Link
            to="/demo/use-memo"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            useMemo
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            About
          </Link>
          <a
            href="https://tanstack.com/start/latest/docs/framework/react/overview"
            className="nav-link"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
        </div>
      </nav>
    </header>
  );
}
