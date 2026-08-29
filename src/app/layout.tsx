import type { Metadata, Viewport } from 'next'
import { Anton, Bangers, Nunito_Sans } from 'next/font/google'
import './globals.css'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { StickyDonateBar } from '@/components/donate/StickyDonateBar'
import { StructuredData } from '@/components/StructuredData'
import { CloudflareAnalytics } from '@/components/analytics/CloudflareAnalytics'
import { siteConfig } from '@/config/site'
import { activeSocialAccounts } from '@/config/social'
import { defaultKeywords } from '@/lib/seo'

/* ---------------------------------------------------------------------------
   FONTS - all three are SIL Open Font License 1.1, self-hosted by next/font.
     Anton        - display headings (condensed, poster-weight)
     Bangers      - comic kickers and sound effects only, never body copy
     Nunito Sans  - all body text, chosen for legibility at small sizes
   --------------------------------------------------------------------------- */

// `fallback` drives the size-adjusted local font next/font generates. Anton is
// a very condensed face, so basing the fallback on Arial Narrow rather than the
// default Arial keeps line widths (and therefore heading heights) close enough
// that the swap barely shifts the layout.
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
  fallback: ['Arial Narrow', 'Helvetica Neue Condensed', 'sans-serif'],
  adjustFontFallback: true,
})

const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bangers',
  display: 'swap',
  fallback: ['Impact', 'Haettenschweiler', 'sans-serif'],
  adjustFontFallback: true,
})

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  fallback: ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
})

export const viewport: Viewport = {
  themeColor: '#0c2549',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: defaultKeywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.agency.office,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  manifest: '/manifest.webmanifest',
  category: 'education',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
      suppressHydrationWarning is deliberate and belongs on this element only.

      The inline script below adds a `js` class to <html> before first paint,
      so by the time React hydrates, the live class list no longer matches the
      one that was server-rendered. That is the intended behaviour, not a bug -
      but React cannot tell the difference and reports it as a mismatch.

      This suppression is one level deep: it covers attributes on <html> itself
      and nothing inside it, so real mismatches anywhere else are still caught.
    */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${bangers.variable} ${nunito.variable}`}
    >
      <head>
        {/*
          Marks the document as scripted before first paint. Scroll-reveal
          animations key off this class, so with JavaScript disabled their
          content stays visible instead of being hidden forever.

          This must stay a blocking inline script in <head>. Deferring it (or
          moving it into a component effect) would let the browser paint the
          un-hidden state first, and every reveal on the page would flash into
          view before animating.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <SiteHeader />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <SiteFooter />
        <StickyDonateBar />

        {/* Renders nothing unless NEXT_PUBLIC_CF_BEACON_TOKEN is set. */}
        <CloudflareAnalytics />

        <StructuredData
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteConfig.name,
            alternateName: 'Electronics Storage Detection K9 Cooper',
            url: siteConfig.url,
            email: siteConfig.email,
            description: siteConfig.description,
            logo: `${siteConfig.url}/images/brand/cooper-badge.png`,
            areaServed: siteConfig.agency.region,
            sameAs: activeSocialAccounts.map((a) => a.url),
          }}
        />
      </body>
    </html>
  )
}
