import { LifecycleDemo } from '#/components/demo/lifecycle';
import { Box } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/lifecycle')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box>
      <LifecycleDemo />
    </Box>
  );
}
