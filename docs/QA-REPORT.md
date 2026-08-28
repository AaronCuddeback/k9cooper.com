# QA report

Run at the end of the build, against the **production** build (`next build` +
`next start`), not the dev server.

---

## Summary

| Check | Result |
| --- | --- |
| TypeScript (`tsc --noEmit`) | Pass, 0 errors |
| ESLint | Pass, 0 errors, 0 warnings |
| Unit tests (Vitest) | **61 / 61 pass**, 6 files |
| Production build | Pass, **30 / 30 routes prerendered static** |
| Breakpoint + a11y audit | **133 / 133 page-width combinations pass** |
| Mobile drawer audit | **5 / 5 phone widths pass** |
| Internal links | 22 pages crawled, **0 broken** |
| External links | 3 / 3 reachable (HTTP 200) |
| Lighthouse | See below — all four targets exceeded |

---

## Lighthouse

Desktop preset, production build, five representative pages.

| Page | Performance | Accessibility | Best Practices | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| Home | 98 | 100 | 100 | 100 | 0.094 |
| What Cooper Does | 100 | 100 | 100 | 100 | 0.001 |
| The Mission | 100 | 100 | 100 | 100 | 0.001 |
| Safety HQ | 100 | 100 | 100 | 100 | 0.002 |
| Support | 100 | 100 | 100 | 100 | 0.043 |
| Events (index) | 100 | 100 | 100 | 100 | 0.003 |
| Event detail | 100 | 100 | 100 | 100 | 0.001 |
| Adventure detail | 100 | 100 | 100 | 100 | 0.001 |
| Gallery | 100 | 100 | 100 | 100 | 0.004 |
| Social Hub | 100 | 100 | 100 | 100 | 0.001 |
| Meet Cooper | 100 | 100 | 100 | 100 | 0.001 |
| FAQ | 100 | 100 | 100 | 100 | 0.001 |
| Shop | 100 | 100 | 100 | 100 | - |
| Sponsors | 100 | 100 | 100 | 100 | - |
| Contact | 100 | 100 | 100 | 100 | - |

**Targets from the brief:** Performance 90+, Accessibility 95+, Best Practices
95+, SEO 95+. All exceeded on every page measured.

Total Blocking Time is 0 ms everywhere. First Contentful Paint is 0.4 s.

### Work done to get there

- **Removed Framer Motion.** Replaced with a ~400-byte `IntersectionObserver`
  component (`src/components/ui/Reveal.tsx`). Cut the largest page from 153 kB
  to 117 kB First Load JS.
- **Fixed layout shift from web fonts.** The homepage hero art column was
  vertically centred against the copy column, so any reflow when Anton and
  Bangers swapped in moved the photograph. Anchored the art to the top of the
  grid row and reserved height for the intro paragraph. Home CLS went 0.242 → 0.094.
- **Tuned font fallback metrics.** Anton is very condensed, so the size-adjusted
  fallback next/font generates is now based on Arial Narrow instead of the
  default Arial. Bangers uses Impact.
- **Reduced interior page title scale.** Long page titles at hero size sat right
  on a wrap boundary, so the font swap changed the line count. Support CLS went
  0.102 → 0.043 — and the hierarchy is better, since the homepage hero should be
  the biggest type on the site.
- **Reserved height for the rotating safety tips**, which swap text after
  hydration.

Remaining home CLS of 0.094 is under the 0.1 "good" threshold. It is font-swap
reflow measured on a throttled cold cache; on a repeat visit it is zero.

---

## Breakpoint and accessibility audit

```bash
node scripts/audit-breakpoints.mjs
```

**19 pages × 7 widths (320, 375, 390, 430, 768, 1024, 1440) = 133 combinations.
All pass.**

Checked on every combination:

- Horizontal overflow (reports the offending element)
- Images with no `alt` attribute
- Exactly one `<h1>`
- No skipped heading levels
- No links or buttons without an accessible name
- **Colour contrast below WCAG AA**, folding in text alpha, every layer of
  translucent background, and cumulative ancestor `opacity`
- **`<dl>` structure** - `<dt>`/`<dd>` must be direct children of the list, or of
  a bare `<div>` wrapper that contains nothing else
- `<main>` landmark present
- Skip link present
- `<title>` present
- No console errors or uncaught exceptions

Two subtleties the contrast check has to handle, both flagged in the source:

- `[data-svg-backed]` - the action bursts are filled by an SVG polygon, not a
  CSS background, so a DOM walker sees the section behind them and would report
  a false failure. Those subtrees are skipped and their contrast was verified by
  hand instead (values recorded in `ActionBurst.tsx`).
- `[data-reveal="hidden"]` - scroll-reveal content below the fold is still faded
  out when the page is measured; it reaches full opacity once scrolled into view.

### Issues found and fixed during this pass

