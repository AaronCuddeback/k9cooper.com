import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Handshake,
  MessageCircleHeart,
  Search,
} from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { CooperGuide } from '@/components/CooperGuide'
import { ActionBurst } from '@/components/comic/ActionBurst'
import { DonateButton } from '@/components/donate/DonateButton'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'The Mission',
  description:
    'Why ESD K9 Cooper exists: supporting investigations that protect children, teaching families practical online safety, and building trust between kids, schools and law enforcement.',
  path: '/mission',
  keywords: ['child protection K9', 'online safety education', 'community policing K9'],
})

const PILLARS = [
  {
    icon: Search,
    title: 'Find what was hidden',
    body: 'Cooper supports lawful searches by locating electronic devices that would otherwise stay hidden. Investigators decide what those devices mean.',
    tone: 'blue' as const,
  },
  {
    icon: GraduationCap,
    title: 'Teach kids what to do',
    body: 'A dog gets a room full of children to listen. We use that. Every visit ends with a plan they can actually remember: stop, block, tell.',
    tone: 'gold' as const,
  },
  {
    icon: Handshake,
    title: 'Build the bridge',
    body: 'Schools, libraries, community groups and law enforcement working from the same page. Cooper is often the easiest introduction there is.',
    tone: 'paper' as const,
  },
  {
    icon: MessageCircleHeart,
    title: 'Make telling normal',
    body: 'The single most protective thing a child can do is tell a trusted adult early. Everything we say is designed to make that feel ordinary instead of frightening.',
    tone: 'red' as const,
  },
]

