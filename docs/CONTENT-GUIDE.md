# Content guide

Everything on this site is edited by changing a file in `src/content` or
`src/config`. You never need to touch a component.

After any change, run `npm run check`. If it passes, commit and push — the site
redeploys itself.

If something is typed wrong, the build fails with a clear message and the live
site is left untouched. That is intentional: it is impossible to publish a
broken event.

---

## Adding an event

**File:** `src/content/events.ts`

Copy an existing entry and change it:

```ts
{
  slug: 'placerville-library-safety-day',   // lowercase, hyphens, must be unique
  title: 'Internet Safety Day',
  category: 'Community Event',              // see the list of categories in the file
  start: '2026-09-19T10:00:00-07:00',
  end:   '2026-09-19T12:00:00-07:00',
  location: {
    name: 'Placerville Library',
    address: '345 Fair Lane, Placerville, CA 95667',
  },
  summary: 'One or two sentences shown on the card and in the calendar.',
  details: [
    'A paragraph about what happens.',
    'Another paragraph.',
  ],
  image: {
    src: '/images/cooper/cooper-sitting-indoors.jpg',
    alt: 'Describe what is in the photo',
  },
  visibility: 'public',
  featured: true,
  status: 'scheduled',
  accessNote: 'Step-free access. Please ask before petting.',
  openToPublic: true,
},
```

### Time zones

The offset at the end of the date matters:

- `-07:00` — Pacific **Daylight** Time (roughly March to November)
- `-08:00` — Pacific **Standard** Time (roughly November to March)

Get this wrong and the event shows at the wrong hour and the downloaded calendar
file is off by an hour.

### Cancelling or moving an event

Do not delete it — people have it in their calendars. Change the status:

```ts
status: 'cancelled',
statusNote: 'Cancelled because of the weather. We will announce a new date.',
```

Options: `'scheduled'`, `'cancelled'`, `'postponed'`, `'sold-out'`.

### What never goes on the site

- Private addresses.
- Operational deployments.
- Anything not yet approved for publication.

For a closed booking such as a school assembly, leave the address out and use the
`note` field instead:

```ts
location: {
  name: 'Placerville Elementary',
  note: 'School visits are arranged with the school and are not open to the public.',
},
openToPublic: false,
```

Past events move to the "Past" tab automatically once their end time passes.
Nothing to do.

---

## Writing a story (mission log)

**File:** `src/content/adventures.ts`

New posts go at the **top** of the array.

```ts
{
  slug: 'a-morning-of-hides',
  title: 'A Morning of Hides',
  date: '2026-08-14',                 // YYYY-MM-DD
  category: 'Training',
  cover: {
    src: '/images/adventures/hides-cover.jpg',
    alt: 'Cooper searching a training room, nose to the floor',
  },
  summary: 'One or two sentences. This is what shows on the card.',
  featured: true,
  body: [
    { type: 'p', text: 'A paragraph.' },
    { type: 'h', text: 'A section heading' },
    { type: 'p', text: 'Another paragraph.' },
    { type: 'list', items: ['First point', 'Second point'] },
    { type: 'callout', label: 'Cooper’s Safety Tip', text: 'Shown in a speech bubble.' },
    { type: 'quote', text: 'A pull quote.', attribution: 'Cooper’s handler' },
    { type: 'image', src: '/images/adventures/photo.jpg', alt: 'Description', caption: 'Optional' },
  ],
  gallery: [
    { src: '/images/adventures/extra-1.jpg', alt: 'Description' },
  ],
}
```

Delete `isSample: true` from any real post. Once no post has it, the "Demo"
badges and the editor notice on `/adventures` disappear on their own.

### What never goes in a story

Live investigations, case outcomes, search tactics, addresses, or anything that
would help someone hide a device. Training and community stories only, unless
specifically cleared.

---

## Adding gallery photos

**File:** `src/content/gallery.ts`

1. Put the image in `public/images/cooper/` (or a new folder under
   `public/images/`). At least 1400 px on the long edge.
2. Add an entry:

```ts
{
  id: 'unique-id',
  src: '/images/cooper/new-photo.jpg',
  alt: 'A real description of what is in the photo, for screen readers',
  caption: 'Optional caption shown under the photo',
  category: 'Cooper at Work',
  width: 2000,     // the real pixel dimensions
  height: 1333,
  featured: true,  // optional
}
```

`width` and `height` must be the true dimensions. They reserve the right amount
of space so the page does not jump while images load.

