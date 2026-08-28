import type { CooperEvent } from '@/content/events'
import { siteConfig } from '@/config/site'

/**
 * Builds an RFC 5545 calendar file for a single event, entirely in the browser
 * so no server route (and no server cost) is needed.
 */

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** ISO string -> UTC basic format, e.g. 20260415T173000Z */
function toIcsUtc(iso: string): string {
  const d = new Date(iso)
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  )
}

/** Escapes the characters ICS treats as structural. */
function esc(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** ICS lines must be folded at 75 octets. */
function fold(line: string): string {
  if (line.length <= 73) return line
  const chunks: string[] = []
  let rest = line
  chunks.push(rest.slice(0, 73))
  rest = rest.slice(73)
  while (rest.length > 72) {
    chunks.push(' ' + rest.slice(0, 72))
    rest = rest.slice(72)
  }
  if (rest.length) chunks.push(' ' + rest)
  return chunks.join('\r\n')
}

export function buildIcs(event: CooperEvent): string {
  const end =
    event.end ??
    new Date(new Date(event.start).getTime() + 60 * 60 * 1000).toISOString()

  const description = [
    event.summary,
    '',
    event.externalUrl ? `More information: ${event.externalUrl}` : '',
    `Cooper's website: ${siteConfig.url}/events/${event.slug}`,
  ]
    .filter(Boolean)
    .join('\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ESD K9 Cooper//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.slug}@esdk9cooper`,
    `DTSTAMP:${toIcsUtc(new Date().toISOString())}`,
    `DTSTART:${toIcsUtc(event.start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(description)}`,
    `LOCATION:${esc([event.location.name, event.location.address].filter(Boolean).join(', '))}`,
    `URL:${siteConfig.url}/events/${event.slug}`,
    `STATUS:${event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.map(fold).join('\r\n')
}

/** Triggers a download of the .ics file. Browser-only. */
export function downloadIcs(event: CooperEvent): void {
  const blob = new Blob([buildIcs(event)], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.slug}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Give Safari a moment before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Google Maps directions link for an event location. */
export function directionsUrl(event: CooperEvent): string | null {
  const query = event.location.address || event.location.name
  if (!query) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
}
