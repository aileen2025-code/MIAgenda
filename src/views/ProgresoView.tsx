import { ArrowRight, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { ClassSession, COURSE_TOPICS, NavTab, TaskItem } from '../types';
import { formatShortDateES } from '../utils/dateUtils';

interface ProgresoViewProps {
  tasks: TaskItem[];
  classes: ClassSession[];
  onNavigate: (tab: NavTab) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onRequestReset: () => void;
}

export function ProgresoView({
  tasks,
  classes,
  onNavigate,
  onToggleTaskStatus,
  onRequestReset,
}: ProgresoViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');

  const completionPercent =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // SVG anillo de progreso
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercent / 100) * circumference;

  const topicBreakdown = COURSE_TOPICS.map((topic) => {
    const topicTasks = tasks.filter((t) => t.topic === topic);
    const topicCompleted = topicTasks.filter(
      (t) => t.status === 'completed',
    ).length;
    const topicTotal = topicTasks.length;
    const percent =
      topicTotal > 0 ? Math.round((topicCompleted / topicTotal) * 100) : 0;

    return {
      topic,
      completed: topicCompleted,
      total: topicTotal,
      percent,
    };
  }).filter((item) => item.total > 0);

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
              <svg
                className="h-32 w-32 -rotate-90"
                viewBox="0 0 128 128"
                aria-hidden="true"
              >
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                  {completionPercent}%
                </span>
                <span className="text-xs font-medium text-slate-600">
                  Avance
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Tu progreso en el curso
              </h1>
              <p className="text-base leading-relaxed text-slate-700">
                Has completado{' '}
                <span className="font-bold text-slate-900 tabular-nums">
                  {completedTasks.length}
                </span>{' '}
                de{' '}
                <span className="font-bold text-slate-900 tabular-nums">
                  {totalTasks}
                </span>{' '}
                {totalTasks === 1 ? 'tarea registrada' : 'tareas registradas'}.
              </p>
              <p className="text-sm text-slate-600">
                Te{' '}
                {pendingTasks.length === 1
                  ? 'queda 1 tarea pendiente'
                  : `quedan ${pendingTasks.length} tareas pendientes`}{' '}
                por finalizar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
          >
            <span>Ir a mis tareas</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Cifras de resumen */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5 sm:grid-cols-4">
          <div className="p-2">
            <p className="text-sm font-medium text-slate-600">
              Tareas completadas
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-emerald-700 tabular-nums">
              {completedTasks.length}
            </p>
          </div>
          <div className="p-2">
            <p className="text-sm font-medium text-slate-600">
              Tareas pendientes
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-blue-700 tabular-nums">
              {pendingTasks.length}
            </p>
          </div>
          <div className="p-2">
            <p className="text-sm font-medium text-slate-600">
              Total de tareas
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              {totalTasks}
            </p>
          </div>
          <div className="p-2">
            <p className="text-sm font-medium text-slate-600">
              Clases en agenda
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              {classes.length}
            </p>
          </div>
        </div>
      </section>

      {/* Avance por tema del curso */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Avance por tema del curso
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Progreso agrupado según los módulos de Google AI Studio.
        </p>

        {topicBreakdown.length === 0 ? (
          <p className="mt-4 text-base text-slate-600">
            No hay tareas registradas todavía para calcular el avance por tema.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {topicBreakdown.map((item) => (
              <div key={item.topic} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-slate-900">
                    {item.topic}
                  </span>
                  <span className="font-medium text-slate-600 tabular-nums">
                    {item.completed} de {item.total} completadas ({item.percent}%)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-700 transition-all duration-300"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Listas comparativas: Pendientes y Completadas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 text-blue-700">
            <Clock className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Pendientes por entregar ({pendingTasks.length})
            </h2>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="mt-4 text-base text-slate-600">
              No tienes tareas pendientes en este momento.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200">
              {pendingTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col justify-between gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="text-sm text-slate-600">
                      Entrega: {formatShortDateES(task.dueDate)} · {task.topic}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Completar</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Tareas completadas ({completedTasks.length})
            </h2>
          </div>

          {completedTasks.length === 0 ? (
            <p className="mt-4 text-base text-slate-600">
              Aún no has marcado ninguna tarea como completada.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200">
              {completedTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col justify-between gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-700">{task.title}</p>
                    <p className="text-sm text-slate-500">
                      {task.topic} · Fecha: {formatShortDateES(task.dueDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Volver a pendiente</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Opción sencilla para restaurar los datos iniciales de ejemplo */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            Datos de ejemplo del curso
          </h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Todos tus cambios se guardan en este dispositivo. Si quieres empezar de nuevo, puedes restaurar los ejemplos iniciales.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestReset}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restablecer ejemplos</span>
        </button>
      </section>
    </div>
  );
}
