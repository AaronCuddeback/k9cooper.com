import type { Metadata } from 'next'
import Link from 'next/link'
import { Instagram } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { AdventureBrowser } from '@/components/adventures/AdventureBrowser'
import { CooperGuide } from '@/components/CooperGuide'
import { FollowButtons } from '@/components/social/FollowButtons'
import { EmptyState } from '@/components/ui/States'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata } from '@/lib/seo'
import { sortedAdventures } from '@/content/adventures'

export const metadata: Metadata = pageMetadata({
  title: 'Adventures & Mission Logs',
  description:
    'Training days, community visits, demonstrations and behind-the-scenes moments with ESD K9 Cooper. Cooper’s mission logs and field notes.',
  path: '/adventures',
  keywords: ['K9 Cooper mission logs', 'ESD K9 training blog'],
})

export default function AdventuresPage() {

  return (
    <>
      <PageHero
        kicker="Mission Logs"
        title={
          <>
            Cooper&rsquo;s
            <br />
            adventures
          </>
        }
        intro={
          <>
            Training days, school visits, community events and the occasional
            nap. The parts of the job we can talk about.
          </>
        }
        crumbs={[{ label: 'Adventures' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <h2 className="sr-only">All mission logs</h2>

          {sortedAdventures.length === 0 ? (
            <EmptyState title="No logs yet" pose="resting">
              <p>
                Cooper&rsquo;s first mission log is on its way. Follow him on
                Instagram in the meantime - that is where things land first.
              </p>
            </EmptyState>
          ) : (
            <AdventureBrowser adventures={sortedAdventures} />
          )}

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <CooperGuide pose="happy" label="Follow the adventure!" size="lg">
              <p className="text-lg">
                The short version of all of this lives on Instagram and TikTok -
                training clips, community visits, and me being extremely pleased
                about a tennis ball.
              </p>
            </CooperGuide>
            <div className="lg:w-72">
              <CooperArt
                pose="fly"
                sizes="(max-width: 1024px) 60vw, 280px"
                className="mx-auto mb-4 max-w-[260px]"
              />
              <FollowButtons placement="adventures" showHandle={false} />
              <Link href="/social" className="btn btn-sm btn-ghost mt-3 w-full">
                <Instagram aria-hidden="true" className="h-4 w-4" />
                Visit the Social Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
