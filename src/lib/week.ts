/**
 * Weekly window (Monday 00:00 Asia/Jakarta).
 *
 * Jakarta is UTC+7 with no DST, so the arithmetic is exact. Used to label a
 * "this week" window and drive a countdown to the next week boundary.
 */

const DAY_MS = 86_400_000;
const JAKARTA_OFFSET_MS = 7 * 3_600_000;

export interface WeekWindow {
  startsAt: Date;
  endsAt: Date;
  /** e.g. "2026-W34" */
  weekKey: string;
  /** Human label, e.g. "Minggu 24–30 Agu 2026" */
  label: string;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

/** ISO week number for a UTC (already Jakarta-shifted) date. */
function isoWeekKey(year: number, monthIndex: number, day: number): string {
  const date = new Date(Date.UTC(year, monthIndex, day));
  const dayNum = (date.getUTCDay() + 6) % 7; // Monday = 0
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // nearest Thursday
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * DAY_MS));
  return `${date.getUTCFullYear()}-W${pad(week)}`;
}

export function weekBounds(now: Date = new Date()): WeekWindow {
  const jak = new Date(now.getTime() + JAKARTA_OFFSET_MS);
  const day = jak.getUTCDay(); // 0 Sun .. 6 Sat
  const diffToMonday = (day + 6) % 7;

  const mondayJak = new Date(
    Date.UTC(jak.getUTCFullYear(), jak.getUTCMonth(), jak.getUTCDate() - diffToMonday)
  );
  const startsAt = new Date(mondayJak.getTime() - JAKARTA_OFFSET_MS);
  const endsAt = new Date(startsAt.getTime() + 7 * DAY_MS);

  const lastDay = new Date(endsAt.getTime() - DAY_MS);
  const startMonth = MONTHS_ID[mondayJak.getUTCMonth()];
  const endMonth = MONTHS_ID[lastDay.getUTCMonth()];
  const label = `Minggu ${mondayJak.getUTCDate()} ${startMonth}–${lastDay.getUTCDate()} ${endMonth} ${lastDay.getUTCFullYear()}`;

  return {
    startsAt,
    endsAt,
    weekKey: isoWeekKey(jak.getUTCFullYear(), jak.getUTCMonth(), jak.getUTCDate()),
    label
  };
}
