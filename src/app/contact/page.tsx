import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  GraduationCap,
  Handshake,
  Mail,
  Megaphone,
  Phone,
  ShieldAlert,
  ShoppingBag,
} from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ContactForm } from '@/components/contact/ContactForm'
import { CooperGuide } from '@/components/CooperGuide'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Get in touch with ESD K9 Cooper’s team about school visits, community appearances, law enforcement collaboration, sponsorship, merchandise or media enquiries.',
  path: '/contact',
  keywords: ['book K9 Cooper', 'K9 school visit request', 'contact ESD K9 Cooper'],
})

const REASONS = [
  {
    icon: GraduationCap,
    title: 'School & classroom visits',
    body: 'Assemblies, classroom sessions and demonstrations for students of any age.',
  },
  {
    icon: Building2,
    title: 'Community presentations',
    body: 'Libraries, community groups, faith organisations, parent evenings and public safety events.',
  },
  {
    icon: ShieldAlert,
    title: 'Law enforcement collaboration',
    body: 'Agencies interested in ESD K9 capability, joint training or mutual aid.',
  },
  {
    icon: Handshake,
    title: 'Sponsorship',
    body: 'Veterinary practices, food and equipment suppliers, and local businesses.',
  },
  {
    icon: ShoppingBag,
    title: 'Merchandise questions',
    body: 'Orders, bulk requests and questions about the shop.',
  },
  {
    icon: Megaphone,
    title: 'Media enquiries',
    body: 'Interviews, photography and press. Please include your outlet and deadline.',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Get in touch"
        title={
          <>
            Contact
            <br />
            Cooper&rsquo;s team
          </>
        }
        intro={
          <>
            Bookings, sponsorship, media and general questions all come to the
            same inbox - and a real person reads them.
          </>
        }
        crumbs={[{ label: 'Contact' }]}
      >
        <a href={`mailto:${siteConfig.email}`} className="btn btn-gold btn-lg">
          <Mail aria-hidden="true" className="h-5 w-5" />
          {siteConfig.email}
        </a>
      </PageHero>

      {/* ============================ EMERGENCY ============================ */}
      <section className="border-b-[4px] border-ink bg-red-500 py-6 text-white">
        <div className="shell flex items-start gap-3">
          <Phone aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-gold-300" />
          <p className="text-[0.98rem] leading-relaxed">
            <strong className="font-extrabold">
              This page is not for emergencies or crime reports.
            </strong>{' '}
            If a child is in immediate danger, call 911. For a non-emergency,
            contact your local law enforcement agency through their official
            channels. Nothing sent here reaches an emergency service.
          </p>
        </div>
      </section>

      {/* ============================== REASONS ============================== */}
      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            kicker="What can we help with?"
            title="Reasons people write in"
          />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((reason) => (
              <li key={reason.title}>
                <ComicPanel
                  as="article"
                  tone="white"
                  tiltSeed={reason.title}
                  className="h-full p-4"
                >
                  <reason.icon aria-hidden="true" className="h-6 w-6 text-blue-600" />
                  <h3 className="mt-2 font-display text-base tracking-wide uppercase">
                    {reason.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{reason.body}</p>
                </ComicPanel>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================== THE FORM ============================== */}
      <section className="bg-paper-2 py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
          <div className="min-w-0">
            <SectionHeading
              kicker="Send a message"
              title="Write to Cooper’s handler"
              intro={
                <>
                  Fill this in and it opens a tidy, pre-written email in your own
                  app. Nothing is submitted to this website.
                </>
              }
            />
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
            <CooperGuide pose="alert" label="Cooper says" tone="white" stacked>
              <p>
                Booking a visit? Tell us the date first. My calendar fills up and
                my day job always wins.
              </p>
            </CooperGuide>

            <div className="ink pop bg-white p-5">
              <h2 className="font-display text-lg tracking-wide uppercase">
                Prefer plain email?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                Skip the form entirely and write to us directly.
              </p>
              <a href={`mailto:${siteConfig.email}`} className="btn btn-sm mt-4 w-full">
                <Mail aria-hidden="true" className="h-4 w-4" />
                {siteConfig.email}
              </a>
            </div>

            <div className="ink pop bg-blue-700 p-5 on-dark text-blue-50">
              <h2 className="font-display text-lg tracking-wide text-gold-300 uppercase">
                Response times
              </h2>
              <p className="mt-2 text-sm leading-relaxed">
                Cooper&rsquo;s handler answers email between operational duties, so
                please allow a little time. Appearance requests are subject to
                availability and approval.
              </p>
            </div>

            <div className="ink pop bg-white p-5">
              <h2 className="font-display text-lg tracking-wide uppercase">
                Your privacy
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                This site has no database and no form backend. It cannot store
                what you type. Read the full{' '}
                <Link
                  href="/privacy"
                  className="font-bold text-blue-600 underline decoration-2 underline-offset-4"
                >
                  privacy notice
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
