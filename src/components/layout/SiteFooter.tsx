import Link from 'next/link'
import { AlertTriangle, Mail } from 'lucide-react'
import { footerNav } from '@/config/nav'
import { siteConfig } from '@/config/site'
import { DonateButton } from '@/components/donate/DonateButton'
import { SocialIconRow } from '@/components/social/SocialIcons'
import { CooperBadge } from './CooperBadge'
import { FooterTip } from './FooterTip'
import { PawDivider } from '@/components/comic/Decor'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      data-site-footer
      className="on-dark relative border-t-[4px] border-ink bg-blue-800 text-blue-50"
    >
      <div
        aria-hidden="true"
        className="benday pointer-events-none absolute inset-0 opacity-30"
        style={{ ['--benday-color' as string]: 'rgb(255 255 255 / 0.14)' }}
      />

      <div className="shell relative py-12 sm:py-16">
        <FooterTip />

        <PawDivider className="my-10" tone="gold" count={5} />

        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <CooperBadge className="h-14 w-14" sizes="56px" />
              <span className="font-display text-2xl leading-none tracking-wide uppercase">
                ESD K9
                <br />
                <span className="text-gold-300">Cooper</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100">
              {siteConfig.altTagline}
            </p>

            <p className="mt-4 text-xs leading-relaxed text-blue-200">
              {siteConfig.agency.unit}
              <br />
              {siteConfig.agency.office}
              <br />
              {siteConfig.agency.region}
            </p>

            {siteConfig.handler.showName ? (
              <p className="mt-3 text-xs leading-relaxed text-blue-200">
                Handler: {siteConfig.handler.fullName}
                <br />
                Certified {siteConfig.program.sponsor} ESD K9 team
              </p>
            ) : null}

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold tracking-[0.14em] text-gold-200 uppercase">
                Follow the adventure
              </p>
              <SocialIconRow placement="footer" tone="paper" />
            </div>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-display text-lg tracking-wide text-gold-300 uppercase">
                {group.title}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block py-1 text-sm text-blue-50 underline decoration-blue-400 decoration-2 underline-offset-4 transition-colors hover:text-gold-200 hover:decoration-gold-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 grid gap-4 border-t-2 border-blue-600 pt-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="font-display text-xl tracking-wide uppercase">
              Help keep this hero healthy, equipped and ready.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-gold-200 underline decoration-2 underline-offset-4"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              {siteConfig.email}
            </a>
          </div>
          <DonateButton placement="footer" variant="gold" />
        </div>

        <div
          role="note"
          className="mt-8 flex items-start gap-3 border-[3px] border-gold-300 bg-blue-900 p-4"
        >
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-gold-300"
          />
          <p className="text-sm leading-relaxed">
            <strong className="font-extrabold">{siteConfig.emergency.line}</strong>{' '}
            {siteConfig.emergency.action} This site cannot receive crime reports,
            tips or case information.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-blue-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/privacy" className="inline-block py-1 underline underline-offset-4 hover:text-gold-200">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="inline-block py-1 underline underline-offset-4 hover:text-gold-200">
                Accessibility
              </Link>
            </li>
            <li>
              <Link href="/contact" className="inline-block py-1 underline underline-offset-4 hover:text-gold-200">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
