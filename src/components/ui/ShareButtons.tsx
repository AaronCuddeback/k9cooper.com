'use client'

import { useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Share controls.
 *
 * Uses the native share sheet when the browser offers one (all modern phones),
 * and falls back to copy-to-clipboard plus a plain X/Facebook link elsewhere.
 * No third-party share scripts are loaded.
 */
export function ShareButtons({
  url,
  title,
  className,
  label = 'Share this',
}: {
  url: string
  title: string
  className?: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  async function share() {
    track('share_click', { url })
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // User cancelled, or share is unavailable - fall through to copy.
      }
    }
    await copy()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      <span className="text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
        {label}
      </span>
      <button type="button" onClick={share} className="btn btn-sm">
        <Share2 aria-hidden="true" className="h-4 w-4" />
        Share
      </button>
      <button type="button" onClick={copy} className="btn btn-sm btn-ghost">
        {copied ? (
          <Check aria-hidden="true" className="h-4 w-4 text-scent-500" />
        ) : (
          <Link2 aria-hidden="true" className="h-4 w-4" />
        )}
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}
