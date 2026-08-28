import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Handshake,
  Heart,
  Instagram,
  MapPin,
  Search,
  ShieldCheck,
} from 'lucide-react'

import { HeroSection } from '@/components/home/HeroSection'
import { MissionTicker } from '@/components/home/MissionTicker'
import { SafetyTipSpotlight } from '@/components/safety/SafetyTipSpotlight'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { PawDivider, TornEdge } from '@/components/comic/Decor'
import { CooperGuide } from '@/components/CooperGuide'
import { CooperArt } from '@/components/CooperArt'
import { AdventureCard } from '@/components/cards/AdventureCard'
import { EventCard } from '@/components/cards/EventCard'
import { VideoFacade } from '@/components/media/VideoFacade'
import { DonateButton } from '@/components/donate/DonateButton'
import { DonationQrPanel } from '@/components/donate/DonationQrPanel'
import { FollowButtons } from '@/components/social/FollowButtons'
import { EmptyState } from '@/components/ui/States'

import { sortedAdventures } from '@/content/adventures'
import { splitEvents } from '@/content/events'
import { featuredVideo } from '@/content/videos'
import { searchEnvironments } from '@/content/cooper'
import { donationConfig } from '@/config/donations'
import { siteConfig } from '@/config/site'
import { getSocial } from '@/config/social'

