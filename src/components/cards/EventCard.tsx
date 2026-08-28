import Image from 'next/image'
import Link from 'next/link'
import { Clock, MapPin, Users } from 'lucide-react'
import type { CooperEvent } from '@/content/events'
import { formatMonthDay, formatTimeRange } from '@/lib/dates'
import { cn, tiltFor } from '@/lib/utils'

const STATUS_BADGE: Record<CooperEvent['status'], { label: string; cls: string } | null> = {
  scheduled: null,
  cancelled: { label: 'Cancelled', cls: 'badge-red' },
  postponed: { label: 'Postponed', cls: 'badge-gold' },
  'sold-out': { label: 'Full', cls: 'badge-muted' },
}

export function EventCard({
  event,
  className,
  compact = false,
  tilt = false,
}: {
  event: CooperEvent
  className?: string
  compact?: boolean
  tilt?: boolean
}) {
  const { month, day } = formatMonthDay(event.start)
  const status = STATUS_BADGE[event.status]

  return (
    <article
      className={cn('card card-hover flex gap-0 overflow-hidden', className)}
      style={tilt ? { rotate: tiltFor(event.slug) } : undefined}
    >
      {/* Tear-off calendar block */}
      <div className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center border-r-[3px] border-ink bg-red-500 px-2 py-4 text-white sm:w-24">
        <span className="font-display text-sm tracking-[0.15em] uppercase">{month}</span>
        <span className="font-display text-4xl leading-none sm:text-5xl">{day}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-blue">{event.category}</span>
          {event.featured ? <span className="badge badge-gold">Featured</span> : null}
          {status ? <span className={cn('badge', status.cls)}>{status.label}</span> : null}
          {!event.openToPublic ? (
            <span className="badge badge-muted">Private booking</span>
          ) : null}
          {event.isSample ? <span className="badge badge-muted">Demo</span> : null}
        </div>

        <h3 className="mt-2 text-title leading-none uppercase">
          <Link
            href={`/events/${event.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>

        <ul className="mt-2 flex flex-col gap-1 text-sm text-ink-2">
          <li className="flex items-start gap-2">
            <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <time dateTime={event.start}>{formatTimeRange(event.start, event.end)}</time>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{event.location.name}</span>
          </li>
          {!event.openToPublic ? (
            <li className="flex items-start gap-2">
              <Users aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Not open to the general public</span>
            </li>
          ) : null}
        </ul>

        {!compact ? (
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{event.summary}</p>
        ) : null}
      </div>

      {!compact && event.image ? (
        <div className="relative hidden w-40 shrink-0 border-l-[3px] border-ink lg:block">
          <Image
            src={event.image.src}
            alt={event.image.alt}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
      ) : null}
    </article>
  )
}
