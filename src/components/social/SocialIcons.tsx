'use client'

import type { SVGProps } from 'react'
import { activeSocialAccounts, type SocialPlatform } from '@/config/social'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/* Brand glyphs. Lucide has no official brand marks, so these are simple
   in-house paths - recognisable without reproducing a trademarked logotype. */

export function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
    </svg>
  )
}

export function TikTokGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14.2 3v9.9a3.1 3.1 0 1 1-2.6-3.06"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 3.4c.5 2.4 2.2 4 4.6 4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function YouTubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10.4 9.4v5.2l4.4-2.6z" fill="currentColor" />
    </svg>
  )
}

export function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H17.4V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8.6v3H11v7z"
        fill="currentColor"
      />
    </svg>
  )
}

export const socialGlyphs: Record<
  SocialPlatform,
  (props: SVGProps<SVGSVGElement>) => React.ReactElement
> = {
  instagram: InstagramGlyph,
  tiktok: TikTokGlyph,
  youtube: YouTubeGlyph,
  facebook: FacebookGlyph,
}

/** Compact icon row for the header, footer and mobile drawer. */
export function SocialIconRow({
  placement,
  className,
  iconClassName,
  tone = 'ink',
}: {
  placement: string
  className?: string
  iconClassName?: string
  tone?: 'ink' | 'paper'
}) {
  return (
    <ul className={cn('flex items-center gap-2', className)}>
      {activeSocialAccounts.map((account) => {
        const Glyph = socialGlyphs[account.platform]
        return (
          <li key={account.platform}>
            <a
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track('social_click', { platform: account.platform, placement })
              }
              className={cn(
                'grid h-11 w-11 place-items-center border-[3px] border-ink transition-transform hover:-translate-y-0.5',
                tone === 'ink'
                  ? 'bg-white text-ink hover:bg-gold-300'
                  : 'bg-blue-700 text-paper hover:bg-gold-300 hover:text-ink',
              )}
            >
              <Glyph className={cn('h-5 w-5', iconClassName)} />
              <span className="sr-only">
                {account.label} - {account.handle} (opens in a new tab)
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
