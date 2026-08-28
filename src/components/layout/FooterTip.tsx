'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { safetyTips } from '@/content/safety'
import { CooperGuide } from '@/components/CooperGuide'
import { dayOfYear } from '@/lib/day'

/**
 * Cooper's rotating footer tip.
 *
 * The first render always uses index 0 so the server and the browser produce
 * identical HTML; the day-based tip is swapped in after hydration. Visitors can
 * also step through the tips manually.
 */
export function FooterTip() {
  const [index, setIndex] = useState(0)
  const [announce, setAnnounce] = useState(false)

  useEffect(() => {
    setIndex(dayOfYear() % safetyTips.length)
  }, [])

  const tip = safetyTips[index]

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <CooperGuide
        pose="happy"
        label="Cooper’s Safety Tip"
        tone="cream"
        size="md"
        className="[&_.btn]:hidden"
      >
        <p
          aria-live={announce ? 'polite' : 'off'}
          className="min-h-[4.5rem] text-ink sm:min-h-[3.5rem]"
        >
          {tip.text}
        </p>
      </CooperGuide>

      <button
        type="button"
        onClick={() => {
          setAnnounce(true)
          setIndex((i) => (i + 1) % safetyTips.length)
        }}
        className="inline-flex min-h-11 items-center justify-center gap-2 self-start border-[3px] border-ink bg-gold-300 px-4 py-2 font-display text-sm tracking-wide text-ink uppercase transition-transform hover:-translate-y-0.5 md:self-auto"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4" />
        Another tip
      </button>
    </div>
  )
}
