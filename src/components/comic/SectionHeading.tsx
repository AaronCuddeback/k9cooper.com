import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  kicker?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  tone?: 'ink' | 'paper'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}

/**
 * The standard section header: a tilted comic kicker tab, a big display
 * heading, and an optional intro paragraph.
 */
export function SectionHeading({
  kicker,
  title,
  intro,
  align = 'left',
  tone = 'ink',
  as: Tag = 'h2',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {/* self-* stops the inline-flex chip from stretching in the flex column. */}
      {kicker ? (
        <span
          className={cn('kicker', align === 'center' ? 'self-center' : 'self-start')}
        >
          {kicker}
        </span>
      ) : null}
      <Tag
        id={id}
        className={cn(
          'text-display uppercase',
          tone === 'paper' ? 'text-paper' : 'text-ink',
        )}
      >
        {title}
      </Tag>
      {intro ? (
        <div
          className={cn(
            'prose-comic text-[1.05rem] leading-relaxed',
            tone === 'paper' ? 'text-blue-50' : 'text-ink-2',
            align === 'center' && 'mx-auto',
          )}
        >
          {intro}
        </div>
      ) : null}
    </div>
  )
}
