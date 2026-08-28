'use client'

import { useId, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  id: string
  question: string
  answer: React.ReactNode
  /** Small flag shown next to the question, e.g. "Needs review". */
  flag?: string
}

/**
 * Accessible accordion built on buttons and `aria-expanded` / `aria-controls`
 * rather than <details>, so the open/closed state is announced reliably and
 * the animation can be disabled under reduced motion.
 */
export function Accordion({
  items,
  className,
  defaultOpenId,
}: {
  items: AccordionItem[]
  className?: string
  defaultOpenId?: string
}) {
  const [open, setOpen] = useState<string | null>(defaultOpenId ?? null)
  const base = useId()

  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => {
        const isOpen = open === item.id
        const panelId = `${base}-${item.id}-panel`
        const buttonId = `${base}-${item.id}-button`

        return (
          <li key={item.id} className="ink bg-white pop-sm">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-gold-100 sm:px-5"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center border-2 border-ink bg-gold-300">
                  {isOpen ? (
                    <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg leading-tight tracking-wide uppercase">
                    {item.question}
                  </span>
                  {item.flag ? (
                    <span className="badge badge-muted mt-1.5">{item.flag}</span>
                  ) : null}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="border-t-2 border-ink/15 px-4 py-4 sm:px-5"
            >
              <div className="prose-comic text-ink-2">{item.answer}</div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
