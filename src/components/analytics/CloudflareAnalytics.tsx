import Script from 'next/script'

/**
 * CLOUDFLARE WEB ANALYTICS
 * ----------------------------------------------------------------------------
 * Renders the Cloudflare Web Analytics beacon, and only when a token is set.
 * With no token this component returns null, so the site ships with no
 * analytics and no third-party request - which is the default.
 *
 *
 * YOU PROBABLY DO NOT NEED THIS COMPONENT
 * k9cooper.com is served by Cloudflare, so the beacon can be injected
 * automatically from the dashboard with no code at all. Try that first:
 *
 *   Cloudflare dashboard -> Analytics & Logs -> Web Analytics
 *   -> Add a site -> k9cooper.com -> leave "JS snippet injection" ON
 *
 * That path needs no token, no rebuild and no deploy. This component exists
 * for the case where automatic injection does not take - the site is served by
 * a Worker rather than Pages, and automatic injection is documented for
 * proxied and Pages sites.
 *
 *
 * NEVER RUN BOTH AT ONCE
 * Cloudflare renders one beacon per page. If automatic injection is on AND
 * this component has a token, the page gets two beacons and every visit is
 * counted twice. Pick one:
 *
 *   automatic  -> leave NEXT_PUBLIC_CF_BEACON_TOKEN unset (this renders nothing)
 *   manual     -> turn "JS snippet injection" OFF in the dashboard, then set
 *                 the token
 *
 *
 * SETTING THE TOKEN
 * The site is a static export, so NEXT_PUBLIC_* values are baked in at BUILD
 * time, not read at runtime. Setting it locally in .env.local only affects
 * local builds. For the live site it has to be set where Cloudflare builds it:
 *
 *   Workers & Pages -> k9cooper-com -> Settings -> Build -> Variables
 *
 * then redeploy. See docs/ANALYTICS.md.
 *
 *
 * WHAT IT COLLECTS
 * Page views, referrers, paths, countries, browsers and Core Web Vitals. No
 * cookies, no localStorage, no fingerprinting, no cross-site identifiers - so
 * no consent banner is required. It does NOT support custom events, so the
 * events in src/lib/analytics.ts stay dormant under it. See docs/ANALYTICS.md
 * for what it would take to capture those.
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN

  if (!token) return null

  return (
    <Script
      id="cf-web-analytics"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      // `spa: true` counts App Router client-side navigations as page views.
      // Without it only the first, full page load is ever recorded.
      data-cf-beacon={JSON.stringify({ token, spa: true })}
    />
  )
}
