# ESD K9 Cooper

The official website for **ESD K9 Cooper**, an Electronics Storage Detection
K9 with the El Dorado County Sheriff's Office High Tech Crimes Unit.

> One Nose. One Mission. Protect Children.

It is built to do five jobs well: make donating fast and trustworthy, grow
Cooper's Instagram and TikTok audiences, teach children and families practical
online safety, explain what an ESD K9 actually does, and let schools and
community groups book a visit.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

---

## The stack, and why

| Choice | Reason |
| --- | --- |
| **Next.js 15 (App Router)** | Every page prerenders to static HTML. Fast, cheap, and nothing to break at runtime. |
| **TypeScript** | The content files are typed, so a malformed event or story fails at build time instead of on the live site. |
| **Tailwind CSS v4** | The whole design system is CSS custom properties in one file (`src/app/globals.css`). Change a token, the whole site follows. |
| **Lucide icons** | Accessible, tree-shaken, no icon font. |
| **No database, no CMS, no auth** | There is nothing to log into, nothing to breach, and no monthly bill. Content lives in typed files in `src/content`. |
| **No animation library** | A 400-byte `IntersectionObserver` component replaced Framer Motion and cut 36 kB off the largest page. |

There is no backend. The contact form drafts an email in the visitor's own
client; donations happen entirely on the external donation platform. That keeps
the site free to host, impossible to spam, and free of anything that could leak.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the exported `out/` folder locally (see note below) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Vitest suite (61 tests) |
| `npm run check` | Typecheck, lint, test and build in one go — run this before deploying |

Because the site builds with `output: 'export'`, `next start` refuses to run
it — there is no server to start. `npm start` therefore serves the exported
`out/` folder with a small static server (`scripts/serve-export.mjs`) that
mirrors what a static host does: clean URLs and a real 404 page.

The QA scripts below need a server running in another terminal. Point them at
the exported build, which is what actually ships:

```bash
npm run build && npm start
```

```bash
node scripts/audit-breakpoints.mjs
```

Loads every page at 320, 375, 390, 430, 768, 1024 and 1440 px and reports
horizontal overflow, missing alt text, heading-order problems, unnamed
links/buttons, colour contrast below WCAG AA, invalid `<dl>` structure and
console errors. Exits non-zero on any finding.

```bash
node scripts/audit-mobile-nav.mjs
```

Opens the mobile menu at each phone width and checks it is actually usable -
full viewport height, no overlapping links, body scroll locked, donate control
present. This exists because a real layout bug got past both the unit tests and
the static audit; see `docs/QA-REPORT.md`.

```bash
node scripts/shot.mjs ./shots 390 / /safety-hq /support
```

Full-page screenshots at a given width, using real device-metric emulation.

---

## Deploying

The site is hosted on **Cloudflare Pages** (free tier) at **k9cooper.com**, and
deploys automatically on every push to `main`.

```bash
npm run check && git add -A && git commit -m "Describe the change" && git push
```

Cloudflare builds and publishes in a couple of minutes. To roll back, open a
previous deployment under **Workers & Pages → k9cooper → Deployments** and
choose **Rollback to this deployment**.

**Read `docs/DEPLOYMENT.md` before changing anything about the build.** It
covers the one-time setup, why this is on Cloudflare rather than Vercel (the
free Vercel tier forbids sites that ask for donations) or Netlify (its free
tier takes the site offline when monthly credits run out), and three things
about the static export that are easy to break:

- `headers()` in `next.config.ts` does nothing in production — the live
  security headers are in `public/_headers`.
- `next/image` cannot resize at request time, so images are served as they sit
  in `/public`.
- The Open Graph card is written as an extensionless file and needs its
  `Content-Type` set in `public/_headers`, or social previews lose their image.

---

## Updating content

Everything an editor needs is in two folders. No component files need to be
touched.

