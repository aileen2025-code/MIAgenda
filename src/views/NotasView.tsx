import { useState } from 'react';
import { FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { COURSE_TOPICS, NoteItem } from '../types';
import { formatShortDateES } from '../utils/dateUtils';
import { BottomSheetModal } from '../components/BottomSheetModal';

interface NotasViewProps {
  notes: NoteItem[];
  onAddNote: () => void;
  onEditNote: (note: NoteItem) => void;
  onDeleteNote: (note: NoteItem) => void;
}

export function NotasView({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: NotasViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingNote, setReadingNote] = useState<NoteItem | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredNotes = [...notes]
    .filter((note) => {
      if (selectedTopic !== 'all' && note.topic !== selectedTopic) {
        return false;
      }
      if (normalizedQuery) {
        const matchesTitle = note.title.toLowerCase().includes(normalizedQuery);
        const matchesContent = note.content
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesTopic = note.topic.toLowerCase().includes(normalizedQuery);
        return matchesTitle || matchesContent || matchesTopic;
      }
      return true;
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-6">
      {/* Cabecera de Notas */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Notas y apuntes del curso
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Guarda resúmenes, ejemplos de prompts y recordatorios por tema de Google AI Studio.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNote}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva nota</span>
          </button>
        </div>

        {/* Buscador y filtro por tema */}
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
          <div className="relative">
            <label htmlFor="notes-search" className="sr-only">
              Buscar en tus apuntes
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="notes-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o palabra clave..."
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white pr-4 pl-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="notes-topic-filter" className="sr-only">
              Filtrar por tema del curso
            </label>
            <select
              id="notes-topic-filter"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none"
            >
              <option value="all">Todos los temas ({notes.length})</option>
              {COURSE_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Lista de apuntes */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <FileText className="mx-auto h-9 w-9 text-slate-400" />
          <p className="mt-3 text-lg font-semibold text-slate-900">
            No se encontraron apuntes
          </p>
          <p className="mt-1 text-base text-slate-600">
            {searchQuery || selectedTopic !== 'all'
              ? 'Prueba cambiando el tema o el texto de búsqueda.'
              : 'Crea tu primer apunte para tener tus ideas del curso a la mano.'}
          </p>
          <button
            type="button"
            onClick={onAddNote}
            className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva nota</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                  <span className="font-semibold text-blue-700">
                    {note.topic}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Actualizado el {formatShortDateES(note.updatedAt)}</span>
                </div>

                <h2 className="mt-2 font-display text-lg font-bold text-slate-900">
                  {note.title}
                </h2>

                <p className="mt-2 line-clamp-4 whitespace-pre-line text-base leading-relaxed text-slate-700">
                  {note.content}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setReadingNote(note)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
                >
                  <FileText className="h-4 w-4" />
                  <span>Leer nota completa</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none whitespace-nowrap shrink-0"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none whitespace-nowrap shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar nota</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Lector completo de nota */}
      <BottomSheetModal
        isOpen={readingNote !== null}
        onClose={() => setReadingNote(null)}
        title={readingNote?.title || 'Apunte'}
      >
        {readingNote && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-blue-700">
                {readingNote.topic}
              </span>{' '}
              · Actualizado el {formatShortDateES(readingNote.updatedAt)}
            </p>
            <div className="whitespace-pre-line text-base leading-relaxed text-slate-800">
              {readingNote.content}
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setReadingNote(null)}
                className="flex min-h-[48px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = readingNote;
                  setReadingNote(null);
                  onEditNote(current);
                }}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-base font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
              >
                <Pencil className="h-4 w-4" />
                <span>Editar nota</span>
              </button>
            </div>
          </div>
        )}
      </BottomSheetModal>
    </div>
  );
}
