import type { Metadata } from 'next'
import Link from 'next/link'
import * as Icons from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { DonateButton } from '@/components/donate/DonateButton'
import { DonationQrPanel } from '@/components/donate/DonationQrPanel'
import { Accordion } from '@/components/ui/Accordion'
import { ActionBurst } from '@/components/comic/ActionBurst'
import { TornEdge } from '@/components/comic/Decor'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata } from '@/lib/seo'
import { donationConfig } from '@/config/donations'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Support Cooper',
  description:
    'Help keep ESD K9 Cooper healthy, equipped and ready. Donations support veterinary care, food, training supplies, safety equipment and travel for working K9s. Donate online or scan the QR code.',
  path: '/support',
  keywords: ['donate to K9 Cooper', 'support a police K9', 'K9 association donation'],
})

const SUPPORT_ICONS: Record<string, Icons.LucideIcon> = {
  stethoscope: Icons.Stethoscope,
  bone: Icons.Bone,
  target: Icons.Target,
  shield: Icons.Shield,
  truck: Icons.Truck,
  heart: Icons.Heart,
}

export default function SupportPage() {
  return (
    <>
      <PageHero
        kicker="Help support my care"
        tone="red"
        title={
          <>
            Help keep this hero
            <br />
            <span className="text-gold-300">healthy, equipped and ready.</span>
          </>
        }
        intro={
          <>
            Cooper works for food, praise and a tennis ball. Everything else -
            the vet, the gear, the travel - costs real money, and that is where
            you come in.
          </>
        }
        crumbs={[{ label: 'Support Cooper' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <DonateButton placement="support-hero" size="lg" variant="gold" label="Donate now" />
          <Link href="#how-it-helps" className="btn btn-lg bg-white">
            See what it pays for
          </Link>
        </div>
      </PageHero>

      {/* ========================= DONATE + QR ========================= */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <SectionHeading
              kicker="Two ways to give"
              title="It takes about thirty seconds"
              intro={
                <>
                  Every donation goes to the {donationConfig.recipient} through
                  their own secure page on {donationConfig.platform}.
                </>
              }
            />

            <ol className="mt-7 flex flex-col gap-4">
              {[
                {
                  n: 1,
                  title: 'Tap the button, or scan the code',
                  body: `Either one opens ${donationConfig.platform}. On a phone, point your camera at the QR code and tap the link that pops up.`,
                },
                {
                  n: 2,
                  title: 'Choose an amount',
                  body: 'Any amount genuinely helps. A bag of food, a set of paw protection, a portion of a vet visit - it all adds up.',
                },
                {
                  n: 3,
                  title: 'That is it',
                  body: 'You are done. Cooper does not know what money is, but his handler is very grateful.',
                },
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border-[3px] border-ink bg-gold-300 font-display text-xl">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-display text-lg tracking-wide uppercase">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-[0.95rem] leading-relaxed text-ink-2">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <DonateButton placement="support-main" size="lg" label="Donate now" />
            </div>

            <div className="mt-6 border-[3px] border-ink bg-white p-4">
              <p className="text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
                Prefer to type it in?
              </p>
              <p className="mt-1.5 text-sm break-all text-ink-2">
                <a
                  href={donationConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 underline decoration-2 underline-offset-4"
                >
                  {donationConfig.url}
                </a>
              </p>
            </div>
          </div>

          <div className="relative">
            <DonationQrPanel placement="support-page" />
            <ActionBurst
              tone="gold"
              rotate={9}
              className="absolute -top-6 right-0 z-10 w-20 sm:-right-3 sm:w-28"
            >
              <span className="font-comic text-sm leading-tight sm:text-base">
                Scan
                <br />
                me!
              </span>
            </ActionBurst>
          </div>
        </div>
      </section>

      {/* ========================= WHAT IT PAYS FOR ========================= */}
      <section
        id="how-it-helps"
        className="relative isolate scroll-mt-24 overflow-hidden bg-blue-800 py-12 on-dark sm:py-16"
      >
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-35"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Where it goes"
            tone="paper"
            align="center"
            title="What your support pays for"
          />

          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {donationConfig.supports.map((s) => {
              const Icon = SUPPORT_ICONS[s.icon] ?? Icons.Heart
              return (
                <li key={s.title}>
                  <ComicPanel
                    as="article"
                    tone="paper"
                    tiltSeed={s.title}
                    className="h-full p-5"
                  >
                    <Icon aria-hidden="true" className="h-8 w-8 text-red-600" />
                    <h3 className="mt-2.5 font-display text-lg tracking-wide uppercase">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">
                      {s.body}
                    </p>
                  </ComicPanel>
                </li>
              )
            })}
          </ul>

        </div>
        <TornEdge className="absolute inset-x-0 -bottom-px" />
      </section>

      {/* ============================ OTHER WAYS ============================ */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="Not just money"
            title="Other ways to help"
            intro={<>Several of these cost nothing at all.</>}
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Icons.Share2,
                title: 'Share this site',
                body: 'Send Safety HQ to one other family. That is the whole ask, and it is genuinely the most useful thing on this list.',
                href: '/safety-hq',
                cta: 'Visit Safety HQ',
              },
              {
                icon: Icons.Instagram,
                title: 'Follow and share',
                body: 'Every follow puts the safety message in front of more families. Costs nothing, helps a lot.',
                href: '/social',
                cta: 'Social Hub',
              },
              {
                icon: Icons.Handshake,
                title: 'Sponsor Cooper',
                body: 'Veterinary practices, food suppliers, equipment makers and local businesses can all get involved.',
                href: '/sponsors',
                cta: 'Sponsorship',
              },
              {
                icon: Icons.ShoppingBag,
                title: 'Buy something',
                body: 'Stickers, patches and posters. Wear the mission, start a conversation.',
                href: '/shop',
                cta: 'Visit the shop',
              },
            ].map((item) => (
              <ComicPanel
                key={item.title}
                as="article"
                tone="white"
                tiltSeed={item.title}
                className="flex flex-col p-5"
              >
                <item.icon aria-hidden="true" className="h-7 w-7 text-blue-600" />
                <h3 className="mt-2.5 font-display text-lg tracking-wide uppercase">
                  {item.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-2">
                  {item.body}
                </p>
                <Link href={item.href} className="btn btn-sm mt-4">
                  {item.cta}
                </Link>
              </ComicPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FAQ ============================== */}
      <section className="bg-paper-2 py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <SectionHeading kicker="Donation questions" title="The honest answers" />
            <div className="mt-7">
              <Accordion
                defaultOpenId="q0"
                items={donationConfig.faqs.map((f, i) => ({
                  id: `q${i}`,
                  question: f.q,
                  answer: <p>{f.a}</p>,
                }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="ink pop relative overflow-hidden bg-gold-300 p-5">
              <div
                aria-hidden="true"
                className="benday pointer-events-none absolute inset-0 opacity-40"
                style={{ ['--benday-color' as string]: 'rgb(11 11 13 / 0.16)' }}
              />
              <CooperArt
                pose="wave"
                sizes="(max-width: 1024px) 50vw, 240px"
                className="relative mx-auto max-w-[220px]"
              />
              <p className="relative mt-3 text-center text-[0.95rem] leading-relaxed font-semibold text-ink">
                I have absolutely no concept of money. I do have a concept of
                dinner, and the two turn out to be closely related.
              </p>
            </div>

            <div className="ink pop bg-white p-5">
              <h2 className="font-display text-lg tracking-wide uppercase">
                Transparency
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {donationConfig.legalNotes.map((note, i) => (
                  <li
                    key={i}
                    className="border-l-[4px] border-blue-400 pl-3 text-sm leading-relaxed text-ink-2"
                  >
                    {note}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 border-t-2 border-ink/15 pt-3 text-xs text-ink-3">
                <Icons.Lock aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>
                  {siteConfig.name} does not collect, process or store payment
                  information of any kind.
                </span>
              </p>
            </div>

            <div className="ink pop bg-blue-700 p-5 on-dark text-blue-50">
              <h2 className="font-display text-lg tracking-wide text-gold-300 uppercase">
                Sponsor enquiries
              </h2>
              <p className="mt-2 text-sm leading-relaxed">
                Businesses and organisations interested in supporting Cooper -
                veterinary care, food, equipment, event sponsorship - can get in
                touch directly.
              </p>
              <Link href="/contact" className="btn btn-sm btn-gold mt-4 w-full">
                Talk to Cooper&rsquo;s team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
