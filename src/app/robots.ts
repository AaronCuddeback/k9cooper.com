/*
  Required by `output: 'export'`. Without it the static export build fails on
  this route. See docs/DEPLOYMENT.md.
*/
export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
