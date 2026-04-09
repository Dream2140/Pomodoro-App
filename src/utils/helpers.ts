import type { TaskDate } from '@/types';

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function formatDate(date?: Date | string): string {
  const d = date ? new Date(date) : new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.length !== 8) return null;
  const month = parseInt(dateStr.substring(0, 2), 10) - 1;
  const day = parseInt(dateStr.substring(3, 5), 10);
  const year = parseInt(dateStr.substring(6), 10) + 2000;
  return new Date(year, month, day);
}

export function createTaskDate(date?: string): TaskDate {
  const d = date ? new Date(date) : new Date();
  return {
    fullDeadline: d.getTime(),
    month: d.toLocaleDateString('en-US', { month: 'long' }),
    day: d.getDate(),
  };
}

export function getWeekDays(): string[] {
  const MS_PER_DAY = 86400000;
  const days: string[] = [];
  const now = new Date();
  let time = now.getTime();

  for (let i = 0; i < 7; i++) {
    const d = new Date(time);
    days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    time -= MS_PER_DAY;
  }

  return days.reverse();
}

export function getMonthDays(): number[] {
  return Array.from({ length: 30 }, (_, i) => i + 1);
}

export function getWeekDayByDate(dateStr: string): string | null {
  const d = parseDate(dateStr);
  if (!d) return null;
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getMonthDayIndex(dateStr: string): number | null {
  const d = parseDate(dateStr);
  if (!d) return null;

  const now = new Date();
  const MS_PER_DAY = 86400000;
  const diff = now.getTime() - d.getTime();

  if (diff > MS_PER_DAY) {
    return 30 - Math.floor(diff / MS_PER_DAY);
  }
  return 30;
}

export function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  return parts.join(' ') || '0m';
}
