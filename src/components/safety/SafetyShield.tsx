'use client'

import { useEffect, useState } from 'react'
import { Check, Printer, RotateCcw } from 'lucide-react'
import { shieldItems } from '@/content/safety'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'cooper:safety-shield'

/**
 * BUILD YOUR SAFETY SHIELD
 *
 * A checklist that fills in a shield as items are ticked.
 *
 * Privacy: the ticked state lives in this browser's localStorage and is never
 * transmitted anywhere. No account, no analytics on individual items. That is
 * deliberate - this page is written for children.
 */
export function SafetyShield() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>)
    } catch {
      /* storage unavailable - the checklist still works, it just will not persist */
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
    } catch {
      /* ignore */
    }
  }, [checked, loaded])

  const done = shieldItems.filter((i) => checked[i.id]).length
  const total = shieldItems.length
  const pct = Math.round((done / total) * 100)
  const complete = done === total

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
      {/* ---- The shield itself ---- */}
      <div className="mx-auto w-full max-w-[260px]">
        <div className="relative">
          <svg viewBox="0 0 100 118" className="w-full" role="img" aria-label={`Safety shield, ${pct} percent complete`}>
            <defs>
              <clipPath id="shield-clip">
                <path d="M50 3 L94 18 V58c0 26-19 46-44 57C25 104 6 84 6 58V18z" />
              </clipPath>
            </defs>

            <path
              d="M50 3 L94 18 V58c0 26-19 46-44 57C25 104 6 84 6 58V18z"
              fill="var(--color-paper-3)"
              stroke="var(--color-ink)"
              strokeWidth="4"
            />
            {/* Fill rises from the bottom as items are ticked. */}
            <g clipPath="url(#shield-clip)">
              <rect
                x="0"
                y={118 - (118 * pct) / 100}
                width="100"
                height={(118 * pct) / 100}
                fill="var(--color-gold-300)"
                className="transition-[y,height] duration-500 ease-out motion-reduce:transition-none"
              />
            </g>
            <path
              d="M50 3 L94 18 V58c0 26-19 46-44 57C25 104 6 84 6 58V18z"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="4"
            />
            <text
              x="50"
              y="56"
              textAnchor="middle"
              className="font-display"
              style={{ fontSize: '26px', fill: 'var(--color-ink)' }}
            >
              {done}/{total}
            </text>
            <text
              x="50"
              y="72"
              textAnchor="middle"
              style={{ fontSize: '9px', fill: 'var(--color-ink-2)', fontWeight: 800 }}
            >
              SHIELD
            </text>
          </svg>
        </div>

        <p aria-live="polite" className="mt-3 text-center font-comic text-xl tracking-wide">
          {complete ? 'Shield complete!' : `${pct}% built`}
        </p>

        {complete ? (
          <p className="mt-1 text-center text-sm font-bold text-scent-500">
            Cooper is impressed. Genuinely.
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              track('safety_checklist_print')
              window.print()
            }}
            className="btn btn-sm"
          >
            <Printer aria-hidden="true" className="h-4 w-4" />
            Print this page
          </button>
          <button
            type="button"
            onClick={() => setChecked({})}
            className="btn btn-sm btn-ghost"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Start over
          </button>
        </div>
      </div>

      {/* ---- The checklist ---- */}
      <div>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {shieldItems.map((item) => {
            const on = !!checked[item.id]
            return (
              <li key={item.id}>
                <label
                  className={cn(
                    'flex h-full cursor-pointer items-start gap-3 border-[3px] border-ink p-3.5 transition-colors',
                    'has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-400',
                    on ? 'bg-scent-300' : 'bg-white hover:bg-gold-100',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) =>
                      setChecked((c) => ({ ...c, [item.id]: e.target.checked }))
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-0.5 grid h-6 w-6 shrink-0 place-items-center border-[3px] border-ink',
                      on ? 'bg-ink text-scent-300' : 'bg-white',
                    )}
                  >
                    {on ? <Check className="h-4 w-4" strokeWidth={4} /> : null}
                  </span>
                  <span>
                    <span className="block font-display text-base tracking-wide uppercase">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink-2">
                      {item.detail}
                    </span>
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-sm text-ink-3">
          Your ticks are saved in this browser only. Nothing is sent anywhere, and
          no account is needed.
        </p>
      </div>
    </div>
  )
}
