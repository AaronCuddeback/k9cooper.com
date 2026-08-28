import { jsonLd } from '@/lib/seo'

/**
 * Renders a JSON-LD block. Content is escaped in `jsonLd()` so a stray
 * closing tag inside the data cannot break out of the script element.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  )
}
