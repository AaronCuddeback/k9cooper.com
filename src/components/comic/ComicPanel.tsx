import type { ElementType, ReactNode } from 'react'
import { cn, tiltFor } from '@/lib/utils'

type Tone = 'paper' | 'white' | 'blue' | 'gold' | 'red' | 'ink'

const TONES: Record<Tone, string> = {
  paper: 'bg-paper-2 text-ink',
  white: 'bg-white text-ink',
  blue: 'bg-blue-600 text-white on-dark',
  gold: 'bg-gold-300 text-ink',
  red: 'bg-red-500 text-white on-dark',
  ink: 'bg-ink text-paper on-dark',
}

interface ComicPanelProps {
  children: ReactNode
  /** Background treatment. */
  tone?: Tone
  /** Seed used to pick a small, stable rotation so grids look hand-laid. */
  tiltSeed?: string
  /** Disables the rotation entirely. */
  straight?: boolean
  className?: string
  as?: ElementType
  /** Adds the caption-box corner tab in the top-left. */
  label?: string
  labelTone?: 'gold' | 'red' | 'blue' | 'cream'
  id?: string
}

const LABEL_TONES = {
  gold: 'bg-gold-300 text-ink',
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-600 text-white',
  cream: 'bg-paper text-ink',
}

/**
 * The core visual unit of the site: a heavy-inked comic panel with a hard
 * offset shadow and an optional caption tab, the way a printed comic labels
 * a scene.
 */
export function ComicPanel({
  children,
  tone = 'white',
  tiltSeed,
  straight = false,
  className,
  as: Tag = 'div',
  label,
  labelTone = 'gold',
  id,
}: ComicPanelProps) {
  const rotate = straight || !tiltSeed ? undefined : tiltFor(tiltSeed)

  return (
    <Tag
      id={id}
      className={cn('relative ink pop', TONES[tone], className)}
      style={rotate ? { rotate } : undefined}
    >
      {label ? (
        <span
          className={cn(
            'absolute -top-px -left-px z-10 inline-block border-b-[3px] border-r-[3px] border-ink px-3 py-1.5 font-comic text-base leading-none tracking-wide',
            LABEL_TONES[labelTone],
          )}
        >
          {label}
        </span>
      ) : null}
      {children}
    </Tag>
  )
}
