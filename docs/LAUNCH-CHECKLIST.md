# Launch checklist

> **Status: cleared for launch (28 Aug 2026).** Every owner-facing note,
> `[REVIEW]` marker and piece of sample content has been removed from the live
> pages. A sweep of all 16 rendered routes finds no `[REVIEW]` / `[TBD]` /
> `[SAMPLE]` / `[INSERT]` text, no "Note for the site owner" blocks, and no
> source-file paths shown to visitors.
>
> What follows is kept as a maintenance record: what was decided, and what to
> re-check when things change. Items marked **[x]** are done.

## What was removed at launch

- **Sample events** — all four deleted. `/events` shows its empty state until
  real ones are added.
- **Sample mission logs** — all four deleted. `/adventures` shows its empty
  state.
- **Placeholder videos** — the two `[INSERT YOUTUBE VIDEO ID]` entries deleted.
  The self-hosted training clip is the only video.
- **TikTok placeholder card** — deleted from `/social`. The TikTok account is
  still linked from the account panel at the top of that page.
- **Owner notes** — the `/adventures` and `/social` dashed "Note for the site
  owner" blocks, and the machinery that generated them, are gone.
- **`[REVIEW]` paragraphs** — removed from accessibility, contact, mission,
  privacy, social, sponsors and support. Where the note covered something
  visitors genuinely need to know, it was rewritten as normal page copy rather
  than deleted.
- **Merchandise** — the `[REVIEW]` proceeds note replaced with wording that
  makes no financial claim. `/shop` stays live as a coming-soon teaser: prices
  read "Price to be confirmed" and every button is a disabled "Coming soon".

## Still to do when you have the material

- [ ] Add real events to `src/content/events.ts`.
- [ ] Add real mission logs to `src/content/adventures.ts`.
- [ ] Add a TikTok post to `src/content/social.ts` when you want one featured.
- [ ] Wire up the store: real `price` and `buyUrl` in `src/content/merch.ts`,
      then change `status` from `'coming-soon'` to `'available'`.
- [ ] Add a captions `.vtt` for the training video if you want one.
- [x] Certification date confirmed: **12 August 2026**. The team course itself
      ran **2–14 August 2026**, so certification fell on day 11 of 13 rather
      than at the end.

---

# Part 1 — Placeholder content to replace

## Cooper's profile

**File:** `src/content/cooper.ts`

Nothing about Cooper's history was invented. **No `[TBD]` markers remain** —
every field was supplied by his handler.

**Supplied by the handler and now published** — date of birth (17 July 2024),
the Paws With A Cause origin, the six-month Jordan Detection K9 program, the
U.S. Secret Service placement, the 3 August 2026 award at the NCFI in Alabama,
team certification, and the handler's name and rank. These drive `cooperStats`,
`funFacts`, `cooperBio`, `milestones` and `cooperPartners`.

Also supplied and published: Cooper's trained final response (passive sit, then
points with his nose), his favourite napping spot (his kennel) and his favourite
off-duty game (chasing a ball). **No `[TBD]` markers remain in `cooperStats` or
`funFacts`.** The disclaimer about `[TBD]` fields on `/meet-cooper` is rendered
conditionally, so it is currently hidden and returns on its own if a `pending`
field is ever added back.

The final response is defined once, in `cooper.ts` → `finalResponse`, and is
also reflected in `missionSteps` step 4 and the `how-does-he-alert` FAQ.

Still outstanding:

- [x] Certification date confirmed: **12 August 2026** (`siteConfig.program
      .certifiedOn`, the `Certified` stat, the certification milestone, the bio
      and two FAQ answers).
- [x] Course dates confirmed: **2–14 August 2026** (`siteConfig.program
      .courseRan`). Cooper was awarded on the 3rd, the second day of the
      course; the team certified on the 12th and the course ran two more days.
      The site describes this as "two weeks" and never implies certification
      was the final act.
