import React, { useEffect, useState } from 'react';
import { COURSE_TOPICS, NoteItem } from '../types';
import { getTodayISO } from '../utils/dateUtils';
import { BottomSheetModal } from './BottomSheetModal';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<NoteItem, 'id'>, existingId?: string) => void;
  initialNote?: NoteItem | null;
}

export function NoteFormModal({
  isOpen,
  onClose,
  onSave,
  initialNote,
}: NoteFormModalProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState<string>(COURSE_TOPICS[0]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialNote) {
      setTitle(initialNote.title);
      setTopic(initialNote.topic);
      setContent(initialNote.content);
    } else {
      setTitle('');
      setTopic(COURSE_TOPICS[0]);
      setContent('');
    }
    setError('');
  }, [isOpen, initialNote]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para tu apunte.');
      return;
    }
    if (!content.trim()) {
      setError('Escribe el contenido de tu nota antes de guardar.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        topic,
        content: content.trim(),
        updatedAt: getTodayISO(),
      },
      initialNote?.id,
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? 'Editar apunte' : 'Crear nuevo apunte'}
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
            htmlFor="note-title"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Título del apunte
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ejemplo: Diferencias entre modelos Gemini Flash y Pro"
            className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="note-topic"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Tema del curso
          </label>
          <select
            id="note-topic"
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
            htmlFor="note-content"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Apuntes
          </label>
          <textarea
            id="note-content"
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe ideas clave, ejemplos de prompts, atajos o dudas para repasar..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
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
            {initialNote ? 'Guardar cambios' : 'Guardar nota'}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}
