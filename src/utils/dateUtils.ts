const MONTHS_FULL = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const WEEKDAYS_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function toLocalDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return toLocalDateISO(new Date());
}

export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function addDaysISO(isoDate: string, days: number): string {
  const date = parseLocalDate(isoDate);
  date.setDate(date.getDate() + days);
  return toLocalDateISO(date);
}

export function getWeekDatesISO(referenceISO: string): string[] {
  const ref = parseLocalDate(referenceISO);
  const dayOfWeek = ref.getDay(); // 0=Dom, 1=Lun, ...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push(toLocalDateISO(current));
  }
  return days;
}

export function formatLongDateES(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  const weekday = WEEKDAYS_FULL[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_FULL[date.getMonth()];
  return `${weekday} ${day} de ${month}`;
}

export function formatFullDateWithYearES(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  const day = date.getDate();
  const month = MONTHS_FULL[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

export function formatShortDateES(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  return `${day} ${month}`;
}

export function getWeekdayShortES(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  return WEEKDAYS_SHORT[date.getDay()];
}

export function getDayNumber(isoDate: string): number {
  return parseLocalDate(isoDate).getDate();
}

export function formatWeekRangeES(weekDays: string[]): string {
  if (weekDays.length === 0) return '';
  const first = parseLocalDate(weekDays[0]);
  const last = parseLocalDate(weekDays[weekDays.length - 1]);
  const firstMonth = MONTHS_SHORT[first.getMonth()];
  const lastMonth = MONTHS_SHORT[last.getMonth()];

  if (first.getMonth() === last.getMonth()) {
    return `Del ${first.getDate()} al ${last.getDate()} de ${MONTHS_FULL[last.getMonth()]}`;
  }
  return `${first.getDate()} ${firstMonth} – ${last.getDate()} ${lastMonth}`;
}

export function getRelativeDueLabel(isoDate: string, todayISO: string): string {
  if (isoDate === todayISO) return 'Vence hoy';
  if (isoDate === addDaysISO(todayISO, 1)) return 'Vence mañana';
  if (isoDate < todayISO) return 'Fecha pasada';
  return `Entrega: ${formatShortDateES(isoDate)}`;
}

export function getRelativeDayLabel(isoDate: string, todayISO: string): string {
  if (isoDate === todayISO) return 'Hoy';
  if (isoDate === addDaysISO(todayISO, 1)) return 'Mañana';
  if (isoDate === addDaysISO(todayISO, -1)) return 'Ayer';
  return formatLongDateES(isoDate);
}
