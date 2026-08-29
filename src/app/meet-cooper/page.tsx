import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, PawPrint, Sparkles } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { CooperGuide } from '@/components/CooperGuide'
import { PawDivider } from '@/components/comic/Decor'
import { DonateButton } from '@/components/donate/DonateButton'
import { FollowButtons } from '@/components/social/FollowButtons'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site'
import {
  cooperBio,
  cooperPartners,
  cooperStats,
  funFacts,
  milestones,
} from '@/content/cooper'

export const metadata: Metadata = pageMetadata({
  title: 'Meet Cooper',
  description:
    'Cooper’s story: born July 2024, an assistance dog candidate at Paws With A Cause, then six months of electronics detection training at Jordan Detection K9. Awarded to Detective Aaron Cuddeback on August 3, 2026 and certified as a United States Secret Service ESD K9 team at the NCFI in Alabama on August 12, 2026.',
  path: '/meet-cooper',
  keywords: [
    'Cooper K9 biography',
    'ESD K9 handler',
    'Labrador detection dog',
    'Jordan Detection K9',
    'Secret Service ESD K9',
    'Detective Aaron Cuddeback',
  ],
})

export default function MeetCooperPage() {
  return (
    <>
      <PageHero
        kicker="K9 Hero Profile"
        title={
          <>
            Meet
            <br />
            ESD K9 Cooper
          </>
        }
        intro={
          <>
            He was going to be an assistance dog. Then somebody noticed his
            nose. Part working detection K9, part community ambassador, entirely
            motivated by food - this is Cooper.
          </>
        }
        crumbs={[{ label: 'Meet Cooper' }]}
      />

      {/* ============================ HERO PROFILE ============================ */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative">
            <ComicPanel tone="paper" tiltSeed="profile-photo" className="overflow-hidden">
              <Image
                src="/images/cooper/cooper-sitting-indoors.jpg"
                alt="Cooper sitting indoors in his ESD-K9 harness, looking up at the camera"
                width={1400}
                height={2487}
                priority
                sizes="(max-width: 1024px) 92vw, 480px"
                className="h-auto w-full"
              />
            </ComicPanel>
            <p
              aria-hidden="true"
              className="sfx absolute -right-2 -bottom-4 rotate-[6deg] text-3xl sm:text-4xl"
            >
              GOOD BOY!
            </p>
          </div>

          <div>
            {/* --- Hero profile card, styled like a trading card --- */}
            <ComicPanel
              tone="blue"
              label="K9 Hero Profile"
              labelTone="gold"
              tiltSeed="hero-card"
            >
              <div className="p-5 pt-12 sm:p-6 sm:pt-14">
                <p className="font-display text-3xl tracking-wide text-gold-300 uppercase sm:text-4xl">
                  Cooper
                </p>
                <p className="mt-1 font-comic text-lg tracking-wide text-blue-100">
                  Electronics Storage Detection K9
                </p>

                <dl className="mt-5 grid gap-px overflow-hidden border-2 border-ink bg-ink sm:grid-cols-2">
                  {cooperStats.map((stat) => (
                    <div key={stat.label} className="bg-blue-900 px-3 py-2.5">
                      <dt className="text-[0.68rem] font-bold tracking-[0.14em] text-gold-200 uppercase">
                        {stat.label}
                      </dt>
                      <dd
                        className={
                          stat.pending
                            ? 'text-sm font-bold text-blue-300 italic'
                            : 'text-sm font-bold text-white'
                        }
                      >
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>

              </div>
            </ComicPanel>

            <div className="prose-comic mt-8">
              <h2 className="text-title uppercase">Cooper&rsquo;s story</h2>
              {cooperBio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <p>
                Labradors are a common choice for this work for good reasons: an
                exceptional nose, an unshakeable interest in food, and a
                temperament that stays steady in the middle of a busy room full
                of strangers. Cooper has all three, and he brings the last one to
                school assemblies with real enthusiasm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================== HOW HE GOT HERE =========================== */}
      <section className="bg-paper-2 py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="Cooper’s Crew"
            title="Who got him here"
            intro={
              <>
                No working K9 arrives on his own. Five organisations put Cooper
                in the harness he wears today.
              </>
            }
          />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cooperPartners.map((partner, i) => (
              <li key={partner.id}>
                <ComicPanel
                  as="article"
                  tone="white"
                  tiltSeed={`partner-${partner.id}`}
                  className="h-full p-5"
                >
                  <p className="text-[0.68rem] font-bold tracking-[0.14em] text-red-600 uppercase">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-lg leading-tight tracking-wide uppercase">
                    {partner.url ? (
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-gold-400 decoration-[3px] underline-offset-4 hover:text-blue-700"
                      >
                        {partner.name}
                      </a>
                    ) : (
                      partner.name
                    )}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">
                    {partner.role}
                  </p>
                </ComicPanel>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-ink-3">
            External links open on those organisations&rsquo; own websites. Their
            inclusion here records Cooper&rsquo;s history and is not an
            endorsement of this site by any of them.
          </p>
        </div>
      </section>

      {/* ============================== FUN FACTS ============================== */}
      <section className="relative isolate overflow-hidden bg-gold-300 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-50"
          style={{ ['--benday-color' as string]: 'rgb(11 11 13 / 0.14)' }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Super Sniffer Facts"
            title="Things about Cooper"
            align="center"
          />

          <ul className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funFacts.map((fact, i) => (
              <li
                key={i}
                className="flex items-start gap-3 ink pop-sm bg-paper p-4"
                style={{ rotate: i % 2 === 0 ? '-0.8deg' : '0.7deg' }}
              >
                <span aria-hidden="true" className="text-2xl leading-none">
                  {fact.emoji}
                </span>
                <p
                  className={
                    fact.pending
                      ? 'text-[0.95rem] leading-snug font-semibold text-ink-3 italic'
                      : 'text-[0.95rem] leading-snug font-semibold'
                  }
                >
                  {fact.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =========================== HANDLER PARTNERSHIP =========================== */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              kicker="One Team"
              title="Cooper and his handler"
              intro={
                <>
                  A detection K9 is half of a team. The other half is the person
                  holding the leash.
                </>
              }
            />
            <div className="prose-comic mt-5">
              <p>
                Cooper did not choose his handler, and neither did his handler
                choose Cooper. The {siteConfig.program.sponsor} did both. After
                Cooper finished detection school, the Secret Service selected{' '}
                {siteConfig.handler.showName ? (
                  <strong>{siteConfig.handler.fullName}</strong>
                ) : (
                  <strong>a detective</strong>
                )}{' '}
                of the {siteConfig.handler.office} for his work in Internet
                Crimes Against Children investigations and digital forensics.
              </p>
              <p>
                They met for the first time on{' '}
                {siteConfig.program.awardedOn}, at the{' '}
                {siteConfig.program.certifiedAt} in{' '}
                {siteConfig.program.certifiedLocation}, on the day Cooper was
                awarded to him. Then they spent weeks training as a single team
                before either of them was allowed to work a real search.
              </p>
              <p>
                Now they train together, work together and go home together.
                That constant partnership is what makes the work possible: his
                handler learns to read the small changes in Cooper&rsquo;s body
                language that mean &ldquo;something is here&rdquo;, and Cooper
                learns that telling his handler is always the thing that pays.
              </p>
              <p>
                Cooper finds the device. His handler and trained investigators
                decide what happens next. Cooper has never once been asked for a
                legal opinion, which suits him.
              </p>
              {siteConfig.handler.showName ? (
                <p>
                  <strong>Handler:</strong> {siteConfig.handler.fullName},{' '}
                  {siteConfig.handler.office}
                </p>
              ) : null}
            </div>
          </div>

          <ComicPanel tone="paper" tiltSeed="handler" className="overflow-hidden">
            <Image
              src="/images/cooper/cooper-and-handler-bond.jpg"
              alt="Cooper looking up at his handler, face to face, during a break in training"
              width={1800}
              height={1800}
              sizes="(max-width: 1024px) 92vw, 560px"
              className="h-auto w-full"
            />
            <p className="border-t-[3px] border-ink bg-paper px-4 py-3 text-center font-comic text-lg tracking-wide">
              Most of the job is trust.
            </p>
          </ComicPanel>
        </div>
      </section>

      {/* ============================== TIMELINE ============================== */}
      <section className="on-dark relative isolate overflow-hidden bg-blue-800 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-35"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Case File"
            tone="paper"
            title="Cooper’s milestones"
            intro={
              <>
                Two years, one career change, six months of detection school and
                a very good day in Alabama.
              </>
            }
          />

          <ol className="relative mt-9 flex flex-col gap-6 border-l-[4px] border-gold-400 pl-6 sm:pl-10">
            {milestones.map((m) => (
              <li key={m.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-3 -left-[2.15rem] h-4 w-4 rotate-45 border-[3px] border-ink bg-gold-300 sm:-left-[3.15rem]"
                />
                <div className="ink pop-sm bg-blue-900 p-4 sm:p-5">
                  <p className="font-comic text-lg tracking-wide text-gold-300">
                    {m.date}
                  </p>
                  <h3 className="mt-0.5 font-display text-xl tracking-wide text-white uppercase">
                    {m.title}
                  </h3>
                  <p
                    className={
                      m.pending
                        ? 'mt-1.5 leading-relaxed text-blue-300 italic'
                        : 'mt-1.5 leading-relaxed text-blue-50'
                    }
                  >
                    {m.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================== CLOSING ============================== */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <CooperArt
              pose="stand"
              sizes="(max-width: 640px) 55vw, 240px"
              className="mx-auto max-w-[220px]"
            />
            <CooperGuide pose="happy" label="Follow the adventure!" size="lg" tone="gold">
              <p className="text-lg">
                That is me. If you want the day-to-day version - training clips,
                community visits, the occasional nap in a patrol vehicle - I am
                on Instagram and TikTok.
              </p>
            </CooperGuide>
          </div>

          <PawDivider className="my-9" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/what-cooper-does" className="btn">
              <Sparkles aria-hidden="true" className="h-5 w-5" />
              What Cooper does
            </Link>
            <Link href="/mission" className="btn btn-blue">
              <PawPrint aria-hidden="true" className="h-5 w-5" />
              The mission
            </Link>
            <Link href="/adventures" className="btn">
              Mission logs
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
            <DonateButton placement="meet-cooper-footer" label="Support Cooper" />
          </div>

          <FollowButtons placement="meet-cooper" className="mt-5" />
        </div>
      </section>
    </>
  )
}
