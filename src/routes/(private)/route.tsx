import DataRepo from '#/api/datasource';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/(private)')({
  component: RouteComponent,
  beforeLoad: async () => {
    console.log('Checking auth');
    const user = await DataRepo.getCurrentUser();
    if (!user) {
      console.log('No user, redirecting');
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
