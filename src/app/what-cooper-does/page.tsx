import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AlertTriangle, ArrowRight, Search, ShieldCheck } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { ScentTrail } from '@/components/mission/ScentTrail'
import { CooperGuide } from '@/components/CooperGuide'
import { TornEdge } from '@/components/comic/Decor'
import { DonateButton } from '@/components/donate/DonateButton'
import { StructuredData } from '@/components/StructuredData'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata } from '@/lib/seo'
import { deviceTypes, searchEnvironments } from '@/content/cooper'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'What Cooper Does',
  description:
    'How an Electronics Storage Detection K9 works: what ESD means, what Cooper is trained to find, the odour he follows, where he can search, and what happens after he alerts his handler.',
  path: '/what-cooper-does',
  keywords: [
    'how does an ESD K9 work',
    'TPPO detection dog',
    'electronic storage detection',
  ],
})

export default function WhatCooperDoesPage() {
  return (
    <>
      <PageHero
        kicker="Mission Briefing"
        title={
          <>
            How Cooper
            <br />
            finds the unfindable
          </>
        }
        intro={
          <>
            Cooper is not looking for metal, batteries or a signal. He is
            following a smell - and he is very, very good at it.
          </>
        }
        crumbs={[{ label: 'What Cooper Does' }]}
      />

      {/* ============================ THE BASICS ============================ */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              kicker="Cooper’s Superpower"
              title={<>His nose</>}
              intro={
                <>
                  A human nose has roughly six million scent receptors. A
                  Labrador has a couple of hundred million, wired into a much
                  larger chunk of brain. That difference is the whole job.
                </>
              }
            />

            <div className="prose-comic mt-5">
              <p>
                <strong>ESD stands for Electronics Storage Detection.</strong>{' '}
                Cooper is trained to locate electronics that someone has
                deliberately hidden - the kind of device that a person searching
                a room by hand could easily walk straight past.
              </p>
              <p>
                Manufacturing certain electronic components leaves behind trace
                amounts of a chemical compound - commonly identified as
                triphenylphosphine oxide, or TPPO. It is present in quantities
                far too small for a person to notice. Cooper was taught that this
                specific smell means a reward is coming, so he goes hunting for
                it.
              </p>
              <p>
                That is why a device being switched off, out of battery, water
                damaged or completely broken makes no difference at all. The
                smell is still there.
              </p>
              <p>
                Learning it took Cooper six months at{' '}
                <a
                  href={siteConfig.program.trainerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-gold-400 decoration-[3px] underline-offset-4 hover:text-blue-700"
                >
                  {siteConfig.program.trainer}
                </a>
                , then two more weeks at the{' '}
                {siteConfig.program.certifiedAt} learning to do it alongside{' '}
                {siteConfig.handler.showName
                  ? siteConfig.handler.fullName
                  : 'his handler'}
                . A dog who can find the odour is only half of a team that can
                work a real search.
              </p>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
                What Cooper is trained to find
              </p>
              <ul className="flex flex-wrap gap-2">
                {deviceTypes.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-1.5 border-2 border-ink bg-white px-3 py-1.5 text-sm font-bold"
                  >
                    <Search aria-hidden="true" className="h-3.5 w-3.5 text-red-600" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="relative">
              <CooperArt
                pose="searching"
                priority
                sizes="(max-width: 1024px) 85vw, 420px"
                alt="Cooper working nose-down over a hidden phone and hard drive"
              />
              <p
                aria-hidden="true"
                className="sfx absolute top-2 right-0 rotate-[8deg] text-3xl sm:text-4xl"
              >
                SNIFF!
              </p>
            </div>

            {/*
              Matted rather than stretched: this panel is cropped from the
              supplied poster (1086px wide), so displaying it above its native
              size would only upscale it. See docs/ASSETS.md.
            */}
            <ComicPanel tone="paper" tiltSeed="how-works" className="overflow-hidden p-3">
              <Image
                src="/images/comic/panel-how-it-works.jpg"
                alt="Comic panel showing Cooper nose-down following a green scent trail toward a phone lying on the ground, with the sound effect Sniff! Sniff!"
                width={344}
                height={284}
                sizes="344px"
                className="mx-auto h-auto w-full max-w-[344px] border-2 border-ink"
              />
            </ComicPanel>

            <CooperGuide pose="curious" label="Super Sniffer Fact" tone="white">
              <p>
                I cannot smell electricity, and I have no idea what is on your
                phone. I smell the chemistry inside it. That is the whole trick.
              </p>
            </CooperGuide>
          </div>
        </div>
      </section>

      {/* ========================== THE FIVE STEPS ========================== */}
      <section
        className="relative isolate overflow-hidden bg-paper-2 py-12 sm:py-16"
        aria-labelledby="five-steps"
      >
        <div className="shell relative">
          <SectionHeading
            id="five-steps"
            kicker="Case File"
            title="A search, step by step"
            intro={
              <>
                Five stages, from the call coming in to the device being
                recovered. Switch between the kid-friendly version and the
                detail for grown-ups.
              </>
            }
          />

          <div className="mt-8">
            <ScentTrail />
          </div>
        </div>
      </section>

      {/* ========================== WHERE HE SEARCHES ========================== */}
      <section className="on-dark relative isolate overflow-hidden bg-blue-700 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="speed-lines pointer-events-none absolute inset-0"
          style={{
            ['--speed-x' as string]: '50%',
            ['--speed-y' as string]: '0%',
            ['--speed-color' as string]: 'rgb(255 255 255 / 0.09)',
          }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Where Cooper Searches"
            tone="paper"
            align="center"
            title="Five environments, one nose"
          />

          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {searchEnvironments.map((env) => (
              <li key={env.id}>
                <ComicPanel
                  as="article"
                  tone="paper"
                  tiltSeed={`wcd-${env.id}`}
                  className="h-full overflow-hidden"
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={env.image.src}
                      alt={env.image.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 220px"
                      className="object-cover"
                    />
                  </div>
                  <div className="border-t-[3px] border-ink p-3.5">
                    <h3 className="font-display text-lg tracking-wide uppercase">
                      {env.title}
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-ink-2">{env.body}</p>
                  </div>
                </ComicPanel>
              </li>
            ))}
          </ul>
        </div>
        <TornEdge className="absolute inset-x-0 -bottom-px" />
      </section>

      {/* ============================ THE LIMITS ============================ */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-2">
          <ComicPanel tone="white" label="What Cooper does not do" labelTone="red" straight>
            <div className="p-5 pt-12 sm:p-6 sm:pt-14">
              <ul className="prose-comic">
                <li>
                  <strong>He does not read devices.</strong> Cooper finds a
                  phone. He has no idea what is on it, and neither does anyone
                  else until it is examined properly.
                </li>
                <li>
                  <strong>He does not decide what anything means.</strong> An
                  alert tells his handler where a device is. Whether it matters
                  is a question for trained investigators, not for a dog.
                </li>
                <li>
                  <strong>He does not create legal authority.</strong> Cooper
                  works inside searches that are already lawful. He is a tool
                  within that process, never a shortcut around it.
                </li>
                <li>
                  <strong>He does not detect drugs or explosives.</strong>{' '}
                  Different training, different dog. Cooper does electronics.
                </li>
              </ul>
            </div>
          </ComicPanel>

          <div className="flex flex-col gap-5">
            <div
              role="note"
              className="flex items-start gap-3 ink pop bg-gold-200 p-5"
            >
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 h-6 w-6 shrink-0 text-red-600"
              />
              <div>
                <p className="font-display text-lg tracking-wide uppercase">
                  About the detail on this page
                </p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">
                  This page explains Cooper&rsquo;s work in general terms on
                  purpose. It does not describe search tactics, deployment
                  procedures, training thresholds or anything else that would
                  help a person conceal a device.
                </p>
              </div>
            </div>

            <ComicPanel tone="blue" straight className="p-5 sm:p-6">
              <p className="font-comic text-xl tracking-wide text-gold-300">
                Why it is worth it
              </p>
              <p className="mt-2 leading-relaxed text-blue-50">
                A search of a house by hand can take hours and still miss a
                memory card the size of a fingernail. Cooper covers the same
                room in minutes and tells his handler exactly where to look.
                That is the difference between evidence being found and evidence
                staying hidden.
              </p>
              <Link href="/mission" className="btn btn-sm btn-gold mt-5">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Why this mission matters
              </Link>
            </ComicPanel>
          </div>
        </div>

        <div className="shell mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/safety-hq" className="btn btn-gold">
            Kids: learn to stay safe online
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
          <Link href="/faq" className="btn btn-ghost">
            Read the FAQ
          </Link>
          <DonateButton placement="what-cooper-does-footer" />
        </div>
      </section>

      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is an ESD K9?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'ESD stands for Electronics Storage Detection. An ESD K9 is a dog trained to locate hidden electronics such as phones, tablets, memory cards, USB drives and hard drives.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can an ESD K9 find a device that is turned off?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Detection is based on odour rather than power, so a device that is switched off, out of battery or broken still carries the same scent.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does Cooper read the devices he finds?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: `No. Cooper locates a device and alerts his handler. Recovery, examination and any evidentiary determination are made by trained investigators. ${siteConfig.name}.`,
              },
            },
          ],
        }}
      />
    </>
  )
}
