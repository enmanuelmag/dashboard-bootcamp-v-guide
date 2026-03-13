import { useState } from 'react';

const STEPS = [
  // --- Phase 1: Fresh fetch ---
  {
    id: 0,
    phase: 1,
    actor: 'user',
    title: 'Usuario navega a /products',
    detail:
      'El navegador detecta el cambio de URL. TanStack Router renderiza la nueva ruta.',
    storeState: null,
  },
  {
    id: 1,
    phase: 1,
    actor: 'react',
    title: 'React monta <ProductList />',
    detail: 'El componente entra al árbol del DOM. Sus hooks se registran.',
    storeState: null,
  },
  {
    id: 2,
    phase: 1,
    actor: 'hook',
    title: "useQuery(['products']) se ejecuta",
    detail:
      "El hook se conecta al QueryClient compartido y busca la key 'products'.",
    storeState: 'searching',
  },
  {
    id: 3,
    phase: 1,
    actor: 'miss',
    title: 'Cache MISS — no hay datos previos',
    detail:
      'Es la primera vez que se pide esta query. No existe entrada en el store.',
    storeState: 'miss',
  },
  {
    id: 4,
    phase: 1,
    actor: 'network',
    title: "Se ejecuta queryFn → fetch('/api/products')",
    detail:
      'El hook dispara la función de fetching. El componente muestra estado: loading.',
    storeState: 'fetching',
  },
  {
    id: 5,
    phase: 1,
    actor: 'network',
    title: 'El servidor responde con los datos',
    detail:
      'La respuesta llega. TanStack Query la intercepta antes de dársela al componente.',
    storeState: 'fetching',
  },
  {
    id: 6,
    phase: 1,
    actor: 'store',
    title: 'QueryClient guarda los datos en cache',
    detail:
      "Almacena: data, status: 'success', dataUpdatedAt (timestamp), staleTime.",
    storeState: 'saved',
  },
  {
    id: 7,
    phase: 1,
    actor: 'react',
    title: '<ProductList /> re-renderiza con los datos',
    detail:
      'El componente recibe data y pasa de loading → success. La UI se actualiza.',
    storeState: 'saved',
  },
  // --- Phase 2: Cache hit ---
  {
    id: 8,
    phase: 2,
    actor: 'react',
    title: '<ProductBadge /> se monta en otra parte de la app',
    detail:
      'Un componente completamente distinto necesita el conteo de productos.',
    storeState: 'saved',
  },
  {
    id: 9,
    phase: 2,
    actor: 'hook',
    title: "useQuery(['products']) — misma queryKey",
    detail:
      "El hook se conecta al mismo QueryClient compartido y busca la key 'products'.",
    storeState: 'searching',
  },
  {
    id: 10,
    phase: 2,
    actor: 'hit',
    title: 'Cache HIT — datos disponibles y frescos',
    detail:
      'El QueryClient encuentra la entrada. Los datos todavía están dentro del staleTime.',
    storeState: 'hit',
  },
  {
    id: 11,
    phase: 2,
    actor: 'react',
    title: '<ProductBadge /> renderiza al instante',
    detail:
      'Sin petición de red. Los datos se devuelven desde el cache. Render inmediato.',
    storeState: 'hit',
  },
];

const ACTOR_STYLES = {
  user: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-800',
    dot: 'bg-blue-400',
    label: 'Usuario',
  },
  react: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    text: 'text-cyan-800',
    dot: 'bg-cyan-500',
    label: 'React',
  },
  hook: {
    bg: 'bg-violet-50',
    border: 'border-violet-300',
    text: 'text-violet-800',
    dot: 'bg-violet-500',
    label: 'useQuery',
  },
  store: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-800',
    dot: 'bg-orange-400',
    label: 'QueryClient',
  },
  miss: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-800',
    dot: 'bg-red-400',
    label: 'Cache MISS',
  },
  hit: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    dot: 'bg-green-500',
    label: 'Cache HIT',
  },
  network: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    dot: 'bg-amber-400',
    label: 'Red / Servidor',
  },
};

const STORE_STATES = {
  null: {
    label: 'Vacío',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-400',
  },
  searching: {
    label: 'Buscando...',
    bg: 'bg-violet-100',
    border: 'border-violet-400',
    text: 'text-violet-700',
  },
  miss: {
    label: 'Cache MISS',
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-700',
  },
  fetching: {
    label: 'Fetching...',
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    text: 'text-amber-700',
  },
  saved: {
    label: 'Datos en cache',
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-700',
  },
  hit: {
    label: 'Cache HIT',
    bg: 'bg-green-200',
    border: 'border-green-500',
    text: 'text-green-800',
  },
};

