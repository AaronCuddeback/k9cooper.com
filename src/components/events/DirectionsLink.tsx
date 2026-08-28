'use client'

import { Navigation } from 'lucide-react'
import type { CooperEvent } from '@/content/events'
import { directionsUrl } from '@/lib/ics'
import { track } from '@/lib/analytics'

/** Directions button. Renders nothing when no address has been published. */
export function DirectionsLink({ event }: { event: CooperEvent }) {
  const href = event.location.address ? directionsUrl(event) : null
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('event_directions', { event: event.slug })}
      className="btn btn-sm w-full"
    >
      <Navigation aria-hidden="true" className="h-4 w-4" />
      Get directions
      <span className="sr-only"> (opens Google Maps in a new tab)</span>
    </a>
  )
}
