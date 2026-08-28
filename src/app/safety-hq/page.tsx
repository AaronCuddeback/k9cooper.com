import Link from 'next/link'
import type { Metadata } from 'next'
import {
  AlertTriangle,
  BookOpen,
  ExternalLink,
  ListChecks,
  Printer,
  School,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { CooperGuide } from '@/components/CooperGuide'
import { PawDivider, TornEdge } from '@/components/comic/Decor'
import { SafetyAcademy } from '@/components/safety/SafetyAcademy'
import { SafetyShield } from '@/components/safety/SafetyShield'
import { SafetyQuiz } from '@/components/safety/SafetyQuiz'
import { EmptyState } from '@/components/ui/States'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata } from '@/lib/seo'
import { approvedResources, familyChecklist, glossary } from '@/content/safety'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Safety HQ',
  description:
    'Cooper’s free online-safety headquarters for kids, teens, parents and teachers. Twelve short lessons, a quiz, a printable family checklist and a build-your-shield tracker. No sign-up, no data collection.',
  path: '/safety-hq',
  keywords: [
    'kids online safety lessons',
    'family internet safety checklist',
    'online safety for teens',
    'classroom internet safety resources',
  ],
})

export default function SafetyHqPage() {
  return (
    <>
      <PageHero
        kicker="Safety HQ"
        tone="ink"
        title={
          <>
            Stop.
            <br />
            Block.
            <br />
            <span className="text-gold-300">Tell.</span>
          </>
        }
        intro={
          <>
            Welcome to Cooper&rsquo;s training academy. Twelve short lessons, a
            quiz, and a shield you build yourself. No sign-up, no accounts,
            nothing collected about you at all.
          </>
        }
        crumbs={[{ label: 'Safety HQ' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="#academy" className="btn btn-gold">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            Start the training
          </Link>
          <Link href="#grown-ups" className="btn bg-white">
            <Users aria-hidden="true" className="h-5 w-5" />
            For grown-ups
          </Link>
        </div>
      </PageHero>

      {/* ============================== THE RULE ============================== */}
      <section className="relative isolate overflow-hidden bg-red-500 py-12 text-white sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-30"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.4)' }}
        />
        <div className="shell relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-comic text-2xl tracking-wide text-gold-300">
              Cooper says
            </p>
            <p className="mt-2 font-display text-display uppercase">
              If it feels wrong,
              <br />
              it is allowed to be wrong.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-red-50">
              You never have to be polite to someone who makes you
              uncomfortable online. You can stop replying, block them, and go
              tell a grown-up - in that order, and without explaining yourself to
              anyone.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed font-bold text-gold-200">
              And if something has already happened: you are not in trouble. It
              is not your fault. Telling someone is what ends it.
            </p>
          </div>

          {/*
            No sound-effect burst here: the page's <h1> already shouts
            "Stop. Block. Tell." a few hundred pixels above, and repeating it
            only buried Cooper's face.

            The glow behind him matters - his cape is red and so is this band,
            so without it the silhouette flattens into the background.
          */}
          <div className="relative mx-auto w-full max-w-sm shrink-0 lg:max-w-lg">
            <span
              aria-hidden="true"
              className="absolute inset-0 -m-6 rounded-full bg-[radial-gradient(closest-side,rgb(251_245_230/0.30),transparent_75%)]"
            />
            <CooperArt
              pose="shield"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 480px"
              className="relative"
            />
          </div>
        </div>
        <TornEdge className="absolute inset-x-0 -bottom-px" />
      </section>

      {/* ============================== ACADEMY ============================== */}
      <section id="academy" className="newsprint scroll-mt-24 py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="Training Academy"
            title="Twelve lessons, one shield"
            intro={
              <>
                Filter by age, read the ones that fit, and open the
                &ldquo;for grown-ups&rdquo; note where you want the version with
                more detail.
              </>
            }
          />
          <div className="mt-8">
            <SafetyAcademy />
          </div>
        </div>
      </section>

      {/* ================================ SHIELD ================================ */}
      <section
        id="shield"
        className="relative isolate scroll-mt-24 overflow-hidden bg-blue-700 py-12 on-dark sm:py-16"
      >
        <div
          aria-hidden="true"
          className="speed-lines pointer-events-none absolute inset-0"
          style={{
            ['--speed-x' as string]: '22%',
            ['--speed-y' as string]: '30%',
            ['--speed-color' as string]: 'rgb(248 202 62 / 0.10)',
          }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Build Your Safety Shield"
            tone="paper"
            title="Eight things that actually protect you"
            intro={
              <>
                Tick each one as you do it. The shield fills up. Your answers
                stay in this browser and are never sent anywhere.
              </>
            }
          />

          <div className="mt-9 ink pop bg-paper p-5 text-ink sm:p-7">
            <SafetyShield />
          </div>
        </div>
        <TornEdge className="absolute inset-x-0 -bottom-px" />
      </section>

      {/* ================================= QUIZ ================================= */}
      <section id="quiz" className="newsprint scroll-mt-24 py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <SectionHeading
              kicker="Cooper’s Quiz"
              title="Five questions. No wrong answers, only better ones."
              intro={
                <>
                  Nothing is recorded and nothing is shared. Get one wrong and
                  Cooper explains it instead of buzzing at you.
                </>
              }
            />
            <div className="mt-7">
              <SafetyQuiz />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <CooperGuide pose="alert" label="Cooper’s Safety Tip" tone="gold">
              <p>
                A code that arrives on your phone is a key to your account.
                Nobody who is genuinely helping you will ever ask you to read it
                out.
              </p>
            </CooperGuide>

            <ComicPanel tone="blue" straight className="overflow-hidden p-5">
              <CooperArt
                pose="tablet"
                sizes="(max-width: 1024px) 70vw, 320px"
                className="mx-auto max-w-[280px]"
              />
              <p className="mt-3 border-t-[3px] border-ink/20 pt-3 text-sm leading-relaxed text-blue-50">
                Never share personal photos or videos with people you do not
                know. Tell a trusted adult if something does not feel right.
              </p>
            </ComicPanel>
          </div>
        </div>
      </section>

      {/* ============================== GROWN-UPS ============================== */}
      <section
        id="grown-ups"
        className="relative isolate scroll-mt-24 overflow-hidden bg-paper-2 py-12 sm:py-16"
      >
        <div className="shell">
          <SectionHeading
            kicker="For Grown-Ups"
            title="Parents, guardians and educators"
            intro={
              <>
                The practical version. What to change tonight, what to say
                before anything goes wrong, and how to react if it already has.
              </>
            }
          />

          <div className="mt-9 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* --- Printable family checklist --- */}
            <ComicPanel tone="white" label="Family Safety Checklist" tiltSeed="checklist">
              <div className="p-5 pt-12 sm:p-6 sm:pt-14">
                <p className="text-[0.95rem] leading-relaxed text-ink-2">
                  Print this, stick it on the fridge, work through it together.
                  It takes about an evening and it is the highest-value hour most
                  households will spend on this.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {familyChecklist.map((section) => (
                    <div key={section.section}>
                      <h3 className="font-display text-lg tracking-wide text-red-700 uppercase">
                        {section.section}
                      </h3>
                      <ul className="mt-2 flex flex-col gap-2">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm leading-snug">
                            <span
                              aria-hidden="true"
                              className="mt-0.5 h-4 w-4 shrink-0 border-2 border-ink bg-paper"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <p className="no-print mt-6 flex items-center gap-2 text-sm text-ink-3">
                  <Printer aria-hidden="true" className="h-4 w-4" />
                  Use your browser&rsquo;s print command. This page is styled to
                  print cleanly without the navigation.
                </p>
              </div>
            </ComicPanel>

            <div className="flex flex-col gap-5">
              <ComicPanel tone="blue" straight className="p-5 sm:p-6">
                <p className="font-comic text-xl tracking-wide text-gold-200">
                  The sentence that matters most
                </p>
                <p className="mt-2 text-lg leading-relaxed text-blue-50">
                  &ldquo;If anything ever happens online, you will not be in
                  trouble and I will not take your phone away. Just tell
                  me.&rdquo;
                </p>
                <p className="mt-3 text-sm leading-relaxed text-blue-100">
                  Say it out loud, before anything happens. Fear of losing the
                  device is the single most common reason children stay quiet -
                  and staying quiet is exactly what an offender is counting on.
                </p>
              </ComicPanel>

              <ComicPanel tone="white" straight className="p-5 sm:p-6">
                <h3 className="font-display text-xl tracking-wide uppercase">
                  If a child discloses something
                </h3>
                <ol className="prose-comic mt-3 text-[0.95rem]">
                  <li>Stay calm. Your first reaction sets everything that follows.</li>
                  <li>Thank them for telling you, and say clearly that they are not in trouble.</li>
                  <li>Do not delete anything. Screenshots and messages may matter.</li>
                  <li>Do not confront the other person or try to investigate yourself.</li>
                  <li>Contact law enforcement through their official channels.</li>
                  <li>If a child is in immediate danger, call 911.</li>
                </ol>
              </ComicPanel>

              <ComicPanel tone="white" straight className="p-5 sm:p-6">
                <School aria-hidden="true" className="h-8 w-8 text-blue-600" />
                <h3 className="mt-2 font-display text-xl tracking-wide uppercase">
                  Teachers and community groups
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">
                  Cooper visits schools, libraries and community organisations.
                  Sessions run roughly 30-45 minutes and include a live
                  demonstration plus an age-appropriate safety talk.
                </p>
                <Link href="/contact" className="btn btn-sm btn-blue mt-4">
                  Request a visit
                </Link>
              </ComicPanel>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= RESOURCES ============================= */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="Where to get help"
            title="Trusted resources"
            intro={
              <>
                Cooper&rsquo;s team only links to resources they have personally
                checked.
              </>
            }
          />

          <div className="mt-7">
            {approvedResources.length === 0 ? (
              <EmptyState title="This list is being finalised" pose="working">
                <p>
                  Cooper&rsquo;s team is verifying every organisation before
                  linking to it from a page written for children. Nothing goes
                  here until it has been checked.
                </p>
                <p className="mt-2">
                  In the meantime:{' '}
                  <strong>if a child is in immediate danger, call 911.</strong>{' '}
                  For anything that is not an emergency, contact your local law
                  enforcement agency through their official channels.
                </p>
              </EmptyState>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {approvedResources.map((r) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card card-hover flex h-full flex-col p-5"
                    >
                      <span className="badge badge-blue self-start">{r.audience}</span>
                      <span className="mt-2 flex items-center gap-1.5 font-display text-lg tracking-wide uppercase">
                        {r.name}
                        <ExternalLink aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="mt-1 text-sm leading-relaxed text-ink-2">
                        {r.description}
                      </span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            role="note"
            className="mt-7 flex items-start gap-3 ink bg-gold-200 p-5"
          >
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
            <p className="text-[0.95rem] leading-relaxed">
              <strong>{siteConfig.emergency.line}</strong>{' '}
              {siteConfig.emergency.action} Nothing you type into this website is
              sent to Cooper&rsquo;s team, to law enforcement, or to anyone else.
            </p>
          </div>
        </div>
      </section>

      {/* ============================== GLOSSARY ============================== */}
      <section className="bg-paper-2 py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="Cooper’s Dictionary"
            title="Words grown-ups use"
            intro={<>Short, plain definitions. Useful for homework, too.</>}
          />

          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((entry, i) => (
              <div
                key={entry.term}
                className="ink pop-sm bg-white p-4"
                style={{ rotate: i % 3 === 1 ? '0.7deg' : i % 3 === 2 ? '-0.6deg' : '0deg' }}
              >
                <dt className="flex items-center gap-2 font-display text-lg tracking-wide uppercase">
                  <BookOpen aria-hidden="true" className="h-4 w-4 text-red-600" />
                  {entry.term}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-2">
                  {entry.definition}
                </dd>
              </div>
            ))}
          </dl>

          <PawDivider className="mt-10" />

          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <ListChecks aria-hidden="true" className="h-9 w-9 text-blue-600" />
            <p className="max-w-xl text-lg font-bold">
              Learned something? Send this page to one other family. That is the
              whole ask.
            </p>
            <Link href="/social" className="btn btn-gold">
              Share Cooper&rsquo;s safety pages
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
