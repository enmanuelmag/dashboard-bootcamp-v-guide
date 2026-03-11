import { ClassComponent } from '#/components/demo/class-comp';
import { FunctionalComponent } from '#/components/demo/func-comp';
import { Box, Divider, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box>
      <Title order={2}>Functional Component</Title>
      <FunctionalComponent />

      <Divider my="md" />

      <Title order={2}>Class Component</Title>
      <ClassComponent />
    </Box>
  );
}
