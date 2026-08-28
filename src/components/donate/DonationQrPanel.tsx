'use client'

import Image from 'next/image'
import { Download, QrCode, ShieldCheck } from 'lucide-react'
import { donationConfig } from '@/config/donations'
import { track } from '@/lib/analytics'
import { DonateButton } from './DonateButton'
import { cn } from '@/lib/utils'

/**
 * The QR panel. Large enough to scan comfortably from a desktop screen, and
 * downloadable on mobile where scanning your own screen is not an option.
 */
export function DonationQrPanel({
  placement,
  className,
  compact = false,
}: {
  placement: string
  className?: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'ink pop bg-white p-5 text-center sm:p-6',
        className,
      )}
    >
      <p className="kicker mb-4">Scan to give</p>

      <div className="mx-auto w-fit ink-thin bg-white p-2">
        <Image
          src={donationConfig.qr.src}
          alt={`QR code linking to the ${donationConfig.recipient} donation page`}
          width={donationConfig.qr.width}
          height={donationConfig.qr.height}
          sizes="(max-width: 640px) 200px, 260px"
          className={cn('h-auto', compact ? 'w-[168px]' : 'w-[200px] sm:w-[240px]')}
          onLoad={() => track('donate_qr_view', { placement })}
        />
      </div>

      <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
        Point your phone camera at the code, then tap the link that pops up. It
        opens {donationConfig.platform}, where the donation is handled.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        <DonateButton placement={`${placement}-qr-panel`} size="sm" label="Or tap to donate" />
        <a
          href={donationConfig.qr.src}
          download={donationConfig.qr.downloadName}
          onClick={() => track('donate_qr_download', { placement })}
          className="inline-flex items-center justify-center gap-2 text-sm font-bold text-blue-600 underline decoration-2 underline-offset-4 hover:bg-gold-200"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Save the QR code
        </a>
      </div>

      <p className="mt-4 flex items-start justify-center gap-2 text-xs leading-relaxed text-ink-3">
        <ShieldCheck aria-hidden="true" className="mt-px h-4 w-4 shrink-0" />
        <span>
          This website never sees your payment details. Everything happens on{' '}
          {donationConfig.platform}.
        </span>
      </p>
    </div>
  )
}

/** Small inline QR nudge used in sidebars. */
export function QrNudge({ placement }: { placement: string }) {
  return (
    <a
      href={donationConfig.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('donate_click', { placement })}
      className="group ink-thin flex items-center gap-3 bg-paper-2 p-3 transition-colors hover:bg-gold-200"
    >
      <QrCode aria-hidden="true" className="h-8 w-8 shrink-0" />
      <span className="text-left text-sm leading-tight font-bold">
        Help keep this hero healthy, equipped and ready.
        <span className="block font-display text-base tracking-wide text-red-600 uppercase">
          Donate now
        </span>
      </span>
    </a>
  )
}
