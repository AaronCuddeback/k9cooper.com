'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import {
  galleryCategories,
  type GalleryCategory,
  type GalleryItem,
} from '@/content/gallery'
import { NoResults } from '@/components/ui/States'
import { cn } from '@/lib/utils'

/**
 * Masonry-ish gallery with an accessible lightbox.
 *
 * - Aspect ratios are preserved; nothing is centre-cropped.
 * - Images below the fold load lazily.
 * - The lightbox is a real modal dialog: focus is trapped, Escape closes it,
 *   arrow keys move between images, and focus returns to the thumbnail that
 *   opened it.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState<GalleryCategory | 'all'>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])

  const used = useMemo(() => {
    const set = new Set(items.map((i) => i.category))
    return galleryCategories.filter((c) => set.has(c))
  }, [items])

  const filtered = useMemo(
    () => (category === 'all' ? items : items.filter((i) => i.category === category)),
    [items, category],
  )

  const close = useCallback(() => {
    setOpenIndex((current) => {
      if (current !== null) triggerRefs.current[current]?.focus()
      return null
    })
  }, [])

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return null
        return (current + delta + filtered.length) % filtered.length
      })
    },
    [filtered.length],
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
          Filter
        </span>
        <button
          type="button"
          onClick={() => setCategory('all')}
          aria-pressed={category === 'all'}
          className={chipClass(category === 'all')}
        >
          All ({items.length})
        </button>
        {used.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={chipClass(category === c)}
          >
            {c}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {filtered.length} photos.
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
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <li key={item.id}>
              <button
                ref={(el) => {
                  triggerRefs.current[i] = el
                }}
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group card card-hover block w-full overflow-hidden text-left"
                style={{ rotate: i % 3 === 1 ? '0.6deg' : i % 3 === 2 ? '-0.7deg' : '0deg' }}
              >
                <span className="relative block">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading={i < 6 ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px"
                    className="h-auto w-full border-b-[3px] border-ink"
                  />
                  <span className="absolute top-2 right-2 grid h-9 w-9 place-items-center border-[3px] border-ink bg-gold-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <ZoomIn aria-hidden="true" className="h-4 w-4" />
                  </span>
                </span>
                <span className="block p-3.5">
                  <span className="badge badge-blue">{item.category}</span>
                  {item.caption ? (
                    <span className="mt-2 block text-sm leading-snug font-semibold">
                      {item.caption}
                    </span>
                  ) : null}
                </span>
                <span className="sr-only">Open larger view</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {openIndex !== null ? (
        <Lightbox
          items={filtered}
          index={openIndex}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </div>
  )
}

function chipClass(active: boolean) {
  return cn(
    'min-h-10 border-[3px] border-ink px-3 py-1.5 font-display text-sm tracking-wide uppercase transition-colors',
    active ? 'bg-red-500 text-white' : 'bg-white hover:bg-gold-200',
  )
}

function Lightbox({
  items,
  index,
  onClose,
  onStep,
}: {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const item = items[index]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onStep(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onStep(-1)
      } else if (e.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${items.length}: ${item.alt}`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 bg-ink/90"
      />

      <div ref={panelRef} className="relative flex max-h-full w-full max-w-4xl flex-col">
        <div className="flex items-center justify-between gap-3 pb-2">
          <p className="font-comic text-lg tracking-wide text-gold-300">
            {index + 1} / {items.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center border-[3px] border-ink bg-white"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center gap-2">
          {items.length > 1 ? (
            <button
              type="button"
              onClick={() => onStep(-1)}
              className="grid h-12 w-12 shrink-0 place-items-center border-[3px] border-ink bg-white hover:bg-gold-300"
            >
              <ChevronLeft aria-hidden="true" className="h-6 w-6" />
              <span className="sr-only">Previous photo</span>
            </button>
          ) : null}

          <figure className="min-w-0 flex-1 overflow-hidden border-[4px] border-ink bg-paper">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 1024px) 92vw, 900px"
              className="max-h-[60vh] w-full object-contain"
            />
            <figcaption className="border-t-[3px] border-ink bg-white p-3.5">
              <span className="badge badge-blue">{item.category}</span>
              {item.caption ? (
                <p className="mt-2 font-semibold">{item.caption}</p>
              ) : null}
              <p className="mt-1 text-sm text-ink-3">{item.alt}</p>
            </figcaption>
          </figure>

          {items.length > 1 ? (
            <button
              type="button"
              onClick={() => onStep(1)}
              className="grid h-12 w-12 shrink-0 place-items-center border-[3px] border-ink bg-white hover:bg-gold-300"
            >
              <ChevronRight aria-hidden="true" className="h-6 w-6" />
              <span className="sr-only">Next photo</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
