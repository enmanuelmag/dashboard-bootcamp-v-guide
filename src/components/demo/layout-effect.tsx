import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  Text,
  Badge,
  Title,
  Stack,
  Group,
  Button,
} from '@mantine/core';

// Dropdown con useEffect - Puede "flashear"
function DropdownWithEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'below' | 'above'>('below');
  const [wasWrong, setWasWrong] = useState(false);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Simular un pequeño retraso para que veas el cambio
    setTimeout(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const spaceBelow = window.innerHeight - rect.bottom;

      // Si no hay espacio abajo, mostrar arriba
      if (spaceBelow < 140) {
        setWasWrong(true); // Indica que tuvo que corrección
        setPosition('above');
      } else {
        setWasWrong(false);
        setPosition('below');
      }
    }, 50); // pequeño delay para ver el "flash"
  }, [isOpen]);

  return (
    <Box ref={containerRef} pos="relative">
      <Button onClick={() => setIsOpen(!isOpen)} color="blue" fullWidth>
        {isOpen ? 'Cerrar' : 'Abrir Menú'}
      </Button>

      {isOpen && (
        <Box
          p="md"
          bg={wasWrong ? 'red.0' : 'blue.0'}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            [position === 'below' ? 'top' : 'bottom']: '100%',
            border: wasWrong ? '2px solid red' : '2px solid blue',
            minHeight: '140px',
            zIndex: 1000,
            marginBottom: position === 'above' ? '8px' : '0',
            marginTop: position === 'below' ? '8px' : '0',
            boxShadow: wasWrong
              ? '0 0 8px rgba(255, 0, 0, 0.5)'
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          <Group justify="space-between">
            <Box>
              <Text size="sm" fw={500}>
                Position:{' '}
                <Badge color={wasWrong ? 'red' : 'blue'}>
                  {position.toUpperCase()}
                </Badge>
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                {wasWrong
                  ? '❌ Se abrió ABAJO primero, luego saltó ARRIBA (PARPADEO)'
                  : '✅ Se abrió directamente ABAJO (correcto)'}
              </Text>
            </Box>
          </Group>
        </Box>
      )}
    </Box>
  );
}

// Dropdown con useLayoutEffect - Siempre correcto
function DropdownWithLayoutEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'below' | 'above'>('below');

  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    // Si no hay espacio abajo, mostrar arriba
    if (spaceBelow < 180) {
      setPosition('above');
    } else {
      setPosition('below');
    }
  }, [isOpen]);

  return (
    <Box ref={containerRef} pos="relative">
      <Button onClick={() => setIsOpen(!isOpen)} color="green" fullWidth>
        {isOpen ? 'Cerrar' : 'Abrir Menú'}
      </Button>

      {isOpen && (
        <Box
          p="md"
          bg="green.0"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            [position === 'below' ? 'top' : 'bottom']: '100%',
            border: '2px solid green',
            minHeight: '140px',
            zIndex: 1000,
            marginBottom: position === 'above' ? '8px' : '0',
            marginTop: position === 'below' ? '8px' : '0',
            backgroundColor: position === 'above' ? '#f0fdf4' : '#f0fdf4',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Group justify="space-between">
            <Box>
              <Text size="sm" fw={500}>
                Posición: <Badge color="green">{position.toUpperCase()}</Badge>
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                {position === 'below'
                  ? '📍 Predeterminado: abajo'
                  : '✅ Correcto: arriba'}
              </Text>
            </Box>
            {position === 'above' && (
              <Text size="sm" c="green" fw={500}>
                ✨ ¡Perfecto!
              </Text>
            )}
          </Group>
        </Box>
      )}
    </Box>
  );
}