- [ ] Confirm the approximate months used for the Paws With A Cause period
      ("Summer 2025" / "Late 2025") and the start of detection school
      ("Early 2026"). These were derived from "approximately 1 year old" and
      "about a year and a half old".
- [ ] `siteConfig.program.certifiedLocation` says "Alabama". Add the city if it
      should be published.

`Age` is computed from `cooperDob` at build time, so it corrects itself on each
redeploy rather than going stale.

## Sample events

**File:** `src/content/events.ts`

**[x] Done — all four sample events deleted at launch.** The array is empty and
every view (list, calendar, homepage "next appearance") falls back to its own
empty state with a "Request an appearance" link.

- [ ] Add real approved appearances when you have them.

## Sample mission logs

**File:** `src/content/adventures.ts`

**[x] Done — all sample stories deleted at launch,** along with the Demo badge
notice on `/adventures`. The page shows "No logs yet" and points visitors at
Instagram.

- [ ] Add real mission logs when you have them.

## Videos

**File:** `src/content/videos.ts`

**[x] Done — the two `[INSERT YOUTUBE VIDEO ID]` placeholders were deleted.**

The only video is the self-hosted training clip, `provider: 'local'`, served
from `/public/videos/`. It uses `preload="none"`, so the 7.8 MB file is not
fetched until a visitor presses play, and nothing is requested from any third
party.

- [ ] Optional: add a captions `.vtt` and point the entry's `captions` at it.
      The clip has burned-in captions, which do not help screen-reader users.

## Merchandise

**File:** `src/content/merch.ts`

**Launching as a coming-soon teaser, deliberately.** All six products are
`status: 'coming-soon'`, so buy buttons are inert, no `buyUrl` is rendered, and
no Product structured data is emitted. Prices display as "Price to be
confirmed"; the `[TBD]` / `[INSERT STORE URL]` values never reach the page.

- [ ] To open the store: set real `price` and `buyUrl`, then flip `status` to
      `'available'`.

## Social posts

**File:** `src/content/social.ts`

The Social Hub is hand-curated. There is no live Instagram feed and no way to
add one: Instagram's read API is Professional-accounts-only, and `@esdk9_cooper`
is a personal account. See `docs/CONTENT-GUIDE.md` for the full reasoning and
the alternatives that were ruled out.

**[x] Done — all five Instagram cards now use the real post images**, saved
locally from each permalink's `og:image` meta tag, with captions and alt text
written from the real posts. `ig-5` is a hand-made square crop of the original
photo, because Instagram's own square crop cut Cooper's head off.

**[x] The TikTok placeholder card was deleted.** TikTok is still linked from the
account panel at the top of `/social`.

**[x] The owner-only note and the machinery behind it were removed.**

- [ ] Add a TikTok post when you want one featured.

Note that these thumbnails are point-in-time copies. Editing or deleting a post
on Instagram will not change the card here.

## Safety HQ resources

**File:** `src/content/safety.ts` → `safetyResources`

- [ ] **Empty on purpose.** No external resource is linked from a page written
      for children until someone has personally opened the link and confirmed
      the destination.

To enable one: add the entry and set `approved: true`. Until then the page shows
an honest "being finalised" state plus the 911 guidance. **Safe to launch empty.**

## Sponsors

**File:** `src/content/sponsors.ts`

- [ ] Empty on purpose. Never list an organisation before written agreement.

The page shows a "be the first supporter" state. **Safe to launch empty.**

## Configuration

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain in Vercel (no trailing slash)
- [ ] Redeploy after the domain is attached so the sitemap picks it up
- [ ] `src/config/site.ts` → `url` fallback matches the real domain

---

# Part 2 — Statements requiring review before launch

Search the codebase for `[REVIEW]` to find these in place.

## Donations — highest priority

**File:** `src/config/donations.ts`

