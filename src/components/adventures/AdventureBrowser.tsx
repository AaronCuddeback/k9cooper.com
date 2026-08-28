'use client'

import { useMemo, useState } from 'react'
import { AdventureCard } from '@/components/cards/AdventureCard'
import { NoResults } from '@/components/ui/States'
import {
  adventureCategories,
  type Adventure,
  type AdventureCategory,
} from '@/content/adventures'
import { cn } from '@/lib/utils'

/** Category filter over the mission logs. */
export function AdventureBrowser({ adventures }: { adventures: Adventure[] }) {
  const [category, setCategory] = useState<AdventureCategory | 'all'>('all')

  const available = useMemo(() => {
    const used = new Set(adventures.map((a) => a.category))
    return adventureCategories.filter((c) => used.has(c))
  }, [adventures])

  const filtered = useMemo(
    () =>
      category === 'all'
        ? adventures
        : adventures.filter((a) => a.category === category),
    [adventures, category],
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
          Filter
        </span>
        <FilterChip
          active={category === 'all'}
          onClick={() => setCategory('all')}
          label={`All (${adventures.length})`}
        />
        {available.map((c) => (
          <FilterChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={c}
          />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {filtered.length} of {adventures.length} mission logs.
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <NoResults
            onReset={
              <button type="button" onClick={() => setCategory('all')} className="btn btn-sm">
                Show everything
              </button>
            }
          />
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((adventure, i) => (
            <li key={adventure.slug}>
              <AdventureCard
                adventure={adventure}
                priority={i === 0}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'min-h-10 border-[3px] border-ink px-3 py-1.5 font-display text-sm tracking-wide uppercase transition-colors',
        active ? 'bg-red-500 text-white' : 'bg-white hover:bg-gold-200',
      )}
    >
      {label}
    </button>
  )
}
