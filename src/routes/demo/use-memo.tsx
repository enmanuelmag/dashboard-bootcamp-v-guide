import { UseMemoDemo } from '#/components/demo/use-memo';
import { Box } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/use-memo')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box>
      <UseMemoDemo />
    </Box>
  );
}
