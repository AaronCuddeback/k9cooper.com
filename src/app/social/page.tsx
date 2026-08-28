import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Download } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { SocialPostCard } from '@/components/social/SocialEmbed'
import { FollowButtons } from '@/components/social/FollowButtons'
import { VideoFacade } from '@/components/media/VideoFacade'
import { CooperGuide } from '@/components/CooperGuide'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { pageMetadata, absoluteUrl } from '@/lib/seo'
import { featuredPosts } from '@/content/social'
import { videos } from '@/content/videos'
import { activeSocialAccounts } from '@/config/social'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Social Hub',
  description:
    'Follow ESD K9 Cooper on Instagram and TikTok at @esdk9_cooper. Training clips, community visits, safety tips and shareable graphics.',
  path: '/social',
  keywords: ['esdk9_cooper', 'K9 Cooper Instagram', 'K9 Cooper TikTok'],
})

/** Shareable graphics visitors can download and post themselves. */
const SHAREABLES = [
  {
    src: '/images/comic/cooper-comic-poster.jpg',
    download: 'esd-k9-cooper-poster.jpg',
    title: 'The Cooper poster',
    body: 'The full educational poster. Good for classrooms, noticeboards and community centres.',
    alt: 'The ESD K9 Cooper educational comic poster',
    width: 1086,
    height: 1448,
  },
  {
    src: '/images/comic/cooper-sticker-hide-the-thing.jpg',
    download: 'esd-k9-cooper-hide-the-thing.jpg',
    title: '"Hide the thing" graphic',
    body: 'Cooper’s job description in three lines. Square, so it posts cleanly.',
    alt: 'Sticker artwork of Cooper searching, reading Hide the thing, I find the thing, I get the food',
    width: 900,
    height: 900,
  },
  {
    src: '/images/comic/panel-kids-online.jpg',
    download: 'esd-k9-cooper-safety-panel.jpg',
    title: 'Safety reminder panel',
    body: 'Stay safe. Stay smart. Speak up. Short enough for a story post.',
    alt: 'Comic panel of children with a tablet and the caption What You Can Do',
    width: 366,
    height: 196,
  },
]

export default function SocialPage() {
  /*
    Hand-picked posts from src/content/social.ts. There is no live feed: reading
    an account's own posts requires Instagram's professional-account API, and
    this account is a personal one. Everything here is therefore static, which
    also means the page cannot break because of a third party.
  */
  const posts = featuredPosts

  return (
    <>
      <PageHero
        kicker="Social Hub"
        title={
          <>
            Follow Cooper&rsquo;s
            <br />
            next adventure
          </>
        }
        intro={
          <>
            Training clips, community visits, safety reminders and a genuinely
            unreasonable number of naps. Same handle on both:{' '}
            <strong className="text-gold-300">@esdk9_cooper</strong>
          </>
        }
        crumbs={[{ label: 'Social Hub' }]}
      />
      {/*
        No follow buttons in the hero on purpose: the two account panels
        directly below are the same two links, larger and with more context.
      */}

      {/* ============================== ACCOUNTS ============================== */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-5 sm:grid-cols-2">
            {activeSocialAccounts.map((account) => (
              <ComicPanel
                key={account.platform}
                as="article"
                tone={account.platform === 'tiktok' ? 'ink' : 'red'}
                tiltSeed={account.platform}
                className="flex flex-col p-6"
              >
                <p className="font-comic text-2xl tracking-wide text-gold-300">
                  {account.label}
                </p>
                <p className="mt-1 font-display text-3xl tracking-wide uppercase">
                  {account.handle}
                </p>
                <p className="mt-3 flex-1 leading-relaxed opacity-90">
                  {account.platform === 'instagram'
                    ? 'Photos, stories, event announcements and the day-to-day of a working K9.'
                    : 'Short video: searches, training, safety tips and Cooper being extremely Labrador.'}
                </p>
                <a
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold mt-5"
                >
                  {account.cta}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </ComicPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= SOCIAL WALL ============================= */}
      <section className="relative isolate overflow-hidden bg-paper-2 py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="Featured posts"
            title="From Cooper’s feed"
            intro={
              <>
                Hand-picked posts. Tap any card to open the real thing on
                Instagram or TikTok.
              </>
            }
          />

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <SocialPostCard post={post} className="h-full" />
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="text-sm leading-relaxed text-ink-3">
              <strong>Why these are cards and not platform embeds:</strong>{' '}
              Instagram&rsquo;s own embed widget loads a lot of third-party
              JavaScript, gets blocked by common privacy settings, and breaks
              without warning. Cards always work, always match the site, and
              never let Instagram see you before you choose to click.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ LATEST VIDEO ============================ */}
      <section className="on-dark relative isolate overflow-hidden bg-blue-800 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-35"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
        />
        <div className="shell relative">
          <SectionHeading kicker="Latest video" tone="paper" title="Watch Cooper work" />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {videos.slice(0, 2).map((video) => (
              <VideoFacade key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================= SHAREABLES ============================= */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="Spread the word"
            title="Shareable Cooper graphics"
            intro={
              <>
                Free to download and post. If you use one, tagging{' '}
                <strong>@esdk9_cooper</strong> helps more families find the
                safety material.
              </>
            }
          />

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SHAREABLES.map((item) => (
              <li key={item.src}>
                <ComicPanel
                  as="article"
                  tone="white"
                  tiltSeed={item.title}
                  className="flex h-full flex-col overflow-hidden"
                >
                  <div className="border-b-[3px] border-ink bg-paper-2">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      sizes="(max-width: 640px) 92vw, 360px"
                      className="mx-auto h-56 w-auto max-w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-lg tracking-wide uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-2">
                      {item.body}
                    </p>
                    <a href={item.src} download={item.download} className="btn btn-sm mt-4">
                      <Download aria-hidden="true" className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </ComicPanel>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-ink-3">
            These graphics are free to download and share for education and
            community awareness. Please do not alter them or use them to imply
            endorsement of a product, business or campaign.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <CooperGuide pose="happy" label="Follow the adventure!" size="lg">
              <p className="text-lg">
                Every follow puts the safety message in front of another family.
                That is genuinely the cheapest way to help me do my job.
              </p>
            </CooperGuide>
            <div className="flex flex-col gap-3 lg:w-72">
              <FollowButtons placement="social-footer" showHandle={false} />
              <ShareButtons
                url={absoluteUrl('/social')}
                title={`Follow ${siteConfig.name}`}
                label="Or send this page on"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/gallery" className="btn btn-ghost">
              See the full gallery
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

