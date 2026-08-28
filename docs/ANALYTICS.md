# Analytics

**No analytics is enabled.** No provider script is bundled, no requests go
anywhere, no cookies are set.

The plumbing is in place so you can switch one on in about ten minutes if you
decide you want it.

---

## Why it is off by default

Parts of this site are written for children. That makes the calculation
different from a normal marketing site:

- No behavioural advertising, ever.
- No cross-site tracking pixels.
- No cookie banner, because there are no cookies to consent to.
- If analytics is switched on, it must be a cookieless, privacy-first provider.

Google Analytics is a poor fit here. It sets cookies, would require a consent
banner, and collects far more than is needed to answer "did the donate button
get clicked".

---

## Recommended providers

Any of these are cookieless, do not need a consent banner in most
jurisdictions, and are GDPR-friendly:

| Provider | Cost | Notes |
| --- | --- | --- |
| [Plausible](https://plausible.io) | Paid, or free self-hosted | Simplest. Custom events built in. |
| [Fathom](https://usefathom.com) | Paid | Similar. |
| [Umami](https://umami.is) | Free self-hosted | Good if you already run a server. |
| Vercel Web Analytics | Free tier | One click if you host on Vercel. |

---

## Turning it on

`src/lib/analytics.ts` already detects whichever of these is present at call
time and routes events to it. You do not need to change any component.

### 1. Add the script

In `src/app/layout.tsx`, inside `<body>`:

```tsx
{process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN ? (
  <Script
    defer
    strategy="afterInteractive"
    data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}
    src="https://plausible.io/js/script.tagged-events.js"
  />
) : null}
```

Import `Script` from `next/script`. `afterInteractive` keeps it off the critical
path.

### 2. Set the variable

Locally in `.env.local`, and in Vercel under Settings → Environment Variables:

```
NEXT_PUBLIC_ANALYTICS_DOMAIN=k9cooper.com
```

Leave it unset in preview deployments so test traffic is not counted.

### 3. Update the privacy notice

`src/app/privacy/page.tsx` currently says no analytics provider is enabled.
**That becomes untrue the moment you do this.** Update the Analytics section to
name the provider and say what it records.

### 4. Verify

Open the site, click a donate button, and confirm the `donate_click` event
appears in the provider's dashboard.

---

## Events already wired up

Every one of these fires today and is silently discarded until a provider is
present.

| Event | Fires when | Properties |
| --- | --- | --- |
| `donate_click` | Any donate button or QR nudge | `placement` |
| `donate_qr_view` | QR panel image loads | `placement` |
| `donate_qr_download` | Visitor saves the QR image | `placement` |
| `social_click` | Instagram or TikTok link | `platform`, `placement` |
| `video_play` | Play pressed on a video facade | `video`, `provider` |
| `event_add_to_calendar` | `.ics` downloaded | `event` |
| `event_directions` | Directions link opened | `event` |
| `merch_click` | External store link | `product` |
| `appearance_request` | Contact form successfully submitted | `reason` |
| `safety_checklist_print` | Safety HQ print button | — |
| `safety_quiz_complete` | Quiz finished | `score`, `total` |
| `share_click` | Share or copy-link pressed | `url` |

### The `placement` property

Every donate button reports where it was. That is the most useful number on the
site — it tells you which callout is actually working:

`header`, `mobile-drawer`, `sticky-mobile`, `footer`, `home-hero`,
`home-donate-section`, `home-closing`, `support-hero`, `support-main`,
`support-page-qr-panel`, `event-sidebar`, `adventure-sidebar`, `faq-sidebar`,
`meet-cooper-footer`, `mission-footer`, `what-cooper-does-footer`, `shop-page`,
`sponsors-empty`.

---

## Adding an event

1. Add the name to the `AnalyticsEvent` union in `src/lib/analytics.ts`. It is a
   closed union on purpose — a typo will not compile.
2. Call it:

```ts
import { track } from '@/lib/analytics'

track('donate_click', { placement: 'new-banner' })
```

Never pass personal information in `props`. No names, no email addresses, no
free-text a visitor typed, nothing that could identify a child.

---

## Cookie consent

Not needed with any of the recommended providers, because they set no cookies
and store no personal data.

If someone later insists on a provider that does set cookies, you need a real
consent banner that defaults to off, and the privacy notice must be rewritten.
That is a bigger decision than it looks on a site aimed partly at children —
push back on it.

---

## What to actually watch

Do not drown in dashboards. Four numbers tell the story:

1. **Donate clicks by placement** — which callout works.
2. **Social clicks** — is the site feeding Instagram and TikTok.
3. **Safety HQ page views and quiz completions** — is the education landing.
4. **Appearance requests** — is the booking path working.
