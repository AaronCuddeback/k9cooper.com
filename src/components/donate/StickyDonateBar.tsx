'use client'

import { useEffect, useState } from 'react'
import { Heart, X } from 'lucide-react'
import { donationConfig } from '@/config/donations'
import { track } from '@/lib/analytics'

const DISMISS_KEY = 'cooper:sticky-donate-dismissed'

/**
 * Mobile-only donate bar.
 *
 * Deliberately restrained: it stays hidden until the visitor has scrolled past
 * the first screen, it can be dismissed for the rest of the session, and it
 * reserves its own space at the end of the document so it never covers page
 * content or the footer.
 */
export function StickyDonateBar() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    let wasDismissed = false
    try {
      wasDismissed = sessionStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      // Private browsing with storage disabled - just show the bar.
    }
    setDismissed(wasDismissed)
    if (wasDismissed) return

    const onScroll = () => setVisible(window.scrollY > 620)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function dismiss() {
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (dismissed) return null

  return (
    <>
      {/* Reserves layout space so the bar never overlaps the footer. */}
      <div aria-hidden="true" className={visible ? 'h-[4.5rem] md:hidden' : 'hidden'} />

      <div
        className={`no-print fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-ink bg-red-500 transition-transform duration-300 md:hidden ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <a
            href={donationConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('donate_click', { placement: 'sticky-mobile' })}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 border-[3px] border-ink bg-gold-300 px-4 font-display text-base tracking-wide text-ink uppercase"
          >
            <Heart aria-hidden="true" className="h-4 w-4" fill="currentColor" />
            Support Cooper
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="grid h-11 w-11 shrink-0 place-items-center border-[3px] border-ink bg-white text-ink"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Hide the donate bar for now</span>
          </button>
        </div>
      </div>
    </>
  )
}
