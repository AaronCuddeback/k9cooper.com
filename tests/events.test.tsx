import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { EventsBrowser } from '@/components/events/EventsBrowser'
import { AddToCalendarButton } from '@/components/events/AddToCalendarButton'
import { buildIcs } from '@/lib/ics'
import { events, publicEvents, splitEvents } from '@/content/events'
import type { CooperEvent } from '@/content/events'

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

const sample: CooperEvent = {
  slug: 'test-event',
  title: 'Test Demonstration; with a comma, too',
  category: 'Demonstration',
  start: '2026-09-19T10:00:00-07:00',
  end: '2026-09-19T12:00:00-07:00',
  location: { name: 'Test Venue', address: '1 Test Street' },
  summary: 'A test event.',
  visibility: 'public',
  featured: false,
  status: 'scheduled',
  openToPublic: true,
}

describe('event data', () => {
  it('never exposes an event marked private', () => {
    const privateEvents = events.filter((e) => e.visibility === 'private')
    for (const e of privateEvents) {
      expect(publicEvents.find((p) => p.slug === e.slug)).toBeUndefined()
    }
  })

  it('sorts upcoming events soonest first', () => {
    const { upcoming } = splitEvents(new Date('2026-01-01').getTime())
    const times = upcoming.map((e) => new Date(e.start).getTime())
    expect([...times].sort((a, b) => a - b)).toEqual(times)
  })

  it('gives every event a unique slug', () => {
    const slugs = events.map((e) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('calendar file', () => {
  const ics = buildIcs(sample)

  it('produces a well-formed VCALENDAR', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true)
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true)
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
  })

  it('uses CRLF line endings as the spec requires', () => {
    expect(ics).toContain('\r\n')
  })

  it('converts the start time to UTC basic format', () => {
    // 10:00 Pacific Daylight Time is 17:00 UTC.
    expect(ics).toContain('DTSTART:20260919T170000Z')
  })

  it('escapes semicolons and commas in the summary', () => {
    expect(ics).toContain('SUMMARY:Test Demonstration\\; with a comma\\, too')
  })

  it('marks a cancelled event as cancelled', () => {
    const cancelled = buildIcs({ ...sample, status: 'cancelled' })
    expect(cancelled).toContain('STATUS:CANCELLED')
  })
})

describe('events browser', () => {
  it('shows upcoming events by default and can switch to past', async () => {
    const user = userEvent.setup()
    const past: CooperEvent[] = [{ ...sample, slug: 'past-one', title: 'Past Event' }]
    render(<EventsBrowser upcoming={[sample]} past={past} />)

    expect(screen.getByRole('heading', { name: /test demonstration/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /past \(1\)/i }))
    expect(screen.getByRole('heading', { name: /past event/i })).toBeInTheDocument()
  })

  it('switches to the calendar view', async () => {
    const user = userEvent.setup()
    render(<EventsBrowser upcoming={[sample]} past={[]} />)

    await user.click(screen.getByRole('button', { name: /^calendar$/i }))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('shows a helpful empty state when there is nothing upcoming', () => {
    render(<EventsBrowser upcoming={[]} past={[]} />)
    expect(screen.getByText(/no upcoming events right now/i)).toBeInTheDocument()
  })

  it('renders an add-to-calendar control with an accessible name', () => {
    render(<AddToCalendarButton event={sample} />)
    expect(
      screen.getByRole('button', { name: /downloads a calendar file/i }),
    ).toBeInTheDocument()
  })
})
