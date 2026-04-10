import { Link } from '@tanstack/react-router';
import { useAppStore } from '#/store';
import { Button, Flex, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import { useGetUser, useLogoutMutation } from '#/hooks/mutation/auth';

export default function Header() {
  const user = useGetUser();

  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const logoutMutation = useLogoutMutation();

  const { setColorScheme } = useMantineColorScheme();

  React.useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 sm:py-4">
        <Flex align="center" gap="md">
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

            {user && (
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
            )}

            <Link
              to="/about"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              About
            </Link>
          </div>
        </Flex>
        <Flex align="center" gap="md">
          {user && (
            <Button size="xs" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          )}
        </Flex>
      </nav>
    </header>
  );
}
