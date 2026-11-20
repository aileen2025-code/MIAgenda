import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';

interface Actividad {
  id: number;
  nombre: string;
  completada: boolean;
}

export function MiAgendaPreviewScreen() {
  const [textoActividad, setTextoActividad] = useState('');
  const [siguienteId, setSiguienteId] = useState(3);
  const [errorTexto, setErrorTexto] = useState(false);

  // Estado temporal solo en memoria mientras la app esté abierta
  const [actividades, setActividades] = useState<Actividad[]>([
    { id: 1, nombre: 'Repasar qué es un @Composable', completada: false },
    { id: 2, nombre: 'Probar mi primera lista en Compose', completada: true },
  ]);

  const handleAgregarActividad = (event: React.FormEvent) => {
    event.preventDefault();
    const nombreLimpio = textoActividad.trim();
    if (!nombreLimpio) {
      setErrorTexto(true);
      return;
    }

    setActividades((prev) => [
      { id: siguienteId, nombre: nombreLimpio, completada: false },
      ...prev,
    ]);
    setSiguienteId((prev) => prev + 1);
    setTextoActividad('');
    setErrorTexto(false);
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
    <div className="flex w-full flex-col rounded-[28px] border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
      {/* 1. Título principal */}
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
        Mi Agenda
      </h1>

      {/* 2 y 3. Campo para escribir una actividad y botón Agregar actividad */}
      <form onSubmit={handleAgregarActividad} className="mt-4 space-y-3">
        <div>
          <label
            htmlFor="actividad-input"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Escribe una actividad
          </label>
          <input
            id="actividad-input"
            type="text"
            value={textoActividad}
            onChange={(e) => {
              setTextoActividad(e.target.value);
              if (errorTexto) setErrorTexto(false);
            }}
            placeholder="Ejemplo: Estudiar Column y Row"
            className={`min-h-[48px] w-full rounded-xl border bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
              errorTexto
                ? 'border-red-500 focus:border-red-600 focus:ring-red-600/20'
                : 'border-slate-300 focus:border-blue-700 focus:ring-blue-700/20'
            }`}
          />
          {errorTexto && (
            <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
              Escribe el nombre de una actividad antes de agregarla.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]"
        >
          Agregar actividad
        </button>
      </form>

      {/* 4. Lista donde aparecen las actividades agregadas */}
      <div className="mt-6 flex-1">
        {actividades.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <p className="text-base text-slate-600">
              Aún no hay actividades. Escribe una arriba y toca «Agregar actividad».
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5" aria-label="Lista de actividades">
            {actividades.map((actividad) => (
              <li
                key={actividad.id}
                className="flex min-h-[56px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 px-2.5 py-2"
              >
                {/* 5. Control para marcar como completada */}
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
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-slate-200/70 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      actividad.completada
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : 'border-slate-500 bg-white'
                    }`}
                  >
                    {actividad.completada && (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    )}
                  </span>
                </button>

                {/* Texto de la actividad */}
                <span
                  className={`flex-1 text-base leading-snug break-words ${
                    actividad.completada
                      ? 'text-slate-500 line-through'
                      : 'font-medium text-slate-900'
                  }`}
                >
                  {actividad.nombre}
                </span>

                {/* 6. Botón para eliminar cada actividad */}
                <button
                  type="button"
                  onClick={() => handleEliminar(actividad.id)}
                  aria-label={`Eliminar "${actividad.nombre}"`}
                  title="Eliminar actividad"
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
