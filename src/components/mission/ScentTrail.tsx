'use client'

import Image from 'next/image'
import { useState } from 'react'
import { missionSteps } from '@/content/cooper'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

/**
 * THE FIVE-STEP SEARCH
 *
 * A scroll-revealed comic strip with a scent trail running down the left. Each
 * panel can be flipped between the kid-facing explanation and the more
 * technical "for grown-ups" version.
 *
 * Degrades gracefully: with JavaScript disabled every panel is visible and
 * readable (see <Reveal>), and with reduced motion the animation is skipped.
 * The audience toggle needs JS, so the kid-facing text is what renders without
 * it - which is the right default for this page.
 */
export function ScentTrail() {
  const [mode, setMode] = useState<'kids' | 'grown-ups'>('kids')

  return (
    <div>
      <AudienceToggle mode={mode} onChange={setMode} />

      <ol className="relative mt-10 flex flex-col gap-10 sm:gap-14">
        {/* The scent trail: a dashed green line threading the panels together. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-6 bottom-10 left-[1.4rem] w-1 bg-[repeating-linear-gradient(to_bottom,var(--color-scent-400)_0_10px,transparent_10px_20px)] sm:left-8"
        />

        {missionSteps.map((step, i) => (
          <Reveal
            key={step.n}
            as="li"
            className="relative pl-14 sm:pl-24"
          >
            {/* Step number badge sitting on the trail */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 grid h-11 w-11 place-items-center rounded-full border-[3px] border-ink bg-gold-300 font-display text-xl sm:h-16 sm:w-16 sm:text-3xl"
            >
              {step.n}
            </span>

            <ComicPanel tone="white" tiltSeed={`step-${step.n}`} className="overflow-hidden">
              <div
                className={cn(
                  'grid gap-0',
                  step.image ? 'sm:grid-cols-[1fr_220px]' : '',
                )}
              >
                <div className="p-5 sm:p-6">
                  <p className="font-comic text-lg tracking-wide text-red-600">
                    Step {step.n} of 5
                  </p>
                  <h3 className="mt-1 text-title uppercase">{step.title}</h3>

                  <p className="mt-3 leading-relaxed text-ink-2">
                    {mode === 'kids' ? step.kid : step.grownUp}
                  </p>

                  {step.sfx ? (
                    <p
                      aria-hidden="true"
                      className="sfx mt-4 inline-block -rotate-2 text-2xl sm:text-3xl"
                    >
                      {step.sfx}
                    </p>
                  ) : null}
                </div>

                {step.image ? (
                  // object-contain: these are complete comic panels with their
                  // own captions, so cropping them loses the text.
                  <div className="grid place-items-center border-t-[3px] border-ink bg-paper-2 p-2 sm:border-t-0 sm:border-l-[3px]">
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      width={400}
                      height={340}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      sizes="(max-width: 640px) 90vw, 220px"
                      className="h-auto max-h-56 w-auto max-w-full border-2 border-ink object-contain"
                    />
                  </div>
                ) : null}
              </div>
            </ComicPanel>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

/** The "For Kids / For Grown-Ups" switch, built as a real radio group. */
export function AudienceToggle({
  mode,
  onChange,
  className,
}: {
  mode: 'kids' | 'grown-ups'
  onChange: (m: 'kids' | 'grown-ups') => void
  className?: string
}) {
  return (
    <fieldset className={cn('inline-flex flex-col gap-2', className)}>
      <legend className="text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
        Read this as
      </legend>
      <div className="inline-flex ink pop-sm bg-white">
        {(
          [
            ['kids', 'For Kids'],
            ['grown-ups', 'For Grown-Ups'],
          ] as const
        ).map(([value, label]) => (
          <label
            key={value}
            className={cn(
              'cursor-pointer px-4 py-2.5 font-display text-sm tracking-wide uppercase transition-colors sm:text-base',
              'has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-400',
              mode === value ? 'bg-blue-600 text-white' : 'hover:bg-gold-200',
            )}
          >
            <input
              type="radio"
              name="audience-mode"
              value={value}
              checked={mode === value}
              onChange={() => onChange(value)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
