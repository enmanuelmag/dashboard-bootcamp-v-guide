import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Center, Divider, Flex, Text, Title } from '@mantine/core';
import { useGetUser } from '#/hooks/mutation/auth';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const user = useGetUser();

  return (
    <Center pt="xl">
      <Flex direction="column" gap="lg">
        <Center>
          <Title order={1}>Welcome to Dashboard TH</Title>
        </Center>

        <Divider />

        <Flex direction="column" align="center" gap="xs">
          <Text>
            En este proyecto puedes ver diferentes características y componentes
            en acción
          </Text>
          <Text>
            Tales como ciclo de vida de componentes, manejo de estado, fetching
            de datos y mas
          </Text>
        </Flex>

        <Divider />

        <Flex direction="column" align="center" gap="xs">
          {user && (
            <Link to="/candidates">
              <Button>Go to candidates</Button>
            </Link>
          )}
          {!user && (
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Center>
  );
}
