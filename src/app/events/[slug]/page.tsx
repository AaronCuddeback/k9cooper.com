import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Accessibility,
  AlertTriangle,
  ArrowLeft,
  Clock,
  ExternalLink,
  MapPin,
  Users,
} from 'lucide-react'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { AddToCalendarButton } from '@/components/events/AddToCalendarButton'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { EventCard } from '@/components/cards/EventCard'
import { DonateButton } from '@/components/donate/DonateButton'
import { StructuredData } from '@/components/StructuredData'
import { DirectionsLink } from '@/components/events/DirectionsLink'
import { getEvent, publicEvents, splitEvents } from '@/content/events'
import { formatDate, formatTimeRange } from '@/lib/dates'
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
  const params = publicEvents.map((e) => ({ slug: e.slug }))
  return params.length > 0 ? params : [{ slug: 'none-published-yet' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) {
    return pageMetadata({ title: 'Not found', description: '', path: '/events', noIndex: true })
  }

  return pageMetadata({
    title: event.title,
    description: event.summary,
    path: `/events/${event.slug}`,
    ...(event.image ? { image: event.image.src, imageAlt: event.image.alt } : {}),
  })
}

const STATUS_MESSAGE: Record<string, string> = {
  cancelled: 'This event has been cancelled.',
  postponed: 'This event has been postponed. A new date will be posted here.',
  'sold-out': 'This event is full.',
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) notFound()

  const { upcoming } = splitEvents()
  const others = upcoming.filter((e) => e.slug !== slug).slice(0, 2)
  const url = absoluteUrl(`/events/${event.slug}`)

  return (
    <>
      <header className="on-dark relative isolate overflow-hidden bg-blue-800">
        {event.image ? (
          <div className="absolute inset-0">
            <Image
              src={event.image.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25"
            />
          </div>
        ) : null}
        <div
          aria-hidden="true"
          className="benday absolute inset-0 opacity-40"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.45)' }}
        />

        <div className="shell relative pt-8 pb-14 sm:pb-16">
          <Breadcrumbs
            crumbs={[{ label: 'Events', href: '/events' }, { label: event.title }]}
            tone="paper"
            className="mb-6"
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-gold">{event.category}</span>
            {!event.openToPublic ? (
              <span className="badge badge-muted">Private booking</span>
            ) : null}
            {event.isSample ? <span className="badge badge-red">Sample content</span> : null}
          </div>

          <h1 className="mt-4 max-w-3xl text-display text-paper uppercase">
            {event.title}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-50">
            {event.summary}
          </p>
        </div>
      </header>

      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            {event.status !== 'scheduled' ? (
              <div
                role="alert"
                className="mb-8 flex items-start gap-3 ink pop bg-red-100 p-5"
              >
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 h-6 w-6 shrink-0 text-red-600"
                />
                <div>
                  <p className="font-display text-xl tracking-wide text-red-700 uppercase">
                    {STATUS_MESSAGE[event.status] ?? 'This event has changed.'}
                  </p>
                  {event.statusNote ? (
                    <p className="mt-1.5 text-ink-2">{event.statusNote}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {event.image ? (
              <figure className="ink pop overflow-hidden bg-white">
                <Image
                  src={event.image.src}
                  alt={event.image.alt}
                  width={1400}
                  height={900}
                  sizes="(max-width: 1024px) 92vw, 720px"
                  className="h-auto w-full"
                />
              </figure>
            ) : null}

            {event.details && event.details.length > 0 ? (
              <div className="prose-comic mt-8">
                <h2 className="text-title uppercase">What to expect</h2>
                {event.details.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}

            {event.accessNote ? (
              <div className="mt-8 flex items-start gap-3 border-[3px] border-ink bg-paper-2 p-4">
                <Accessibility aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-display text-base tracking-wide uppercase">
                    Access &amp; attendance
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">
                    {event.accessNote}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-8 border-t-[3px] border-ink pt-6">
              <ShareButtons url={url} title={event.title} />
            </div>

            <Link href="/events" className="btn btn-sm btn-ghost mt-8">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              All events
            </Link>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
            <div className="ink pop bg-white p-5">
              <h2 className="font-display text-xl tracking-wide uppercase">Details</h2>
              {/*
                A <dl> may only contain <dt>/<dd>, or <div> wrappers that
                themselves contain only <dt>/<dd>. The icons therefore live
                inside the <dt> rather than in an extra wrapper element.
              */}
              <dl className="mt-4 grid gap-3.5 text-sm">
                <div>
                  <dt className="flex items-center gap-2 font-bold">
                    <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-red-600" />
                    When
                  </dt>
                  <dd className="mt-0.5 pl-6 text-ink-2">
                    <time dateTime={event.start}>{formatDate(event.start)}</time>
                    <br />
                    {formatTimeRange(event.start, event.end)}
                  </dd>
                </div>

                <div>
                  <dt className="flex items-center gap-2 font-bold">
                    <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-red-600" />
                    Where
                  </dt>
                  <dd className="mt-0.5 pl-6 text-ink-2">
                    {event.location.name}
                    {event.location.address ? (
                      <>
                        <br />
                        {event.location.address}
                      </>
                    ) : null}
                    {event.location.note ? (
                      <span className="mt-1 block text-xs text-ink-3">
                        {event.location.note}
                      </span>
                    ) : null}
                  </dd>
                </div>

                <div>
                  <dt className="flex items-center gap-2 font-bold">
                    <Users aria-hidden="true" className="h-4 w-4 shrink-0 text-red-600" />
                    Who can come
                  </dt>
                  <dd className="mt-0.5 pl-6 text-ink-2">
                    {event.openToPublic
                      ? 'Open to the public - just turn up.'
                      : 'Closed event. Invited attendees only.'}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-2.5">
                <AddToCalendarButton event={event} variant="blue" className="w-full" />
                <DirectionsLink event={event} />
                {event.externalUrl && !event.externalUrl.startsWith('[') ? (
                  <a
                    href={event.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost w-full"
                  >
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    {event.externalLabel ?? 'More information'}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="ink pop bg-red-500 p-5 text-white">
              <p className="font-comic text-xl tracking-wide text-gold-200">
                Meeting Cooper
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-red-50">
                If his harness is on, he is working. Always ask his handler before
                saying hello - and then, usually, yes.
              </p>
              <DonateButton
                placement="event-sidebar"
                variant="gold"
                size="sm"
                className="mt-4 w-full"
              />
            </div>

            {others.length > 0 ? (
              <div>
                <h2 className="font-display text-lg tracking-wide uppercase">
                  Also coming up
                </h2>
                <ul className="mt-3 flex flex-col gap-4">
                  {others.map((e) => (
                    <li key={e.slug}>
                      <EventCard event={e} compact />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: event.title,
          startDate: event.start,
          ...(event.end ? { endDate: event.end } : {}),
          eventStatus:
            event.status === 'cancelled'
              ? 'https://schema.org/EventCancelled'
              : event.status === 'postponed'
                ? 'https://schema.org/EventPostponed'
                : 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: event.location.name,
            ...(event.location.address ? { address: event.location.address } : {}),
          },
          description: event.summary,
          url,
          organizer: { '@type': 'Organization', name: siteConfig.name },
          ...(event.image ? { image: absoluteUrl(event.image.src) } : {}),
        }}
      />
    </>
  )
}
