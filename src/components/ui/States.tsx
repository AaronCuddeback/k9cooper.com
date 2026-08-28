import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CooperGuide, type CooperPose } from '@/components/CooperGuide'

/** Nothing to show yet - and Cooper says so, so it does not feel broken. */
export function EmptyState({
  title,
  children,
  action,
  className,
  pose = 'working',
}: {
  title: string
  children: ReactNode
  action?: ReactNode
  className?: string
  pose?: CooperPose
}) {
  return (
    <div className={cn('ink pop bg-paper-2 p-6 sm:p-8', className)}>
      <CooperGuide pose={pose} label={title} tone="white">
        {children}
      </CooperGuide>
      {action ? <div className="mt-5 flex flex-wrap gap-3">{action}</div> : null}
    </div>
  )
}

/** Filters returned nothing. */
export function NoResults({
  onReset,
  label = 'Nothing matched that filter.',
}: {
  onReset?: ReactNode
  label?: string
}) {
  return (
    <div className="ink-thin bg-white p-8 text-center">
      <p className="font-display text-2xl uppercase">{label}</p>
      <p className="mt-2 text-ink-2">
        Cooper checked twice. Try a different filter.
      </p>
      {onReset ? <div className="mt-4 flex justify-center">{onReset}</div> : null}
    </div>
  )
}

/** Skeleton block for content that is still loading. */
export function LoadingBlock({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('ink-thin animate-pulse bg-paper-3', className)}
    >
      <span className="sr-only">Loading</span>
    </div>
  )
}

/** Something went wrong, said kindly. */
export function ErrorBlock({
  title = 'That did not work',
  children,
  action,
}: {
  title?: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div role="alert" className="ink pop bg-red-50 p-6">
      <p className="font-display text-2xl text-red-700 uppercase">{title}</p>
      <div className="prose-comic mt-2 text-ink-2">{children}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
