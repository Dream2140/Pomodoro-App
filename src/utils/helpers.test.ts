import { describe, it, expect } from 'vitest';
import {
  generateUniqueId,
  formatDate,
  parseDate,
  createTaskDate,
  getWeekDays,
  getMonthDays,
  formatMinutesToTime,
} from './helpers';

describe('generateUniqueId', () => {
  it('returns a non-empty string', () => {
    const id = generateUniqueId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateUniqueId()));
    expect(ids.size).toBe(100);
  });
});

describe('formatDate', () => {
  it('formats a known date correctly', () => {
    const result = formatDate(new Date(2024, 0, 15)); // Jan 15, 2024
    expect(result).toBe('01-15-24');
  });

  it('pads single-digit month and day', () => {
    const result = formatDate(new Date(2024, 2, 5)); // Mar 5, 2024
    expect(result).toBe('03-05-24');
  });

  it('returns current date when no arg', () => {
    const result = formatDate();
    expect(result).toMatch(/^\d{2}-\d{2}-\d{2}$/);
  });
});

describe('parseDate', () => {
  it('parses MM-dd-YY format', () => {
    const result = parseDate('01-15-24');
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(0);
    expect(result!.getDate()).toBe(15);
  });

  it('returns null for invalid input', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate('abc')).toBeNull();
    expect(parseDate('1234567890')).toBeNull();
  });
});

describe('createTaskDate', () => {
  it('creates a task date object', () => {
    const result = createTaskDate('2024-06-15');
    expect(result.fullDeadline).toBeGreaterThan(0);
    expect(result.month).toBe('June');
    expect(result.day).toBe(15);
  });

  it('uses current date when no arg', () => {
    const result = createTaskDate();
    expect(result.fullDeadline).toBeGreaterThan(0);
    expect(typeof result.month).toBe('string');
    expect(typeof result.day).toBe('number');
  });
});

describe('getWeekDays', () => {
  it('returns 7 days', () => {
    const days = getWeekDays();
    expect(days).toHaveLength(7);
  });

  it('returns short day names', () => {
    const days = getWeekDays();
    days.forEach((day) => {
      expect(day.length).toBeLessThanOrEqual(4);
    });
  });
});

describe('getMonthDays', () => {
  it('returns 30 days', () => {
    const days = getMonthDays();
    expect(days).toHaveLength(30);
    expect(days[0]).toBe(1);
    expect(days[29]).toBe(30);
  });
});

describe('formatMinutesToTime', () => {
  it('formats minutes only', () => {
    expect(formatMinutesToTime(25)).toBe('25m');
  });

  it('formats hours and minutes', () => {
    expect(formatMinutesToTime(90)).toBe('1h 30m');
  });

  it('formats hours only', () => {
    expect(formatMinutesToTime(120)).toBe('2h');
  });

  it('handles zero', () => {
    expect(formatMinutesToTime(0)).toBe('0m');
  });
});
