/**
 * Privacy-conscious analytics.
 *
 * No analytics provider is bundled or loaded by default. `track()` is a thin,
 * provider-agnostic shim: it looks for a global sender at call time and does
 * nothing at all if one is not present.
 *
 * To enable analytics:
 *   1. Choose a cookieless, privacy-first provider (Plausible, Fathom,
 *      Umami, Vercel Analytics...).
 *   2. Add its script tag in `src/app/layout.tsx`, guarded by
 *      `process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN` so it stays off in dev.
 *   3. Nothing else changes - the calls below start reporting automatically.
 *
 * Never pass personal information into `props`. Because this site is written
 * partly for children, do not add behavioural advertising or cross-site
 * tracking pixels. See docs/PRIVACY.md.
 */

export type AnalyticsEvent =
  | 'donate_click'
  | 'donate_qr_view'
  | 'donate_qr_download'
  | 'social_click'
  | 'video_play'
  | 'event_view'
  | 'event_add_to_calendar'
  | 'event_directions'
  | 'merch_click'
  | 'appearance_request'
  | 'safety_checklist_print'
  | 'safety_quiz_complete'
  | 'share_click'

type Props = Record<string, string | number | boolean>

interface AnalyticsGlobals {
  plausible?: (event: string, options?: { props?: Props }) => void
  umami?: { track: (event: string, data?: Props) => void }
  fathom?: { trackEvent: (event: string) => void }
  gtag?: (command: 'event', event: string, params?: Props) => void
}

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === 'undefined') return

  const w = window as unknown as AnalyticsGlobals

  try {
    if (typeof w.plausible === 'function') {
      w.plausible(event, { props })
      return
    }
    if (w.umami?.track) {
      w.umami.track(event, props)
      return
    }
    if (w.fathom?.trackEvent) {
      w.fathom.trackEvent(event)
      return
    }
    if (typeof w.gtag === 'function') {
      w.gtag('event', event, props)
      return
    }
  } catch {
    // Analytics must never break the page.
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', event, props)
  }
}
