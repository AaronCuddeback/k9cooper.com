'use client'

import { Heart } from 'lucide-react'
import { donationConfig } from '@/config/donations'
import { track } from '@/lib/analytics'
import { buttonClass, type ButtonSize, type ButtonVariant } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface DonateButtonProps {
  /** Where on the site the click happened - recorded as an analytics prop. */
  placement: string
  label?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  showIcon?: boolean
}

/**
 * The single canonical way to link to the donation platform. Every donate
 * control on the site goes through this component so the URL, the analytics
 * event and the external-link safety attributes stay consistent.
 */
export function DonateButton({
  placement,
  label = 'Support Cooper',
  variant = 'donate',
  size = 'md',
  className,
  showIcon = true,
}: DonateButtonProps) {
  return (
    <a
      href={donationConfig.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('donate_click', { placement })}
      className={cn(buttonClass(variant, size, className))}
      data-testid="donate-button"
      data-placement={placement}
    >
      {showIcon ? (
        <Heart aria-hidden="true" className="h-5 w-5 shrink-0" fill="currentColor" />
      ) : null}
      <span>{label}</span>
      <span className="sr-only"> (opens the donation page in a new tab)</span>
    </a>
  )
}
