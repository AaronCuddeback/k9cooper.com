import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Mail } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { CooperGuide } from '@/components/CooperGuide'
import { DonateButton } from '@/components/donate/DonateButton'
import { pageMetadata } from '@/lib/seo'
import { sponsors, sponsorLevels } from '@/content/sponsors'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Sponsors & Supporters',
  description:
    'The businesses and organisations that help keep ESD K9 Cooper healthy, equipped and working - and how your organisation can join them.',
  path: '/sponsors',
  keywords: ['sponsor a police K9', 'K9 sponsorship', 'community K9 support'],
})

export default function SponsorsPage() {
  const hasSponsors = sponsors.length > 0

  return (
    <>
      <PageHero
        kicker="Cooper’s Crew"
        title={
          <>
            Sponsors &amp;
            <br />
            supporters
          </>
        }
        intro={
          <>
            Keeping a working K9 on the job takes a small community. These are
            the people in it.
          </>
        }
        crumbs={[{ label: 'Sponsors' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          {hasSponsors ? (
            <>
              <SectionHeading kicker="Thank you" title="The people behind Cooper" />
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sponsors.map((sponsor) => (
                  <li key={sponsor.id}>
                    <ComicPanel
                      as="article"
                      tone="white"
                      tiltSeed={sponsor.id}
                      className="flex h-full flex-col p-5"
                    >
                      <span className="badge badge-gold self-start">{sponsor.level}</span>

                      {sponsor.logo ? (
                        <div className="mt-4 grid h-24 place-items-center bg-white">
                          <Image
                            src={sponsor.logo.src}
                            alt={`${sponsor.name} logo`}
                            width={sponsor.logo.width}
                            height={sponsor.logo.height}
                            className="max-h-24 w-auto object-contain"
                          />
                        </div>
                      ) : null}

                      <h2 className="mt-4 font-display text-xl tracking-wide uppercase">
                        {sponsor.name}
                      </h2>

                      {sponsor.blurb ? (
                        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-2">
                          {sponsor.blurb}
                        </p>
                      ) : null}

                      {sponsor.url ? (
                        <a
                          href={sponsor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 underline decoration-2 underline-offset-4"
                        >
                          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                          Visit {sponsor.name}
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : null}
                    </ComicPanel>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <SectionHeading
                  kicker="Be the first"
                  title="This wall is empty on purpose"
                  intro={
                    <>
                      No organisation appears here until they have agreed, in
                      writing, to be listed. There is a space at the top of this
                      page with somebody&rsquo;s name on it - it could be yours.
                    </>
                  }
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn btn-blue">
                    <Mail aria-hidden="true" className="h-5 w-5" />
                    Talk about sponsorship
                  </Link>
                  <DonateButton placement="sponsors-empty" variant="ghost" label="Or donate" />
                </div>
              </div>

              <CooperGuide pose="duty" label="Mission Briefing" size="lg" stacked>
                <p>
                  I am not fussy about who feeds me, but my handler is fussy about
                  who we put on this page. Everyone here said yes first.
                </p>
              </CooperGuide>
            </div>
          )}
        </div>
      </section>

      {/* ============================ LEVELS ============================ */}
      <section className="relative isolate overflow-hidden bg-blue-800 py-12 on-dark sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-35"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Ways to sponsor"
            tone="paper"
            title="Where a business can actually help"
            intro={
              <>
                Sponsorship does not have to mean writing a cheque. Some of the
                most useful support Cooper gets is in kind.
              </>
            }
          />

          <ul className="mt-9 grid gap-5 sm:grid-cols-2">
            {sponsorLevels.map((level) => (
              <li key={level.level}>
                <ComicPanel
                  as="article"
                  tone="paper"
                  tiltSeed={level.level}
                  className="h-full p-5"
                >
                  <h3 className="font-display text-xl tracking-wide text-red-700 uppercase">
                    {level.level}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-2">{level.description}</p>
                  <p className="mt-2.5 border-t-2 border-ink/15 pt-2.5 text-sm text-ink-3">
                    <strong className="text-ink-2">For example:</strong>{' '}
                    {level.examples}
                  </p>
                </ComicPanel>
              </li>
            ))}
          </ul>

          <div className="mt-9 ink pop bg-gold-300 p-6 text-ink">
            <h2 className="font-display text-2xl tracking-wide uppercase">
              Interested? Here is what to send.
            </h2>
            <ul className="prose-comic mt-3">
              <li>Your organisation and what you do.</li>
              <li>What you would like to contribute - funds, goods or services.</li>
              <li>Whether you want public recognition, or would rather stay quiet.</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`mailto:${siteConfig.email}`} className="btn">
                <Mail aria-hidden="true" className="h-5 w-5" />
                {siteConfig.email}
              </a>
              <Link href="/contact" className="btn btn-ghost">
                Use the contact page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
