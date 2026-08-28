/**
 * EVENTS AND APPEARANCES
 * ----------------------------------------------------------------------------
 * HOW TO ADD AN EVENT
 *   1. Copy any object below and paste it into the `events` array.
 *   2. Give it a unique `slug` (lowercase, hyphens, no spaces).
 *   3. Use full ISO date-times including the timezone offset:
 *        "2026-09-12T10:00:00-07:00"   (-07:00 = Pacific Daylight Time)
 *        "2026-12-05T10:00:00-08:00"   (-08:00 = Pacific Standard Time)
 *   4. Save. The list, the calendar, the event page, the "Add to calendar"
 *      download and the homepage "next appearance" card all update themselves.
 *
 * NEVER PUBLISH
 *   - Private residences, non-public appearances, or any operational detail.
 *   - Anything with `visibility: 'private'` is filtered out of every view; it
 *     is safer still to simply not add it.
 */

export type EventCategory =
  | 'School Visit'
  | 'Community Event'
  | 'Demonstration'
  | 'Fundraiser'
  | 'Meet & Greet'
  | 'Public Safety'

export type EventStatus = 'scheduled' | 'cancelled' | 'postponed' | 'sold-out'

export interface CooperEvent {
  slug: string
  title: string
  category: EventCategory
  /** ISO-8601 with timezone offset. */
  start: string
  /** Optional ISO-8601 end time. Defaults to one hour after `start`. */
  end?: string
  location: {
    name: string
    address?: string
    /** Shown when the venue is deliberately not published. */
    note?: string
  }
  summary: string
  /** Longer description, one paragraph per array entry. */
  details?: string[]
  image?: { src: string; alt: string }
  externalUrl?: string
  externalLabel?: string
  visibility: 'public' | 'private'
  featured: boolean
  status: EventStatus
  /** Free-text note shown when status is not "scheduled". */
  statusNote?: string
  /** Accessibility and attendance information. */
  accessNote?: string
  /** True when the general public can just turn up. */
  openToPublic: boolean
  /** Marks demo content so it is easy to find and delete before launch. */
  isSample?: boolean
}

export const events: CooperEvent[] = [
  /*
    No events are published yet. Add one by copying the shape from the
    CooperEvent interface above - the list, the calendar, the event page, the
    "Add to calendar" download and the homepage "next appearance" card all pick
    it up automatically. Until then every view shows its own empty state.
  */
]

/* ---------------------------------------------------------------------------
   Derived helpers. Nothing below needs editing to add an event.
   --------------------------------------------------------------------------- */

export const publicEvents = events
  .filter((e) => e.visibility === 'public')
  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

export function splitEvents(now: number = Date.now()): {
  upcoming: CooperEvent[]
  past: CooperEvent[]
} {
  const upcoming: CooperEvent[] = []
  const past: CooperEvent[] = []
  for (const e of publicEvents) {
    const endTime = new Date(e.end ?? e.start).getTime()
    if (endTime >= now) upcoming.push(e)
    else past.push(e)
  }
  return { upcoming, past: past.reverse() }
}

export function getEvent(slug: string): CooperEvent | undefined {
  return publicEvents.find((e) => e.slug === slug)
}

export const eventCategories: EventCategory[] = [
  'School Visit',
  'Community Event',
  'Demonstration',
  'Fundraiser',
  'Meet & Greet',
  'Public Safety',
]
