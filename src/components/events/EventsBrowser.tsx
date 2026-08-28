'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, List } from 'lucide-react'
import { EventCard } from '@/components/cards/EventCard'
import { NoResults } from '@/components/ui/States'
import { eventCategories, type CooperEvent, type EventCategory } from '@/content/events'
import { dayKey, formatMonthYear, formatTimeRange } from '@/lib/dates'
import { cn } from '@/lib/utils'

type View = 'list' | 'calendar'

/**
 * Events browser with a list view and a month calendar.
 *
 * The calendar stays usable on a 320px phone: it drops to a compact grid where
 * each day with an event gets a marker, and tapping a day scrolls its entry
 * into view in the list below.
 */
export function EventsBrowser({
  upcoming,
  past,
}: {
  upcoming: CooperEvent[]
  past: CooperEvent[]
}) {
  const [view, setView] = useState<View>('list')
  const [category, setCategory] = useState<EventCategory | 'all'>('all')
  const [showPast, setShowPast] = useState(false)

  const source = showPast ? past : upcoming

  const filtered = useMemo(
    () => (category === 'all' ? source : source.filter((e) => e.category === category)),
    [source, category],
  )

  const usedCategories = useMemo(() => {
    const used = new Set(source.map((e) => e.category))
    return eventCategories.filter((c) => used.has(c))
  }, [source])

  return (
    <div>
      {/* ---- Controls ---- */}
      <div className="flex flex-col gap-4 border-[3px] border-ink bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Choose a view"
          className="inline-flex self-start border-[3px] border-ink"
        >
          <ViewButton
            active={view === 'list'}
            onClick={() => setView('list')}
            icon={<List aria-hidden="true" className="h-4 w-4" />}
            label="List"
          />
          <ViewButton
            active={view === 'calendar'}
            onClick={() => setView('calendar')}
            icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
            label="Calendar"
          />
        </div>

        <div
          role="group"
          aria-label="Upcoming or past"
          className="inline-flex self-start border-[3px] border-ink"
        >
          <ViewButton
            active={!showPast}
            onClick={() => setShowPast(false)}
            label={`Upcoming (${upcoming.length})`}
          />
          <ViewButton
            active={showPast}
            onClick={() => setShowPast(true)}
            label={`Past (${past.length})`}
          />
        </div>
      </div>

      {/* ---- Category filter ---- */}
      {usedCategories.length > 1 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
            Type
          </span>
          <Chip active={category === 'all'} onClick={() => setCategory('all')} label="All" />
          {usedCategories.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              label={c}
            />
          ))}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        Showing {filtered.length} {showPast ? 'past' : 'upcoming'} events.
      </p>

      {/* ---- Views ---- */}
      <div className="mt-7">
        {view === 'calendar' ? <MonthCalendar events={filtered} /> : null}

        {filtered.length === 0 ? (
          <NoResults
            label={
              showPast ? 'No past events to show yet.' : 'No upcoming events right now.'
            }
            onReset={
              category !== 'all' ? (
                <button type="button" onClick={() => setCategory('all')} className="btn btn-sm">
                  Show all types
                </button>
              ) : (
                <Link href="/contact" className="btn btn-sm btn-blue">
                  Request an appearance
                </Link>
              )
            }
          />
        ) : (
          <ul className={cn('flex flex-col gap-5', view === 'calendar' && 'mt-8')}>
            {filtered.map((event) => (
              <li key={event.slug} id={`event-${event.slug}`} className="scroll-mt-28">
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function ViewButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-10 items-center gap-1.5 px-3 py-1.5 font-display text-sm tracking-wide uppercase transition-colors',
        active ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gold-200',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'min-h-10 border-[3px] border-ink px-3 py-1.5 font-display text-sm tracking-wide uppercase transition-colors',
        active ? 'bg-red-500 text-white' : 'bg-white hover:bg-gold-200',
      )}
    >
      {label}
    </button>
  )
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function MonthCalendar({ events }: { events: CooperEvent[] }) {
  // Open on the month of the first event so the grid is never empty.
  const initial = events[0] ? new Date(events[0].start) : new Date()
  const [cursor, setCursor] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  })

  const byDay = useMemo(() => {
    const map = new Map<string, CooperEvent[]>()
    for (const e of events) {
      const key = dayKey(e.start)
      map.set(key, [...(map.get(key) ?? []), e])
    }
    return map
  }, [events])

  const first = new Date(cursor.year, cursor.month, 1)
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const leading = first.getDay()
  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function shift(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const monthLabel = formatMonthYear(cursor.year, cursor.month)

  return (
    <div className="ink pop bg-white p-3 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="grid h-11 w-11 place-items-center border-[3px] border-ink bg-white hover:bg-gold-200"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Previous month</span>
        </button>
        <p aria-live="polite" className="font-display text-xl tracking-wide uppercase sm:text-2xl">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          className="grid h-11 w-11 place-items-center border-[3px] border-ink bg-white hover:bg-gold-200"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Next month</span>
        </button>
      </div>

      <table className="mt-4 w-full table-fixed border-collapse">
        <caption className="sr-only">
          Cooper&rsquo;s appearances in {monthLabel}
        </caption>
        <thead>
          <tr>
            {WEEKDAYS.map((d, i) => (
              <th
                key={i}
                scope="col"
                className="pb-2 text-center text-xs font-bold tracking-wider text-ink-3 uppercase"
              >
                <span aria-hidden="true">{d}</span>
                <span className="sr-only">{WEEKDAY_NAMES[i]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, week) => (
            <tr key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((day, i) => {
                if (day === null) {
                  return <td key={i} className="border border-ink/10 p-0.5" />
                }
                const key = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayEvents = byDay.get(key) ?? []
                const has = dayEvents.length > 0

                return (
                  <td key={i} className="border border-ink/15 p-0.5 align-top">
                    <div
                      className={cn(
                        'flex min-h-14 flex-col gap-0.5 p-1 sm:min-h-20',
                        has && 'bg-gold-100',
                      )}
                    >
                      <span
                        className={cn(
                          'self-end text-xs font-bold',
                          has ? 'text-ink' : 'text-ink-3',
                        )}
                      >
                        {day}
                      </span>
                      {dayEvents.map((e) => (
                        <a
                          key={e.slug}
                          href={`#event-${e.slug}`}
                          className="block truncate border-2 border-ink bg-red-500 px-1 py-0.5 text-[0.6rem] leading-tight font-bold text-white hover:bg-red-400 sm:text-[0.68rem]"
                        >
                          <span className="hidden sm:inline">
                            {formatTimeRange(e.start)} &middot;{' '}
                          </span>
                          {e.title}
                        </a>
                      ))}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-xs text-ink-3">
        Tap an event to jump to its details below.
      </p>
    </div>
  )
}
