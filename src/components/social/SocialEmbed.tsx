'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { socialGlyphs } from './SocialIcons'
import { track } from '@/lib/analytics'
import type { SocialPlatform } from '@/config/social'
import { cn } from '@/lib/utils'

export interface SocialPost {
  id: string
  platform: SocialPlatform
  /** Permalink to the public post. */
  url: string
  caption: string
  /** Local thumbnail. Never hot-linked from the platform. */
  thumbnail?: string
  thumbnailAlt?: string
  date?: string
}

const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  instagram: 'View on Instagram',
  tiktok: 'Watch on TikTok',
  youtube: 'Watch on YouTube',
  facebook: 'View on Facebook',
}

/**
 * SOCIAL POST CARD
 *
 * Deliberately NOT a live embed.
 *
 * Instagram and TikTok embeds are blocked by common privacy settings and
 * content blockers, they load a large amount of third-party JavaScript, and
 * they break without warning when the platforms change their markup. So this
 * site renders a self-hosted card that always works and always looks right,
 * and links out to the real post.
 *
 * Posts are hand-picked in src/content/social.ts. There is no live feed - see
 * that file for why - and nothing is ever scraped.
 */
export function SocialPostCard({
  post,
  className,
}: {
  post: SocialPost
  className?: string
}) {
  const Glyph = socialGlyphs[post.platform]
  const ready = !post.url.startsWith('[')

  /*
    Thumbnails are local files, so this should not fire - but a typo'd path or
    an image-blocking extension would otherwise leave an empty box. Falling back
    to the platform glyph keeps the card readable either way.
  */
  const [imageFailed, setImageFailed] = useState(false)
  const thumbnail = imageFailed ? undefined : post.thumbnail

  /*
    Cooper's illustrated artwork is transparent line art, so it needs to sit
    whole on a background rather than be cropped to fill like a photo. Using
    the folder as the signal keeps this automatic: a real post photo dropped
    into /images/social/ gets a normal cover crop with no extra flag to set.
  */
  const isArtwork = thumbnail?.startsWith('/images/guide/') ?? false

  const inner = (
    <>
      <div
        className={cn(
          'relative aspect-square overflow-hidden border-b-[3px] border-ink',
          isArtwork ? 'bg-blue-600' : 'bg-paper-3',
        )}
      >
        {isArtwork ? (
          <span
            aria-hidden="true"
            className="benday absolute inset-0"
            style={{ ['--benday-color' as string]: 'rgb(255 255 255 / 0.18)' }}
          />
        ) : null}
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={post.thumbnailAlt ?? ''}
            fill
            loading="lazy"
            onError={() => setImageFailed(true)}
            sizes="(max-width: 640px) 92vw, 320px"
            className={cn(
              'transition-transform duration-500 group-hover:scale-[1.04]',
              isArtwork ? 'object-contain p-4' : 'object-cover',
            )}
          />
        ) : (
          <div
            aria-hidden="true"
            className="benday grid h-full w-full place-items-center bg-blue-600"
            style={{ ['--benday-color' as string]: 'rgb(255 255 255 / 0.2)' }}
          >
            <Glyph className="h-12 w-12 text-white" />
          </div>
        )}

        <span className="absolute top-2.5 left-2.5 grid h-9 w-9 place-items-center border-[3px] border-ink bg-white">
          <Glyph className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex-1 text-sm leading-snug font-semibold">{post.caption}</p>
        {post.date ? (
          <p className="mt-2 text-xs font-bold tracking-wider text-ink-3 uppercase">
            {post.date}
          </p>
        ) : null}
        <p className="mt-3 inline-flex items-center gap-1.5 font-display text-sm tracking-wide text-red-600 uppercase">
          {ready ? PLATFORM_LABEL[post.platform] : 'Link coming soon'}
          {ready ? <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" /> : null}
        </p>
      </div>
    </>
  )

  if (!ready) {
    return (
      /* Muted via background and a greyscale thumbnail rather than opacity:
         fading the whole card also fades its text below the AA contrast floor. */
      <article
        className={cn('card flex flex-col bg-paper-2 [&_img]:grayscale', className)}
        aria-label="Placeholder post, not yet linked"
      >
        {inner}
      </article>
    )
  }

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('social_click', { platform: post.platform, placement: 'social-wall' })}
      className={cn('card card-hover group flex flex-col', className)}
    >
      {inner}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
