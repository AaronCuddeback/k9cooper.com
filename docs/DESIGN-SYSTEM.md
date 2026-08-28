# Design system

Everything lives in one file: **`src/app/globals.css`**. Change a token there
and the whole site follows.

The visual language is taken from the educational comic poster the site owner
supplied: saturated comic blue, alarm red, signal gold, aged cream paper, heavy
black ink lines, Ben-Day dots and speed lines.

---

## Colour

Defined as Tailwind theme tokens, so `bg-blue-700`, `text-gold-300`,
`border-ink` and so on all work.

| Family | Role | Key steps |
| --- | --- | --- |
| `ink` | Every outline, all body text | `ink` `#0b0b0d`, `ink-2` `#1c1c22`, `ink-3` `#3a3a44` |
| `paper` | Page background, panel fills | `paper` `#fbf5e6`, `paper-2` `#f4e9cf`, `paper-3` `#e8d9b6` |
| `blue` | Primary dark surface | `blue-500` `#1d55a8` … `blue-800` `#0c2549` |
| `red` | Donate, urgency, accents | `red-500` `#bf2026` |
| `gold` | Highlights, kickers, CTAs on dark | `gold-300` `#f8ca3e` |
| `brass` | Metallic accents on badges and seals | `brass-400` `#c9a06b` |
| `scent` | Cooper's scent trail, success states | `scent-300` `#cfe04a` |

### Contrast rules

- Body text is `ink` or `ink-2` on `paper` — comfortably above AA.
- On dark blue, body text is `blue-50`, never `blue-200` or lighter.
- `gold-300` is used for **large or bold** text on dark, never small body copy.
- Nothing relies on colour alone. Every status has a word or an icon next to it.

Any section with a dark background gets the `on-dark` class, which flips the
focus ring so it stays visible.

---

## Typography

Three faces, all SIL OFL 1.1, self-hosted by `next/font`.

| Token | Font | Where |
| --- | --- | --- |
| `--font-display` | Anton | All headings, buttons, badges, labels |
| `--font-comic` | Bangers | Kickers, sound effects, Cooper's voice. **Never body copy.** |
| `--font-body` | Nunito Sans | Every paragraph, list and form control |

### Scale

Fluid clamps, so nothing needs breakpoint overrides:

```css
--text-hero:    clamp(2.6rem, 11vw, 6.5rem);
--text-display: clamp(2rem, 7vw, 3.75rem);
--text-title:   clamp(1.5rem, 4.6vw, 2.5rem);
```

Body text is `1.0625rem` at `1.65` line-height — slightly larger than a typical
default, because a lot of readers here are children or reading on a phone.

---

## Ink lines and shadows

Comic borders are variables that shrink on phones, so panels do not feel heavy
on a 320 px screen:

```css
--ink-1: 2px;   --ink-2: 3px;   --ink-3: 4px;    /* mobile */
--ink-1: 2px;   --ink-2: 4px;   --ink-3: 6px;    /* ≥ 768px */
--shadow-pop: 4px 4px 0 var(--color-ink);        /* 6px 6px on desktop */
```

Utilities: `ink`, `ink-thin`, `ink-thick`, `pop`, `pop-sm`.

Shadows are **hard offsets, never blurs**. That is the single most important
rule for keeping the print-comic feel.

---

## Texture utilities

| Utility | Effect | Tunable |
| --- | --- | --- |
| `benday` | Ben-Day dot field | `--benday-color`, `--benday-size`, `--benday-dot` |
| `halftone-fade` | Dots that fade out across the element | `--benday-color`, `--halftone-dir`, `--halftone-stop` |
| `speed-lines` | Radiating comic rays | `--speed-x`, `--speed-y`, `--speed-color` |
| `zip-lines` | Motion streaks | `--zip-angle`, `--zip-color` |
| `newsprint` | Paper grain page background | — |

All of them go on an `aria-hidden` element behind the content, never on the
content itself. Example:

```tsx
<div
  aria-hidden="true"
  className="benday pointer-events-none absolute inset-0 opacity-35"
  style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.35)' }}
/>
```

---

## Components

### `<ComicPanel>`

