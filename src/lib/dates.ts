import { siteConfig } from '@/config/site'

/**
 * Every date on the site is stored as an ISO-8601 string and formatted here so
 * the server and the browser always agree (no hydration mismatches).
 */

const TZ = siteConfig.timeZone
const LOCALE = siteConfig.locale

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TZ,
  }).format(new Date(iso))
}

export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: TZ,
  }).format(new Date(iso))
}

export function formatMonthDay(iso: string): { month: string; day: string } {
  const d = new Date(iso)
  return {
    month: new Intl.DateTimeFormat(LOCALE, { month: 'short', timeZone: TZ })
      .format(d)
      .toUpperCase(),
    day: new Intl.DateTimeFormat(LOCALE, { day: 'numeric', timeZone: TZ }).format(d),
  }
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  }).format(new Date(iso))
}

export function formatTimeRange(startIso: string, endIso?: string): string {
  const start = formatTime(startIso)
  return endIso ? `${start} - ${formatTime(endIso)}` : start
}

/** "March 2026" - used as the calendar heading. */
export function formatMonthYear(year: number, monthIndex: number): string {
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, monthIndex, 1)))
}

/** YYYY-MM-DD in the site timezone, used as a stable calendar cell key. */
export function dayKey(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TZ,
  }).formatToParts(new Date(iso))
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '01'
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now()
}
