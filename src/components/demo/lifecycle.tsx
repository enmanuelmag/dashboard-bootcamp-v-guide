import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  TextInput,
  Badge,
  Divider,
  Title,
  Paper,
  Group,
  Stack,
} from '@mantine/core';

type LogEntry = {
  id: number;
  message: string;
  timestamp: number;
};

// Inner component with cleanup effect
function TimerComponent() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    console.log('[TimerComponent] Montado - Iniciando intervalo');

    const interval = setInterval(() => {
      console.log('[TimerComponent] Tick del intervalo');
      setTime((t) => t + 1);
    }, 1000);

    // Función de limpieza
    return () => {
      console.log('[TimerComponent] Limpieza - Borrando intervalo');
      clearInterval(interval);
    };
  }, []);

  return (
    <Paper p="md" withBorder>
      <Text fw={500}>Componente Temporizador (Montado)</Text>
      <Text size="sm" c="dimmed">
        Este componente tiene un setInterval. Abre la consola para ver la
        limpieza al desmontar.
      </Text>
      <Text size="sm">Segundos: {time}</Text>
    </Paper>
  );
}

export function LifecycleDemo() {
  const [counter, setCounter] = useState(0);
  const [name, setName] = useState('Alice');
  const [showTimer, setShowTimer] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);

  // Helper to add log entries
  const addLog = (message: string, skipUpdate: boolean = false) => {
    const id = logIdRef.current++;
    if (!skipUpdate) {
      setLogs((prev) => {
        const newLogs = [{ id, message, timestamp: Date.now() }, ...prev];
        return newLogs;
      });
    }
    console.log(`[LOG] ${message}`);
  };

  // Effect 1: No dependencies - runs after every render
  useEffect(() => {
    addLog(
      `Efecto 1: Sin deps - Se ejecuta después de cada render (contador: ${counter}, nombre: "${name}")`,
      true,
    );
  });

  // Effect 2: Empty dependency array - runs once on mount
  useEffect(() => {
    addLog(
      'Efecto 2: Deps vacío - Se ejecuta solo una vez al montar el componente',
    );

    return () => {
      addLog('Efecto 2 Limpieza: Se ejecuta al desmontar el componente');
    };
  }, []);

  // Efecto 3: Depende de 'nombre' - se ejecuta cuando nombre cambia
  useEffect(() => {
    addLog(
      `Efecto 3: Depende de [nombre] - Se ejecuta cuando "nombre" cambia. Ha cambiado a "${name}"`,
    );
  }, [name]);

  // Efecto 4: Depende de 'contador' - se ejecuta cuando contador cambia
  useEffect(() => {
    addLog(
      `Efecto 4: Depende de [contador] - Se ejecuta cuando "contador" cambia. Ha cambiado a ${counter}`,
    );
  }, [counter]);

  return (
    <Box p="md">
      <Title order={2} mb="lg">
        Demostración del Ciclo de Vida con useEffect
      </Title>

      <Stack gap="md">
        {/* Controls */}
        <Paper p="md" withBorder>
          <Title order={3} mb="md">
            Controles
          </Title>

          <Group grow>
            <div>
              <Text fw={500} mb="xs">
                Counter: {counter}
              </Text>
              <Button onClick={() => setCounter((c) => c + 1)} fullWidth>
                Incrementar Contador
              </Button>
            </div>

            <div>
              <Text fw={500} mb="xs">
                Entrada de Nombre
              </Text>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa un nombre"
              />
              <Text size="sm" c="dimmed" mt="xs">
                Actual: {name}
              </Text>
            </div>

            <div>
              <Text fw={500} mb="xs">
                Componente Temporizador
              </Text>
              <Button
                onClick={() => setShowTimer((s) => !s)}
                color={showTimer ? 'red' : 'green'}
                fullWidth
              >
                {showTimer ? 'Desmontar Temporizador' : 'Montar Temporizador'}
              </Button>
            </div>
          </Group>
        </Paper>

        {/* Timer Component */}
        {showTimer && <TimerComponent />}

        <Divider />

        {/* Event Log */}
        <Paper p="md" withBorder>
          <Title order={3} mb="md">
            Effect Event Log
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Check the browser console to see detailed logs. Below are the
            effects that ran:
          </Text>

          <Box
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: '4px',
              padding: '8px',
            }}
          >
            {logs.length === 0 ? (
              <Text c="dimmed">
                No effects logged yet. Try changing values above.
              </Text>
            ) : (
              <Stack gap="xs">
                {logs.map((log) => (
                  <Box
                    key={log.id}
                    p="xs"
                    style={{
                      borderLeft: '3px solid var(--mantine-color-blue-5)',
                    }}
                  >
                    <Text size="sm" fw={500}>
                      {log.message}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>

        <Divider />

        {/* Explanation */}
        <Paper
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}
        >
          <Title order={4} mb="md">
            Explicación de los efectos (en español)
          </Title>

          <Stack gap="sm">
            <Box>
              <Badge color="red">useEffect(() =&gt; {'{...}'})</Badge>
              <Text size="sm" mt="xs">
                Sin dependencias: Se ejecuta{' '}
                <strong>después de cada render</strong> (similar a
                componentDidUpdate). No se ejecuta en el primer render.
              </Text>
            </Box>

            <Box>
              <Badge color="green">useEffect(() =&gt; {'{...}'}, [])</Badge>
              <Text size="sm" mt="xs">
                Arreglo vacío: Se ejecuta{' '}
                <strong>solo una vez al montar</strong> (como
                componentDidMount). La limpieza se ejecuta al desmontar.
              </Text>
            </Box>

            <Box>
              <Badge color="blue">useEffect(() =&gt; {'{...}'}, [dep])</Badge>
              <Text size="sm" mt="xs">
                Con dependencias: Se ejecuta{' '}
                <strong>solo cuando las dependencias cambian</strong>
              </Text>
            </Box>

            <Box>
              <Badge color="orange">Cleanup function</Badge>
              <Text size="sm" mt="xs">
                La función de limpieza se ejecuta antes de que el componente se
                desmonte o antes de que se ejecute el efecto nuevamente (si las
                dependencias cambian).
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
