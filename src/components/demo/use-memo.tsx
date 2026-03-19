import { useState, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Badge,
  Table,
  Text,
  Group,
  Stack,
  Switch,
  Card,
  TextInput,
  Title,
  Paper,
  Grid,
} from '@mantine/core';

type Product = {
  id: number;
  name: string;
  price: number;
};

// Generar productos simulados
function generateProducts(): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= 1000; i++) {
    products.push({
      id: i,
      name: `Producto ${i}`,
      price: Math.floor(Math.random() * 100000) + 10,
    });
  }
  return products;
}

// Con useMemo
function FilteredListWithMemo({
  filter,
  sortAsc,
}: {
  filter: string;
  sortAsc: boolean;
}) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const products = useMemo(() => generateProducts(), []);

  const filtered = useMemo(() => {
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()),
    );

    if (sortAsc) {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, filter, sortAsc]);

  return (
    <Box>
      <Text fw={500} mb="md">
        Renderizados: <Badge>{renderCountRef.current}</Badge>
      </Text>
      <Text size="sm" mb="md">
        Resultados filtrados: {filtered.length}
      </Text>
      <Box
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: '4px',
        }}
      >
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Precio</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.slice(0, 20).map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>${product.price}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}

// Sin useMemo
function FilteredListWithoutMemo({
  filter,
  sortAsc,
}: {
  filter: string;
  sortAsc: boolean;
}) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // Re-generar productos en cada render (¡costoso!)
  const products = generateProducts();

  // Filtrar y ordenar sin memoización
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  );

  if (sortAsc) {
    filtered.sort((a, b) => a.price - b.price);
  } else {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <Box>
      <Text fw={500} mb="md">
        Renderizados: <Badge color="red">{renderCountRef.current}</Badge>
      </Text>
      <Text size="sm" mb="md">
        Resultados filtrados: {filtered.length}
      </Text>
      <Box
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: '4px',
        }}
      >
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Precio</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.slice(0, 20).map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>${product.price}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export function UseMemoDemo() {
  const [filter, setFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [uselessClicks, setUselessClicks] = useState(0);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  return (
    <Box p="md">
      <Title order={2} mb="lg">
        Demostración de useMemo: Filtrado + Ordenamiento Costosos
      </Title>

      <Stack gap="md">
        {/* Instructions */}
        <Paper
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-yellow-0)' }}
        >
          <Text fw={500} mb="xs">
            ℹ️ Qué está pasando:
          </Text>
          <Text size="sm">
            Haz clic en "Clics inútiles" para incrementar estado no relacionado.
            Observa cuántas veces cada lista recalcula el filtro/ordenamiento.
            Con useMemo ENCENDIDO, el número de renders se mantiene bajo. Con
            useMemo APAGADO, recalcula cada vez que el padre se re-renderiza.
          </Text>
        </Paper>

        {/* Controls */}
        <Card withBorder p="md">
          <Title order={4} mb="md">
            Controles
          </Title>

          <Stack gap="md">
            <Box>
              <TextInput
                label="Filtrar por nombre de producto"
                placeholder="p. ej., 'Producto 5'"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Box>

            <Group grow>
              <Box>
                <Switch
                  label={
                    sortAsc
                      ? 'Ordenar: Precio ↑ (Ascendente)'
                      : 'Ordenar: Precio ↓ (Descendente)'
                  }
                  checked={sortAsc}
                  onChange={(e) => setSortAsc(e.currentTarget.checked)}
                />
              </Box>

              <Box>
                <Switch
                  label={
                    useMemoEnabled
                      ? 'useMemo: ENCENDIDO ✅'
                      : 'useMemo: APAGADO ❌'
                  }
                  checked={useMemoEnabled}
                  onChange={(e) => setUseMemoEnabled(e.currentTarget.checked)}
                  color={useMemoEnabled ? 'green' : 'red'}
                />
              </Box>
            </Group>

            <Box>
              <Text fw={500} mb="xs">
                Clics inútiles (estado no relacionado): {uselessClicks}
              </Text>
              <Button
                onClick={() => setUselessClicks((c) => c + 1)}
                variant="light"
                fullWidth
              >
                Haz clic para cambiar estado no relacionado
              </Button>
              <Text size="xs" c="dimmed" mt="xs">
                Esto activará una re-renderización de todo el componente
              </Text>
            </Box>
          </Stack>
        </Card>

        {/* Comparison */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder p="md">
              <Group justify="space-between" mb="md">
                <Title order={4}>Con useMemo ✅</Title>
                <Badge color="green">Optimizado</Badge>
              </Group>
              {useMemoEnabled && (
                <FilteredListWithMemo filter={filter} sortAsc={sortAsc} />
              )}
              {!useMemoEnabled && (
                <Text c="dimmed">
                  Deshabilitado - Activa el interruptor de arriba para ver esta
                  versión
                </Text>
              )}
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder p="md">
              <Group justify="space-between" mb="md">
                <Title order={4}>Sin useMemo ❌</Title>
                <Badge color="red">No Optimizado</Badge>
              </Group>
              {!useMemoEnabled ? (
                <FilteredListWithoutMemo filter={filter} sortAsc={sortAsc} />
              ) : (
                <Text c="dimmed">
                  Deshabilitado - Activa el interruptor de arriba para ver esta
                  versión
                </Text>
              )}
            </Card>
          </Grid.Col>
        </Grid>

        {/* Explanation */}
        <Paper
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}
        >
          <Title order={4} mb="md">
            Cómo Funciona useMemo
          </Title>

          <Stack gap="sm">
            <Box>
              <Text fw={500} size="sm">
                useMemo(() =&gt; cálculoCostoso(), [dependencias])
              </Text>
              <Text size="sm" c="dimmed">
                Memoiza el resultado de un cálculo costoso. Solo recalcula
                cuando las dependencias cambian.
              </Text>
            </Box>

            <Box>
              <Text fw={500} size="sm">
                ✅ Usa cuando:
              </Text>
              <Text size="sm" c="dimmed">
                - Filtrar/ordenar arrays grandes - Cálculos complejos - Crear
                objetos/arrays que se pasan a componentes memoizados
              </Text>
            </Box>

            <Box>
              <Text fw={500} size="sm">
                ❌ Evita cuando:
              </Text>
              <Text size="sm" c="dimmed">
                - El cálculo ya es rápido - Estás memoizando valores primitivos
                - Optimización prematura sin perfilación
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