export function LayoutEffectDemo() {
  return (
    <Box p="md">
      <Title order={2} mb="lg">
        useEffect vs useLayoutEffect: Mediciones de DOM
      </Title>

      <Stack gap="md">
        {/* Instructions */}
        <Card
          withBorder
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-yellow-0)' }}
        >
          <Text fw={500} mb="xs">
            📝 Como verlo:
          </Text>
          <Text size="sm">
            1. <strong>Scroll hasta el fondo</strong> de la página
          </Text>
          <Text size="sm">
            2. Los botones deben estar{' '}
            <strong>muy cerca del borde inferior</strong>
          </Text>
          <Text size="sm" fw={500} c="red">
            3. Clickea el botón izquierdo (useEffect)
          </Text>
          <Text size="sm">
            → Verás que el dropdown se abre abajo, pero se pone{' '}
            <strong>ROJO</strong> y se mueve hacia arriba
          </Text>
          <Text size="sm" fw={500} c="green">
            4. Clickea el botón derecho (useLayoutEffect)
          </Text>
          <Text size="sm">
            → El dropdown aparece directamente arriba, sin cambios
          </Text>
        </Card>

        {/* Explanation */}
        <Card
          withBorder
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}
        >
          <Title order={4} mb="md">
            🎯 Qué está sucediendo:
          </Title>
          <Stack gap="sm">
            <Box>
              <Badge size="sm" color="blue">
                useEffect
              </Badge>
              <Text size="sm" mt="xs">
                1. React renderiza el dropdown (por defecto: abajo)
              </Text>
              <Text size="sm">
                2. El navegador lo pinta en pantalla ← <strong>¡Lo ves!</strong>
              </Text>
              <Text size="sm">
                3. useEffect se ejecuta, detecta sin espacio
              </Text>
              <Text size="sm">
                4. Actualiza posición a arriba → <strong>Parpadea/salta</strong>
              </Text>
            </Box>

            <Box mt="md">
              <Badge size="sm" color="green">
                useLayoutEffect
              </Badge>
              <Text size="sm" mt="xs">
                1. useLayoutEffect se ejecuta primero
              </Text>
              <Text size="sm">2. Mide el espacio, decide la posición</Text>
              <Text size="sm">3. React renderiza con la posición correcta</Text>
              <Text size="sm">
                4. El navegador pinta ←{' '}
                <strong>¡Perfecto desde el inicio!</strong>
              </Text>
            </Box>
          </Stack>
        </Card>

        {/* Add spacing to show the effect */}
        <Box h={300} bg="gray.1" style={{ borderRadius: '8px' }}>
          <Group justify="center" align="center" h="100%">
            <Text c="dimmed">Scroll hacia abajo para ver la diferencia →</Text>
          </Group>
        </Box>

        {/* Comparison */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder p="md">
              <Group justify="center" mb="md">
                <Badge size="lg" color="blue">
                  useEffect
                </Badge>
              </Group>
              <DropdownWithEffect />
              <Text size="xs" c="dimmed" ta="center" mt="md">
                Puede parpadear al reposicionarse
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder p="md">
              <Group justify="center" mb="md">
                <Badge size="lg" color="green">
                  useLayoutEffect
                </Badge>
              </Group>
              <DropdownWithLayoutEffect />
              <Text size="xs" c="dimmed" ta="center" mt="md">
                Siempre posicionado correctamente
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Summary */}
        <Card
          withBorder
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-green-0)' }}
        >
          <Title order={4} mb="md">
            ✅ Puntos Clave:
          </Title>
          <Stack gap="sm">
            <Box>
              <Badge color="blue">useEffect</Badge>
              <Text size="sm" mt="xs">
                Se ejecuta <strong>después</strong> de que el navegador pinta.
                Está bien para la mayoría de casos, pero no para mediciones de
                DOM.
              </Text>
            </Box>

            <Box>
              <Badge color="green">useLayoutEffect</Badge>
              <Text size="sm" mt="xs">
                Se ejecuta <strong>antes</strong> de que el navegador pinta.
                Úsalo para medir/posicionar elementos del DOM.
              </Text>
            </Box>

            <Box
              mt="md"
              p="sm"
              bg="white"
              style={{ borderRadius: '6px', border: '1px solid #ddd' }}
            >
              <Text size="sm" fw={500}>
                💡 Usos en el mundo real de useLayoutEffect:
              </Text>
              <Text size="xs" mt="xs">
                • Posicionar dropdowns, tooltips, popovers
              </Text>
              <Text size="xs">
                • Medir elementos del DOM para ajustes de diseño
              </Text>
              <Text size="xs">
                • Operaciones síncronas del DOM que deben completarse antes del
                pintado
              </Text>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
