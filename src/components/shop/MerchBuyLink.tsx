'use client'

import { ShoppingBag } from 'lucide-react'
import { track } from '@/lib/analytics'
import { buttonClass } from '@/components/ui/Button'

/** External purchase link with click tracking and safe link attributes. */
export function MerchBuyLink({
  href,
  productId,
  className,
}: {
  href: string
  productId: string
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('merch_click', { product: productId })}
      className={buttonClass('gold', 'sm', className)}
    >
      <ShoppingBag aria-hidden="true" className="h-4 w-4" />
      Buy
      <span className="sr-only"> (opens the store in a new tab)</span>
    </a>
  )
}
