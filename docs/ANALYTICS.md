# Analytics

The site uses **Cloudflare Web Analytics**: free, cookieless, and no consent
banner. It reports page views, referrers, paths, countries, browsers and Core
Web Vitals.

It does **not** record custom events. That is a deliberate Cloudflare product
decision, and it has one real consequence for this site, covered below.

---

## Turning it on

Cloudflare serves k9cooper.com, so it can inject the beacon itself. **This is
the path to use — it needs no code, no rebuild and no deploy.**

1. Cloudflare dashboard → **Analytics & Logs → Web Analytics**
2. **Add a site** → `k9cooper.com`
3. Leave **JS snippet injection** ON
4. Data appears within a few minutes. There is no verification step.

That is the whole job. Nothing in this repository needs to change.

### If automatic injection does not take

Automatic injection is documented for proxied and Pages sites; this site is
served by a Worker with static assets. If no data arrives after an hour, switch
to the manual beacon, which is already built and waiting:

1. In **Manage site → Advanced options**, turn **JS snippet injection OFF** and
   copy the token out of the snippet Cloudflare shows you.
2. In Cloudflare, go to **Workers & Pages → k9cooper-com → Settings → Build →
   Variables** and add:

   ```
   NEXT_PUBLIC_CF_BEACON_TOKEN = <the token>
   ```

3. Redeploy (push anything to `main`, or hit Retry on the last build).

`src/components/analytics/CloudflareAnalytics.tsx` renders the beacon only when
that variable is set, so with it unset the component returns null and no
third-party script loads at all.

> **Never run both.** Cloudflare renders one beacon per page. Automatic
> injection *and* the token set means two beacons and every visit counted
> twice. Pick one.

### Why the variable has to be set in Cloudflare, not `.env.local`

The site is a static export, so `NEXT_PUBLIC_*` values are baked into the HTML
at **build** time rather than read at runtime. Setting it locally only affects
local builds. The live site takes whatever was set where Cloudflare built it.

---

## What you get, and the one thing you do not

**You get:** page views over time, which pages are read, where visitors came
from (search, Instagram, TikTok, direct), country, browser, device type, and
Core Web Vitals.

**You do not get:** which donate button people click.

That matters more here than it would on most sites. There are **twelve custom
events already wired into sixteen places** in the code, and every one of them
is firing into nothing right now:

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

`donate_click` reports a `placement` from eighteen distinct spots — `home-hero`,
`sticky-mobile`, `footer`, `faq-sidebar`, `support-main` and so on. That answers
"which callout actually earns its space", which is the most useful number this
site could produce. Cloudflare cannot capture it.

Nothing is broken by this. `track()` looks for a provider at call time and
silently does nothing when there is not one, so the events sit dormant at no
cost until something can receive them.

---

## If you later want the custom events

`src/lib/analytics.ts` already speaks Plausible, Umami, Fathom and `gtag`. No
component changes are needed — add the provider's script in
`src/app/layout.tsx` and all twelve events start reporting on their own.

| Provider | Cost | Notes |
| --- | --- | --- |
| [Plausible](https://plausible.io/#pricing) | $9/mo for 10k views | Cookieless, no banner, goals and custom events on the entry plan. The straightforward choice. |
| [Umami](https://umami.is) | Free self-hosted | Needs a server and a Postgres database, which undoes this project's "no backend, nothing to breach" design. |
| [Fathom](https://usefathom.com) | Paid | Equivalent to Plausible. |
| Google Analytics | Free | **Not recommended.** Sets cookies, so you would need a real consent banner, and behavioural tracking on a site written partly for children is a bad trade. It is the one option that changes your COPPA position. |

Running Cloudflare and one of these together is fine — they are separate
scripts and do not conflict. Only the *Cloudflare* beacon must not be doubled.

**If you add one, update the privacy page in the same commit.**
`src/app/privacy/page.tsx` describes what is collected, and it has to stay true.

---

## Adding a new event

1. Add the name to the `AnalyticsEvent` union in `src/lib/analytics.ts`. It is a
   closed union on purpose — a typo will not compile.
2. Call it:

```ts
import { track } from '@/lib/analytics'

track('donate_click', { placement: 'new-banner' })
```

Never pass personal information in `props`. No names, no email addresses, no
free text a visitor typed, nothing that could identify a child.

---

## Privacy position

Parts of this site are written for children, which sets the bar:

- No behavioural advertising, ever.
- No cross-site or cross-device tracking.
- No cookie banner, because nothing is stored on the visitor's device.
- No personal data collected, by this site or by the analytics.

Cloudflare Web Analytics fits that: no cookies, no `localStorage`, no
fingerprinting, no persistent identifier. That is why it is the default here
rather than Google Analytics.

This is a design position, not a legal opinion. COPPA and applicable state
privacy law should still be reviewed by a qualified professional before launch —
see `docs/LAUNCH-CHECKLIST.md`.

---

## What to actually watch

Four numbers tell the story. Cloudflare gives you the first three:

1. **Page views on `/support`** — is anyone reaching the donation page.
2. **Referrers** — is Instagram and TikTok actually sending traffic.
3. **Safety HQ page views** — is the education being read.
4. **Donate clicks by placement** — needs Plausible. The one worth paying for,
   if any of them is.
