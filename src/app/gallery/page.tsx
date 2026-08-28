import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { VideoFacade } from '@/components/media/VideoFacade'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { FollowButtons } from '@/components/social/FollowButtons'
import { CooperGuide } from '@/components/CooperGuide'
import { pageMetadata } from '@/lib/seo'
import { galleryItems } from '@/content/gallery'
import { videos } from '@/content/videos'

export const metadata: Metadata = pageMetadata({
  title: 'Gallery',
  description:
    'Photos and videos of ESD K9 Cooper at work, in training, at community events and off duty. Plus the comic artwork used in Cooper’s classroom materials.',
  path: '/gallery',
  image: '/images/cooper/cooper-portrait-vest.jpg',
  keywords: ['K9 Cooper photos', 'ESD K9 gallery'],
})

export default function GalleryPage() {
  return (
    <>
      <PageHero
        kicker="The Gallery"
        title={
          <>
            Cooper,
            <br />
            in pictures
          </>
        }
        intro={
          <>
            At work, in training, at community events and comprehensively off
            duty.
          </>
        }
        crumbs={[{ label: 'Gallery' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <GalleryGrid items={galleryItems} />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-blue-800 py-12 on-dark sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-35"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
        />
        <div className="shell relative">
          <SectionHeading
            kicker="Watch"
            tone="paper"
            title="Cooper on video"
            intro={
              <>
                Nothing loads from a video platform until you press play. That
                keeps the page quick and keeps third-party cookies off the site.
              </>
            }
          />

          <ul className="mt-8 grid gap-6 lg:grid-cols-2">
            {videos.map((video) => (
              <li key={video.id}>
                <VideoFacade video={video} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <CooperGuide pose="happy" label="Follow the adventure!" size="lg">
            <p className="text-lg">
              New photos land on Instagram before they land here. Come find me -
              I post a lot, and roughly a third of it is me asleep.
            </p>
          </CooperGuide>
          <div className="lg:w-80">
            <FollowButtons placement="gallery" showHandle={false} />
          </div>
        </div>
      </section>
    </>
  )
}
