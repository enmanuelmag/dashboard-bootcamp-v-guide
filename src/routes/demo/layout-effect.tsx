import { LayoutEffectDemo } from '#/components/demo/layout-effect';
import { Box } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/layout-effect')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box>
      <LayoutEffectDemo />
    </Box>
  );
}
