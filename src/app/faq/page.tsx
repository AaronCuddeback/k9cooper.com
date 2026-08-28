import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, Mail } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { Accordion } from '@/components/ui/Accordion'
import { CooperGuide } from '@/components/CooperGuide'
import { DonateButton } from '@/components/donate/DonateButton'
import { StructuredData } from '@/components/StructuredData'
import { pageMetadata } from '@/lib/seo'
import { faqCategories, faqs } from '@/content/faqs'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Frequently Asked Questions',
  description:
    'What is an ESD K9? What can Cooper detect? Can he find a device that is turned off? How do we book a school visit? Answers to the questions Cooper’s team gets most.',
  path: '/faq',
  keywords: ['ESD K9 FAQ', 'electronic detection dog questions'],
})

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="Ask Cooper"
        title={
          <>
            Frequently asked
            <br />
            questions
          </>
        }
        intro={
          <>
            The things people ask most - answered plainly, and without
            overstating what a dog can do.
          </>
        }
        crumbs={[{ label: 'FAQ' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            {faqCategories.map((category) => {
              const items = faqs.filter((f) => f.category === category)
              if (items.length === 0) return null

              return (
                <div key={category} className="mb-10 last:mb-0">
                  <SectionHeading
                    as="h2"
                    kicker={category}
                    title={category}
                    className="[&>h2]:sr-only"
                  />
                  <div className="mt-4">
                    <Accordion
                      items={items.map((f) => ({
                        id: f.id,
                        question: f.question,
                        answer: (
                          <>
                            {f.answer.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </>
                        ),
                        flag: f.needsReview ? 'Pending expert review' : undefined,
                      }))}
                    />
                  </div>
                </div>
              )
            })}

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
                  This website cannot take reports
                </p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">
                  {siteConfig.emergency.line} {siteConfig.emergency.action} For a
                  non-emergency, contact your local law enforcement agency
                  directly through their official channels.
                </p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
            <CooperGuide pose="curious" label="Cooper says" tone="white" stacked>
              <p>
                Did not find your question? Ask my handler. Genuinely - people
                email good questions all the time and some of them end up on this
                page.
              </p>
            </CooperGuide>

            <div className="ink pop bg-white p-5">
              <h2 className="font-display text-lg tracking-wide uppercase">
                Still curious?
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {[
                  ['What Cooper does', '/what-cooper-does'],
                  ['The mission', '/mission'],
                  ['Safety HQ', '/safety-hq'],
                  ['Events and appearances', '/events'],
                  ['Support Cooper', '/support'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-block py-1 font-bold text-blue-600 underline decoration-2 underline-offset-4 hover:bg-gold-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${siteConfig.email}`} className="btn btn-sm mt-5 w-full">
                <Mail aria-hidden="true" className="h-4 w-4" />
                Email Cooper&rsquo;s team
              </a>
            </div>

            <div className="ink pop bg-red-500 p-5 text-white">
              <p className="font-comic text-xl tracking-wide text-gold-200">
                Help support my care
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-red-50">
                Vet visits, food, gear and travel. All of it keeps Cooper working.
              </p>
              <DonateButton
                placement="faq-sidebar"
                variant="gold"
                size="sm"
                className="mt-4 w-full"
              />
            </div>
          </aside>
        </div>
      </section>

      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer.join(' '),
            },
          })),
        }}
      />
    </>
  )
}
