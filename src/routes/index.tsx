import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Flex, Title } from '@mantine/core';

export const Route = createFileRoute('/')({ component: App });

function App() {
  // state
  return (
    <Flex direction="column" gap="md">
      <Title order={1}>Welcome to Dashboard TH</Title>

      <Link to="/candidates">
        <Button>Go to candidates</Button>
      </Link>
    </Flex>
  );
}
