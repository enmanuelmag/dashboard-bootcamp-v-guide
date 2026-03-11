import { useState, useEffect } from 'react';

type User = {
  name: string;
  age: number;
  working: boolean;
};

// type User = Record<string, string | number | boolean>;

export const FunctionalComponent = () => {
  // INICIALIZAR STATE en componentes funcionales con useState
  const [user, setUser] = useState<User>({
    name: 'María',
    age: 28,
    working: false,
  });

  // USE_EFFECT SIN DEPENDENCIAS - Se ejecuta después de CADA render
  useEffect(() => {
    console.log(
      '[FUNCIONAL] useEffect sin dependencias - Se ejecuta después de cada render',
    );
    console.log('Usuario actual:', user);
  });

  // USE_EFFECT CON ARRAY VACÍO - Se ejecuta solo una vez (equivalent a componentDidMount)
  useEffect(() => {
    console.log(
      '[FUNCIONAL] useEffect con [] - Se ejecuta solo 1 vez (componentDidMount)',
    );
    return () => {
      console.log(
        '[FUNCIONAL] Cleanup - Aquí va el equivalente a componentWillUnmount',
      );
    };
  }, []);

  // USE_EFFECT CON DEPENDENCIAS - Se ejecuta cuando el valor en las dependencias cambia
  useEffect(() => {
    console.log(
      '[FUNCIONAL] useEffect con [user.name] - Solo se ejecuta cuando el nombre cambia',
    );
    console.log(`El nombre ahora es: ${user.name}`);
  }, [user.name]);

  // USE_EFFECT CON MÚLTIPLES DEPENDENCIAS
  useEffect(() => {
    console.log(
      '[FUNCIONAL] useEffect con [user.age, user.working] - Se ejecuta cuando cambian age o working',
    );
    if (user.working) {
      console.log(`${user.name} está trabajando y tiene ${user.age} años`);
    }
  }, [user.age, user.working]);

  // Manejar cambios en los inputs
  // En funciones usamos la función setUser para actualizar el estado
  const handleInputChange = (
    // usamos keyof para asegurar que field sea una clave de User
    // y no cualquier string que podría causar errores
    field: keyof User,
    // definimos el tipo de value como string | number | boolean
    // para cubrir los tipos de los campos en User
    value: string | number | boolean,
  ): void => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
      nuevas: 'propiedades se pueden agregar sin problemas',
    }));
  };

  const { name, age, working } = user;

  return (
    <div
      style={{
        border: '2px solid green',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
      }}
    >
      <h2>Componente Funcional (Functional Component)</h2>

      <div
        style={{
          backgroundColor: '#f1f8e9',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
        }}
      >
        <p>
          <strong>Hooks useEffect con diferentes dependencias:</strong>
        </p>
        <ul>
          <li>
            useEffect(() =&gt; {'{...}'}) - Sin dependencias: Se ejecuta en cada
            render
          </li>
          <li>
            useEffect(() =&gt; {'{...}'}, []) - Con array vacío: Se ejecuta 1
            sola vez (componentDidMount)
          </li>
          <li>
            useEffect(() =&gt; {'{...}'}, [dependency]) - Con dependencias: Se
            ejecuta cuando cambien
          </li>
        </ul>
        <p>
          <em>Abre la consola para ver los logs de useEffect</em>
        </p>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {/* Input para Name */}
        <div>
          <label
            htmlFor="func-name"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}
          >
            Nombre:
          </label>
          <input
            id="func-name"
            type="text"
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          <p style={{ margin: '5px 0', color: '#666' }}>
            Valor actual: <strong>{name}</strong>
          </p>
        </div>

        {/* Input para Age */}
        <div>
          <label
            htmlFor="func-age"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}
          >
            Edad:
          </label>
          <input
            id="func-age"
            type="number"
            value={age}
            onChange={(e) => handleInputChange('age', Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          <p style={{ margin: '5px 0', color: '#666' }}>
            Valor actual: <strong>{age} años</strong>
          </p>
        </div>

        {/* Input para Working */}
        <div>
          <label
            htmlFor="func-working"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <input
              id="func-working"
              type="checkbox"
              checked={working}
              onChange={(e) => handleInputChange('working', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 'bold' }}>¿Está trabajando?</span>
          </label>
          <p style={{ margin: '5px 0', color: '#666' }}>
            Valor actual:{' '}
            <strong>
              {working ? '✅ Sí, está trabajando' : '❌ No está trabajando'}
            </strong>
          </p>
        </div>
      </div>

      {/* Resumen del estado */}
      <div
        style={{
          backgroundColor: '#e8f5e9',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '15px',
        }}
      >
        <h3>📊 Estado Actual:</h3>
        <pre
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {JSON.stringify({ name, age, working }, null, 2)}
        </pre>
      </div>
    </div>
  );
};
