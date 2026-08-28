'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import { safetyTips } from '@/content/safety'
import { CooperMedallion } from '@/components/CooperGuide'
import { dayOfYear } from '@/lib/day'

/**
 * "Cooper's Safety Tip of the Day" on the homepage.
 *
 * Index 0 renders on the server so the markup matches on hydration; the
 * day-based tip is applied in an effect. The tip region is a live region so
 * screen-reader users hear the new tip when they press the button.
 */
export function SafetyTipSpotlight() {
  const [index, setIndex] = useState(0)
  const [interacted, setInteracted] = useState(false)
  const tip = safetyTips[index]

  useEffect(() => {
    setIndex(dayOfYear() % safetyTips.length)
  }, [])

  return (
    <div className="relative ink pop bg-gold-300 p-5 sm:p-7">
      <div
        aria-hidden="true"
        className="benday pointer-events-none absolute inset-0 opacity-50"
        style={{ ['--benday-color' as string]: 'rgb(11 11 13 / 0.16)' }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
        <CooperMedallion
          src="/images/cooper/cooper-face-alert.jpg"
          alt="Cooper looking directly at the camera"
          boxClass="h-20 w-20 sm:h-28 sm:w-28"
          px={160}
        />

        <div className="min-w-0 flex-1">
          <p className="font-comic text-xl tracking-wide text-red-700">
            Cooper&rsquo;s Safety Tip of the Day
          </p>

          <p
            aria-live={interacted ? 'polite' : 'off'}
            className="mt-2 min-h-[5.25rem] text-lg leading-snug font-bold text-ink sm:min-h-[5.5rem] sm:text-xl"
          >
            {tip.text}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setInteracted(true)
                setIndex((i) => (i + 1) % safetyTips.length)
              }}
              className="btn btn-sm bg-white"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Next tip
            </button>
            <Link href="/safety-hq" className="btn btn-sm btn-blue">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              Enter Safety HQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
