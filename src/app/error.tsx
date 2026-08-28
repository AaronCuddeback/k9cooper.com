'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the failure in the browser console for debugging. No error
    // reporting service is wired up, so nothing leaves the visitor's machine.
    console.error(error)
  }, [error])

  return (
    <section className="newsprint py-16 sm:py-24">
      <div className="shell-narrow">
        <div role="alert" className="ink pop bg-white p-6 sm:p-8">
          <p className="font-comic text-2xl tracking-wide text-red-600">
            Well, that did not work.
          </p>
          <h1 className="mt-2 text-display uppercase">Something went wrong</h1>
          <p className="mt-4 leading-relaxed text-ink-2">
            The page hit an unexpected error. Trying again usually sorts it. If it
            keeps happening, Cooper&rsquo;s team would genuinely like to know.
          </p>
          {error.digest ? (
            <p className="mt-3 font-mono text-xs text-ink-3">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={reset} className="btn btn-donate">
              <RotateCcw aria-hidden="true" className="h-5 w-5" />
              Try again
            </button>
            <Link href="/" className="btn btn-ghost">
              Back to the homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