The core unit. Heavy border, hard offset shadow, optional caption tab.

```tsx
<ComicPanel tone="blue" label="Mission Briefing" tiltSeed="unique-key">
  …
</ComicPanel>
```

- `tone`: `paper` `white` `blue` `gold` `red` `ink`
- `tiltSeed`: any string. Hashes to a small stable rotation so grids look
  hand-laid rather than machine-set. Pass `straight` to disable.
- `label`: renders the corner caption tab.

Give the same panel the same seed every time, or it will jump when React
re-renders.

### `<ActionBurst>`

A jagged starburst with content laid over it. The SVG and label are stacked with
CSS grid, not absolute positioning, so callers are free to position the burst
itself (`className="absolute -top-6 right-0 …"`).

### `<SpeechBubble>` and `<CooperGuide>`

`CooperGuide` is Cooper's recurring appearance: a circular photo medallion with
a gold mis-registered ring, next to a speech bubble.

```tsx
<CooperGuide pose="duty" label="Cooper’s Safety Tip" size="lg">
  <p>…</p>
</CooperGuide>
```

Poses map to square face crops in `public/images/cooper/`. See
[`ASSETS.md`](ASSETS.md) for the brief if illustrated poses are commissioned
later.

Cooper never floats over content and never follows the viewport. He is a guide,
not a chatbot.

### `<SectionHeading>`

Kicker tab, display heading, optional intro. Handles the `self-start` /
`self-center` alignment of the kicker chip automatically.

### Buttons

`.btn` plus a variant: `.btn-donate` `.btn-gold` `.btn-blue` `.btn-ghost`, and a
size: `.btn-sm` `.btn-lg`.

Minimum height is 3rem (48 px) — above the 44 px touch target minimum. On hover
a button lifts up-left and its shadow grows; on press it sinks. Both are
disabled under `prefers-reduced-motion`.

Use `<LinkButton>` rather than a raw `<a className="btn">` — it adds
`target="_blank"` and `rel="noopener noreferrer"` to external links for you.

### Badges

`.badge` plus `.badge-red` `.badge-gold` `.badge-blue` `.badge-green`
`.badge-muted`.

### Sound effects

`.sfx` — Bangers, gold fill, black stroke, red offset shadow.

Always `aria-hidden="true"`. They are decoration; a screen reader reading
"PAW-SOME" out of context helps nobody. Use them **sparingly** — roughly one per
screenful, never inside a paragraph.

---

## Motion

Three rules:

1. **Nothing moves on load** except the mission ticker.
2. **Reveals are one-shot.** `<Reveal>` fades and lifts an element once when it
   scrolls into view, then disconnects its observer.
3. **`prefers-reduced-motion` removes all of it.** A global rule in `globals.css`
   cuts every animation and transition to 0.001 ms, the ticker becomes a static
   wrapped row, and `<Reveal>` renders visible immediately.

There is no animation library. `<Reveal>` is about 400 bytes of
`IntersectionObserver`; it replaced Framer Motion and cut 36 kB from the largest
page.

---

## Layout

| Class | Max width | Use |
| --- | --- | --- |
| `.shell` | 80rem | Standard page container |
| `.shell-narrow` | 48rem | Long-form reading: privacy, accessibility, disclaimers |

Breakpoints are Tailwind defaults: `sm` 40rem, `md` 48rem, `lg` 64rem, `xl`
80rem. The site is designed mobile-first and verified at 320, 375, 390, 430,
768, 1024 and 1440 px.

`body` carries `overflow-x: clip` as a backstop, but nothing should rely on it —
`scripts/audit-breakpoints.mjs` fails the check if any element actually
overflows.

---

## Extending it

**Adding a colour:** add it under `@theme` in `globals.css`. It immediately
works as `bg-*`, `text-*`, `border-*`.

**Adding a texture:** add an `@utility` block that reads its own custom
properties, the way `benday` does.

**Adding a panel tone:** add a key to the `TONES` map in `ComicPanel.tsx`.

**What to avoid**, because it breaks the identity: soft blurred shadows,
corporate gradients, glassmorphism, purple, rounded-everything, and comic display
fonts anywhere in body copy.
