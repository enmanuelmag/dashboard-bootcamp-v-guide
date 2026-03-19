import { useState, useEffect, useRef, memo } from 'react';
import {
  Box,
  TextInput,
  Select,
  Switch,
  Badge,
  Loader,
  Card,
  Text,
  Group,
  Stack,
  Title,
  Paper,
  Grid,
} from '@mantine/core';

// Fake weather data type
type WeatherData = {
  temp: number;
  condition: string;
};

// Simulates an external library component - cannot be modified
// This component simulates an API call on mount
function WeatherWidget({ city, unit }: { city: string; unit: 'C' | 'F' }) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const apiCallCountRef = useRef(0);

  // Sin optimización - SE EJECUTA en cada render (malo sin memo)
  // Con triggerRender, forzamos que se ejecute cada vez que cambia el padre
  useEffect(() => {
    apiCallCountRef.current += 1;
    console.log(
      `🌤 [WeatherWidget] API Call #${apiCallCountRef.current} - Fetching weather for ${city}...`,
    );

    setLoading(true);
    const timer = setTimeout(() => {
      // Fake API response
      const fakeTemp = Math.floor(Math.random() * 30) + 5;
      setWeather({ temp: fakeTemp, condition: 'Sunny' });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [city, unit]);

  console.log('[WeatherWidget] Renderizado - Props:', { city, unit });

  return (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={500}>
            {city} ({unit}°)
          </Text>
          <Badge size="lg">Llamadas API: {apiCallCountRef.current}</Badge>
        </div>
        <Badge color="blue">Renderizados: {renderCountRef.current}</Badge>
      </Group>

      {loading ? (
        <Group>
          <Loader size="sm" />
          <Text size="sm">Buscando clima...</Text>
        </Group>
      ) : (
        weather && (
          <Box>
            <Text size="xl" fw={700}>
              {weather.temp}°{unit}
            </Text>
            <Text size="sm" c="dimmed">
              {weather.condition}
            </Text>
          </Box>
        )
      )}
    </Card>
  );
}

// Versión memoizada - evita re-obtener cuando props no relacionados cambian
const MemoizedWeatherWidget = memo(WeatherWidget);

export function MemoHocDemo() {
  const [searchText, setSearchText] = useState('');
  const [city, setCity] = useState<string | null>('Barcelona');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [memoEnabled, setMemoEnabled] = useState(true);

  // Choose which component to use based on memo toggle
  const WidgetComponent = memoEnabled ? MemoizedWeatherWidget : WeatherWidget;

  const cities = [
    { value: 'Barcelona', label: 'Barcelona' },
    { value: 'Madrid', label: 'Madrid' },
    { value: 'Valencia', label: 'Valencia' },
    { value: 'Bilbao', label: 'Bilbao' },
    { value: 'Sevilla', label: 'Sevilla' },
  ];

  return (
    <Box p="md">
      <Title order={2} mb="lg">
        Demostración de React.memo: Previniendo llamadas API innecesarias
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
            El WeatherWidget obtiene datos cuando sus props (ciudad o unidad)
            cambian. Activa/desactiva memo y escribe en el cuadro de búsqueda.
            Con memo APAGADO, el widget recarga en cada pulsación. Con memo
            ENCENDIDO, solo recarga cuando la ciudad o unidad realmente cambian.
          </Text>
        </Paper>

        {/* Controls */}
        <Card withBorder p="md">
          <Title order={4} mb="md">
            Controles
          </Title>

          <Stack gap="md">
            {/* Search input (unrelated state) */}
            <Box>
              <Text fw={500} mb="xs">
                Búsqueda (no relacionada con el clima):
              </Text>
              <TextInput
                placeholder="Escribe cualquier cosa..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Esto cambia el estado del padre pero NO debería afectar el
                widget de clima
              </Text>
            </Box>

            <Group grow>
              {/* City selector */}
              <Box>
                <Text fw={500} mb="xs">
                  Seleccionar ciudad:
                </Text>
                <Select
                  value={city}
                  onChange={(value) => setCity(value)}
                  data={cities}
                  searchable
                />
              </Box>

              {/* Unit toggle */}
              <Box>
                <Text fw={500} mb="xs">
                  Unidad de temperatura:
                </Text>
                <Group>
                  <Badge
                    color={unit === 'C' ? 'blue' : 'gray'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setUnit('C')}
                  >
                    °C
                  </Badge>
                  <Badge
                    color={unit === 'F' ? 'blue' : 'gray'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setUnit('F')}
                  >
                    °F
                  </Badge>
                </Group>
              </Box>
            </Group>

            {/* Memo toggle */}
            <Group
              justify="space-between"
              p="sm"
              style={{
                backgroundColor: 'var(--mantine-color-gray-0)',
                borderRadius: '4px',
              }}
            >
              <div>
                <Text fw={500}>
                  React.memo {memoEnabled ? '✅ ENCENDIDO' : '❌ APAGADO'}
                </Text>
                <Text size="sm" c="dimmed">
                  {memoEnabled
                    ? 'El widget solo recarga cuando sus props cambian'
                    : 'El widget recarga en cada renderización del padre'}
                </Text>
              </div>
              <Switch
                checked={memoEnabled}
                onChange={(e) => setMemoEnabled(e.currentTarget.checked)}
                color={memoEnabled ? 'green' : 'red'}
              />
            </Group>
          </Stack>
        </Card>

        {/* Weather Widget */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box>
              <Text fw={500} mb="md">
                {memoEnabled ? 'Con React.memo ✅' : 'Sin React.memo ❌'}
              </Text>
              {city && <WidgetComponent city={city} unit={unit} />}
              {!city && <Text c="dimmed">Selecciona una ciudad</Text>}
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box>
              <Text fw={500} mb="md">
                Búsqueda actual: "{searchText}"
              </Text>
              <Paper
                p="md"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
              >
                <Text size="sm" fw={500}>
                  💡 Observación:
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {memoEnabled
                    ? 'El widget NO recarga mientras escribes porque React.memo evita la re-renderización cuando los props no han cambiado.'
                    : 'El widget recarga cada vez que escribes porque sin memo, se re-renderiza en cada cambio del padre.'}
                </Text>
              </Paper>
            </Box>
          </Grid.Col>
        </Grid>

        {/* Explanation */}
        <Paper
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}
        >
          <Title order={4} mb="md">
            Cuándo usar React.memo
          </Title>

          <Stack gap="sm">
            <Box>
              <Badge color="green">React.memo(Component)</Badge>
              <Text size="sm" mt="xs">
                Envuelve un componente para evitar re-renderizaciones si sus
                props no han cambiado. Útil para componentes "de terceros" o
                componentes con efectos secundarios costosos.
              </Text>
            </Box>

            <Box>
              <Text fw={500} size="sm">
                ✅ Usa cuando:
              </Text>
              <Text size="sm" c="dimmed">
                - El componente tiene efectos secundarios costosos (llamadas
                API, cálculos pesados) - El componente es de una biblioteca que
                no puedes modificar - El componente recibe principalmente props
                estáticas pero el padre se re-renderiza frecuentemente
              </Text>
            </Box>

            <Box>
              <Text fw={500} size="sm">
                ❌ Evita cuando:
              </Text>
              <Text size="sm" c="dimmed">
                - Los props cambian frecuentemente de todos modos - Comparar
                props es más costoso que re-renderizar - Necesitas lógica de
                comparación personalizada (usa memo con un comparador
                personalizado)
              </Text>
            </Box>

            <Box>
              <Text size="sm" c="orange" fw={500}>
                ⚠️ memo() hace comparación superficial por defecto. Para props
                complejos, usa: memo(Component, (prev, next) =&gt; {'{...}'}
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
