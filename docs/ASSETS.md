# Assets

## What is in the repo

All artwork was supplied by the site owner. No stock imagery, no third-party
character art, no copyrighted franchise branding.

### `public/images/cooper/` — photographs

| File | Size | Used for |
| --- | --- | --- |
| `cooper-portrait-vest` | 2400 × 1601 | Homepage hero, gallery, adventure covers |
| `cooper-at-sheriffs-office` | 1600 × 2842 | Gallery, event cards |
| `cooper-and-handler` | 1800 × 1616 | Gallery |
| `cooper-and-handler-bond` | 1800 × 1800 | Meet Cooper, gallery |
| `cooper-sitting-indoors` | 1400 × 2487 | Meet Cooper, event cards |
| `cooper-smiling-outdoors` | 1600 × 2842 | Gallery, event cards |
| `cooper-public-safety-complex-art` | 1400 × 1120 | Gallery (illustrated) |
| `cooper-in-the-car` | 1500 × 2664 | Gallery, mascot source |
| `cooper-head-tilt` | 1500 × 2664 | Gallery, mascot source |
| `cooper-looking-out` | 1500 × 2664 | Mascot source |
| `cooper-off-duty-blanket` | 1500 × 2664 | Gallery, mascot source |

Each exists as both `.webp` and `.jpg`. The site references the `.jpg`;
Next.js serves AVIF or WebP automatically based on what the browser accepts.

### `public/images/cooper/cooper-face-*.jpg` — mascot medallions

512 × 512 square crops used by `<CooperGuide>`. They render as **circles** on
the site, so each one is composed for the inscribed circle: Cooper's head is
centred, with room around it so the round mask never clips his ears.

| Pose | Source photo | Feel | Used for |
| --- | --- | --- | --- |
| `alert` | park, facing camera | Direct, friendly, tongue out | The default guide appearance |
| `happy` | park, head tilted | Charming, slightly cheeky | Social and follow CTAs |
| `working` | in the vehicle | Attentive, ready | Instructional content |
| `duty` | outside the Sheriff's Office | Official, in harness | Mission and events content |
| `resting` | chin on a blanket | Soft, gentle | Off-duty and reassuring content |
| `curious` | park, looking aside | Questioning, "look at this" | FAQ, 404, explanations |

**Adjusting a crop.** Do not eyeball it against the square file - the square is
not what visitors see. Run `py scripts/prepare-avatars.py` and open
`scripts/_avatar-check.jpg`. That sheet applies the real circular
mask and overlays a 10% grid with a centre crosshair, so you can read off
exactly where Cooper's head sits and correct it arithmetically. The script's
docstring has the formula and the script prints the numbers it needs.

### `public/images/comic/` — the poster and its panels

`cooper-comic-poster` is the full educational poster (1086 × 1448). The
individual panels were cropped from it by `scripts/prepare-assets.py`:

`panel-indoors`, `panel-outdoors`, `panel-vehicles`, `panel-underwater`,
`panel-buried`, `panel-how-it-works`, `panel-training`, `panel-more-than`,
`panel-kids-online`, `cooper-hero-seated`.

Also `cooper-sticker-hide-the-thing` (900 × 900) — the die-cut sticker artwork.

### `public/images/brand/cooper-badge.png`

512 × 512, transparent background. The site's brand mark: Cooper's illustrated
face, cropped from `guide/cooper-wave.png` by `scripts/make-cooper-badge.mjs`.
Used in the header, the footer and as the organisation logo in structured data.

> **Why not the unit seal?** This site is a personal, educational project about
> Cooper. It is not an official El Dorado County Sheriff's Office publication,
> so it deliberately does not display the High Tech Crimes Unit logo or any
> other agency seal as its mark. Cooper's own artwork carries the branding.
> Do not reintroduce agency insignia without written approval from the agency.

### `public/images/support/donation-qr-code.png`

720 × 740. Encodes the donation URL in `src/config/donations.ts`. If you change
the donation URL, regenerate this image to match — nothing validates that they
agree.

### `public/images/social/` — Instagram post thumbnails

`ig-1.jpg` … `ig-5.jpg`, 640 × 640. These are the real preview images for the
five featured Instagram posts, saved locally from each post's `og:image` meta
tag. See the header of `src/content/social.ts` for the one-line curl that pulls
one out.

Always save the file. The CDN URLs are signed and expire, so hotlinking them
would break the page within days.

The crop is Instagram's own square preview, which can cut a portrait photo
badly — `ig-5.jpg` loses Cooper's head. If a crop looks wrong, replace the file
with a hand-made square crop of the original photo at 640 × 640 or larger; the
card does not care where the image came from.

