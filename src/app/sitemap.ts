/*
  Required by `output: 'export'`. Without it the static export build fails on
  this route. See docs/DEPLOYMENT.md.
*/
export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { publicEvents } from '@/content/events'
import { adventures } from '@/content/adventures'

/** Static routes with their relative importance. */
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/support', priority: 0.95, changeFrequency: 'monthly' },
  { path: '/safety-hq', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/meet-cooper', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/what-cooper-does', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/mission', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/adventures', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/events', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/gallery', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/social', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/shop', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/sponsors', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    ...routes.map((r) => ({
      url: `${siteConfig.url}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...adventures.map((a) => ({
      url: `${siteConfig.url}/adventures/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...publicEvents.map((e) => ({
      url: `${siteConfig.url}/events/${e.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
