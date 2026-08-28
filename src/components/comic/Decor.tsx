import { cn } from '@/lib/utils'

/** A row of inked paw prints used as a section divider. */
export function PawDivider({
  className,
  count = 5,
  tone = 'ink',
}: {
  className?: string
  count?: number
  tone?: 'ink' | 'gold' | 'paper'
}) {
  const fill = {
    ink: 'var(--color-ink)',
    gold: 'var(--color-gold-300)',
    paper: 'var(--color-paper)',
  }[tone]

  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center justify-center gap-3 sm:gap-5', className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
          style={{
            rotate: `${(i % 2 === 0 ? -1 : 1) * (8 + i * 3)}deg`,
            opacity: 0.35 + (i / Math.max(count - 1, 1)) * 0.65,
          }}
        >
          <ellipse cx="12" cy="16" rx="6" ry="5" fill={fill} />
          <ellipse cx="5" cy="9" rx="2.6" ry="3.4" fill={fill} />
          <ellipse cx="10" cy="5.5" rx="2.6" ry="3.6" fill={fill} />
          <ellipse cx="15.5" cy="6" rx="2.6" ry="3.5" fill={fill} />
          <ellipse cx="19.6" cy="10.5" rx="2.5" ry="3.2" fill={fill} />
        </svg>
      ))}
    </div>
  )
}

/** Torn-paper edge used between a dark section and the cream page. */
export function TornEdge({
  className,
  flip = false,
  color = 'var(--color-paper)',
}: {
  className?: string
  flip?: boolean
  color?: string
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 34"
      preserveAspectRatio="none"
      className={cn('block h-4 w-full sm:h-6', flip && 'rotate-180', className)}
    >
      <path
        d="M0 34 V14 l38 7 44-11 51 12 47-9 55 10 42-13 60 12 49-8 53 11 46-12 58 10 51-9 44 12 55-11 49 9 52-12 46 11 40-8 60 12 60-9v22z"
        fill={color}
      />
    </svg>
  )
}

/** Decorative halftone corner. Purely presentational. */
export function HalftoneCorner({
  className,
  color = 'rgb(0 0 0 / 0.18)',
}: {
  className?: string
  color?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute halftone-fade', className)}
      style={{ ['--benday-color' as string]: color }}
    />
  )
}