### `public/videos/` — self-hosted video

| File | Notes |
| --- | --- |
| `cooper-training-day.mp4` | 720 × 1280, 36s, H.264/AAC, 7.8 MB. Portrait phone footage. |
| `cooper-training-day-poster.jpg` | Frame grab used as the click-to-play poster. |

Videos here are served from this site — no YouTube, no third party. They are
listed in `src/content/videos.ts` with `provider: 'local'` and a `src` path.

**Encoding a new one.** Browsers need H.264 video and AAC audio in an MP4. A
`.ts` file straight out of a capture tool is MPEG-2 and will not play:

```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/videos/output.mp4
```

If the source is already H.264/AAC, remux losslessly instead of re-encoding —
re-encoding an already-compressed file only makes it bigger and worse:

```bash
ffmpeg -i input.mp4 -c copy -movflags +faststart public/videos/output.mp4
```

`+faststart` moves the index to the front of the file. Without it the browser
downloads the whole thing before playing a single frame.

Grab a poster frame at a moment that reads well as a thumbnail:

```bash
ffmpeg -ss 2 -i input.mp4 -frames:v 1 -q:v 3 public/videos/output-poster.jpg
```

Set `aspect: 'portrait'` in `videos.ts` for phone footage, and keep clips short
— every byte is served from your own hosting on every view.

> **Watch the extension.** `.ts` means MPEG transport stream to ffmpeg and
> TypeScript to this project. Saving a video as `src/content/videos.ts` will
> overwrite the video *configuration* file and break the build.

---

## Re-running the asset pipeline

Two Python scripts regenerate everything from the originals. They are **not**
part of the build; they exist so the same transformations can be repeated when
new photographs arrive.

```bash
py -m pip install Pillow
py scripts/prepare-assets.py
py scripts/prepare-avatars.py
```

Both read from hard-coded source paths at the top of the file — update those to
point at wherever the new originals live.

`prepare-assets.py` honours EXIF orientation (several of the phone photos were
stored sideways), resizes to a sensible maximum width, and writes matching
`.webp` and `.jpg` files.

`prepare-avatars.py` takes fractional centre-x / centre-y / size values so face
crops can be nudged without recalculating pixels. Adjust the numbers, re-run,
look at the result.

---

## Adding new photographs

1. Aim for at least **1400 px on the long edge**. 2000 px+ for anything used as
   a hero.
2. Name the file for what it shows: `cooper-school-visit-october.jpg`, not
   `IMG_4471.jpg`. Filenames are part of SEO and they make the content files
   readable.
3. Put photos in `public/images/cooper/`, event photos in
   `public/images/events/`, story photos in `public/images/adventures/`.
4. Add the entry to the relevant content file with the **true** pixel width and
   height. There is a test that fails the build if a referenced image is
   missing.
5. Write real alt text (below).

Do not commit anything above about 1.5 MB. Run it through
`prepare-assets.py`, or any image optimiser, first.

---

## Writing alt text

Alt text is read aloud to people using screen readers and shown when an image
fails to load. It is not a caption and it is not a keyword dump.

**Good:** `Cooper sitting on the walkway in front of the El Dorado County
Sheriff's Office entrance, beside the bronze eagle statue`

**Bad:** `Cooper`, `dog photo`, `K9 Cooper ESD detection dog police El Dorado`

Rules used throughout this site:

- Describe what is actually visible.
- Mention Cooper's harness when it is visible — it signals he is working.
- Purely decorative images get `alt=""` and `aria-hidden="true"`.
- For comic panels, describe the drawing **and** any text inside it.

`tests/content-integrity.test.ts` fails the build if any gallery, adventure or
merchandise image has alt text shorter than about 10–15 characters.

---

## Recommended dimensions

| Slot | Size | Notes |
| --- | --- | --- |
| Homepage hero photo | 2000 × 1500 min | Displayed 4:3 |
| Gallery image | 1400 px long edge min | Aspect ratio preserved, never cropped |
| Adventure cover | 1400 × 900 | Displayed 16:10 |
| Event image | 1200 × 800 | |
| Merchandise photo | 1000 × 1000 | Square |
| Sponsor logo | 400 × 200, transparent PNG | Sits on white |
| Mascot medallion | 512 × 512 | Square crop, face centred |
| Social thumbnail | 1080 × 1080 | Square |
| Social share card | 1200 × 630 | Generated automatically, see below |

---

## Social share cards

