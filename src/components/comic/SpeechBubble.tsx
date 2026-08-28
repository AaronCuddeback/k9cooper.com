import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tail = 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'none'
type Variant = 'speech' | 'think' | 'shout'

interface SpeechBubbleProps {
  children: ReactNode
  tail?: Tail
  variant?: Variant
  tone?: 'cream' | 'white' | 'gold' | 'blue'
  className?: string
  /** Small label rendered above the bubble text, e.g. "Cooper's Safety Tip". */
  label?: string
}

const TONES = {
  cream: 'bg-paper',
  white: 'bg-white',
  gold: 'bg-gold-200',
  blue: 'bg-blue-50',
}

/**
 * A comic speech bubble with an inked tail. The tail is two stacked triangles
 * (black behind, fill in front) so the outline stays continuous.
 */
export function SpeechBubble({
  children,
  tail = 'bottom-left',
  variant = 'speech',
  tone = 'cream',
  className,
  label,
}: SpeechBubbleProps) {
  const isShout = variant === 'shout'

  return (
    <div
      className={cn(
        'relative ink pop px-4 py-3.5 sm:px-5 sm:py-4',
        TONES[tone],
        isShout ? 'panel-skew-a' : 'rounded-[1.75rem]',
        className,
      )}
    >
      {label ? (
        <p className="mb-1 font-comic text-sm tracking-[0.14em] text-red-600 uppercase">
          {label}
        </p>
      ) : null}

      <div className="text-[0.98rem] leading-snug font-semibold sm:text-base">
        {children}
      </div>

      {tail !== 'none' && !isShout ? <BubbleTail tail={tail} tone={tone} /> : null}
    </div>
  )
}

function BubbleTail({ tail, tone }: { tail: Tail; tone: keyof typeof TONES }) {
  const fill = {
    cream: 'var(--color-paper)',
    white: '#ffffff',
    gold: 'var(--color-gold-200)',
    blue: 'var(--color-blue-50)',
  }[tone]

  const position: Record<Exclude<Tail, 'none'>, string> = {
    left: 'top-6 -left-[19px]',
    right: 'top-6 -right-[19px] -scale-x-100',
    'bottom-left': '-bottom-[19px] left-8 -rotate-90',
    'bottom-right': '-bottom-[19px] right-8 -rotate-90 -scale-x-100',
  }

  return (
    <svg
      viewBox="0 0 22 26"
      aria-hidden="true"
      className={cn('absolute h-[26px] w-[22px]', position[tail as Exclude<Tail, 'none'>])}
    >
      {/* Ink outline drawn first, fill overlaps the bubble edge to hide the seam. */}
      <path d="M22 2 L1 13 L22 24 Z" fill="var(--color-ink)" />
      <path d="M21 6 L5 13 L21 20 Z" fill={fill} />
      <rect x="18" y="1" width="6" height="24" fill={fill} />
    </svg>
  )
}
