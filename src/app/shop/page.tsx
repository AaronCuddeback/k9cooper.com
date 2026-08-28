import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Info, ShoppingBag } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { SectionHeading } from '@/components/comic/SectionHeading'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { CooperGuide } from '@/components/CooperGuide'
import { DonateButton } from '@/components/donate/DonateButton'
import { StructuredData } from '@/components/StructuredData'
import { MerchBuyLink } from '@/components/shop/MerchBuyLink'
import { CooperArt } from '@/components/CooperArt'
import { pageMetadata, absoluteUrl } from '@/lib/seo'
import { merchItems, proceedsNote, isBuyable } from '@/content/merch'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = pageMetadata({
  title: 'Shop',
  description:
    'ESD K9 Cooper stickers, patches, posters and apparel. Wear the mission and help start the conversation about online safety.',
  path: '/shop',
  keywords: ['K9 Cooper merchandise', 'ESD K9 stickers', 'police K9 patch'],
})

const STATUS_BADGE = {
  available: { label: 'Available', cls: 'badge-green' },
  'coming-soon': { label: 'Coming soon', cls: 'badge-gold' },
  'sold-out': { label: 'Sold out', cls: 'badge-muted' },
} as const

export default function ShopPage() {
  const anyBuyable = merchItems.some(isBuyable)

  return (
    <>
      <PageHero
        kicker="Cooper’s Shop"
        title={
          <>
            Wear
            <br />
            the mission
          </>
        }
        intro={
          <>
            Stickers, patches, posters and apparel. Every one of them is a
            conversation starter about the thing Cooper actually cares about.
          </>
        }
        crumbs={[{ label: 'Shop' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell">
          {!anyBuyable ? (
            <div
              role="note"
              className="mb-8 flex items-start gap-3 border-[3px] border-ink bg-gold-200 p-4"
            >
              <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="text-sm leading-relaxed">
                <p className="font-bold">The shop is not open yet.</p>
                <p className="mt-1 text-ink-2">
                  Everything below is in preparation. Follow Cooper on Instagram
                  and you will hear the moment it goes live - or{' '}
                  <Link
                    href="/support"
                    className="font-bold text-blue-700 underline decoration-2 underline-offset-4"
                  >
                    support him directly
                  </Link>{' '}
                  in the meantime.
                </p>
              </div>
            </div>
          ) : null}

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {merchItems.map((item) => {
              const status = STATUS_BADGE[item.status]
              const buyable = isBuyable(item)

              return (
                <li key={item.id}>
                  <ComicPanel
                    as="article"
                    tone="white"
                    tiltSeed={item.id}
                    className="flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative aspect-square border-b-[3px] border-ink bg-paper-2">
                      <Image
                        src={item.images[0].src}
                        alt={item.images[0].alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
                        className={cn(
                          'p-3',
                          item.id === 'cooper-patch' ? 'object-contain' : 'object-cover',
                        )}
                      />
                      <span className={cn('badge absolute top-2.5 left-2.5', status.cls)}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <span className="badge badge-muted self-start">{item.category}</span>
                      <h2 className="mt-2 font-display text-lg leading-tight tracking-wide uppercase">
                        {item.name}
                      </h2>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-2">
                        {item.description}
                      </p>

                      {item.variants ? (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {item.variants.map((v) => (
                            <li
                              key={v}
                              className="border-2 border-ink bg-paper-2 px-2 py-0.5 text-xs font-bold"
                            >
                              {v}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <p className="mt-3 font-display text-2xl tracking-wide">
                        {item.price && !item.price.startsWith('[') ? (
                          item.price
                        ) : (
                          <span className="text-base text-ink-3 italic">
                            Price to be confirmed
                          </span>
                        )}
                      </p>

                      {buyable && item.buyUrl ? (
                        <MerchBuyLink
                          href={item.buyUrl}
                          productId={item.id}
                          className="mt-3 w-full"
                        />
                      ) : (
                        <span className="btn btn-sm mt-3 w-full cursor-not-allowed bg-paper-3 text-ink-3 shadow-none">
                          <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                          {item.status === 'sold-out' ? 'Sold out' : 'Coming soon'}
                        </span>
                      )}
                    </div>
                  </ComicPanel>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ============================ THE FINE PRINT ============================ */}
      <section className="bg-paper-2 py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <SectionHeading kicker="How this works" title="The honest fine print" />
            <div className="prose-comic mt-5">
              <p>
                This website does not sell anything directly and does not process
                payments. Every product links out to an external store, and the
                purchase happens entirely there.
              </p>
              <p className="border-l-[5px] border-gold-400 bg-white py-3 pl-4 text-sm text-ink-3">
                {proceedsNote}
              </p>
              <p>
                Merchandise is not the way to support Cooper financially. If that
                is what you are here to do, the donation page is more direct and
                more of it reaches him.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <DonateButton placement="shop-page" label="Support Cooper instead" />
              <Link href="/sponsors" className="btn btn-ghost">
                Business sponsorship
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <CooperArt
              pose="laptop"
              sizes="(max-width: 1024px) 55vw, 280px"
              className="mx-auto max-w-[240px]"
            />
            <CooperGuide pose="resting" label="Cooper says" tone="white" stacked>
            <p>
              A sticker on a laptop starts a conversation about online safety
              roughly once a week. That is a genuinely good return on a sticker.
            </p>
            </CooperGuide>
          </div>
        </div>
      </section>

      {merchItems.filter(isBuyable).map((item) => (
        <StructuredData
          key={item.id}
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: item.name,
            description: item.description,
            image: absoluteUrl(item.images[0].src),
            brand: { '@type': 'Brand', name: siteConfig.name },
            ...(item.buyUrl
              ? {
                  offers: {
                    '@type': 'Offer',
                    url: item.buyUrl,
                    availability:
                      item.status === 'available'
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/PreOrder',
                  },
                }
              : {}),
          }}
        />
      ))}
    </>
  )
}
