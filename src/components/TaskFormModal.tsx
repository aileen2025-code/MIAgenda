import React, { useEffect, useState } from 'react';
import { COURSE_TOPICS, TaskItem, TaskStatus } from '../types';
import { getTodayISO } from '../utils/dateUtils';
import { BottomSheetModal } from './BottomSheetModal';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TaskItem, 'id'>, existingId?: string) => void;
  initialTask?: TaskItem | null;
  defaultDate?: string;
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  initialTask,
  defaultDate,
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [topic, setTopic] = useState<string>(COURSE_TOPICS[0]);
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setDueDate(initialTask.dueDate);
      setTopic(initialTask.topic);
      setStatus(initialTask.status);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(defaultDate || getTodayISO());
      setTopic(COURSE_TOPICS[0]);
      setStatus('pending');
    }
    setError('');
  }, [isOpen, initialTask, defaultDate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Escribe el nombre de la tarea.');
      return;
    }
    if (!dueDate) {
      setError('Selecciona la fecha de entrega.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        topic,
        status,
      },
      initialTask?.id,
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Editar tarea' : 'Agregar nueva tarea'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="task-title"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Nombre de la tarea
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ejemplo: Probar un prompt con salida JSON"
            className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Descripción
          </label>
          <textarea
            id="task-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalla qué pasos debes realizar para completar esta entrega..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-date"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              Fecha de entrega
            </label>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="task-topic"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              Tema del curso
            </label>
            <select
              id="task-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            >
              {COURSE_TOPICS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-slate-800">
            Estado de la tarea
          </span>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setStatus('pending')}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                status === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendiente
            </button>
            <button
              type="button"
              onClick={() => setStatus('completed')}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                status === 'completed'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completada
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[48px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex min-h-[48px] items-center justify-center rounded-xl bg-blue-700 px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
          >
            {initialTask ? 'Guardar cambios' : 'Guardar tarea'}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}
