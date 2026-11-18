import { UserProgressData } from '../types';

export const XP_PER_PROBLEM = 50;
export const XP_PER_LEVEL = 150;

const DEMO_COMPLETED = ['prob-algebra-1', 'prob-geom-1'];
const DEMO_BOOKMARKS = ['quadratic-formula', 'pythagoras', 'normal-pdf'];

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateKey(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

/** Consecutive local calendar days ending today, or yesterday if today is not recorded yet. */
export function computeStreak(activeDates: string[], today = localDateKey()): number {
  const dates = new Set(activeDates);
  const start = dates.has(today) ? today : dates.has(shiftDateKey(today, -1)) ? shiftDateKey(today, -1) : '';
  if (!start) return 0;

  let streak = 0;
  let cursor = start;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  return streak;
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

export function formatStudyTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  return `${minutes} min`;
}

export function formatVisitedAt(value: string, now = Date.now()): string {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return value;
  const minutes = Math.floor((now - time) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function sameIds(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const ids = new Set(left);
  return right.every((id) => ids.has(id));
}

function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isIsoTimestamp(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T/.test(value);
}

export function emptyProgress(today = localDateKey()): UserProgressData {
  return {
    streak: 1,
    lastActiveDate: today,
    activeDates: [today],
    studiedSeconds: 0,
    completedProblems: [],
    masteredTopics: [],
    recentlyVisited: [],
    visitedTopics: [],
    xp: 0,
    level: 1,
    bookmarks: [],
  };
}

export function normalizeProgress(raw: Partial<UserProgressData> | null, today = localDateKey()): UserProgressData {
  if (!raw) return emptyProgress(today);

  const legacy = !Array.isArray(raw.activeDates);
  let completed = Array.isArray(raw.completedProblems)
    ? [...new Set(raw.completedProblems.filter((id) => typeof id === 'string' && id))]
    : [];
  let bookmarks = Array.isArray(raw.bookmarks)
    ? [...new Set(raw.bookmarks.filter((id) => typeof id === 'string' && id))]
    : [];
  let recentlyVisited = Array.isArray(raw.recentlyVisited)
    ? raw.recentlyVisited.filter((item) => item && typeof item.topicId === 'string')
    : [];

  if (legacy) {
    const extras = completed.filter((id) => !DEMO_COMPLETED.includes(id));
    const matchesSeedMath =
      raw.xp === 420 + extras.length * XP_PER_PROBLEM &&
      raw.streak === 5 + extras.length;
    if (matchesSeedMath) {
      completed = extras;
      if (sameIds(bookmarks, DEMO_BOOKMARKS)) bookmarks = [];
    }
    recentlyVisited = recentlyVisited.filter((item) => isIsoTimestamp(item.visitedAt));
  }

  const activeDates = (Array.isArray(raw.activeDates) ? raw.activeDates : [])
    .filter((day) => typeof day === 'string' && isDateKey(day));
  const dates = activeDates.includes(today) ? activeDates : [...activeDates, today];
  const xp = completed.length * XP_PER_PROBLEM;

  return {
    streak: computeStreak(dates, today),
    lastActiveDate: today,
    activeDates: dates,
    studiedSeconds: typeof raw.studiedSeconds === 'number' && raw.studiedSeconds > 0 ? raw.studiedSeconds : 0,
    completedProblems: completed,
    masteredTopics: legacy || !Array.isArray(raw.masteredTopics) ? [] : raw.masteredTopics,
    recentlyVisited: recentlyVisited.slice(0, 5),
    visitedTopics: Array.isArray(raw.visitedTopics) ? raw.visitedTopics.filter((id) => typeof id === 'string') : [],
    xp,
    level: levelFromXp(xp),
    bookmarks,
  };
}

export function shuffleItems<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}