export default function MissionPage() {
  return (
    <>
      <PageHero
        kicker="The Mission"
        tone="red"
        title={
          <>
            One nose.
            <br />
            One mission.
            <br />
            <span className="text-gold-300">Protect children.</span>
          </>
        }
        intro={
          <>
            Cooper&rsquo;s work sits at the point where a technical problem and a
            human one meet: finding the evidence, and helping children never
            become part of it in the first place.
          </>
        }
        crumbs={[{ label: 'The Mission' }]}
      />

      {/* ============================== WHY ============================== */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="prose-comic">
            <SectionHeading kicker="Why Cooper exists" title="Evidence that hides in plain sight" />
            <p className="mt-5">
              Almost everything now lives on a device. When someone harms a
              child, the record of it very often lives on one too - and if that
              person has any sense of what is coming, that device gets hidden.
            </p>
            <p>
              A memory card is the size of a fingernail. A phone fits inside a
              wall cavity, a car seat, a flowerbed. Investigators can search a
              house carefully for hours and still miss it.
            </p>
            <p>
              Cooper does not miss it. He walks the room, reads the air, and
              tells his handler where to look. What that device turns out to
              hold is decided by trained investigators through the proper legal
              process - but they cannot examine something they never found.
            </p>
            <p>
              That is why this team exists in the shape it does. Cooper trained
              for six months to find hidden electronics; the{' '}
              {siteConfig.program.sponsor} then paired him with{' '}
              {siteConfig.handler.showName
                ? siteConfig.handler.fullName
                : 'a detective'}{' '}
              of the {siteConfig.agency.office}, chosen for his work in Internet
              Crimes Against Children investigations and digital forensics. A
              nose that finds the device, and an investigator who knows what to
              do with it.
            </p>
            <p className="border-l-[5px] border-red-500 bg-white pl-4 text-lg font-bold">
              Every device recovered is a chance for a case to be understood
              properly. Sometimes that is the whole difference.
            </p>
          </div>

          <div className="relative">
            {/* Native size - cropped from the 1086px poster. See docs/ASSETS.md. */}
            <ComicPanel tone="paper" tiltSeed="mission-art" className="overflow-hidden p-3">
              <Image
                src="/images/comic/panel-more-than.jpg"
                alt="Comic panel of Cooper sitting on a hilltop at sunset with the caption More than a search dog"
                width={391}
                height={284}
                priority
                sizes="391px"
                className="mx-auto h-auto w-full max-w-[391px] border-2 border-ink"
              />
            </ComicPanel>
            <ActionBurst
              tone="gold"
              rotate={8}
              className="absolute right-0 -bottom-8 z-10 w-24 sm:-right-3 sm:w-36"
            >
              <span className="font-comic text-sm leading-tight sm:text-base">
                More than
                <br />a search
                <br />
                dog
              </span>
            </ActionBurst>
          </div>
        </div>
      </section>

      {/* ============================= PILLARS ============================= */}
      <section className="relative isolate overflow-hidden bg-blue-800 py-12 on-dark sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-35"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Four fronts"
            tone="paper"
            align="center"
            title="What the mission actually involves"
          />

          <ul className="mt-9 grid gap-5 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <li key={pillar.title}>
                <ComicPanel
                  as="article"
                  tone={pillar.tone}
                  tiltSeed={pillar.title}
                  className="h-full p-5 sm:p-6"
                >
                  <pillar.icon
                    aria-hidden="true"
                    className={
                      pillar.tone === 'blue' || pillar.tone === 'red'
                        ? 'h-9 w-9 text-gold-300'
                        : 'h-9 w-9 text-red-600'
                    }
                  />
                  <h3 className="mt-3 font-display text-xl tracking-wide uppercase">
                    {pillar.title}
                  </h3>
                  <p
                    className={
                      pillar.tone === 'blue' || pillar.tone === 'red'
                        ? 'mt-2 leading-relaxed text-blue-50'
                        : 'mt-2 leading-relaxed text-ink-2'
                    }
                  >
                    {pillar.body}
                  </p>
                </ComicPanel>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ THE TONE ============================ */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <ComicPanel tone="gold" label="How we talk about this" tiltSeed="tone">
              <div className="p-5 pt-12 sm:p-6 sm:pt-14">
                <p className="leading-relaxed">
                  Cooper&rsquo;s work involves some of the hardest subjects there
                  are. Everything on this website is written so that a nine year
                  old can read it without being frightened, and a parent can read
                  it without being patronised.
                </p>
                <ul className="prose-comic mt-4">
                  <li>No graphic detail, ever.</li>
                  <li>No scare tactics. Fear does not teach.</li>
                  <li>No blaming children for what adults did.</li>
                  <li>Always an action a child can actually take.</li>
                </ul>
              </div>
            </ComicPanel>

            <div>
              <SectionHeading
                kicker="Prevention"
                title="The half of the job that happens in classrooms"
                intro={
                  <>
                    The best outcome is a case that never has to exist. That is
                    what the school visits are for.
                  </>
                }
              />

              <div className="prose-comic mt-5">
                <p>
                  A working dog gets attention that a slide deck never will. Kids
                  who came to see a Labrador stay for the part about what to do
                  when a stranger online asks for a photo - and they remember it,
                  because it arrived attached to something they actually liked.
                </p>
                <p>
                  The message is short on purpose:{' '}
                  <strong>stop, block, tell.</strong> Then the grown-ups get their
                  own version, with the settings to change and the conversation
                  to have before anything goes wrong.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/safety-hq" className="btn btn-blue">
                  Visit Safety HQ
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </Link>
                <Link href="/contact" className="btn">
                  Book Cooper for a school
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <CooperGuide pose="duty" label="Cooper says" size="lg" tone="white">
              <p className="text-lg">
                If something online ever feels wrong, you have not done anything
                wrong by telling someone. That is the bravest part, and it is the
                part that fixes it.
              </p>
            </CooperGuide>
            <CooperArt
              pose="case"
              sizes="(max-width: 1024px) 45vw, 240px"
              className="mx-auto max-w-[210px]"
            />
          </div>
        </div>
      </section>

      {/* ============================ DISCLAIMER ============================ */}
      <section className="bg-paper-2 py-12 sm:py-16">
        <div className="shell-narrow">
          <div
            role="note"
            className="ink pop bg-white p-6 sm:p-7"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                aria-hidden="true"
                className="mt-1 h-7 w-7 shrink-0 text-red-600"
              />
              <div>
                <h2 className="font-display text-2xl tracking-wide uppercase">
                  This website cannot take reports
                </h2>
                <div className="prose-comic mt-3 text-ink-2">
                  <p>
                    {siteConfig.name} is an educational and community website. It
                    is not monitored, and it cannot receive crime reports, tips,
                    evidence, case information or requests for help.
                  </p>
                  <p>
                    <strong>
                      If a child is in immediate danger, call 911 right now.
                    </strong>
                  </p>
                  <p>
                    For a situation that is not an emergency, contact your local
                    law enforcement agency directly through their official
                    channels. If you are outside the United States, use your own
                    national emergency number.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <DonateButton placement="mission-footer" size="lg" />
            <Link href="/what-cooper-does" className="btn btn-lg btn-ghost">
              How a search works
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
