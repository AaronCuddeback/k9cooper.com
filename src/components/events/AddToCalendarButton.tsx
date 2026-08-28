'use client'

import { CalendarPlus } from 'lucide-react'
import type { CooperEvent } from '@/content/events'
import { downloadIcs } from '@/lib/ics'
import { track } from '@/lib/analytics'
import { buttonClass, type ButtonSize, type ButtonVariant } from '@/components/ui/Button'

/**
 * Downloads an .ics file built in the browser - no server route needed, so the
 * whole site stays statically rendered.
 */
export function AddToCalendarButton({
  event,
  variant = 'default',
  size = 'sm',
  className,
}: {
  event: CooperEvent
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => {
        downloadIcs(event)
        track('event_add_to_calendar', { event: event.slug })
      }}
      className={buttonClass(variant, size, className)}
      data-testid="add-to-calendar"
    >
      <CalendarPlus aria-hidden="true" className="h-4 w-4" />
      Add to calendar
      <span className="sr-only"> (downloads a calendar file for {event.title})</span>
    </button>
  )
}