`src/app/opengraph-image.tsx` generates the default 1200 × 630 card at build
time from the site config, so it never goes stale when the tagline changes.

Individual pages override it with their own image where one makes sense — an
adventure post uses its cover, an event uses its event photo.

To restyle the default card, edit that file. It uses inline styles because it
renders through Satori, not the browser, so Tailwind classes do not apply there.

---

## Illustrated Cooper poses

Ten illustrated poses live in `public/images/guide/`. They are used as
full-figure spot art through `<CooperArt>`, which is the companion to
`<CooperGuide>`: the guide is Cooper talking to you in a circular photo
medallion, the art is Cooper the superhero.

| Pose | Shows | Used on |
| --- | --- | --- |
| `leap` | Caped Cooper leaping at the viewer | Homepage closing call to action |
| `fly` | Caped Cooper flying | Adventures |
| `searching` | Nose-down over a hidden phone and drive | What Cooper Does |
| `wave` | Sitting, paw raised | Support, Events |
| `stand` | Standing square in harness and cape | Meet Cooper |
| `laptop` | Paw resting on a closed laptop | Shop |
| `peek` | Peeking round the edge of the page | 404 |
| `shield` | Beside a golden padlock shield | Safety HQ |
| `tablet` | Lying down with a padlock on a tablet | Safety HQ quiz sidebar |
| `case` | Paw on a hard equipment case | The Mission |

Four of them are also gallery entries under **Comic Cooper**.

### Regenerating them

```bash
py scripts/prepare-illustrations.py
```

Then look at `scripts/_illustration-check.jpg`, which composites every pose onto
the site's cream so any leftover halo is obvious.

Two things that script handles, both worth knowing about if new art arrives:

- **Seven of the supplied files had a transparency checkerboard baked into the
  pixels** rather than a real alpha channel - the same trap as `htcu.png`. The
  script detects that (two near-neutral light greys dominating the border) and
  removes it with a flood fill seeded from the image edges, so light areas
  *inside* the artwork survive. It then clears any checker trapped inside the
  drawing - the gap in the laptop lid, for instance - by checking whether an
  enclosed region actually alternates between the two greys. A solid white
  highlight uses one tone and is kept; a checker patch uses both and goes.
- **Nothing on the site renders this art above about 420 CSS px**, so the
  longest edge is capped around 900px. That covers a 2x display with room and
  keeps the folder near 5 MB instead of 11 MB.

### Adding a new pose

1. Drop the file in `~/Desktop/HeroCooper/` (or edit `SRC` in the script).
2. Add a row to `POSES` with an output name and a max size.
3. Run the script and check the contact sheet.
4. Add the pose to `ART` and `CooperArtPose` in `src/components/CooperArt.tsx`,
   with the real pixel dimensions the script printed.

**Do not** commission anything that imitates a specific superhero franchise,
costume or logo. The brief is "comic-book hero", not any existing character.

---

## Original brief: illustrated Cooper poses

Kept for reference, in case more poses are commissioned.

**Style:** match the supplied comic poster — heavy black ink outlines, flat
colour with cross-hatched shading, warm cream fur (`#e8c88f`), olive-black
working harness with the round ESD-K9 patch.

**Delivery:** transparent PNG, 800 × 800, plus the layered source file.

**Poses needed:**

| Pose | Description | Where it would be used |
| --- | --- | --- |
| `alert` | Sitting, head up, ears forward, looking at the reader | Default guide appearances |
| `happy` | Sitting, tongue out, tail blur | Social and follow CTAs |
| `working` | Nose down, front legs braced, scent trail | Search explanations |
| `duty` | Standing square in harness, formal | Official and mission content |
| `pointing` | Head turned, nose indicating to the side | Pointing at adjacent content |
| `proud` | Sitting tall, chest out, slight smile | Achievements and milestones |

Consistent eye line and line weight across the set matters more than any
individual pose.

Drop the files into `public/images/guide/` and swap the `src` values in the
`POSES` map in `src/components/CooperGuide.tsx`. Nothing else changes.

**Do not** commission anything that imitates a specific superhero franchise,
costume or logo. The brief is "comic-book hero", not any existing character.

---

## Files supplied but not used

| File | Why |
| --- | --- |
| `20260816_201851.jpg` | A Jordan Detection K9 daily training log form. Internal document — not appropriate for a public site. It does suggest Cooper's training provider; see the launch checklist. |
| `htcu.png` | Checkerboard baked into the pixels instead of real transparency. The vector export was used instead. |
| Gold-gradient logo variants | The flat black-and-brass version reproduces better at small sizes and matches the site's flat-colour treatment. |
