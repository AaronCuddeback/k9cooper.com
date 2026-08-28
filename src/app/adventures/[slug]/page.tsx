import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays } from 'lucide-react'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { BlockRenderer } from '@/components/content/BlockRenderer'
import { AdventureCard } from '@/components/cards/AdventureCard'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { VideoFacade } from '@/components/media/VideoFacade'
import { DonateButton } from '@/components/donate/DonateButton'
import { StructuredData } from '@/components/StructuredData'
import { PawDivider } from '@/components/comic/Decor'
import { adventures, getAdventure, relatedAdventures } from '@/content/adventures'
import { formatDate } from '@/lib/dates'
import { absoluteUrl, pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site'

/*
  `output: 'export'` requires at least one param here, and treats an empty
  array as if this function were missing - which fails the build. While there
  is no published content, emit one throwaway slug: the page calls notFound()
  for any slug it does not recognise, so it renders as a 404 and nothing links
  to it. As soon as one real entry exists this returns the real list instead.
*/
export function generateStaticParams() {
  const params = adventures.map((a) => ({ slug: a.slug }))
  return params.length > 0 ? params : [{ slug: 'none-published-yet' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const adventure = getAdventure(slug)
  if (!adventure) return pageMetadata({ title: 'Not found', description: '', path: '/adventures', noIndex: true })

  return pageMetadata({
    title: adventure.title,
    description: adventure.summary,
    path: `/adventures/${adventure.slug}`,
    image: adventure.cover.src,
    imageAlt: adventure.cover.alt,
    type: 'article',
    publishedTime: adventure.date,
  })
}

export default async function AdventurePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const adventure = getAdventure(slug)
  if (!adventure) notFound()

  const related = relatedAdventures(slug)
  const url = absoluteUrl(`/adventures/${adventure.slug}`)

  return (
    <>
      <article>
        {/* ---- Cover ---- */}
        <header className="on-dark relative isolate overflow-hidden bg-blue-800">
          <div className="absolute inset-0">
            <Image
              src={adventure.cover.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
          </div>
          <div
            aria-hidden="true"
            className="benday absolute inset-0 opacity-45"
            style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.5)' }}
          />

          <div className="shell relative pt-8 pb-14 sm:pb-16">
            <Breadcrumbs
              crumbs={[{ label: 'Adventures', href: '/adventures' }, { label: adventure.title }]}
              tone="paper"
              className="mb-6"
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-red">{adventure.category}</span>
              {adventure.isSample ? (
                <span className="badge badge-gold">Sample content</span>
              ) : null}
            </div>

            <h1 className="mt-4 max-w-3xl text-display text-paper uppercase">
              {adventure.title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm font-bold tracking-wider text-gold-200 uppercase">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              <time dateTime={adventure.date}>{formatDate(adventure.date)}</time>
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-50">
              {adventure.summary}
            </p>
          </div>
        </header>

        {/* ---- Body ---- */}
        <div className="newsprint py-12 sm:py-16">
          <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div className="min-w-0">
              <figure className="ink pop overflow-hidden bg-white">
                <Image
                  src={adventure.cover.src}
                  alt={adventure.cover.alt}
                  width={1400}
                  height={900}
                  sizes="(max-width: 1024px) 92vw, 720px"
                  className="h-auto w-full"
                />
              </figure>

              <div className="mt-8">
                <BlockRenderer blocks={adventure.body} />
              </div>

              {adventure.video ? (
                <div className="mt-8">
                  <VideoFacade
                    video={{
                      id: adventure.slug,
                      provider: adventure.video.provider,
                      videoId: adventure.video.id,
                      title: adventure.video.title,
                      description: `From the mission log: ${adventure.title}`,
                      poster: adventure.video.poster ?? adventure.cover.src,
                    }}
                  />
                </div>
              ) : null}

              {adventure.gallery && adventure.gallery.length > 0 ? (
                <section className="mt-10" aria-labelledby="log-photos">
                  <h2 id="log-photos" className="text-title uppercase">
                    From the day
                  </h2>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {adventure.gallery.map((photo) => (
                      <li key={photo.src}>
                        <figure className="ink pop-sm overflow-hidden bg-white">
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            width={900}
                            height={700}
                            sizes="(max-width: 640px) 92vw, 350px"
                            className="h-auto w-full"
                          />
                        </figure>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="mt-10 border-t-[3px] border-ink pt-6">
                <ShareButtons url={url} title={adventure.title} />
              </div>

              <Link href="/adventures" className="btn btn-sm btn-ghost mt-8">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                All mission logs
              </Link>
            </div>

            {/* ---- Sidebar ---- */}
            <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
              <div className="ink pop bg-red-500 p-5 text-white">
                <p className="font-comic text-xl tracking-wide text-gold-200">
                  Help support my care
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-red-50">
                  Food, veterinary care, training supplies and safety gear. It all
                  adds up, and it all keeps Cooper working.
                </p>
                <DonateButton
                  placement="adventure-sidebar"
                  variant="gold"
                  size="sm"
                  className="mt-4 w-full"
                />
              </div>

              {related.length > 0 ? (
                <div>
                  <h2 className="font-display text-lg tracking-wide uppercase">
                    More logs
                  </h2>
                  <ul className="mt-3 flex flex-col gap-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <AdventureCard adventure={r} tilt={false} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>

          <PawDivider className="mt-12" />
        </div>
      </article>

      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: adventure.title,
          description: adventure.summary,
          datePublished: adventure.date,
          image: absoluteUrl(adventure.cover.src),
          author: { '@type': 'Organization', name: siteConfig.name },
          publisher: { '@type': 'Organization', name: siteConfig.name },
          mainEntityOfPage: url,
        }}
      />
    </>
  )
}