| I want to... | Edit this file |
| --- | --- |
| Add an event | `src/content/events.ts` |
| Write a story / mission log | `src/content/adventures.ts` |
| Add gallery photos | `src/content/gallery.ts` |
| Feature a video | `src/content/videos.ts` |
| Add a product | `src/content/merch.ts` |
| Add or edit an FAQ | `src/content/faqs.ts` |
| Add a sponsor | `src/content/sponsors.ts` |
| Change safety tips or lessons | `src/content/safety.ts` |
| Feature a social post | `src/content/social.ts` |
| Cooper's bio, stats, milestones | `src/content/cooper.ts` |
| Donation link, QR, categories | `src/config/donations.ts` |
| Instagram / TikTok links | `src/config/social.ts` |
| Site name, email, agency, handler | `src/config/site.ts` |
| Menu structure | `src/config/nav.ts` |

Each file opens with step-by-step instructions for that content type. See
[`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) for worked examples.

After any change:

```bash
npm run check
```

If that passes, commit and push. Cloudflare redeploys automatically.

---

## Project layout

```
public/images/
  brand/     cooper-badge.png - the site's logo mark (Cooper's face)
  social/    Thumbnails for the featured posts on the Social Hub
  comic/     The educational poster and panels cropped from it
  cooper/    Photographs, plus square face crops for the mascot
  guide/     Illustrated caped-Cooper poses (transparent PNG)
  support/   Donation QR code

scripts/
  prepare-assets.py         Re-processes original photos into web assets
  make-cooper-badge.mjs     Rebuilds the header/footer logo mark
  prepare-avatars.py        Re-cuts the circular mascot face crops
  prepare-illustrations.py  Cuts out the illustrated caped-Cooper poses
  audit-breakpoints.mjs     Cross-breakpoint accessibility smoke test
  audit-mobile-nav.mjs      Opens and measures the mobile drawer
  shot.mjs                  Screenshot tool for visual QA

src/
  app/         One folder per route, plus sitemap/robots/manifest/OG image
  components/  Reusable UI, grouped by area
    comic/     ComicPanel, ActionBurst, SpeechBubble, SectionHeading, Decor
    donate/    DonateButton, DonationQrPanel, StickyDonateBar
    safety/    SafetyAcademy, SafetyShield, SafetyQuiz, SafetyTipSpotlight
    ...
  config/      Site-wide settings an editor may change
  content/     All page content, typed
  lib/         Dates, ICS generation, analytics shim, SEO helpers

tests/         Vitest suite
docs/          Everything below
```

---

## Documentation

| Document | Covers |
| --- | --- |
| [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) | Worked examples for every content type |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Tokens, components, motion rules, how to extend it |
| [`docs/ASSETS.md`](docs/ASSETS.md) | Image sizes, naming, the illustrated poses, and the asset pipeline |
| [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) | What was built and how to keep it that way |
| [`docs/ANALYTICS.md`](docs/ANALYTICS.md) | Turning analytics on, and the events already wired up |
| [`docs/SECURITY-PRIVACY.md`](docs/SECURITY-PRIVACY.md) | Threat model, headers, data handling |
| [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) | **Read before launch.** Placeholders and claims needing review |
| [`docs/QA-REPORT.md`](docs/QA-REPORT.md) | Test results from the build |

---

## Before you launch

**Do not publish this site without working through
[`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md).** It lists every
placeholder still in the content, and every statement that needs factual,
legal, departmental or donation-policy sign-off.

Short version of the most important items:

- Sample events and mission logs are labelled **Demo**. Replace or delete them.
- Cooper's age, training provider, certification and milestone dates are `[TBD]`.
- Nothing on the site claims tax deductibility. Do not add such a claim without
  documentation and approved wording.
- The Safety HQ external resource list is deliberately empty until each link has
  been personally verified.
- The handler's name is published from `src/config/site.ts`. Confirm consent, or
  set `showName: false`.

---

## Fonts and licences

All three typefaces are self-hosted by `next/font` and carry the SIL Open Font
License 1.1, which permits commercial and web use:

| Font | Used for | Licence |
| --- | --- | --- |
| [Anton](https://fonts.google.com/specimen/Anton) | Display headings | OFL 1.1 |
| [Bangers](https://fonts.google.com/specimen/Bangers) | Comic kickers and sound effects only | OFL 1.1 |
| [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) | All body text | OFL 1.1 |

No comic-book display font is used for body copy anywhere on the site.

## Image credits

All photographs of Cooper, the comic poster, the sticker artwork and the High
Tech Crimes Unit seal were supplied by the site owner. No stock imagery and no
third-party character art is used.
