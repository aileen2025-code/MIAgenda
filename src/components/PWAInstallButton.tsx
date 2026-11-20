import { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/25 bg-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none whitespace-nowrap shrink-0"
      >
        <Download className="h-4 w-4" />
        <span>Instalar</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/25 bg-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none whitespace-nowrap shrink-0"
        >
          <Share className="h-4 w-4" />
          <span>Instalar</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-md rounded-3xl border border-[#1E2945] bg-[#11192E] p-6 text-white shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <h2
                  id="ios-install-title"
                  className="font-display text-lg font-bold text-white"
                >
                  Instalar en tu iPhone
                </h2>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Cerrar instrucciones"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-300 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="mt-3 space-y-2 text-base leading-relaxed text-slate-200">
                <li>
                  1. Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.
                </li>
                <li>
                  2. Desliza hacia abajo y selecciona{' '}
                  <strong>Agregar a inicio</strong>.
                </li>
                <li>
                  3. Toca <strong>Agregar</strong> para abrirla como aplicación móvil.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#1A56FA] px-5 py-3 text-base font-semibold text-white hover:bg-blue-700"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
