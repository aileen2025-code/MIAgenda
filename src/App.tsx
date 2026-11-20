import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  ClipboardList,
  Flag,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  addDaysISO,
  formatShortDateES,
  getTodayISO,
} from './utils/dateUtils';

type Prioridad = 'Baja' | 'Media' | 'Alta';
type FiltroEstado = 'todas' | 'pendientes' | 'completadas';
type FiltroPrioridad = 'Todas' | Prioridad;

const PRIORIDADES: Prioridad[] = ['Baja', 'Media', 'Alta'];
const FILTROS_PRIORIDAD: FiltroPrioridad[] = ['Todas', 'Alta', 'Media', 'Baja'];

interface Actividad {
  id: number;
  nombre: string;
  completada: boolean;
  prioridad: Prioridad;
  fechaLimite?: string; // YYYY-MM-DD opcional
}

const STORAGE_KEY = 'mi_agenda_movil_actividades_v1';

function createInitialActividades(): Actividad[] {
  const today = getTodayISO();
  return [
    {
      id: 1,
      nombre: 'Revisar pendientes del día',
      completada: false,
      prioridad: 'Alta',
      fechaLimite: today,
    },
    {
      id: 2,
      nombre: 'Organizar mis actividades en el teléfono',
      completada: false,
      prioridad: 'Media',
      fechaLimite: addDaysISO(today, 1),
    },
  ];
}

function loadActividades(): Actividad[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialActividades();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return createInitialActividades();
    return parsed.map((item) => ({
      ...item,
      prioridad: PRIORIDADES.includes(item?.prioridad)
        ? item.prioridad
        : 'Media',
    })) as Actividad[];
  } catch {
    return createInitialActividades();
  }
}

function formatDueDateDisplay(
  fechaLimite: string,
  todayISO: string,
  completada: boolean,
): { text: string; className: string } {
  const shortDate = formatShortDateES(fechaLimite);
  if (completada) {
    return {
      text: `Fecha: ${shortDate}`,
      className: 'text-slate-500',
    };
  }
  if (fechaLimite < todayISO) {
    return {
      text: `Vencida · ${shortDate}`,
      className: 'font-semibold text-rose-400',
    };
  }
  if (fechaLimite === todayISO) {
    return {
      text: `Hoy · ${shortDate}`,
      className: 'font-semibold text-cyan-300',
    };
  }
  if (fechaLimite === addDaysISO(todayISO, 1)) {
    return {
      text: `Mañana · ${shortDate}`,
      className: 'font-semibold text-blue-300',
    };
  }
  return {
    text: `Fecha: ${shortDate}`,
    className: 'text-slate-300',
  };
}

function getPriorityTheme(prioridad: Prioridad, completada: boolean) {
  if (completada) {
    return {
      label: `Prioridad ${prioridad}`,
      cardClass: 'border-[#1E2945] bg-[#0F172B]/70',
      checkboxBorder: 'border-emerald-500 bg-emerald-500 text-slate-950',
      textClass: 'text-slate-500',
    };
  }
  if (prioridad === 'Alta') {
    return {
      label: 'Alta',
      cardClass: 'border-rose-500/35 bg-[#121B33]',
      checkboxBorder: 'border-rose-400 bg-[#0B1120]',
      textClass: 'font-semibold text-rose-400',
    };
  }
  if (prioridad === 'Media') {
    return {
      label: 'Media',
      cardClass: 'border-amber-500/35 bg-[#121B33]',
      checkboxBorder: 'border-amber-400 bg-[#0B1120]',
      textClass: 'font-semibold text-amber-400',
    };
  }
  return {
    label: 'Baja',
    cardClass: 'border-[#253356] bg-[#121B33]',
    checkboxBorder: 'border-sky-400 bg-[#0B1120]',
    textClass: 'font-semibold text-sky-400',
  };
}

