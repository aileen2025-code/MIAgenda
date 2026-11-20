import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { ClassSession, TaskItem } from '../types';
import {
  addDaysISO,
  formatLongDateES,
  formatWeekRangeES,
  getDayNumber,
  getRelativeDayLabel,
  getTodayISO,
  getWeekDatesISO,
  getWeekdayShortES,
} from '../utils/dateUtils';

interface CalendarioViewProps {
  classes: ClassSession[];
  tasks: TaskItem[];
  onAddClassForDate: (dateISO: string) => void;
  onEditClass: (session: ClassSession) => void;
  onDeleteClass: (session: ClassSession) => void;
  onAddTaskForDate: (dateISO: string) => void;
  onEditTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

type CalendarMode = 'day' | 'week';

export function CalendarioView({
  classes,
  tasks,
  onAddClassForDate,
  onEditClass,
  onDeleteClass,
  onAddTaskForDate,
  onEditTask,
  onToggleTaskStatus,
}: CalendarioViewProps) {
  const todayISO = getTodayISO();
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [mode, setMode] = useState<CalendarMode>('day');

  const weekDates = getWeekDatesISO(selectedDate);

  const handlePrevious = () => {
    setSelectedDate((prev) => addDaysISO(prev, mode === 'day' ? -1 : -7));
  };

  const handleNext = () => {
    setSelectedDate((prev) => addDaysISO(prev, mode === 'day' ? 1 : 7));
  };

  const handleGoToday = () => {
    setSelectedDate(todayISO);
  };

  const getClassesForDate = (dateISO: string) =>
    classes
      .filter((c) => c.date === dateISO)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getTasksForDate = (dateISO: string) =>
    tasks.filter((t) => t.dueDate === dateISO);

  const selectedDayClasses = getClassesForDate(selectedDate);
  const selectedDayTasks = getTasksForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Cabecera y selector Día / Semana */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Calendario de actividades
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Consulta tus clases y fechas de entrega por día o por semana.
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:w-auto"
            role="tablist"
            aria-label="Vista del calendario"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'day'}
              onClick={() => setMode('day')}
              className={`min-h-[44px] rounded-lg px-5 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por día
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'week'}
              onClick={() => setMode('week')}
              className={`min-h-[44px] rounded-lg px-5 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'week'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por semana
            </button>
          </div>
        </div>

        {/* Navegación temporal */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label={mode === 'day' ? 'Día anterior' : 'Semana anterior'}
              className="flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              onClick={handleGoToday}
              className="flex min-h-[44px] items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={mode === 'day' ? 'Día siguiente' : 'Semana siguiente'}
              className="flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <p className="font-display text-base font-bold text-slate-900 sm:text-lg">
            {mode === 'day'
              ? formatLongDateES(selectedDate)
              : formatWeekRangeES(weekDates)}
          </p>
        </div>

        {/* Tira semanal de días para selección rápida */}
        <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDates.map((dateISO) => {
            const isSelected = dateISO === selectedDate;
            const isToday = dateISO === todayISO;
            const dayClassesCount = getClassesForDate(dateISO).length;
            const dayTasksCount = getTasksForDate(dateISO).length;
            const totalItems = dayClassesCount + dayTasksCount;

            return (
              <button
                key={dateISO}
                type="button"
                onClick={() => {
                  setSelectedDate(dateISO);
                  if (mode === 'week') setMode('day');
                }}
                aria-label={`${formatLongDateES(dateISO)}, ${totalItems} actividades`}
                className={`flex min-h-[68px] flex-col items-center justify-center rounded-xl border px-1 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none ${
                  isSelected
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : isToday
                      ? 'border-blue-300 bg-blue-50 text-slate-900 hover:bg-blue-100'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {getWeekdayShortES(dateISO)}
                </span>
                <span className="mt-0.5 font-display text-lg font-bold tabular-nums">
                  {getDayNumber(dateISO)}
                </span>
                <span
                  className={`mt-0.5 text-[11px] font-medium tabular-nums ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {totalItems > 0 ? `${totalItems} act.` : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Vista Por Día */}
      {mode === 'day' && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Actividades para {getRelativeDayLabel(selectedDate, todayISO)}
            </h2>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onAddClassForDate(selectedDate)}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar clase</span>
              </button>
              <button
                type="button"
                onClick={() => onAddTaskForDate(selectedDate)}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar tarea</span>
              </button>
            </div>
          </div>

          {selectedDayClasses.length === 0 && selectedDayTasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <CalendarIcon className="mx-auto h-9 w-9 text-slate-400" />
              <p className="mt-3 text-lg font-semibold text-slate-900">
                No hay clases ni entregas este día
              </p>
              <p className="mt-1 text-base text-slate-600">
                Usa los botones de arriba para agregar una clase o una tarea con fecha{' '}
                {formatLongDateES(selectedDate)}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Clases del día */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-600">
                  Clases programadas ({selectedDayClasses.length})
                </h3>
                {selectedDayClasses.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-600">
                    Sin clases programadas para este día.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayClasses.map((session) => (
                      <article
                        key={session.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                      >
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                          <span className="font-mono font-semibold text-blue-700 tabular-nums">
                            {session.startTime} – {session.endTime}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{session.modality}</span>
                        </div>
                        <h4 className="mt-2 font-display text-lg font-bold text-slate-900">
                          {session.title}
                        </h4>
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
                            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                          >
                            <Pencil className="h-4 w-4" />
                            <span>Editar clase</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClass(session)}
                            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 whitespace-nowrap shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Eliminar clase</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Entregas del día */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-600">
                  Entregas de tareas ({selectedDayTasks.length})
                </h3>
                {selectedDayTasks.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-600">
                    No hay entregas de tareas para este día.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayTasks.map((task) => {
                      const isDone = task.status === 'completed';
                      return (
                        <article
                          key={task.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                            <span
                              className={`inline-flex items-center gap-1.5 font-semibold ${
                                isDone ? 'text-emerald-700' : 'text-blue-700'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                              <span>{isDone ? 'Completada' : 'Pendiente'}</span>
                            </span>
                            <span className="text-slate-400" aria-hidden="true">
                              ·
                            </span>
                            <span className="text-slate-600">{task.topic}</span>
                          </div>
                          <h4
                            className={`mt-2 font-display text-lg font-bold ${
                              isDone
                                ? 'text-slate-500 line-through'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="mt-1.5 text-base leading-relaxed text-slate-700">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-4 flex flex-wrap gap-2.5">
                            <button
                              type="button"
                              onClick={() => onToggleTaskStatus(task.id)}
                              className={`flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                                isDone
                                  ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
                              }`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>
                                {isDone
                                  ? 'Volver a pendiente'
                                  : 'Marcar como completada'}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditTask(task)}
                              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
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
              </div>
            </div>
          )}
        </section>
      )}

      {/* Vista Por Semana */}
      {mode === 'week' && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Agenda de la semana
            </h2>
            <button
              type="button"
              onClick={() => onAddClassForDate(selectedDate)}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar clase</span>
            </button>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {weekDates.map((dateISO) => {
              const dayClasses = getClassesForDate(dateISO);
              const dayTasks = getTasksForDate(dateISO);
              const isToday = dateISO === todayISO;

              return (
                <div key={dateISO} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">
                        {formatLongDateES(dateISO)}
                      </h3>
                      {isToday && (
                        <span className="text-sm font-semibold text-blue-700">
                          · Hoy
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddClassForDate(dateISO)}
                      className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar clase</span>
                    </button>
                  </div>

                  {dayClasses.length === 0 && dayTasks.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Sin actividades programadas.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2.5">
                      {dayClasses.map((session) => (
                        <div
                          key={session.id}
                          className="flex flex-col justify-between gap-3 rounded-xl bg-slate-50 p-3.5 sm:flex-row sm:items-center"
                        >
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-mono font-semibold text-blue-700 tabular-nums">
                                {session.startTime} – {session.endTime}
                              </span>{' '}
                              · Clase · {session.modality}
                            </p>
                            <p className="mt-0.5 text-base font-semibold text-slate-900">
                              {session.title}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onEditClass(session)}
                              className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 whitespace-nowrap shrink-0"
                            >
                              <Pencil className="h-4 w-4" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteClass(session)}
                              className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 whitespace-nowrap shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {dayTasks.map((task) => {
                        const isDone = task.status === 'completed';
                        return (
                          <div
                            key={task.id}
                            className="flex flex-col justify-between gap-3 rounded-xl bg-slate-50 p-3.5 sm:flex-row sm:items-center"
                          >
                            <div>
                              <p className="text-sm text-slate-600">
                                <span
                                  className={`font-semibold ${
                                    isDone ? 'text-emerald-700' : 'text-blue-700'
                                  }`}
                                >
                                  Entrega de tarea ({isDone ? 'Completada' : 'Pendiente'})
                                </span>{' '}
                                · {task.topic}
                              </p>
                              <p
                                className={`mt-0.5 text-base font-semibold ${
                                  isDone
                                    ? 'text-slate-500 line-through'
                                    : 'text-slate-900'
                                }`}
                              >
                                {task.title}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => onToggleTaskStatus(task.id)}
                                className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold whitespace-nowrap shrink-0 ${
                                  isDone
                                    ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                                }`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>
                                  {isDone ? 'Pendiente' : 'Completar'}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditTask(task)}
                                className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 whitespace-nowrap shrink-0"
                              >
                                <Pencil className="h-4 w-4" />
                                <span>Editar</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