Aspect ratios are preserved throughout — the grid never centre-crops Cooper out
of frame.

---

## Featuring a video

**File:** `src/content/videos.ts`

Find the video ID:

- YouTube `https://www.youtube.com/watch?v=ABCdef12345` → `ABCdef12345`
- Vimeo `https://vimeo.com/123456789` → `123456789`

```ts
{
  id: 'meet-cooper',
  provider: 'youtube',
  videoId: 'ABCdef12345',
  title: 'Meet ESD K9 Cooper',
  description: 'One or two sentences.',
  poster: '/images/cooper/cooper-portrait-vest.jpg',
  duration: '2:00',
  featured: true,
}
```

Videos never load until a visitor presses play — the page shows a poster with a
play button, and only then does the player load. That keeps the site fast and
keeps third-party cookies off it.

While `videoId` still contains `[INSERT ...]`, the card shows a tidy
"coming soon" message instead of a broken player.

---

## Adding a product

**File:** `src/content/merch.ts`

```ts
{
  id: 'cooper-sticker',
  name: '"Hide the Thing" Sticker',
  category: 'Stickers',
  description: 'One or two sentences.',
  price: '$5',
  status: 'available',          // 'available' | 'coming-soon' | 'sold-out'
  images: [{ src: '/images/merch/sticker.jpg', alt: 'Description' }],
  variants: ['3 inch', '5 inch'],
  buyUrl: 'https://your-store.example.com/product',
  featured: true,
}
```

The Buy button only becomes clickable when `status` is `'available'` **and**
`buyUrl` is a real URL. Until then it renders as a disabled "Coming soon".

Do not add claims about where the money goes without approved wording — see
`proceedsNote` at the top of the file.

---

## Updating donation information

**File:** `src/config/donations.ts`

Changing `url` updates every donate button on the site at once — the header, the
mobile bar, the footer, the homepage, the support page and each sidebar.

To replace the QR code:

1. Save the new image as `public/images/support/donation-qr-code.png`.
2. Update `width` and `height` in the config if the dimensions changed.
3. Check the code still scans from a phone at the size shown on screen.

Read the comments about `legalNotes` before editing them. No tax-deductibility
or charitable-status claim should be added without documentation and approved
wording.

---

## Adding a sponsor

**File:** `src/content/sponsors.ts`

The array starts empty on purpose. **Never add an organisation until they have
agreed in writing to be listed publicly.**

```ts
{
  id: 'example-vet',
  name: 'Example Veterinary Clinic',
  level: 'Veterinary Partner',
  url: 'https://example.com',
  logo: { src: '/images/sponsors/example.png', width: 400, height: 200 },
  blurb: 'One approved sentence.',
}
```

While the list is empty the page shows a well-designed "be the first supporter"
state rather than an awkward gap.

---

## Changing Cooper's safety tips

**File:** `src/content/safety.ts`

The tips rotate daily on the homepage and in the footer, and visitors can step
through them manually.

```ts
{
  id: 'short-unique-id',
  text: 'Short enough to fit in a speech bubble.',
  audience: 'everyone',   // 'kids' | 'teens' | 'everyone'
}
```

The same file holds the twelve academy lessons, the shield checklist, the quiz,
the glossary and the printable family checklist. Each section has its own
instructions.

**Before changing any safety wording, read the rules at the top of the file.**
Four hold everywhere: nothing blames a child, no fear-based messaging, no
graphic detail, and every lesson ends with an action a child can actually take.
There is an automated test (`tests/content-integrity.test.ts`) that fails the
build if a lesson starts blaming children.

### Turning on external resource links

The resource list renders nothing until a link is approved:

```ts
{
  name: 'Organisation Name',
  url: 'https://example.org/help',
  description: 'What this resource does.',
  audience: 'parents',
  approved: true,     // <- only after someone has opened the link and checked it
}
```

Until at least one is approved, the page shows an honest "this list is being
finalised" state plus the 911 guidance.

---

## Updating Instagram and TikTok links

**File:** `src/config/social.ts`

```ts
{
  platform: 'instagram',
  label: 'Instagram',
  handle: '@esdk9_cooper',
  url: 'https://www.instagram.com/esdk9_cooper/',
  enabled: true,
  cta: 'Follow on Instagram',
}
```

Set `enabled: false` to hide a platform everywhere without deleting it. There
are YouTube and Facebook entries already there, switched off, ready for the day
they are needed.

---

## Featuring a social post

**File:** `src/content/social.ts`

