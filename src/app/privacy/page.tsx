import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site'
import { donationConfig } from '@/config/donations'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description:
    'How the ESD K9 Cooper website handles information. No accounts, no tracking cookies, no data collection from children.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Privacy"
        tone="ink"
        title="How this site handles information"
        intro={
          <>
            Short version: it does not collect any. Longer version below.
          </>
        }
        crumbs={[{ label: 'Privacy' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell-narrow">
          <div className="ink pop bg-gold-200 p-5">
            <p className="font-display text-lg tracking-wide uppercase">
              For legal review before launch
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
              This notice describes how the website is actually built, and it is
              accurate as written. It is not legal advice and it has not been
              reviewed by counsel. Because parts of this site are written for
              children, COPPA and any applicable state privacy laws should be
              reviewed by a qualified professional before launch.
            </p>
          </div>

          <div className="prose-comic mt-8">
            <h2 className="text-title uppercase">What we collect</h2>
            <p>
              Nothing. This website has no accounts, no logins, no comment
              sections, no newsletter sign-up and no form that submits data to a
              server.
            </p>

            <h2 className="mt-8 text-title uppercase">Information you type in</h2>
            <p>
              The contact page builds a message and opens it in{' '}
              <strong>your own email application</strong>. Nothing you type is
              transmitted to this website or stored by it. If you press send, the
              email goes from your email provider to {siteConfig.email}, exactly
              like any other email you write.
            </p>

            <h2 className="mt-8 text-title uppercase">Things saved in your browser</h2>
            <p>
              Two small pieces of information may be saved in your own browser,
              on your own device. They are never transmitted anywhere and they
              are not cookies:
            </p>
            <ul>
              <li>
                <strong>Safety Shield ticks.</strong> Which items you have checked
                on the Safety HQ shield, so it is still there when you come back.
              </li>
              <li>
                <strong>Donate bar dismissal.</strong> A note that you closed the
                mobile donate bar, so it stays closed for the rest of your visit.
              </li>
            </ul>
            <p>
              Clearing your browser data removes both. Nothing else is stored.
            </p>

            <h2 className="mt-8 text-title uppercase">Children</h2>
            <p>
              Parts of this website are written for children. It therefore
              deliberately collects no personal information from anyone, of any
              age. There is no way for a child to create an account, submit
              information, upload anything or be contacted through this site. No
              behavioural advertising is used and no advertising or tracking
              pixels are loaded.
            </p>

            <h2 className="mt-8 text-title uppercase">Analytics</h2>
            <p>
              No analytics provider is currently enabled. If a privacy-first,
              cookieless one is added later, it will count anonymous page views
              and a small number of actions such as donate-button clicks - never
              anything that identifies a person. This notice will be updated at
              that point.
            </p>

            <h2 className="mt-8 text-title uppercase">Donations</h2>
            <p>
              Donations are handled entirely by {donationConfig.platform} on their
              own pages. This website never sees, processes or stores payment
              information of any kind. Their privacy policy applies once you leave
              this site.
            </p>

            <h2 className="mt-8 text-title uppercase">Third-party content</h2>
            <p>
              Videos are not loaded until you press play. Until you do, nothing is
              requested from the video platform and no third-party cookies are
              set. Social media posts are shown as self-hosted cards rather than
              live embeds, so Instagram and TikTok are not contacted unless you
              click through.
            </p>

            <h2 className="mt-8 text-title uppercase">Hosting and logs</h2>
            <p>
              Like every website, the hosting provider records standard server
              logs, which typically include IP addresses and browser information,
              for security and operational purposes. That is handled by the host
              rather than by this site.
            </p>

            <h2 className="mt-8 text-title uppercase">Questions</h2>
            <p>
              Write to{' '}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Please
              do not include sensitive information in that email.
            </p>

            <p className="mt-8 text-sm text-ink-3">
              Last updated when this site was built.{' '}
              <Link href="/accessibility">Accessibility statement</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
