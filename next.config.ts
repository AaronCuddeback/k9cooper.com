import type { NextConfig } from 'next'

/**
 * Security headers.
 * The CSP is intentionally strict. `unsafe-inline` on style-src is required by
 * Next.js' inlined critical CSS; script-src uses 'unsafe-inline' only because
 * Next injects a small inline bootstrap script. Tighten further with a nonce
 * if you later add a middleware-based CSP.
 *
 * IMPORTANT: with `output: 'export'` these apply to `next dev` and `next start`
 * only - Next.js is not in the request path in production. The headers that
 * actually reach visitors live in `public/_headers`, which Cloudflare Pages
 * reads. Change both together.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  /*
    Static export. Every page on this site prerenders - there are no API
    routes, server actions, middleware or dynamically rendered pages - so the
    build produces plain HTML in ./out and needs no Node runtime to serve.
    That is what lets it run on Cloudflare Pages' free tier with no server.

    Two consequences worth remembering:
      - `headers()` below is inert in production. See public/_headers.
      - `next/image` cannot optimise at request time, hence `unoptimized`.
  */
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    /*
      Required by `output: 'export'`: there is no server to resize on demand.
      Images are served exactly as they sit in /public, so keep them
      sensibly sized at rest - see docs/ASSETS.md.
    */
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    /*
      No `remotePatterns` on purpose. Every image on this site is served from
      /public, so the visitor's browser never makes a request to a third-party
      host while reading a page. Adding a pattern here would quietly undo that.
    */
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