export default function HomePage() {
  const latest = sortedAdventures.slice(0, 3)
  const { upcoming } = splitEvents()
  const nextEvent = upcoming[0]
  const instagram = getSocial('instagram')

  return (
    <>
      <HeroSection />
      <MissionTicker />

      {/* ================= WHO IS COOPER / WHAT IS AN ESD K9 ================= */}
      <section className="newsprint py-14 sm:py-20" aria-labelledby="who-is-cooper">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <ComicPanel label="Who is Cooper?" tone="white" tiltSeed="who" className="p-6 sm:p-8">
              <div className="pt-6">
                <h2 id="who-is-cooper" className="text-display uppercase">
                  A very good dog
                  <br />
                  <span className="text-red-600">with a very serious job</span>
                </h2>
                <div className="prose-comic mt-4 text-ink-2">
                  <p>
                    Cooper is an Electronics Storage Device K9. That means he is
                    trained to find electronics that somebody has hidden on
                    purpose - a phone taped behind a drawer, a memory card buried
                    in a yard, a hard drive at the bottom of a pond.
                  </p>
                  <p>
                    He was born in July 2024 and started out training to be an
                    assistance dog. It was not the right fit. Six months of
                    electronics detection training later, he was awarded to{' '}
                    {siteConfig.handler.fullName} and certified as a{' '}
                    {siteConfig.program.sponsor} ESD K9 team.
                  </p>
                  <p>
                    Those devices can hold information that matters enormously to
                    an investigation. Cooper finds them. Trained investigators
                    take it from there.
                  </p>
                  <p>
                    The rest of the time, he is a Labrador. He is extremely
                    pleased to meet you and he would like to know what you are
                    eating.
                  </p>
                </div>
                <Link href="/meet-cooper" className="btn btn-sm mt-5">
                  Meet Cooper
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </ComicPanel>

            <ComicPanel
              label="What is an ESD K9?"
              labelTone="red"
              tone="blue"
              tiltSeed="esd-k9"
              className="overflow-hidden"
            >
              <div className="p-6 pt-12 sm:p-8 sm:pt-14">
                <p className="text-lg leading-relaxed text-blue-50">
                  <strong className="font-extrabold text-gold-300">
                    ESD stands for Electronics Storage Device.
                  </strong>{' '}
                  Cooper is not looking for metal, batteries or a signal. He is
                  following a smell - a faint chemical trace given off by
                  compounds used inside electronic components.
                </p>

                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {[
                    'Phones and tablets',
                    'USB flash drives',
                    'Memory cards',
                    'External hard drives',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 border-2 border-ink bg-blue-900 px-3 py-2 text-sm font-bold text-blue-50"
                    >
                      <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-gold-300" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-base text-blue-100">
                  A device that is switched off, out of battery or completely
                  broken still smells exactly the same to Cooper.
                </p>

                <Link href="/what-cooper-does" className="btn btn-sm btn-gold mt-6">
                  See how a search works
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </ComicPanel>
          </div>
        </div>
      </section>

      {/* ========================= WHERE HE SEARCHES ========================= */}
      <section
        className="on-dark relative isolate overflow-hidden bg-blue-700 py-14 sm:py-20"
        aria-labelledby="where-he-searches"
      >
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-40"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.3)' }}
        />
        <div className="shell relative">
          <SectionHeading
            id="where-he-searches"
            kicker="Mission Briefing"
            tone="paper"
            align="center"
            title={<>Where Cooper searches</>}
            intro={
              <>
                Five environments, one nose. Cooper is trained to work all of
                them.
              </>
            }
          />

          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {searchEnvironments.map((env, i) => (
              <li key={env.id}>
                <ComicPanel
                  as="article"
                  tone="paper"
                  tiltSeed={env.id}
                  className="h-full overflow-hidden"
                >
                  <div className="relative aspect-[3/4] border-b-[3px] border-ink">
                    <Image
                      src={env.image.src}
                      alt={env.image.alt}
                      fill
                      loading={i < 3 ? 'eager' : 'lazy'}
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 210px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-lg tracking-wide uppercase">
                      {env.title}
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-ink-2">{env.body}</p>
                  </div>
                </ComicPanel>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center">
            <Link href="/what-cooper-does" className="btn btn-gold">
              The full five-step search
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <TornEdge className="absolute inset-x-0 -bottom-px" />
      </section>

      {/* ===================== VIDEO + SAFETY TIP ===================== */}
      <section className="newsprint py-14 sm:py-20" aria-labelledby="watch-and-learn">
        <div className="shell">
          <SectionHeading
            id="watch-and-learn"
            kicker="Featured Video"
            title="Watch Cooper work"
            intro="A training hide, start to finish. The video is hosted right here - nothing loads, from anywhere, until you press play."
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <VideoFacade video={featuredVideo} />
            <div className="flex flex-col gap-6">
              <SafetyTipSpotlight />

              <ComicPanel tone="white" straight className="p-5">
                <p className="font-comic text-xl tracking-wide text-blue-600">
                  Super Sniffer Fact
                </p>
                <p className="mt-1.5 leading-relaxed text-ink-2">
                  A dog does not smell a room the way we look at one. Cooper
                  reads it in layers, working out how the air moves through the
                  space and following the trail back to its source.
                </p>
              </ComicPanel>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== SAFETY HQ TEASER ========================== */}
      <section
        className="relative isolate overflow-hidden bg-gold-300 py-14 sm:py-20"
        aria-labelledby="safety-hq-teaser"
      >
        <div
          aria-hidden="true"
          className="zip-lines pointer-events-none absolute inset-0 opacity-40"
          style={{ ['--zip-angle' as string]: '-12deg' }}
        />
        <div className="shell relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-md">
            <div className="rotate-[-2deg] border-[4px] border-ink bg-paper p-2 shadow-[8px_8px_0_var(--color-ink)]">
              <Image
                src="/images/comic/panel-kids-online.jpg"
                alt="Comic panel of three children looking at a tablet together with the caption What You Can Do"
                width={366}
                height={196}
                sizes="366px"
                className="mx-auto h-auto w-full max-w-[366px] border-[3px] border-ink"
              />
            </div>
            <p
              aria-hidden="true"
              className="sfx absolute -top-6 -right-2 rotate-[9deg] text-3xl sm:text-4xl"
            >
              SPEAK UP!
            </p>
          </div>

          <div>
            <SectionHeading
              id="safety-hq-teaser"
              kicker="Safety HQ"
              title={
                <>
                  Stay safe. Stay smart.
                  <br />
                  <span className="text-red-600">Speak up.</span>
                </>
              }
              intro={
                <>
                  Cooper&rsquo;s Safety Headquarters is a free online-safety
                  academy for kids, teens, parents and teachers. Twelve short
                  lessons, a quiz, a printable family checklist, and a
                  &ldquo;build your shield&rdquo; tracker that saves nothing to
                  any server.
                </>
              }
            />

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                'Passwords that actually hold',
                'Turning on two-step login',
                'What grooming really looks like',
                'Cyberbullying: block, save, tell',
                'Why it is never the kid’s fault',
                'A checklist you can print tonight',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 border-2 border-ink bg-paper px-3 py-2 text-sm font-bold"
                >
                  <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/safety-hq" className="btn btn-lg mt-7 bg-ink text-paper">
              Enter Safety HQ
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================== LATEST ADVENTURES ========================== */}
      <section className="newsprint py-14 sm:py-20" aria-labelledby="latest-logs">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="latest-logs"
              kicker="Latest Mission Briefing"
              title="Cooper’s adventures"
              intro="Training days, community visits and the occasional nap. Updated as Cooper works."
            />
            <Link href="/adventures" className="btn btn-sm btn-ghost">
              All mission logs
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((adventure, i) => (
              <li key={adventure.slug}>
                <AdventureCard adventure={adventure} priority={i === 0} className="h-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ NEXT EVENT ============================ */}
      <section
        className="relative isolate overflow-hidden bg-paper-2 py-14 sm:py-20"
        aria-labelledby="next-appearance"
      >
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <SectionHeading
                id="next-appearance"
                kicker="Come meet me!"
                title="Cooper’s next appearance"
                intro="Cooper visits schools, community events, demonstrations and fundraisers across the county."
              />

              <div className="mt-7">
                {nextEvent ? (
                  <EventCard event={nextEvent} />
                ) : (
                  <EmptyState title="Nothing on the calendar yet" pose="working">
                    <p>
                      No public appearances are scheduled right now. New dates
                      go up here first - or catch them on Instagram.
                    </p>
                  </EmptyState>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/events" className="btn btn-sm">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  All events
                </Link>
                <Link href="/contact" className="btn btn-sm btn-blue">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  Request an appearance
                </Link>
              </div>
            </div>

            <CooperGuide pose="duty" label="Mission Briefing" size="lg" tone="white">
              <p>
                Bookings go through my handler, and my day job always comes
                first - so ask early. Schools, libraries, community groups and
                public safety events are all welcome.
              </p>
            </CooperGuide>
          </div>
        </div>
      </section>

      {/* ============================== DONATE ============================== */}
      <section
        className="on-dark relative isolate overflow-hidden bg-blue-800 py-14 sm:py-20"
        aria-labelledby="support-cooper"
      >
        <div
          aria-hidden="true"
          className="speed-lines pointer-events-none absolute inset-0"
          style={{
            ['--speed-x' as string]: '20%',
            ['--speed-y' as string]: '85%',
            ['--speed-color' as string]: 'rgb(248 202 62 / 0.09)',
          }}
        />
        <div className="shell relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              id="support-cooper"
              kicker="Help support my care"
              tone="paper"
              title={
                <>
                  Help keep this hero
                  <br />
                  <span className="text-gold-300">healthy, equipped and ready.</span>
                </>
              }
              intro={
                <>
                  Donations go to the {donationConfig.recipient} and help cover
                  the everyday cost of keeping working K9s like Cooper on the
                  job.
                </>
              }
            />

            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {donationConfig.supports.map((s) => (
                <li
                  key={s.title}
                  className="flex items-start gap-2.5 border-2 border-blue-500 bg-blue-900 px-3.5 py-2.5"
                >
                  <Heart
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-300"
                    fill="currentColor"
                  />
                  <span>
                    <span className="block font-display text-sm tracking-wide text-gold-200 uppercase">
                      {s.title}
                    </span>
                    <span className="text-sm leading-snug text-blue-100">{s.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <DonateButton placement="home-donate-section" size="lg" label="Donate now" />
              <Link href="/support" className="btn btn-lg bg-white">
                How it helps
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
            </div>

            <p className="mt-4 max-w-lg text-sm text-blue-200">
              This website never sees your payment details. Donations are handled
              entirely by {donationConfig.platform}.
            </p>
          </div>

          <DonationQrPanel placement="home" className="mx-auto w-full max-w-sm" />
        </div>
      </section>

      {/* ===================== PARTNERS + FOLLOW CLOSER ===================== */}
      <section className="newsprint py-14 sm:py-20" aria-labelledby="stand-with-cooper">
        <div className="shell">
          <SectionHeading
            id="stand-with-cooper"
            kicker="Cooper’s Crew"
            align="center"
            title="Stand with Cooper"
            intro="Follow, share, sponsor, or book a visit. All of it moves the same mission forward."
          />

          <PawDivider className="my-9" />

          <div className="grid gap-6 md:grid-cols-3">
            <ComicPanel tone="white" tiltSeed="crew-follow" className="flex flex-col p-6">
              <Instagram aria-hidden="true" className="h-8 w-8 text-red-600" />
              <h3 className="mt-3 font-display text-xl tracking-wide uppercase">
                Follow the adventure
              </h3>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-2">
                Training clips, community visits and safety reminders short
                enough to actually watch. {instagram ? instagram.handle : ''} on
                both platforms.
              </p>
              <FollowButtons placement="home-crew" size="sm" showHandle={false} className="mt-4" />
            </ComicPanel>

            <ComicPanel tone="white" tiltSeed="crew-sponsor" className="flex flex-col p-6">
              <Handshake aria-hidden="true" className="h-8 w-8 text-blue-600" />
              <h3 className="mt-3 font-display text-xl tracking-wide uppercase">
                Sponsor a working dog
              </h3>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-2">
                Veterinary practices, pet food suppliers, equipment makers and
                local businesses can all help keep Cooper working.
              </p>
              <Link href="/sponsors" className="btn btn-sm mt-4">
                Sponsorship options
              </Link>
            </ComicPanel>

            <ComicPanel tone="white" tiltSeed="crew-book" className="flex flex-col p-6">
              <ShieldCheck aria-hidden="true" className="h-8 w-8 text-scent-500" />
              <h3 className="mt-3 font-display text-xl tracking-wide uppercase">
                Bring Cooper to your school
              </h3>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-2">
                A demonstration kids remember, and an online-safety message they
                can use the same evening.
              </p>
              <Link href="/contact" className="btn btn-sm btn-blue mt-4">
                Request a visit
              </Link>
            </ComicPanel>
          </div>
        </div>
      </section>

      {/* ============================ CLOSING CTA ============================ */}
      <section className="relative isolate overflow-hidden border-t-[4px] border-ink bg-red-500 py-14 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-30"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.4)' }}
        />
        <div
          aria-hidden="true"
          className="speed-lines pointer-events-none absolute inset-0"
          style={{
            ['--speed-x' as string]: '78%',
            ['--speed-y' as string]: '60%',
            ['--speed-color' as string]: 'rgb(255 255 255 / 0.10)',
          }}
        />

        <div className="shell relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="font-comic text-2xl tracking-wide text-gold-300 sm:text-3xl">
              Together, we can
            </p>
            <p className="mt-1 font-display text-hero uppercase">Protect Children</p>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-red-50 lg:mx-0">
              {siteConfig.altTagline} Follow Cooper, share what you learn here, and
              help keep him working.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <DonateButton
                placement="home-closing"
                size="lg"
                variant="gold"
                label="Support Cooper"
              />
              <Link href="/safety-hq" className="btn btn-lg bg-white text-ink">
                Learn to stay safe online
              </Link>
            </div>
          </div>

          {/* Cooper launching out of the band. */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
            <CooperArt
              pose="leap"
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 420px"
              className="drop-shadow-none"
            />
            <p
              aria-hidden="true"
              className="sfx absolute -bottom-2 left-0 rotate-[-6deg] text-4xl sm:text-5xl"
            >
              PAW-SOME!
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
