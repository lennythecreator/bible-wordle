/**
 * Daily puzzles are keyed to a single canonical calendar day so that every
 * user, server instance, and timezone sees the SAME challenge on the SAME
 * day. The game day is defined in UTC to eliminate server-local timezone
 * drift between the admin (write) and player (read) paths.
 */

export const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function getTodayUtcDate(date: Date = new Date()): Date {
  return startOfUtcDate(date);
}

export function utcDateFromKey(key: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) {
    throw new Error(`Invalid date key: ${key}`);
  }
  return new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addUtcDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}