| Issue | Where | Fix |
| --- | --- | --- |
| 3 px horizontal overflow at 320–430 px | `/mission`, `/support` | Action bursts were positioned with a negative right offset; repositioned inside the viewport on small screens |
| Heading level skip (h1 → h3) | `/adventures`, `/events` | Card headings are `<h3>`; added a visually-hidden `<h2>` section heading above each listing |
| Kicker chip stretching full width | Every `SectionHeading` | `inline-flex` was stretching inside a flex column; added `self-start` / `self-center` |
| Action burst rendering in normal flow | Homepage hero | Tailwind emits `.relative` after `.absolute`, so the component's own `relative` was winning over the caller's `absolute`. Restructured to stack with CSS grid instead |
| Hero wordmark lines overlapping | Homepage | Offset drop shadow crossed into the next line; increased leading and reduced the shadow |
| Comic panels cropped in the scent trail | `/what-cooper-does` | Switched from `object-cover` to `object-contain` — these are complete panels with their own captions, so cropping lost the text |

### WCAG 2.2 issues found and fixed

| Issue | Detail | Fix |
| --- | --- | --- |
| **2.5.8 Target Size (Minimum)** | Footer nav, FAQ sidebar and breadcrumb links were 17 px tall | Added vertical padding to clear 24 px |
| **2.5.3 Label in Name** | The header logo's `aria-label` ("ESD K9 Cooper - home") did not contain its own visible text ("One Nose. One Mission.") | Removed the `aria-label`; the wordmark text is the accessible name, with an `sr-only` "home" appended |
| **1.4.3 Contrast (Minimum)** | Gold-300 on red-500 sidebar headings measured 3.92:1, below the 4.5 needed at 20 px | Moved those headings to gold-200 (4.64:1) |
| **1.4.3 Contrast (Minimum)** | Placeholder social cards used `opacity-70`, dragging their text to 4.17:1 and 4.44:1 | "Not linked yet" is now conveyed with a muted background and a greyscale thumbnail; the text stays at full contrast |
| **1.3.1 Info and Relationships** | The event-detail sidebar `<dl>` nested `<dt>`/`<dd>` inside an extra `<div>` alongside an icon, which is invalid | Icons moved inside the `<dt>`, so each `<div>` contains only `<dt>` and `<dd>` |

### The mobile navigation was broken, and how it was missed

Reported by the site owner: the mobile menu did not work or look right.

**Cause.** The site header carries `backdrop-blur`. `backdrop-filter` makes an
element a **containing block for `position: fixed` descendants**, and the drawer
was rendered inside that header. So its `fixed inset-0` resolved against the
64px-tall header rather than the viewport: the panel collapsed to a 64px sliver,
the nav shrank from 617px of usable height to 32px, and links stacked on top of
each other. The donate button and social icons floated loose over the page.

**Fix.** The drawer is portalled to `document.body` with `createPortal`, which
takes it out of that containing block. The header keeps its backdrop blur.

| | Before | After |
| --- | --- | --- |
| Drawer height | 64px | 844px (full viewport) |
| Usable nav height | 32px | 617px, scrolling |
| Overlapping link pairs | 7 | 0 |

**Why the existing tests missed it.** The unit tests run in jsdom, which has no
layout engine - every rect is zero, so a collapsed panel is indistinguishable
from a correct one. The static audit never opened the drawer. Both were checking
semantics; this was purely geometric.

**What covers it now:** `scripts/audit-mobile-nav.mjs` opens the menu at 320,
375, 390, 430 and 768px and asserts the drawer fills the viewport, no two
on-screen links intersect, body scroll is locked, a donate control is present,
and no link falls under the 24px target-size minimum. It calls out the
containing-block symptom by name, because that is the failure most likely to
come back.

Building that check surfaced two false-positive traps worth recording, since
either would mislead someone reading its output later:

- Links scrolled out of a clipping container still report coordinates, so every
  rect is intersected with its scrollable ancestors before being compared.
- Links sitting side by side share a vertical band without overlapping, so the
  comparison tests genuine 2D intersection, not vertical overlap alone.

### A progressive-enhancement bug the contrast check surfaced

Adding the contrast check found a genuine defect it was not looking for. The
`<Reveal>` component started its content at Tailwind's `opacity-0` and only
un-hid it from a `useEffect`, so **with JavaScript disabled the five
search-step panels on What Cooper Does were permanently invisible** - and the
component's own docstring wrongly claimed they degraded gracefully.

Fixed by moving the hidden state into a CSS rule scoped to `html.js`, a class
set by a small script in the document head. With scripting off the class never
appears, so nothing is ever hidden. Verified by emulation:

| Condition | `.reveal` elements hidden | Content readable |
| --- | --- | --- |
| JavaScript disabled | 0 of 5 | Yes |
| JavaScript enabled | 5 of 5, revealing on scroll | Yes |
| `prefers-reduced-motion: reduce` | 0 of 5 | Yes, immediately |

### Image resolution

