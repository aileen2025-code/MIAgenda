import { useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { TaskItem } from '../types';
import {
  formatFullDateWithYearES,
  getRelativeDueLabel,
  getTodayISO,
} from '../utils/dateUtils';

interface TareasViewProps {
  tasks: TaskItem[];
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

type TaskFilter = 'all' | 'pending' | 'completed';

export function TareasView({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TareasViewProps) {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const todayISO = getTodayISO();

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const filteredTasks = [...tasks]
    .filter((task) => {
      if (filter === 'pending') return task.status === 'pending';
      if (filter === 'completed') return task.status === 'completed';
      return true;
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-6">
      {/* Cabecera de Tareas */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Mis tareas del curso
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Organiza tus entregas, revisa fechas y marca cada práctica al terminarla.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddTask}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar tarea</span>
          </button>
        </div>

        {/* Filtro segmentado */}
        <div
          className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-grid"
          role="tablist"
          aria-label="Filtrar tareas por estado"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 tabular-nums sm:px-5 ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'pending'}
            onClick={() => setFilter('pending')}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 tabular-nums sm:px-5 ${
              filter === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'completed'}
            onClick={() => setFilter('completed')}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 tabular-nums sm:px-5 ${
              filter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </section>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <ClipboardList className="mx-auto h-9 w-9 text-slate-400" />
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {filter === 'pending'
              ? 'No tienes tareas pendientes'
              : filter === 'completed'
                ? 'Todavía no has completado ninguna tarea'
                : 'No hay tareas registradas'}
          </p>
          <p className="mt-1 text-base text-slate-600">
            Agrega una nueva tarea para llevar el control de tus fechas de entrega.
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isOverdue = !isCompleted && task.dueDate < todayISO;
            const isDueToday = !isCompleted && task.dueDate === todayISO;

            return (
              <article
                key={task.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors ${
                  isCompleted
                    ? 'border-slate-200 bg-slate-50/70'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  {/* Estado y tema como texto limpio */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 font-semibold ${
                        isCompleted
                          ? 'text-emerald-700'
                          : isOverdue
                            ? 'text-red-700'
                            : isDueToday
                              ? 'text-blue-700'
                              : 'text-slate-800'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      <span>
                        {isCompleted ? 'Completada' : 'Pendiente'}
                      </span>
                    </span>
                    <span className="text-slate-400" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-600">{task.topic}</span>
                  </div>

                  <h2
                    className={`mt-2 font-display text-lg font-bold ${
                      isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h2>

                  {task.description && (
                    <p className="mt-2 text-base leading-relaxed text-slate-700">
                      {task.description}
                    </p>
                  )}

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    Fecha de entrega:{' '}
                    <span className="font-semibold text-slate-900">
                      {formatFullDateWithYearES(task.dueDate)}
                    </span>
                    {!isCompleted && (
                      <span
                        className={`ml-2 font-semibold ${
                          isOverdue
                            ? 'text-red-700'
                            : isDueToday
                              ? 'text-blue-700'
                              : 'text-slate-600'
                        }`}
                      >
                        ({getRelativeDueLabel(task.dueDate, todayISO)})
                      </span>
                    )}
                  </p>
                </div>

                {/* Botones grandes con acción explícita */}
                <div className="mt-5 flex flex-wrap gap-2.5 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none whitespace-nowrap shrink-0 ${
                      isCompleted
                        ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus-visible:ring-blue-700'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-700'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        <span>Marcar como pendiente</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Marcar como completada</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Editar tarea</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task)}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar tarea</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
