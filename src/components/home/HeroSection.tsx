import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, PawPrint } from 'lucide-react'
import { DonateButton } from '@/components/donate/DonateButton'
import { FollowButtons } from '@/components/social/FollowButtons'
import { ActionBurst } from '@/components/comic/ActionBurst'
import { TornEdge } from '@/components/comic/Decor'
import { siteConfig } from '@/config/site'

/**
 * The homepage hero.
 *
 * Everything a first-time visitor needs in one screen: who Cooper is, what he
 * does, and the three things we want them to do next - donate, follow, learn.
 */
export function HeroSection() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-blue-800">
      {/* Layered comic background: radiating speed lines over halftone dots. */}
      <div
        aria-hidden="true"
        className="speed-lines pointer-events-none absolute inset-0"
        style={{
          ['--speed-x' as string]: '72%',
          ['--speed-y' as string]: '30%',
          ['--speed-color' as string]: 'rgb(255 255 255 / 0.11)',
        }}
      />
      <div
        aria-hidden="true"
        className="benday pointer-events-none absolute inset-0 opacity-45"
        style={{
          ['--benday-color' as string]: 'rgb(0 0 0 / 0.32)',
          ['--benday-size' as string]: '9px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-950/60 to-transparent"
      />

      <div className="shell relative grid gap-8 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12 lg:pt-16 lg:pb-24">
        {/* ---- Copy ---- */}
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 border-[3px] border-ink bg-gold-300 px-3 py-1.5 font-comic text-base tracking-[0.08em] text-ink">
            <PawPrint aria-hidden="true" className="h-4 w-4" />
            Electronics Storage Device K9
          </p>

          <h1 className="mt-4">
            <span className="sr-only">
              ESD K9 Cooper. {siteConfig.tagline}
            </span>
            <span
              aria-hidden="true"
              className="block font-display text-[clamp(1.4rem,5vw,2.4rem)] leading-none tracking-[0.06em] text-gold-300 uppercase"
            >
              The amazing work of
            </span>
            <span
              aria-hidden="true"
              className="mt-1 block font-display text-hero leading-[1.02] text-paper uppercase"
              style={{
                textShadow:
                  '4px 4px 0 var(--color-red-500), 7px 7px 0 var(--color-ink)',
              }}
            >
              ESD K9
              <br />
              Cooper
            </span>
          </h1>

          <p
            aria-hidden="true"
            className="mt-6 inline-block -rotate-[1.2deg] border-[3px] border-ink bg-red-500 px-4 py-2.5 font-display text-[clamp(1.05rem,3.9vw,1.7rem)] tracking-wide text-white uppercase pop"
          >
            One Nose. One Mission.{' '}
            <span className="text-gold-300">Protect Children.</span>
          </p>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-blue-50 lg:min-h-[8.25rem]">
            Cooper is a yellow Labrador trained to find hidden electronics -
            phones, memory cards, USB drives - that people have deliberately
            tried to make disappear. He is a certified{' '}
            {siteConfig.program.sponsorShort} ESD K9, partnered with{' '}
            {siteConfig.handler.fullName} of the {siteConfig.agency.office} - and
            he teaches kids how to stay safe online.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <DonateButton placement="home-hero" size="lg" label="Support Cooper" />
            <Link href="/what-cooper-does" className="btn btn-lg btn-gold">
              What does he do?
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-5">
            <p className="mb-2.5 text-xs font-bold tracking-[0.16em] text-gold-200 uppercase">
              Follow Cooper&rsquo;s next adventure
            </p>
            <FollowButtons placement="home-hero" size="sm" />
          </div>
        </div>

        {/* ---- Art ---- */}
        <div className="relative mx-auto w-full max-w-lg lg:mt-16 lg:max-w-none">
          <div className="relative rotate-[1.4deg] border-[4px] border-ink bg-paper p-2 shadow-[10px_10px_0_var(--color-ink)] sm:p-2.5">
            <div className="relative aspect-[4/3] w-full overflow-hidden border-[3px] border-ink">
              <Image
                src="/images/cooper/cooper-portrait-vest.jpg"
                alt="ESD K9 Cooper, a yellow Labrador in his olive working harness with an electronics detection patch, looking up at the camera"
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 560px"
                className="object-cover object-[62%_38%]"
              />
              <div
                aria-hidden="true"
                className="halftone-fade pointer-events-none absolute inset-0"
                style={{
                  ['--benday-color' as string]: 'rgb(11 11 13 / 0.26)',
                  ['--halftone-dir' as string]: 'to top',
                  ['--halftone-stop' as string]: '32%',
                }}
              />
            </div>

            <p className="mt-2 px-1 pb-1 text-center font-comic text-lg tracking-wide text-ink">
              &ldquo;Not all heroes wear capes.&rdquo;
            </p>
          </div>

          <ActionBurst
            tone="gold"
            rotate={-11}
            className="absolute -top-7 -left-2 z-10 w-32 sm:-top-9 sm:-left-7 sm:w-44 lg:-left-12"
          >
            <span className="font-comic text-base leading-[1.05] sm:text-xl">
              Four paws
              <br />
              &amp; an
              <br />
              <span className="text-red-600">incredible</span>
              <br />
              nose
            </span>
          </ActionBurst>

          <p
            aria-hidden="true"
            className="sfx absolute -right-1 -bottom-5 rotate-[7deg] text-4xl sm:-right-4 sm:text-5xl"
          >
            SNIFF!
          </p>
        </div>
      </div>

      <TornEdge className="absolute inset-x-0 -bottom-px" />
    </section>
  )
}
