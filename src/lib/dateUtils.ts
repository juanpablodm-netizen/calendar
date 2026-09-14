export const WEEKDAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(date: Date): boolean {
  return isSameMonth(date, new Date()) && date.getDate() === new Date().getDate();
}

export interface CalendarDay {
  date: Date;
  iso: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  const dayOfWeek = (firstOfMonth.getDay() + 6) % 7; // Monday=0
  const startDate = new Date(year, month, 1 - dayOfWeek);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dow = date.getDay();
    days.push({
      date,
      iso: toISODate(date),
      isCurrentMonth: date.getMonth() === month,
      isToday: isToday(date),
      isWeekend: dow === 0 || dow === 6,
    });
  }
  return days;
}

export function formatDateLong(iso: string): string {
  const date = parseISODate(iso);
  return `${date.getDate()} de ${MONTHS_ES[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatDateShort(iso: string): string {
  const date = parseISODate(iso);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'hace un momento';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}
