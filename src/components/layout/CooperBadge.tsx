import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * COOPER BADGE
 * ----------------------------------------------------------------------------
 * The site's brand mark: Cooper's illustrated face on a gold disc.
 *
 * This site is a personal, educational project about Cooper. It is NOT an
 * official Sheriff's Office publication, so it deliberately does not use any
 * agency seal or unit logo as its mark. Cooper's own artwork carries the
 * branding instead.
 *
 * The artwork is cropped from /public/images/guide/cooper-wave.png by
 * scripts/make-cooper-badge.mjs - re-run that if the source art changes.
 *
 * Decorative by default: the wordmark beside it already says "ESD K9 Cooper",
 * so repeating that in alt text just makes screen readers say it twice.
 */
export function CooperBadge({
  className,
  sizes,
  priority = false,
  alt = '',
}: {
  /** Sizing classes for the disc, e.g. "h-10 w-10 md:h-12 md:w-12". */
  className?: string
  /** CSS pixel width the disc renders at. Must match `className` or the
   *  browser downloads a larger file than it needs. */
  sizes: string
  priority?: boolean
  /** Pass a real string only where the badge is not paired with the wordmark. */
  alt?: string
}) {
  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gold-300 ink',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="benday absolute inset-0 rounded-full opacity-60"
        style={{ ['--benday-size' as string]: '5px' }}
      />
      <Image
        src="/images/brand/cooper-badge.png"
        alt={alt}
        width={512}
        height={512}
        priority={priority}
        sizes={sizes}
        className="relative h-full w-full object-cover"
      />
    </span>
  )
}