| Item | Status | Action |
| --- | --- | --- |
| Donation URL | Read from the supplied QR code: the Zeffy page for the El Dorado County K-9 Association | **Confirm this is the intended destination** |
| Tax deductibility | **No claim made anywhere on the site** | Do not add one without documentation and exact approved wording |
| Charitable / nonprofit status | **No claim made** | Same |
| "Where it goes" categories | Six categories written from general working-K9 costs | **Confirm each with the receiving organisation** |
| Fund allocation | Not stated | Confirm how money given through this link is actually allocated, then update the wording |

Affected copy: `src/config/donations.ts` (`supports`, `legalNotes`, `faqs`),
`src/app/support/page.tsx`, and the donation FAQ in `src/content/faqs.ts`
(`is-it-tax-deductible`).

The site currently says only that donations "support K9 care costs" and are "not
a payment for services". That is deliberately conservative.

## Technical claims about detection

**File:** `src/content/faqs.ts` — entries flagged `needsReview: true`, plus
`src/content/cooper.ts` (`missionSteps`) and `src/app/what-cooper-does/page.tsx`.

- [ ] **TPPO.** The site states Cooper follows an odour associated with
      compounds used in electronic components, "commonly identified as
      triphenylphosphine oxide (TPPO)". This matches the supplied poster.
      **Have the handler or trainer confirm the phrasing.**
- [ ] **"Can find a device that is turned off."** Stated as fact. Confirm.
- [ ] **Where Cooper can search** — indoors, outdoors, vehicles, water, buried.
      Taken from the supplied poster. Confirm all five are current capabilities.
- [ ] **Nothing operational is published.** The pages deliberately avoid search
      tactics, deployment procedures, training thresholds, detection limits and
      anything that would help someone conceal a device. Have someone
      operational read `/what-cooper-does` and `/faq` and confirm.

## Agency and unit wording

**File:** `src/config/site.ts` → `agency`

- [ ] "High Tech Crimes Unit"
- [ ] "El Dorado County Sheriff's Office"
- [ ] "Sacramento Valley High Tech Crimes Task Force" (in the config, not
      currently rendered)
- [ ] Does the department require a disclaimer that this is an unofficial or
      community site?
- [ ] Is the department's seal approved for use on a non-departmental website?
      It appears in the header, the footer and in structured data.

## Handler identification

**File:** `src/config/site.ts` → `handler`

Confirmed by the handler: **Detective Aaron Cuddeback**, El Dorado County
Sheriff's Office. The name and rank now appear on the homepage, `/meet-cooper`,
`/what-cooper-does`, `/mission`, the FAQ and the site footer.

- [x] Agency has confirmed it is content for the rank and name to be published
      on a public-facing site alongside ICAC work.
- [ ] To remove it site-wide, set `showName: false`. Every usage is guarded by
      that flag except the FAQ answers in `src/content/faqs.ts`, which name him
      in prose — edit or remove those too if the flag is turned off.

Photographs of the handler appear on the homepage, Meet Cooper and the gallery.
Confirm those are approved for publication too.

## Training provider

Published: **Jordan Detection K9**, six months of electronics storage detection
training, placing Cooper as a U.S. Secret Service ESD K9. Team certification
followed at the **National Computer Forensics Institute** in Alabama.

`src/content/cooper.ts` → `cooperPartners` links out to Paws With A Cause,
Jordan Detection K9, the U.S. Secret Service and the NCFI.

- [ ] Confirm those organisations are comfortable being named and linked. The
      page states this is a record of history, not an endorsement.

## Merchandise

**File:** `src/content/merch.ts` → `proceedsNote`

- [ ] No claim is made about where merchandise money goes. Get approved wording.
- [ ] Confirm whether departmental artwork or the seal may appear on items sold.
- [ ] `cooper-patch` reuses the unit seal as a placeholder image — confirm before
      selling anything bearing it.

## Illustrated Cooper artwork

**Files:** `public/images/guide/`, used via `src/components/CooperArt.tsx`

- [ ] Confirm the illustrated caped-Cooper poses are approved for publication,
      and that depicting Cooper in a superhero cape alongside agency branding
      is acceptable to the department.
