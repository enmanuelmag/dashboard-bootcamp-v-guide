import { MemoHocDemo } from '#/components/demo/memo-hoc';
import { Box } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/memo-hoc')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box>
      <MemoHocDemo />
    </Box>
  );
}
