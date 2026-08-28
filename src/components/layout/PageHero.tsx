import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { TornEdge } from '@/components/comic/Decor'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  kicker: string
  title: ReactNode
  intro?: ReactNode
  crumbs?: Crumb[]
  children?: ReactNode
  tone?: 'blue' | 'red' | 'ink'
  className?: string
}

const TONES = {
  blue: 'bg-blue-700',
  red: 'bg-red-600',
  ink: 'bg-ink',
}

/**
 * The masthead used at the top of every interior page: a dark, halftoned band
 * with a comic kicker, a poster-weight heading and a torn paper edge.
 */
export function PageHero({
  kicker,
  title,
  intro,
  crumbs,
  children,
  tone = 'blue',
  className,
}: PageHeroProps) {
  return (
    <section className={cn('on-dark relative isolate overflow-hidden', TONES[tone], className)}>
      <div
        aria-hidden="true"
        className="speed-lines pointer-events-none absolute inset-0"
        style={{
          ['--speed-x' as string]: '14%',
          ['--speed-y' as string]: '18%',
          ['--speed-color' as string]: 'rgb(255 255 255 / 0.10)',
        }}
      />
      <div
        aria-hidden="true"
        className="benday pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-40"
        style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.28)' }}
      />

      <div className="shell relative pt-8 pb-14 sm:pt-10 sm:pb-16">
        {crumbs ? <Breadcrumbs crumbs={crumbs} tone="paper" className="mb-6" /> : null}

        <span className="kicker">{kicker}</span>

        <h1 className="mt-4 max-w-4xl text-[clamp(2.3rem,7.6vw,4.6rem)] leading-[1.02] text-paper uppercase">
          {title}
        </h1>

        {intro ? (
          <div className="prose-comic mt-5 max-w-2xl text-lg leading-relaxed text-blue-50">
            {intro}
          </div>
        ) : null}

        {children ? <div className="mt-7">{children}</div> : null}
      </div>

      <TornEdge className="absolute inset-x-0 -bottom-px" />
    </section>
  )
}
