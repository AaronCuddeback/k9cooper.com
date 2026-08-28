'use client'

import { activeSocialAccounts } from '@/config/social'
import { track } from '@/lib/analytics'
import { socialGlyphs } from './SocialIcons'
import { buttonClass, type ButtonSize } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const PLATFORM_STYLE: Record<string, string> = {
  instagram: 'bg-red-500 text-white hover:bg-red-400',
  tiktok: 'bg-ink text-paper hover:bg-ink-2',
  youtube: 'bg-red-600 text-white hover:bg-red-500',
  facebook: 'bg-blue-500 text-white hover:bg-blue-400',
}

/** Full-width follow buttons with the handle spelled out. */
export function FollowButtons({
  placement,
  size = 'md',
  className,
  showHandle = true,
}: {
  placement: string
  size?: ButtonSize
  className?: string
  showHandle?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap', className)}>
      {activeSocialAccounts.map((account) => {
        const Glyph = socialGlyphs[account.platform]
        return (
          <a
            key={account.platform}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('social_click', { platform: account.platform, placement })
            }
            className={cn(
              buttonClass('default', size),
              PLATFORM_STYLE[account.platform],
              'sm:flex-1',
            )}
          >
            <Glyph className="h-5 w-5 shrink-0" />
            <span>
              {account.cta}
              {showHandle ? (
                <span className="ml-1.5 font-body text-xs font-bold tracking-normal normal-case opacity-85">
                  {account.handle}
                </span>
              ) : null}
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )
      })}
    </div>
  )
}
