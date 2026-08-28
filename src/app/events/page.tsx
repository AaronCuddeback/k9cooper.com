import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, ShieldAlert } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { EventsBrowser } from '@/components/events/EventsBrowser'
import { CooperGuide } from '@/components/CooperGuide'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { StructuredData } from '@/components/StructuredData'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata, absoluteUrl } from '@/lib/seo'
import { splitEvents } from '@/content/events'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Events & Appearances',
  description:
    'Where to meet ESD K9 Cooper: school visits, community events, demonstrations, fundraisers and public safety appearances across El Dorado County.',
  path: '/events',
  keywords: ['K9 Cooper events', 'community K9 appearances', 'K9 demonstration'],
})

export default function EventsPage() {
  const { upcoming, past } = splitEvents()
  const publicUpcoming = upcoming.filter((e) => e.openToPublic)

  return (
    <>
      <PageHero
        kicker="Come meet me!"
        title={
          <>
            Events &amp;
            <br />
            appearances
          </>
        }
        intro={
          <>
            Cooper visits schools, libraries, community events and fundraisers.
            Here is where he will be next.
          </>
        }
        crumbs={[{ label: 'Events' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <h2 className="sr-only">Event listings</h2>

          <EventsBrowser upcoming={upcoming} past={past} />

          <div
            role="note"
            className="mt-8 flex items-start gap-3 border-[3px] border-ink bg-paper-2 p-4"
          >
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm leading-relaxed text-ink-2">
              Only public, approved appearances are listed here. Operational
              deployments and private bookings are never published, and locations
              for closed events are withheld on purpose.
            </p>
          </div>
        </div>
      </section>

      {/* ========================== REQUEST A VISIT ========================== */}
      <section className="relative isolate overflow-hidden bg-blue-800 py-12 on-dark sm:py-16">
        <div
          aria-hidden="true"
          className="benday pointer-events-none absolute inset-0 opacity-35"
          style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
        />
        <div className="shell relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              kicker="Request an appearance"
              tone="paper"
              title="Want Cooper at your school or event?"
              intro={
                <>
                  Schools, libraries, community organisations, public safety
                  events and fundraisers are all welcome to ask.
                </>
              }
            />

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                'Tell us your organisation and the date',
                'Roughly how many people will be there',
                'Indoor or outdoor, and the space available',
                'What you want the session to cover',
              ].map((item) => (
                <li
                  key={item}
                  className="border-2 border-blue-500 bg-blue-900 px-3.5 py-2.5 text-sm font-semibold text-blue-50"
                >
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-blue-200">
              Requests are subject to availability and approval, and Cooper&rsquo;s
              operational duties always come first. Please ask as far in advance
              as you can.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-gold">
                <Mail aria-hidden="true" className="h-5 w-5" />
                Request an appearance
              </Link>
              <a href={`mailto:${siteConfig.email}`} className="btn bg-white">
                Email Cooper&rsquo;s team
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <CooperArt
              pose="wave"
              sizes="(max-width: 1024px) 55vw, 260px"
              className="mx-auto max-w-[240px]"
            />
            <CooperGuide pose="duty" label="Mission Briefing" tone="white" stacked>
              <p>
                I do about thirty to forty-five minutes: a short talk, a live
                search demonstration, and then photos. Kids get the safety
                message, grown-ups get the practical version, everyone gets to
                meet a Labrador.
              </p>
            </CooperGuide>
          </div>
        </div>
      </section>

      {publicUpcoming.map((event) => (
        <StructuredData
          key={event.slug}
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
              ...(event.location.address
                ? { address: event.location.address }
                : {}),
            },
            description: event.summary,
            url: absoluteUrl(`/events/${event.slug}`),
            organizer: { '@type': 'Organization', name: siteConfig.name },
            ...(event.image ? { image: absoluteUrl(event.image.src) } : {}),
          }}
        />
      ))}
    </>
  )
}
