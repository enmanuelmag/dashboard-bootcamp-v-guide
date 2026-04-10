import { UseCallbackDemo } from '#/components/demo/use-callback';
import { Box } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/use-callback')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box>
      <UseCallbackDemo />
    </Box>
  );
}
