import React, { useEffect, useState } from 'react';
import { ClassModality, ClassSession, COURSE_TOPICS } from '../types';
import { getTodayISO } from '../utils/dateUtils';
import { BottomSheetModal } from './BottomSheetModal';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ClassSession, 'id'>, existingId?: string) => void;
  initialClass?: ClassSession | null;
  defaultDate?: string;
}

const MODALITIES: ClassModality[] = [
  'Clase en vivo',
  'Práctica guiada',
  'Tutoría',
];

export function ClassFormModal({
  isOpen,
  onClose,
  onSave,
  initialClass,
  defaultDate,
}: ClassFormModalProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState<string>(COURSE_TOPICS[0]);
  const [date, setDate] = useState(getTodayISO());
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:30');
  const [modality, setModality] = useState<ClassModality>('Clase en vivo');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialClass) {
      setTitle(initialClass.title);
      setTopic(initialClass.topic);
      setDate(initialClass.date);
      setStartTime(initialClass.startTime);
      setEndTime(initialClass.endTime);
      setModality(initialClass.modality);
      setDescription(initialClass.description);
    } else {
      setTitle('');
      setTopic(COURSE_TOPICS[0]);
      setDate(defaultDate || getTodayISO());
      setStartTime('18:00');
      setEndTime('19:30');
      setModality('Clase en vivo');
      setDescription('');
    }
    setError('');
  }, [isOpen, initialClass, defaultDate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Escribe el nombre de la clase o actividad.');
      return;
    }
    if (!date) {
      setError('Selecciona la fecha de la clase.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Indica la hora de inicio y de finalización.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        topic,
        date,
        startTime,
        endTime,
        modality,
        description: description.trim(),
      },
      initialClass?.id,
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialClass ? 'Editar clase' : 'Agregar nueva clase'}
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
            htmlFor="class-title"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Nombre de la clase o actividad
          </label>
          <input
            id="class-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ejemplo: Taller de prompts en Google AI Studio"
            className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="class-topic"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              Tema del curso
            </label>
            <select
              id="class-topic"
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

          <div>
            <label
              htmlFor="class-modality"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              Modalidad
            </label>
            <select
              id="class-modality"
              value={modality}
              onChange={(e) => setModality(e.target.value as ClassModality)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            >
              {MODALITIES.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="class-date"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              Fecha
            </label>
            <input
              id="class-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="class-start"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              Hora de inicio
            </label>
            <input
              id="class-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="class-end"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              Hora de fin
            </label>
            <input
              id="class-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="class-description"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Descripción (opcional)
          </label>
          <textarea
            id="class-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Temas que se verán en la sesión o materiales que necesitas tener listos..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
          />
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
            {initialClass ? 'Guardar cambios' : 'Guardar clase'}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}
