import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn, isExternal } from '@/lib/utils'

export type ButtonVariant = 'default' | 'donate' | 'gold' | 'blue' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  default: '',
  donate: 'btn-donate',
  gold: 'btn-gold',
  blue: 'btn-blue',
  ghost: 'btn-ghost',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export function buttonClass(
  variant: ButtonVariant = 'default',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn('btn', VARIANTS[variant], SIZES[size], className)
}

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string
  }

/**
 * A link styled as a button. External links automatically get
 * `target="_blank"` plus `rel="noopener noreferrer"`.
 */
export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  const cls = buttonClass(variant, size, className)

  if (isExternal(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
    const external = isExternal(href)
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  )
}

type PlainButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...rest
}: PlainButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}