export default function App() {
  const [actividades, setActividades] = useState<Actividad[]>(loadActividades);
  const [textoActividad, setTextoActividad] = useState('');
  const [prioridad, setPrioridad] = useState<Prioridad>('Media');
  const [fechaLimite, setFechaLimite] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState<FiltroPrioridad>('Todas');
  const [errorTexto, setErrorTexto] = useState(false);

  const todayISO = getTodayISO();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actividades));
    } catch {
      // Ignorar si el almacenamiento local está restringido
    }
  }, [actividades]);

  const totalCount = actividades.length;
  const pendientesCount = actividades.filter((item) => !item.completada).length;
  const completadasCount = totalCount - pendientesCount;
  const completionPercent =
    totalCount > 0 ? Math.round((completadasCount / totalCount) * 100) : 0;

  const consultaNormalizada = busqueda.trim().toLowerCase();
  const actividadesFiltradas = actividades.filter((item) => {
    if (filtroEstado === 'pendientes' && item.completada) return false;
    if (filtroEstado === 'completadas' && !item.completada) return false;
    if (filtroPrioridad !== 'Todas' && item.prioridad !== filtroPrioridad) {
      return false;
    }
    if (consultaNormalizada) {
      return item.nombre.toLowerCase().includes(consultaNormalizada);
    }
    return true;
  });

  const handleAgregarActividad = (event: React.FormEvent) => {
    event.preventDefault();
    const nombreLimpio = textoActividad.trim();
    if (!nombreLimpio) {
      setErrorTexto(true);
      return;
    }

    const nueva: Actividad = {
      id: Date.now(),
      nombre: nombreLimpio,
      completada: false,
      prioridad,
      ...(fechaLimite ? { fechaLimite } : {}),
    };

    setActividades((prev) => [nueva, ...prev]);
    setTextoActividad('');
    setPrioridad('Media');
    setFechaLimite('');
    setErrorTexto(false);
    if (filtroEstado === 'completadas') {
      setFiltroEstado('todas');
    }
    if (filtroPrioridad !== 'Todas' && filtroPrioridad !== prioridad) {
      setFiltroPrioridad('Todas');
    }
  };

  const handleCambiarCompletada = (id: number) => {
    setActividades((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completada: !item.completada } : item,
      ),
    );
  };

  const handleEliminar = (id: number) => {
    setActividades((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-dvh w-full bg-[#0B1120] text-white">
      {/* Diseño 100% móvil a pantalla completa (sin marcos de escritorio ni barras superpuestas) */}
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#0B1120]">
        {/* Barra superior móvil fija en azul eléctrico */}
        <header className="sticky top-0 z-30 bg-[#1447E6] text-white shadow-md shadow-black/25 pt-safe">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold leading-tight text-white">
                  Mi Agenda
                </h1>
                <p className="text-xs font-medium text-blue-100 tabular-nums">
                  {pendientesCount}{' '}
                  {pendientesCount === 1 ? 'pendiente' : 'pendientes'}
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  {completadasCount}{' '}
                  {completadasCount === 1 ? 'completada' : 'completadas'}
                </p>
              </div>
            </div>
            <PWAInstallButton />
          </div>
        </header>

        {/* Aviso automático cuando no hay conexión */}
        <OfflineIndicator />

        {/* Contenido móvil fluido de un solo dedo */}
        <main className="flex-1 space-y-4 px-4 pt-4 pb-safe">
          {/* Tarjeta 1: Formulario Nueva actividad */}
          <section
            aria-label="Nueva actividad"
            className="rounded-2xl border border-[#1E2945] bg-[#11192E] p-4"
          >
            <form onSubmit={handleAgregarActividad} className="space-y-3.5">
              <div>
                <label
                  htmlFor="actividad-input"
                  className="mb-1.5 block text-sm font-semibold text-white"
                >
                  Nueva actividad
                </label>
                <input
                  id="actividad-input"
                  type="text"
                  enterKeyHint="done"
                  value={textoActividad}
                  onChange={(e) => {
                    setTextoActividad(e.target.value);
                    if (errorTexto) setErrorTexto(false);
                  }}
                  placeholder="Escribe una actividad..."
                  className={`min-h-[48px] w-full rounded-xl border bg-[#0C1326] px-4 py-2.5 text-base text-white placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
                    errorTexto
                      ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-500/25'
                      : 'border-[#253356] focus:border-[#3B82F6] focus:ring-blue-500/25'
                  }`}
                />
                {errorTexto && (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-rose-400"
                  >
                    Escribe una actividad antes de agregarla.
                  </p>
                )}
              </div>

              {/* Fecha opcional */}
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label
                    htmlFor="fecha-limite-input"
                    className="text-sm font-semibold text-white"
                  >
                    Fecha{' '}
                    <span className="font-normal text-slate-400">
                      (opcional)
                    </span>
                  </label>
                  {fechaLimite && (
                    <button
                      type="button"
                      onClick={() => setFechaLimite('')}
                      className="min-h-[32px] px-2 text-xs font-semibold text-blue-300 hover:text-white"
                    >
                      Quitar fecha
                    </button>
                  )}
                </div>
                <input
                  id="fecha-limite-input"
                  type="date"
                  value={fechaLimite}
                  onChange={(e) => setFechaLimite(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl border border-[#253356] bg-[#0C1326] px-4 py-2.5 text-base text-white [color-scheme:dark] focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-500/25 focus:outline-none"
                />
              </div>

              {/* Selector de Prioridad */}
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-white">
                  Prioridad
                </span>
                <div
                  role="radiogroup"
                  aria-label="Nivel de prioridad"
                  className="grid grid-cols-3 gap-1.5 rounded-xl border border-[#1E2945] bg-[#0B1120] p-1"
                >
                  {PRIORIDADES.map((nivel) => {
                    const isSelected = prioridad === nivel;
                    const activeClasses =
                      nivel === 'Media'
                        ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                        : nivel === 'Alta'
                          ? 'bg-rose-600 text-white font-bold shadow-xs'
                          : 'bg-[#1A56FA] text-white font-bold shadow-xs';

                    return (
                      <button
                        key={nivel}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setPrioridad(nivel)}
                        className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                          isSelected
                            ? activeClasses
                            : 'font-medium text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <Flag className="h-3.5 w-3.5 shrink-0" />
                        <span>{nivel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botón principal + Agregar actividad */}
              <button
                type="submit"
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#1A56FA] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1E40AF] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none active:scale-[0.99]"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar actividad</span>
              </button>
            </form>
          </section>

          {/* Tarjeta 2: Progreso de tareas */}
          <section
            aria-label="Resumen de progreso"
            className="rounded-2xl border border-[#1E2945] bg-[#11192E] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-sm font-bold text-white">
                Progreso de tareas
              </p>
              <span className="font-display text-lg font-bold text-cyan-400 tabular-nums">
                {completionPercent}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Porcentaje de tareas completadas"
              aria-valuenow={completionPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#1E2945]"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1A56FA] to-cyan-400 transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <p className="mt-2 text-xs font-medium text-slate-400 tabular-nums">
              {totalCount === 0
                ? 'Sin tareas registradas todavía'
                : `${completadasCount} de ${totalCount} completadas`}
            </p>
          </section>

          {/* Filtros táctiles + Búsqueda en tiempo real */}
          <div className="space-y-3">
            <div
              role="tablist"
              aria-label="Filtrar actividades por estado"
              className="grid grid-cols-3 gap-1 rounded-xl border border-[#1E2945] bg-[#11192E] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={filtroEstado === 'todas'}
                onClick={() => setFiltroEstado('todas')}
                className={`min-h-[44px] rounded-lg px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap tabular-nums ${
                  filtroEstado === 'todas'
                    ? 'bg-[#1A56FA] text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Todas ({totalCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filtroEstado === 'pendientes'}
                onClick={() => setFiltroEstado('pendientes')}
                className={`min-h-[44px] rounded-lg px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap tabular-nums ${
                  filtroEstado === 'pendientes'
                    ? 'bg-[#1A56FA] text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Pendientes ({pendientesCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filtroEstado === 'completadas'}
                onClick={() => setFiltroEstado('completadas')}
                className={`min-h-[44px] rounded-lg px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap tabular-nums ${
                  filtroEstado === 'completadas'
                    ? 'bg-[#1A56FA] text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Hechas ({completadasCount})
              </button>
            </div>

            <div className="relative">
              <label htmlFor="buscar-actividad-input" className="sr-only">
                Buscar actividad por nombre
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="buscar-actividad-input"
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar actividad por nombre..."
                className="min-h-[48px] w-full rounded-xl border border-[#1E2945] bg-[#11192E] py-2.5 pr-12 pl-11 text-base text-white placeholder:text-slate-400 focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-500/25 focus:outline-none"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                  className="absolute top-1/2 right-1 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Selector de filtros por prioridad debajo de la barra de búsqueda */}
            <div
              role="tablist"
              aria-label="Filtrar actividades por prioridad"
              className="grid grid-cols-4 gap-1 rounded-xl border border-[#1E2945] bg-[#11192E] p-1"
            >
              {FILTROS_PRIORIDAD.map((opcion) => {
                const isSelected = filtroPrioridad === opcion;
                const activeClass =
                  opcion === 'Alta'
                    ? 'bg-rose-600 text-white'
                    : opcion === 'Media'
                      ? 'bg-[#F59E0B] text-slate-950 font-bold'
                      : opcion === 'Baja'
                        ? 'bg-sky-600 text-white'
                        : 'bg-[#1A56FA] text-white';

                return (
                  <button
                    key={opcion}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setFiltroPrioridad(opcion)}
                    className={`min-h-[44px] rounded-lg px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                      isSelected
                        ? activeClass
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de actividades */}
          {actividades.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#253356] bg-[#11192E]/70 px-5 py-8 text-center">
              <ClipboardList className="h-8 w-8 text-slate-400" />
              <p className="mt-3 text-base font-semibold text-white">
                No tienes actividades guardadas
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Escribe una actividad arriba y toca «Agregar actividad».
              </p>
            </div>
          ) : actividadesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#253356] bg-[#11192E]/70 px-5 py-8 text-center">
              <Search className="h-8 w-8 text-slate-400" />
              <p className="mt-3 text-base font-semibold text-white">
                Sin actividades en esta vista
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {busqueda.trim()
                  ? `No encontramos actividades con «${busqueda.trim()}».`
                  : 'Prueba seleccionando otro filtro arriba.'}
              </p>
              {(busqueda.trim() ||
                filtroEstado !== 'todas' ||
                filtroPrioridad !== 'Todas') && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda('');
                    setFiltroEstado('todas');
                    setFiltroPrioridad('Todas');
                  }}
                  className="mt-4 flex min-h-[44px] items-center justify-center rounded-xl bg-[#1A56FA] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Mostrar todas
                </button>
              )}
            </div>
          ) : (
            <ul className="space-y-2.5 pb-4" aria-label="Lista de actividades">
              {actividadesFiltradas.map((actividad) => {
                const dueInfo = actividad.fechaLimite
                  ? formatDueDateDisplay(
                      actividad.fechaLimite,
                      todayISO,
                      actividad.completada,
                    )
                  : null;
                const priorityTheme = getPriorityTheme(
                  actividad.prioridad,
                  actividad.completada,
                );

                return (
                  <li
                    key={actividad.id}
                    className={`flex min-h-[64px] items-center gap-2 rounded-2xl border px-2.5 py-2.5 transition-colors ${priorityTheme.cardClass}`}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={actividad.completada}
                      aria-label={
                        actividad.completada
                          ? `Desmarcar "${actividad.nombre}"`
                          : `Marcar "${actividad.nombre}" como completada`
                      }
                      onClick={() => handleCambiarCompletada(actividad.id)}
                      className="flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${priorityTheme.checkboxBorder}`}
                      >
                        {actividad.completada && (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        )}
                      </span>
                    </button>

                    <div className="min-w-0 flex-1 py-0.5">
                      <p
                        className={`text-base leading-snug break-words ${
                          actividad.completada
                            ? 'text-slate-400 line-through'
                            : 'font-medium text-white'
                        }`}
                      >
                        {actividad.nombre}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 ${priorityTheme.textClass}`}
                        >
                          <Flag className="h-3.5 w-3.5 shrink-0" />
                          <span>{priorityTheme.label}</span>
                        </span>
                        {dueInfo && (
                          <>
                            <span className="text-slate-600" aria-hidden="true">
                              ·
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 ${dueInfo.className}`}
                            >
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              <span>{dueInfo.text}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEliminar(actividad.id)}
                      aria-label={`Eliminar "${actividad.nombre}"`}
                      className="flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-500/15 hover:text-rose-400 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
