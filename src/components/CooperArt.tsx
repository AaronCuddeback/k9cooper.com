import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * COOPER ART
 * ----------------------------------------------------------------------------
 * Full-figure illustrated Cooper, used as spot art around the site.
 *
 * This is the companion to <CooperGuide>. The guide is a circular photo
 * medallion with a speech bubble - Cooper talking to you. This is the
 * superhero: bigger, drawn, and purely decorative.
 *
 * Because it is decoration, every instance is `aria-hidden` by default and
 * carries no alt text. If a piece of art is genuinely carrying meaning (rather
 * than repeating what the adjacent copy already says), pass an explicit `alt`
 * and it becomes a real image for screen readers.
 *
 * The source files live in /public/images/guide/ and were produced by
 * scripts/prepare-illustrations.py. See docs/ASSETS.md.
 */

export type CooperArtPose =
  | 'leap'
  | 'fly'
  | 'searching'
  | 'wave'
  | 'stand'
  | 'laptop'
  | 'peek'
  | 'shield'
  | 'tablet'
  | 'case'

interface ArtSpec {
  src: string
  width: number
  height: number
  /** What the drawing shows, for the rare case it needs a real alt. */
  describes: string
}

const ART: Record<CooperArtPose, ArtSpec> = {
  leap: {
    src: '/images/guide/cooper-leap.png',
    width: 900,
    height: 880,
    describes: 'Cooper in a red cape leaping straight towards you',
  },
  fly: {
    src: '/images/guide/cooper-fly.png',
    width: 760,
    height: 610,
    describes: 'Cooper in a red cape flying, cape streaming behind him',
  },
  searching: {
    src: '/images/guide/cooper-searching.png',
    width: 900,
    height: 865,
    describes: 'Cooper nose-down, sniffing out a hidden phone and hard drive',
  },
  wave: {
    src: '/images/guide/cooper-wave.png',
    width: 577,
    height: 720,
    describes: 'Cooper sitting up with one paw raised in greeting',
  },
  stand: {
    src: '/images/guide/cooper-stand.png',
    width: 625,
    height: 720,
    describes: 'Cooper standing squarely in his harness and cape',
  },
  laptop: {
    src: '/images/guide/cooper-laptop.png',
    width: 648,
    height: 720,
    describes: 'Cooper sitting with a paw resting on a closed laptop',
  },
  peek: {
    src: '/images/guide/cooper-peek.png',
    width: 303,
    height: 560,
    describes: 'Cooper peeking around the edge of the page',
  },
  shield: {
    src: '/images/guide/cooper-shield.png',
    width: 836,
    height: 900,
    describes: 'Cooper standing beside a golden padlock shield',
  },
  tablet: {
    src: '/images/guide/cooper-tablet.png',
    width: 860,
    height: 569,
    describes: 'Cooper lying down with a tablet showing a padlock on its screen',
  },
  case: {
    src: '/images/guide/cooper-case.png',
    width: 492,
    height: 720,
    describes: 'Cooper sitting with a paw on a hard equipment case',
  },
}

interface CooperArtProps {
  pose: CooperArtPose
  className?: string
  /** Rendered width hint for the image optimiser. */
  sizes?: string
  priority?: boolean
  /**
   * Pass a string to expose the art to screen readers with that description,
   * or leave it out to mark the art decorative (the default, and correct
   * whenever nearby copy already says the same thing).
   */
  alt?: string
  /** Adds a gentle idle float. Disabled under prefers-reduced-motion. */
  float?: boolean
}

export function CooperArt({
  pose,
  className,
  sizes = '(max-width: 640px) 60vw, 380px',
  priority = false,
  alt,
  float = false,
}: CooperArtProps) {
  const art = ART[pose]
  const decorative = alt === undefined

  return (
    <Image
      src={art.src}
      alt={decorative ? '' : alt}
      aria-hidden={decorative || undefined}
      width={art.width}
      height={art.height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      className={cn(
        'h-auto w-full select-none',
        float && 'motion-safe:animate-sniff',
        className,
      )}
      /* Sits over comic panels, so a drop shadow keeps it from floating flatly. */
      style={{ filter: 'drop-shadow(4px 6px 0 rgb(11 11 13 / 0.18))' }}
    />
  )
}

/** Describes a pose, for callers that need the text (e.g. gallery entries). */
export function cooperArtDescription(pose: CooperArtPose): string {
  return ART[pose].describes
}
