import { useState, useCallback, useRef, memo } from 'react';
import {
  Box,
  Button,
  Badge,
  Text,
  Group,
  Stack,
  Switch,
  Card,
  Title,
  Paper,
  Divider,
} from '@mantine/core';

// Child component wrapped in React.memo
const ChildButton = memo(
  ({
    onClick,
    useCallbackEnabled,
  }: {
    onClick: () => void;
    useCallbackEnabled: boolean;
  }) => {
    const renderCountRef = useRef(0);
    renderCountRef.current += 1;

    console.log(
      `[ChildButton] Render #${renderCountRef.current} ${useCallbackEnabled ? '(useCallback ENCENDIDO)' : '(useCallback APAGADO)'}`,
    );

    return (
      <Paper p="md" withBorder>
        <Group>
          <Button onClick={onClick} variant="light">
            Hazme clic
          </Button>
          <Badge color={renderCountRef.current > 1 ? 'red' : 'green'}>
            Renderizados: {renderCountRef.current}
          </Badge>
        </Group>
        <Text size="xs" c="dimmed" mt="xs">
          Revisa la consola para ver cuándo este componente se re-renderiza
        </Text>
      </Paper>
    );
  },
);

ChildButton.displayName = 'ChildButton';

export function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  const [useCallbackEnabled, setUseCallbackEnabled] = useState(true);

  // Con useCallback - solo cambia cuando 'count' cambia
  const handleClickWithCallback = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  // Sin useCallback - recreada en cada render
  const handleClickWithoutCallback = () => {
    setCount((c) => c + 1);
  };

  const handleClick = useCallbackEnabled
    ? handleClickWithCallback
    : handleClickWithoutCallback;

  return (
    <Box p="md">
      <Title order={2} mb="lg">
        Demostración de useCallback: Previniendo Re-renderizaciones Innecesarias
        de Componentes Hijos
      </Title>

      <Stack gap="md">
        {/* Instructions */}
        <Paper
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-yellow-0)' }}
        >
          <Text fw={500} mb="xs">
            📝 Qué está pasando:
          </Text>
          <Text size="sm">
            El ChildButton está envuelto en React.memo. Solo se re-renderiza
            cuando sus props cambian. Activa/desactiva useCallback y haz clic en
            "Cambiar Otro Estado" para ver la diferencia.
          </Text>
        </Paper>

        {/* Toggle useCallback */}
        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Modo useCallback</Text>
              <Text size="sm" c="dimmed">
                {useCallbackEnabled
                  ? 'ENCENDIDO: la función handleClick está memoizada'
                  : 'APAGADO: handleClick se recrea en cada render'}
              </Text>
            </div>
            <Switch
              checked={useCallbackEnabled}
              onChange={(e) => setUseCallbackEnabled(e.currentTarget.checked)}
              color={useCallbackEnabled ? 'green' : 'red'}
              label={useCallbackEnabled ? '✅ ENCENDIDO' : '❌ APAGADO'}
            />
          </Group>
        </Card>

        {/* Parent State Display */}
        <Card withBorder p="md">
          <Title order={4} mb="md">
            Estado del Padre
          </Title>

          <Group grow>
            <Box>
              <Text fw={500}>Contador: {count}</Text>
              <Button onClick={() => setCount((c) => c + 1)} fullWidth>
                Incrementar Contador
              </Button>
              <Text size="xs" c="dimmed" mt="xs">
                Esto cambia la dependencia de handleClick
              </Text>
            </Box>

            <Box>
              <Text fw={500}>Otro Estado: {otherState}</Text>
              <Button
                onClick={() => setOtherState((s) => s + 1)}
                variant="light"
                fullWidth
              >
                Cambiar Otro Estado
              </Button>
              <Text size="xs" c="dimmed" mt="xs">
                Esto NO afecta handleClick
              </Text>
            </Box>
          </Group>
        </Card>

        <Divider />

        {/* Child Component */}
        <Card withBorder p="md">
          <Title order={4} mb="md">
            Componente Hijo (envuelto en React.memo)
          </Title>

          <ChildButton
            onClick={handleClick}
            useCallbackEnabled={useCallbackEnabled}
          />

          <Box
            mt="lg"
            p="sm"
            style={{
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderRadius: '4px',
            }}
          >
            <Text size="sm" fw={500}>
              📊 Observaciones:
            </Text>
            <Text size="sm" mt="xs" c="dimmed">
              <strong>Con useCallback ENCENDIDO:</strong> ChildButton solo se
              re-renderiza cuando haces clic en "Incrementar Contador" (porque
              handleClick depende de count).
            </Text>
            <Text size="sm" mt="xs" c="dimmed">
              <strong>Con useCallback APAGADO:</strong> ChildButton se
              re-renderiza cada vez que haces clic en "Cambiar Otro Estado"
              porque se crea una nueva función handleClick en cada
              renderización.
            </Text>
          </Box>
        </Card>

        {/* Explanation */}
        <Paper
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}
        >
          <Title order={4} mb="md">
            Por qué useCallback es Importante
          </Title>

          <Stack gap="sm">
            <Box>
              <Badge color="blue">
                useCallback(() =&gt; {'{...}'}, [deps])
              </Badge>
              <Text size="sm" mt="xs">
                Memoiza una función callback. Devuelve la misma referencia de
                función si las dependencias no han cambiado.
              </Text>
            </Box>

            <Box>
              <Text fw={500} size="sm">
                ✅ Usa cuando:
              </Text>
              <Text size="sm" c="dimmed">
                - Pasas callbacks a componentes hijos memoizados (React.memo) -
                Usas callbacks como dependencias en otros hooks (useMemo,
                useEffect)
              </Text>
            </Box>

            <Box>
              <Text fw={500} size="sm">
                ❌ Evita cuando:
              </Text>
              <Text size="sm" c="dimmed">
                - Los componentes hijos no están memoizados (cada render sucede
                de todos modos) - La lista de dependencias es más larga que el
                callback en sí
              </Text>
            </Box>

            <Box>
              <Text size="sm" c="orange" fw={500}>
                💡 Hint: useCallback is for optimization. Don't use it unless
                profiling shows it helps.
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