`image-size-responsive` flagged two comic panels. They are cropped from the
supplied poster, which is only 1086 px wide, so they genuinely cannot be
enlarged without upscaling. Rather than fake the resolution, those panels are
now shown at native size on a cream mat inside their comic frame - correct
pixels, and it reads better as a framed panel. Recorded in `docs/ASSETS.md` so a
higher-resolution poster export can be dropped in later.

---

## Unit tests

61 tests across 6 files. Run with `npm test`.

| File | Tests | Covers |
| --- | --- | --- |
| `donate.test.tsx` | 5 | Donate URL, `target`/`rel`, screen-reader warning, analytics placement, HTTPS |
| `navigation.test.tsx` | 7 | Drawer open/close, `aria-modal`, every destination present, Escape, focus restoration, dropdown `aria-expanded`, donate always reachable |
| `events.test.tsx` | 12 | Private events never exposed, sort order, unique slugs, ICS structure, CRLF, UTC conversion, escaping, cancelled status, list/calendar toggle, empty state |
| `contact-form.test.tsx` | 7 | Emergency warning present, all five validations, email format, `aria-invalid`, consent required, mailto construction, honeypot |
| `safety-interactions.test.tsx` | 12 | Shield counting/persistence/reset/privacy note, quiz coaching and praise, option locking, lightbox dialog semantics, Escape, arrow keys, filtering |
| `content-integrity.test.ts` | 18 | Every referenced image exists on disk, alt text length, internal links resolve, safety content rules, no unreviewed tax/nonprofit/statistic claims, social config |

The content-integrity suite is the important one for a non-technical editor: it
fails the build if someone references a missing image, links to a page that does
not exist, adds alt text that is too short, or introduces a tax-deductibility
claim outside a flagged, reviewed answer.

---

## Manual verification

| Area | Result |
| --- | --- |
| Reduced motion | Verified with emulated `prefers-reduced-motion: reduce`. Ticker animation 38 s → 0.000001 s, button transitions → 0.000001 s, smooth scroll → auto. |
| Print styles | Verified with emulated print media on `/safety-hq`. Header and footer hidden, background white, checklist intact. |
| Donation QR | Decoded — resolves to the same URL as every donate button. |
| Donation link | HTTP 200. |
| Instagram `@esdk9_cooper` | HTTP 200. |
| TikTok `@esdk9_cooper` | HTTP 200. |
| Mobile layout | Screenshotted at 390 px with real device-metric emulation on home, Safety HQ and Support. No overflow, comfortable spacing, touch targets clear. |
| Mascot medallions | All 20 rendered instances across 9 pages checked in the live DOM: every one square, fully rounded, `object-fit: cover`, image loaded. Cooper's head centred in the circle, measured against a 10% grid with a centre crosshair. |
| Mobile drawer | Opened and measured at 5 phone widths. Screenshotted at 390px before and after the portal fix. |
| Illustrated artwork | All ten poses composited onto the site's cream and inspected for halos or leftover checkerboard. |
| Desktop layout | Screenshotted at 1280 px on home, Safety HQ, What Cooper Does, Events and Support. |
| Hydration | No hydration warnings in the console on any page at any width. Rotating tips render index 0 on the server and swap in an effect, precisely to avoid a mismatch. |

---

## Bundle

```
First Load JS shared by all      103 kB
Largest page (/what-cooper-does) 117 kB
Smallest page (/accessibility)   106 kB
```

All 30 routes are prerendered as static HTML. No server rendering at request
time, no API routes, no middleware.

Total `public/` weight is 8.2 MB of source images. Next.js serves resized AVIF
or WebP derivatives, so a typical page transfers a small fraction of that.

---

## Known gaps

Honest list. None block launch, but do not claim otherwise.

1. **No manual screen-reader testing.** NVDA, JAWS and VoiceOver have not been
   used. The semantics are correct and were verified programmatically, but that
   is not the same thing. This is the highest-value next step.
2. **No axe-core run.** Lighthouse's accessibility audit (which uses axe under
   the hood) scores 100, and the custom audit adds structural checks, but a full
   axe pass on every page would be more thorough.
3. **No real-device testing.** All mobile verification was Chrome device
   emulation. Test on at least one physical iPhone and one Android before
   launch — particularly the QR code scan and the mailto handoff.
4. **Video captions unverified.** No real video IDs exist yet.
5. **Lighthouse mobile preset not run.** Desktop preset only. Given TBT of 0 ms
   and a fully static build, mobile scores should be similar, but they will be
   lower on the throttled mobile CPU profile.
6. **Content still contains placeholders.** See
   [`LAUNCH-CHECKLIST.md`](LAUNCH-CHECKLIST.md).

---

## Reproducing this

```bash
npm run check
```

Then, with the production server running:

```bash
npm run build
npm start
```

```bash
AUDIT_BASE=http://localhost:3000 node scripts/audit-breakpoints.mjs
```

```bash
npx lighthouse http://localhost:3000/ --preset=desktop --view
```
