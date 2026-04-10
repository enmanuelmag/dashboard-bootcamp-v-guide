import React from 'react';

interface UserState {
  name: string;
  age: number;
  working: boolean;
}

export class ClassComponent extends React.Component<unknown, UserState> {
  constructor(props: unknown) {
    super(props);
    // Inicializar el state en una clase
    this.state = {
      name: 'Juan',
      age: 30,
      working: true,
    };
  }

  // CICLO DE VIDA: componentDidMount - Se ejecuta después de que el componente se monta en el DOM
  componentDidMount(): void {
    console.log(
      '[CLASS] componentDidMount - El componente se ha montado en el DOM',
    );
    console.log('Estado actual:', this.state);
  }

  // CICLO DE VIDA: componentDidUpdate - Se ejecuta después de que el componente se actualiza
  componentDidUpdate(prevProps: unknown, prevState: Readonly<UserState>): void {
    console.log('[CLASS] componentDidUpdate - El componente se ha actualizado');
    console.log('Estado anterior:', prevState);
    console.log('Estado nuevo:', this.state);

    // Ejemplo: Ejecutar lógica solo cuando cambió el nombre
    if (prevState.name !== this.state.name) {
      console.log(
        `El nombre cambió de "${prevState.name}" a "${this.state.name}"`,
      );
    }
  }

  // CICLO DE VIDA: componentWillUnmount - Se ejecuta antes de que el componente se desmonte
  componentWillUnmount(): void {
    console.log(
      '[CLASS] componentWillUnmount - El componente se va a desmontar',
    );
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log('[CLASS] componentDidCatch - Se ha producido un error');
    console.error('Error:', error);

    console.error('Información del error:', errorInfo);
  }

  // Método para actualizar el estado (en clases usamos this.setState)
  handleInputChange = (
    field: keyof UserState,
    value: string | number | boolean,
  ): void => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  };

  render(): React.ReactNode {
    const { name, age, working } = this.state;

    return (
      <div
        style={{
          border: '2px solid blue',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <h2>📘 Componente de Clase (Class Component)</h2>

        <div
          style={{
            backgroundColor: '#e3f2fd',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
          }}
        >
          <p>
            <strong>Lifecycle Methods:</strong>
          </p>
          <ul>
            <li>componentDidMount() - Se ejecuta al montar</li>
            <li>
              componentDidUpdate() - Se ejecuta al actualizar estado/props
            </li>
            <li>componentWillUnmount() - Se ejecuta al desmontar</li>
          </ul>
          <p>
            <em>Abre la consola para ver los logs</em>
          </p>
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          {/* Input para Name */}
          <div>
            <label
              htmlFor="class-name"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Nombre:
            </label>
            <input
              id="class-name"
              type="text"
              value={name}
              onChange={(e) => this.handleInputChange('name', e.target.value)}
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
              htmlFor="class-age"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Edad:
            </label>
            <input
              id="class-age"
              type="number"
              value={age}
              onChange={(e) =>
                this.handleInputChange('age', Number(e.target.value))
              }
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
              htmlFor="class-working"
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <input
                id="class-working"
                type="checkbox"
                checked={working}
                onChange={(e) =>
                  this.handleInputChange('working', e.target.checked)
                }
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
            backgroundColor: '#f3e5f5',
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
  }
}
