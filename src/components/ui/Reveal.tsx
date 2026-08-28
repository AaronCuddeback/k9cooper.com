'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll-triggered reveal.
 *
 * A deliberately tiny replacement for an animation library: one
 * IntersectionObserver and a CSS rule, at roughly 400 bytes instead of 40
 * kilobytes.
 *
 * WITHOUT JAVASCRIPT the content is fully visible. The hidden starting state
 * is applied by a CSS rule scoped to `html.js`, and that class is only added
 * by a script in the document head - so if scripting is off, or the bundle
 * fails, nothing is ever hidden. (An earlier version used a Tailwind
 * `opacity-0` class directly, which left these panels permanently invisible
 * with JS disabled.)
 *
 * Under `prefers-reduced-motion` the CSS rule does not apply at all, so the
 * element is visible immediately with no transition.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Milliseconds. Use small, staggered values only. */
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'shown' : 'hidden'}
      className={cn('reveal', className)}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
