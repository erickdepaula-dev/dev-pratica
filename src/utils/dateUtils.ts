/**
 * Timezone and date utilities for DevPrática.
 * Enforces 'America/Fortaleza' timezone for all calendar day and streak calculations.
 */

export const FORTALEZA_TIMEZONE = 'America/Fortaleza';

/**
 * Returns today's date formatted as YYYY-MM-DD in the America/Fortaleza timezone.
 */
export function getFortalezaDateString(date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: FORTALEZA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

/**
 * Returns yesterday's date formatted as YYYY-MM-DD in the America/Fortaleza timezone.
 */
export function getFortalezaYesterdayDateString(date = new Date()): string {
  const todayStr = getFortalezaDateString(date);
  const [year, month, day] = todayStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() - 1);
  return utcDate.toISOString().split('T')[0];
}

/**
 * Calculates the exact difference in calendar days between two YYYY-MM-DD date strings.
 * Returns:
 *   0 if dates are the same calendar day
 *   1 if laterDateStr is the day immediately following earlierDateStr
 *  >1 if one or more days were skipped
 *  <0 if earlierDateStr is after laterDateStr
 */
export function getDaysDifference(earlierDateStr: string, laterDateStr: string): number {
  if (!earlierDateStr || !laterDateStr) return 999;
  const [y1, m1, d1] = earlierDateStr.split('-').map(Number);
  const [y2, m2, d2] = laterDateStr.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const diffMs = utc2 - utc1;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export interface WeekDayStatus {
  dateStr: string;
  dayShort: string; // 'Seg', 'Ter', 'Qua', etc.
  dayNumber: number;
  isToday: boolean;
  hasActivity: boolean;
}

/**
 * Returns a 7-day view (Monday to Sunday) of the current week in America/Fortaleza,
 * indicating which days have completed study activity.
 */
export function getCurrentWeekDays(activeDates: string[] = []): WeekDayStatus[] {
  const todayStr = getFortalezaDateString();
  const [year, month, day] = todayStr.split('-').map(Number);
  const todayUtc = new Date(Date.UTC(year, month - 1, day));

  // Determine current day of week in Fortaleza (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const dayOfWeek = todayUtc.getUTCDay();
  // We want Monday (1) to be first day of the week; if Sunday (0), distance is -6
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const mondayUtc = new Date(todayUtc);
  mondayUtc.setUTCDate(todayUtc.getUTCDate() + distanceToMonday);

  const daysShort = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const week: WeekDayStatus[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(mondayUtc);
    current.setUTCDate(mondayUtc.getUTCDate() + i);
    const dateStr = current.toISOString().split('T')[0];
    const isToday = dateStr === todayStr;
    const hasActivity = activeDates.includes(dateStr);

    week.push({
      dateStr,
      dayShort: daysShort[i],
      dayNumber: current.getUTCDate(),
      isToday,
      hasActivity,
    });
  }

  return week;
}
