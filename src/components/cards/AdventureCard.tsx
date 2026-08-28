import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import type { Adventure } from '@/content/adventures'
import { formatDateShort } from '@/lib/dates'
import { cn, tiltFor } from '@/lib/utils'

export function AdventureCard({
  adventure,
  className,
  priority = false,
  tilt = true,
}: {
  adventure: Adventure
  className?: string
  priority?: boolean
  tilt?: boolean
}) {
  return (
    <article
      className={cn('card card-hover group flex flex-col', className)}
      style={tilt ? { rotate: tiltFor(adventure.slug) } : undefined}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-ink">
        <Image
          src={adventure.cover.src}
          alt={adventure.cover.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 badge badge-red">{adventure.category}</span>
        {adventure.isSample ? (
          <span className="absolute top-3 right-3 badge badge-muted">Demo</span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-ink-3 uppercase">
          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
          <time dateTime={adventure.date}>{formatDateShort(adventure.date)}</time>
        </p>

        <h3 className="mt-2 text-title leading-none uppercase">
          <Link
            href={`/adventures/${adventure.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {adventure.title}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-2">
          {adventure.summary}
        </p>

        <p className="mt-4 inline-flex items-center gap-1.5 font-display text-sm tracking-wide text-red-600 uppercase">
          Read the log
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </p>
      </div>
    </article>
  )
}
