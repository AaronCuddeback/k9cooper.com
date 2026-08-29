import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

/**
 * Central SEO helper. Every page calls `pageMetadata()` so titles, canonicals
 * and social cards stay consistent.
 */

interface PageMetaInput {
  title: string
  description: string
  /** Path with a leading slash, e.g. "/support". */
  path: string
  /** Absolute or root-relative image path. Defaults to the site OG image. */
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  noIndex?: boolean
  keywords?: string[]
}

export const defaultKeywords = [
  'ESD K9 Cooper',
  'Electronics Storage Detection K9',
  'electronic detection dog',
  'electronic storage detection K9',
  'K9 online safety education',
  'kids internet safety',
  'community K9 appearances',
  'El Dorado County Sheriff K9',
  'High Tech Crimes Unit K9',
]

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

export function pageMetadata({
  title,
  description,
  path,
  image = '/opengraph-image',
  imageAlt,
  type = 'website',
  publishedTime,
  noIndex = false,
  keywords = [],
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path)
  const ogImage = absoluteUrl(image)

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'en_US',
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt ?? `${title} - ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
  }
}

/** JSON-LD helper - renders as a script tag via <StructuredData />. */
export function jsonLd(data: Record<string, unknown>): string {
  // Escaping `<` prevents a `</script>` inside content from closing the tag.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