export default function TanstackQueryFlow() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  const step = STEPS[current];
  const actor = ACTOR_STYLES[step.actor];
  const storeStyle = STORE_STATES[step.storeState];
  const isLastStep = current === STEPS.length - 1;
  const phase1Steps = STEPS.filter((s) => s.phase === 1);
  const phase2Steps = STEPS.filter((s) => s.phase === 2);

  const advance = () => {
    if (current < STEPS.length - 1) setCurrent((c) => c + 1);
  };

  const reset = () => {
    setCurrent(0);
    setPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            TanStack Query — Flujo de datos
          </h1>
          <p className="text-slate-500 text-sm">
            Visualiza cómo viajan los datos desde el servidor hasta el
            componente, y cómo el QueryClient evita peticiones duplicadas.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Left: Components */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Componentes React
            </p>

            {/* Component A */}
            <div
              className={`rounded-xl border-2 p-4 transition-all duration-300 ${
                step.phase === 1 &&
                ['react', 'hook', 'miss'].includes(step.actor)
                  ? 'border-cyan-400 bg-cyan-50 shadow-md scale-105'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span className="text-xs font-bold text-slate-600">
                  {'<ProductList />'}
                </span>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-md font-mono transition-all duration-300 ${
                  step.id === 7
                    ? 'bg-green-100 text-green-700'
                    : step.id >= 4 && step.id <= 6
                      ? 'bg-amber-100 text-amber-700'
                      : step.id >= 1 && step.id <= 3
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-slate-50 text-slate-300'
                }`}
              >
                {step.id === 7
                  ? 'status: success'
                  : step.id >= 4 && step.id <= 6
                    ? 'status: loading...'
                    : step.id >= 1 && step.id <= 3
                      ? 'montando...'
                      : 'inactivo'}
              </div>
            </div>

            {/* Component B */}
            <div
              className={`rounded-xl border-2 p-4 transition-all duration-300 ${
                step.phase === 2 &&
                ['react', 'hook', 'hit'].includes(step.actor)
                  ? 'border-cyan-400 bg-cyan-50 shadow-md scale-105'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span className="text-xs font-bold text-slate-600">
                  {'<ProductBadge />'}
                </span>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-md font-mono transition-all duration-300 ${
                  step.id === 11
                    ? 'bg-green-100 text-green-700'
                    : step.id >= 8 && step.id <= 10
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-slate-50 text-slate-300'
                }`}
              >
                {step.id === 11
                  ? 'status: success'
                  : step.id >= 8
                    ? 'montando...'
                    : 'aún no montado'}
              </div>
            </div>

            {/* Legend */}
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Leyenda
              </p>
              <div className="space-y-1">
                {Object.entries(ACTOR_STYLES).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${val.dot}`}></div>
                    <span className="text-xs text-slate-600">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: QueryClient Store */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              QueryClient Store
            </p>
            <div
              className={`flex-1 rounded-xl border-2 p-4 transition-all duration-300 ${storeStyle.border} ${storeStyle.bg}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-xs font-bold text-slate-700">
                  QueryClient
                </span>
              </div>

              {/* Store state badge */}
              <div
                className={`text-center py-2 rounded-lg mb-3 border ${storeStyle.border} ${storeStyle.bg}`}
              >
                <span className={`text-sm font-bold ${storeStyle.text}`}>
                  {storeStyle.label}
                </span>
              </div>

              {/* Cache entry */}
              <div
                className={`rounded-lg border p-3 text-xs font-mono space-y-1 transition-all duration-300 ${
                  step.storeState === 'saved' || step.storeState === 'hit'
                    ? 'border-green-300 bg-white'
                    : 'border-dashed border-slate-300 bg-slate-50 opacity-50'
                }`}
              >
                <p className="font-semibold text-slate-600">
                  key: ['products']
                </p>
                <p
                  className={
                    step.storeState === 'saved' || step.storeState === 'hit'
                      ? 'text-green-700'
                      : 'text-slate-400'
                  }
                >
                  data:{' '}
                  {step.storeState === 'saved' || step.storeState === 'hit'
                    ? '[...products]'
                    : 'null'}
                </p>
                <p
                  className={
                    step.storeState === 'fetching' ||
                    step.storeState === 'saved' ||
                    step.storeState === 'hit'
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }
                >
                  status:{' '}
                  {step.storeState === 'fetching'
                    ? 'pending'
                    : step.storeState === 'saved' || step.storeState === 'hit'
                      ? 'success'
                      : 'idle'}
                </p>
                <p
                  className={
                    step.storeState === 'saved' || step.storeState === 'hit'
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }
                >
                  updatedAt:{' '}
                  {step.storeState === 'saved' || step.storeState === 'hit'
                    ? '14:23:05'
                    : '—'}
                </p>
                <p
                  className={
                    step.storeState === 'saved' || step.storeState === 'hit'
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }
                >
                  isStale:{' '}
                  {step.storeState === 'saved' || step.storeState === 'hit'
                    ? 'false'
                    : '—'}
                </p>
              </div>

              {/* Phase badge */}
              <div
                className={`mt-3 text-center text-xs font-semibold py-1 px-2 rounded-full ${
                  step.phase === 2
                    ? 'bg-green-200 text-green-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step.phase === 2
                  ? 'Compartido con todos los componentes'
                  : 'Esperando datos...'}
              </div>
            </div>
          </div>

          {/* Right: Network + Timeline */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Red / Servidor
            </p>

            {/* Network indicator */}
            <div
              className={`rounded-xl border-2 p-4 transition-all duration-300 ${
                step.actor === 'network'
                  ? 'border-amber-400 bg-amber-50 shadow-md'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${step.actor === 'network' ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'}`}
                ></div>
                <span className="text-xs font-bold text-slate-600">
                  GET /api/products
                </span>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-md font-mono ${
                  step.actor === 'network'
                    ? 'bg-amber-100 text-amber-700'
                    : step.phase === 2
                      ? 'bg-green-50 text-green-600'
                      : 'bg-slate-50 text-slate-300'
                }`}
              >
                {step.id === 4
                  ? 'enviando...'
                  : step.id === 5
                    ? '200 OK — datos recibidos'
                    : step.phase === 2
                      ? 'sin peticion (cache)'
                      : 'inactivo'}
              </div>
            </div>

            {/* Phase indicator */}
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Fase actual
              </p>
              <div className="space-y-1">
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    step.phase === 1
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${step.phase === 1 ? 'bg-blue-400' : 'bg-slate-200'}`}
                  ></div>
                  Fase 1: Primer fetch
                </div>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    step.phase === 2
                      ? 'bg-green-100 text-green-700'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${step.phase === 2 ? 'bg-green-400' : 'bg-slate-200'}`}
                  ></div>
                  Fase 2: Cache hit
                </div>
              </div>
            </div>

            {/* Step counter */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <span className="text-3xl font-bold text-slate-700">
                {current + 1}
              </span>
              <span className="text-slate-400 text-sm"> / {STEPS.length}</span>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-400 rounded-full transition-all duration-500"
                  style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current step card */}
        <div
          className={`rounded-xl border-2 p-5 mb-4 transition-all duration-300 ${actor.border} ${actor.bg}`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${actor.dot}`}
            >
              {current + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${actor.bg} ${actor.text} border ${actor.border}`}
                >
                  {actor.label}
                </span>
                {step.phase === 2 && (
                  <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">
                    Sin red
                  </span>
                )}
              </div>
              <p className={`text-base font-semibold mb-1 ${actor.text}`}>
                {step.title}
              </p>
              <p className="text-sm text-slate-600">{step.detail}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm hover:bg-slate-100 transition-colors"
          >
            Reiniciar
          </button>

          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  i === current
                    ? 'scale-125 ' + ACTOR_STYLES[s.actor].dot
                    : i < current
                      ? 'bg-slate-400'
                      : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={isLastStep ? reset : advance}
            className={`px-5 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${
              isLastStep
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-violet-500 hover:bg-violet-600'
            }`}
          >
            {isLastStep ? 'Ver de nuevo' : 'Siguiente paso'}
          </button>
        </div>

        {/* Phase separator note */}
        {current === 7 && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-center text-sm text-green-700">
            Fase 1 completa. Los datos ya estan en cache. Presiona siguiente
            para ver que pasa cuando otro componente los necesita.
          </div>
        )}
      </div>
    </div>
  );
}
