import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-950/70 px-4 py-2 text-sm font-medium text-amber-200"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-amber-400" />
      <span>Sin conexión · Tus actividades siguen guardadas en el teléfono</span>
    </div>
  );
}
