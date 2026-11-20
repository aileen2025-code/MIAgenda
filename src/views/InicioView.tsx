import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Pencil,
  Plus,
} from 'lucide-react';
import { ClassSession, NavTab, TaskItem } from '../types';
import {
  formatLongDateES,
  getRelativeDayLabel,
  getRelativeDueLabel,
  getTodayISO,
} from '../utils/dateUtils';

interface InicioViewProps {
  classes: ClassSession[];
  tasks: TaskItem[];
  notesCount: number;
  onNavigate: (tab: NavTab) => void;
  onAddClass: () => void;
  onEditClass: (item: ClassSession) => void;
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onAddNote: () => void;
}

export function InicioView({
  classes,
  tasks,
  notesCount,
  onNavigate,
  onAddClass,
  onEditClass,
  onAddTask,
  onEditTask,
  onToggleTaskStatus,
  onAddNote,
}: InicioViewProps) {
  const todayISO = getTodayISO();

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= todayISO)
    .sort((a, b) =>
      a.date === b.date
        ? a.startTime.localeCompare(b.startTime)
        : a.date.localeCompare(b.date),
    )
    .slice(0, 4);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pending')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Encabezado de bienvenida */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-600">
              Curso de Google AI Studio · {formatLongDateES(todayISO)}
            </p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              Resumen de tu aprendizaje
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              Tienes{' '}
              <span className="font-semibold text-slate-900 tabular-nums">
                {upcomingClasses.length}
              </span>{' '}
              {upcomingClasses.length === 1
                ? 'clase próxima'
                : 'clases próximas'}{' '}
              y{' '}
              <span className="font-semibold text-slate-900 tabular-nums">
                {pendingTasks.length}
              </span>{' '}
              {pendingTasks.length === 1
                ? 'tarea pendiente'
                : 'tareas pendientes'}
              .
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:flex lg:flex-wrap">
            <button
              type="button"
              onClick={onAddTask}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar tarea</span>
            </button>
            <button
              type="button"
              onClick={onAddClass}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar clase</span>
            </button>
            <button
              type="button"
              onClick={onAddNote}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              <FileText className="h-5 w-5" />
              <span>Nueva nota</span>
            </button>
          </div>
        </div>

        {/* Cifras rápidas en fila limpia sin tarjetas anidadas */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => onNavigate('calendario')}
            className="flex flex-col items-start rounded-xl p-2 text-left transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
          >
            <span className="text-sm font-medium text-slate-600">
              Próximas clases
            </span>
            <span className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              {upcomingClasses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="flex flex-col items-start rounded-xl p-2 text-left transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
          >
            <span className="text-sm font-medium text-slate-600">
              Tareas pendientes
            </span>
            <span className="mt-1 font-display text-2xl font-bold text-blue-700 tabular-nums">
              {pendingTasks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('progreso')}
            className="flex flex-col items-start rounded-xl p-2 text-left transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
          >
            <span className="text-sm font-medium text-slate-600">
              Tareas completadas
            </span>
            <span className="mt-1 font-display text-2xl font-bold text-emerald-700 tabular-nums">
              {completedTasksCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('notas')}
            className="flex flex-col items-start rounded-xl p-2 text-left transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
          >
            <span className="text-sm font-medium text-slate-600">
              Apuntes guardados
            </span>
            <span className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              {notesCount}
            </span>
          </button>
        </div>
      </section>

      {/* Columnas principales: Próximas clases + Tareas pendientes */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Próximas clases */}
        <section aria-labelledby="heading-proximas-clases" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="heading-proximas-clases"
              className="font-display text-xl font-bold text-slate-900"
            >
              Próximas clases
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              <span>Ver calendario</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-base font-semibold text-slate-900">
                No tienes clases próximas programadas
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Agrega una sesión para organizar tu semana de estudio.
              </p>
              <button
                type="button"
                onClick={onAddClass}
                className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar clase</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {upcomingClasses.map((session) => (
                <article key={session.id} className="p-5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                    <span className="font-semibold text-blue-700">
                      {getRelativeDayLabel(session.date, todayISO)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-xs tabular-nums sm:text-sm">
                      {session.startTime} – {session.endTime}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{session.modality}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                    {session.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    Tema: {session.topic}
                  </p>
                  {session.description && (
                    <p className="mt-2 text-base leading-relaxed text-slate-700">
                      {session.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => onEditClass(session)}
                      className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Editar clase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('calendario')}
                      className="flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Abrir en calendario</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Tareas pendientes */}
        <section aria-labelledby="heading-tareas-pendientes" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="heading-tareas-pendientes"
              className="font-display text-xl font-bold text-slate-900"
            >
              Tareas pendientes
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              <span>Ver todas las tareas</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-700" />
              <p className="mt-3 text-base font-semibold text-slate-900">
                Todas tus tareas están completadas
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Buen trabajo. Puedes agregar nuevas entregas cuando lo necesites.
              </p>
              <button
                type="button"
                onClick={onAddTask}
                className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar tarea</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {pendingTasks.slice(0, 4).map((task) => {
                const isOverdue = task.dueDate < todayISO;
                const isDueToday = task.dueDate === todayISO;
                return (
                  <article key={task.id} className="p-5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          isOverdue
                            ? 'text-red-700'
                            : isDueToday
                              ? 'text-blue-700'
                              : 'text-slate-700'
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        <span>{getRelativeDueLabel(task.dueDate, todayISO)}</span>
                      </span>
                      <span className="text-slate-400" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-slate-600">{task.topic}</span>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1.5 text-base leading-relaxed text-slate-700">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className="flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none whitespace-nowrap shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Marcar como completada</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Editar tarea</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