- [ ] Four of the poses also appear in the gallery under **Comic Cooper**.

## Downloadable graphics

**File:** `src/app/social/page.tsx`

- [ ] The comic poster, sticker artwork and a safety panel are offered as free
      downloads. Confirm the usage permissions for Cooper's artwork and any
      agency branding in it.

## Privacy and legal

**File:** `src/app/privacy/page.tsx`

- [ ] Have a qualified professional review the privacy notice. Parts of this
      site are written for children, so **COPPA** and applicable state privacy
      law should be checked. The notice describes the build accurately, but it
      is not legal advice and makes no compliance claim.
- [ ] Name the hosting provider and link their data-processing terms.
- [ ] **The privacy page now states that the site uses Cloudflare Web
      Analytics.** That copy shipped alongside the integration, so switch the
      analytics on in the Cloudflare dashboard (Analytics & Logs → Web
      Analytics → Add a site) — otherwise the page describes measurement that
      is not happening. See `docs/ANALYTICS.md`.
- [ ] If the analytics provider changes later, update the notice. See
      [`ANALYTICS.md`](ANALYTICS.md).

## Emergency and reporting guidance

**Files:** `src/config/site.ts` → `emergency`, plus `/mission`, `/faq`,
`/contact`, `/safety-hq`

- [ ] The site says clearly and repeatedly that it cannot take reports, and to
      call 911 in an emergency. **No other emergency number, hotline or
      reporting address was invented.**
- [ ] Add any agency-approved reporting guidance or verified national resource
      links.

## Response times

**File:** `src/app/contact/page.tsx`

- [ ] Marked `[REVIEW]`. Either commit to a response window or delete the note.

## Accessibility statement

**File:** `src/app/accessibility/page.tsx`

- [ ] States the site *targets* WCAG 2.2 AA, described as a goal rather than a
      certification. Confirm you are comfortable with that wording.
- [ ] Confirm video captions before claiming they exist.

---

# Part 3 — Pre-launch technical checks

```bash
npm run check
```

- [ ] Typecheck, lint, 61 tests and the production build all pass
- [ ] `node scripts/audit-breakpoints.mjs` passes with the dev server running
- [ ] Donate button opens the correct donation page from header, mobile bar,
      footer, homepage, support page and every sidebar
- [ ] QR code scans from a phone, at the size it appears on screen
- [ ] Instagram and TikTok links open the right profiles
- [ ] "Add to calendar" downloads an `.ics` that imports with the correct time
- [ ] Contact form opens a correctly addressed email on desktop and phone
- [ ] Tab through the whole site — focus is always visible and never trapped
- [ ] Turn on "reduce motion" in the OS and confirm the ticker stops
- [ ] Print `/safety-hq` and check the family checklist comes out cleanly
- [ ] Paste the homepage URL into a private Slack/iMessage and check the card
- [ ] Run Lighthouse against the **production** build, not the dev server
- [ ] Check `/sitemap.xml` and `/robots.txt` show the real domain
- [ ] Submit the sitemap to Google Search Console

---

# What is deliberately absent

Not oversights:

- **No fabricated statistics.** No device counts, case numbers, donor totals or
  impact figures anywhere.
- **No testimonials.** None were supplied.
- **No case results.** The site never claims Cooper located evidence in a real
  investigation.
- **No countdown timers, fake urgency, guilt-heavy language or pre-checked
  consent** on the donation flow.
- **No live social embeds.** Self-hosted cards that link out instead — they
  cannot break and cannot track visitors.
- **No newsletter sign-up.** The brief said only if approved, and it would mean
  collecting email addresses on a site written for children.
- **No behavioural advertising, no tracking pixels, no cross-site tracking.**
  Analytics is Cloudflare Web Analytics only: cookieless, no consent banner, and
  no custom events. The twelve events wired into the code stay dormant under it.
- **No emergency numbers other than 911**, which is stated in the brief.