Nothing is scraped from Instagram or TikTok, and no unofficial API is used. You
pick the posts by hand:

1. Copy the post's link.
2. Save its image into `public/images/social/`.
3. Add an entry with the URL, a short caption, the thumbnail path and a
   `thumbnailAlt` describing the picture for screen readers.

Cards with a `[PLACEHOLDER]` URL render muted rather than as a broken link, so a
half-finished entry is safe to leave in place.

### There is no automatic feed, and that is deliberate

Instagram only lets an account read its own posts through the **Instagram API
with Instagram Login**, and that API works exclusively for Professional
(Business or Creator) accounts. `@esdk9_cooper` is a personal account, so there
is no supported way to pull its posts automatically.

The options that do not require a professional account are all worse:

- **Scraping** the public profile page breaks Instagram's terms, and breaks in
  practice every time they change their markup.
- **A third-party widget** (SnapWidget, Elfsight, Curator and friends) still
  needs the same professional-account connection, *and* means a third party
  holds a token for an agency account and runs their JavaScript on the site.
- **Instagram's own `/embed` iframe** does work per-post without any key, but it
  is still one manual paste per post - so it buys no automation over the cards,
  while adding third-party JavaScript and third-party cookies to the page.

Since every route needs manual work anyway, the cards win: they are faster,
they cannot break, and they keep the page free of third-party code.

### The five Instagram cards need finishing

The Instagram links are real and go to the right posts. The **thumbnails and
captions do not match the posts** - they use Cooper's illustrated artwork as a
stand-in, because a post's image cannot be fetched from Instagram without
scraping it.

To finish each card: open the post, save its image into
`/public/images/social/`, then update `thumbnail`, `thumbnailAlt` and `caption`
in `src/content/social.ts`. The card switches from "artwork on blue" to a normal
photo crop automatically - it keys off whether the path starts with
`/images/guide/`.

Nothing is misleading in the meantime: the artwork is obviously an illustration
rather than a screenshot, and the caption does not describe content.

**Why cards instead of real embeds?** Platform embeds load a lot of third-party
JavaScript, get blocked by common privacy settings and content blockers, and
break without warning when the platforms change. These cards always work,
always match the site's design, and never contact Instagram or TikTok until
someone clicks.

---

## Adding illustrated Cooper artwork

**Script:** `scripts/prepare-illustrations.py`
**Component:** `src/components/CooperArt.tsx`

The full-figure caped Cooper drawings are separate from the circular photo
faces. To place one on a page:

```tsx
import { CooperArt } from '@/components/CooperArt'

<CooperArt pose="wave" sizes="(max-width: 1024px) 55vw, 260px" className="max-w-[240px]" />
```

By default the art is decorative and hidden from screen readers, which is
correct when the copy beside it already says the same thing. If a drawing is
genuinely carrying information, pass `alt="..."` and it becomes a real image.

See `docs/ASSETS.md` for the pose list and for how to add a new one.

---

## Changing Cooper's mascot faces

**Script:** `scripts/prepare-avatars.py`

The little circular photos of Cooper come from square crops in
`public/images/cooper/cooper-face-*.jpg`. They are generated, not hand-cropped,
so the whole set stays consistent.

1. Put the new photograph somewhere the script can reach and add it to
   `SOURCES`.
2. Add or edit a line in `POSES` - the source, where to centre, and how tight
   to crop.
3. Run `py scripts/prepare-avatars.py`.
4. **Open `scripts/_avatar-check.jpg`.** It shows each avatar with
   the real circular mask and a 10% measuring grid. Cooper's head should sit on
   the red crosshair. If it does not, the script's docstring has a formula that
   turns "his head is at 44% instead of 50%" into the exact number to change.

If you add a new pose name, also add it to the `POSES` map and the `CooperPose`
type in `src/components/CooperGuide.tsx`.

---

## Changing the menu

**File:** `src/config/nav.ts`

`mainNav` drives the header — items with `children` become a dropdown on desktop
and a grouped section in the mobile drawer. `footerNav` drives the three footer
columns.

If you add a new page, add its route to the `ROUTES` set in
`tests/content-integrity.test.ts` too. That test catches links pointing at pages
that do not exist.

---

## Site-wide settings

**File:** `src/config/site.ts`

Name, tagline, contact email, agency wording, handler name, timezone and the
emergency notice. Changing the email here updates the footer, the contact page
and the contact form's destination all at once.

To remove the handler's name from the site entirely:

```ts
handler: { name: '...', title: '...', showName: false },
```
