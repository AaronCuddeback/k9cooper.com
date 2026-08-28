# Accessibility

Target: **WCAG 2.2 Level AA**. That is what the site was built and tested
against. It is a goal, not a certification.

The comic aesthetic is loud on purpose. None of it is allowed to cost anyone
access to the information.

---

## What was built

### Structure

- One `<h1>` per page, headings in order, no skipped levels. Verified across all
  19 routes at 7 viewport widths.
- Real landmarks: `<header>`, `<nav aria-label>`, `<main id="main">`,
  `<footer>`, `<aside>`.
- Skip link as the first focusable element on every page.
- Lists are `<ul>`/`<ol>`, buttons are `<button>`, links are `<a>`. Nothing is a
  clickable `<div>`.

### Keyboard

Everything works without a mouse:

| Component | Behaviour |
| --- | --- |
| Header dropdowns | `aria-expanded` / `aria-controls`, Escape closes, click-outside closes |
| Mobile drawer | `role="dialog"`, `aria-modal`, focus trapped, Escape closes, focus returns to the toggle |
| Gallery lightbox | Same, plus arrow keys to move between photos |
| Accordions | Real buttons with `aria-expanded` / `aria-controls`, panel is a labelled `region` |
| Filters | `aria-pressed` toggle buttons, or radio groups in a `<fieldset>` with a `<legend>` |
| Safety shield | Real checkboxes; the visual box is decorative and `aria-hidden` |
| Quiz | Real buttons; options are disabled once answered |

Where an input is visually hidden (`sr-only`) so a styled label can be shown
instead, the label carries `has-[:focus-visible]:outline` so keyboard focus is
still visible.

### Focus

A 3 px gold ring at 3 px offset on every interactive element. Dark sections
carry `.on-dark`, which brightens the ring so it stays visible on blue and black.

### Screen readers

- Every icon-only button has an `sr-only` name.
- Every external link announces "(opens in a new tab)".
- Decorative SVG, textures and sound effects are `aria-hidden="true"`.
- Filter results, quiz feedback, form errors and the shield counter are in
  polite live regions. The tip rotators only become live *after* the visitor
  presses the button, so nothing is announced unprompted on load.
- The homepage `<h1>` carries an `sr-only` plain-text version, because the
  visible one is split across styled spans.

### Images

- Every content image has descriptive alt text. Automated tests fail the build
  if a gallery, adventure or merchandise image has alt text that is too short.
- Comic panels describe both the drawing and any text inside it.
- Decorative images use `alt=""` plus `aria-hidden="true"`.

### Motion

- A global `prefers-reduced-motion` rule reduces every animation and transition
  to 0.001 ms.
- Scroll reveals hide their content with a CSS rule scoped to `html.js`, so with
  JavaScript disabled it is simply visible. Nothing is ever left hidden by CSS
  that only JavaScript can un-hide.
- The mission ticker stops scrolling and becomes a static wrapped row.
- `<Reveal>` also checks the media query in JavaScript, so reduced-motion
  visitors get the content immediately with no transition.
- Button hover lift and card hover lift are disabled.
- Nothing important is communicated only by movement.

### Colour

- Body text is `ink`/`ink-2` on cream, or `blue-50` on dark blue.
- Gold is used for large or bold text on dark, never small body copy.
- No meaning is carried by colour alone. Event status, quiz results, product
  availability and form errors all pair colour with a word or an icon.

### Touch and layout

- Interactive controls are at least 44 × 44 px; buttons are 48 px tall.
- No horizontal scrolling at any width from 320 px up — enforced by the audit
  script.
- Fluid type clamps mean no text is smaller than about 12 px anywhere, and body
  copy is 17 px.
- The mobile donate bar reserves its own space at the end of the document, so it
  never covers content or the footer. It can be dismissed for the session.

### Forms

- Every field has a visible `<label>` with `for`/`id`.
- Errors appear twice: once in a summary at the top of the form, linked to the
  field, and once beside the field itself.
- Invalid fields get `aria-invalid="true"` and `aria-describedby` pointing at
  the error.
- The error summary is focused on failed submit.
- Hints are linked with `aria-describedby`.
- Correct `inputMode` and `autoComplete` so mobile keyboards behave.

### Print

`/safety-hq` is styled for print so the family checklist comes out cleanly:
navigation and footer hidden, shadows removed, black borders, and external URLs
printed after their link text.

---

## How this was verified

**Automated, every page × 7 widths (133 combinations):**

```bash
node scripts/audit-breakpoints.mjs
```

Checks horizontal overflow (and names the offending element), missing alt
attributes, `<h1>` count, skipped heading levels, links and buttons with no
accessible name, **colour contrast against WCAG AA**, **`<dl>` structure**,
missing `<main>`, missing skip link, missing `<title>`, and console errors.
**Currently passes with zero findings.**

The contrast check computes the effective ratio properly: text alpha, every
layer of translucent background composited in turn, and cumulative ancestor
`opacity`. It skips two documented cases it cannot measure - subtrees flagged
`[data-svg-backed]`, which are filled by an SVG polygon rather than a CSS
background, and `[data-reveal="hidden"]`, which is scroll-reveal content not yet
on screen.

**Unit tests** (`npm test`) cover the dialog semantics, focus restoration,
Escape handling, arrow-key navigation, `aria-pressed` state, form error
announcement and alt-text length.

---

## What has not been done

Be honest with anyone who asks:

- **No screen-reader pass.** NVDA, JAWS and VoiceOver have not been used
  manually. That is the single most valuable next step.
- **No standalone axe-core run.** Lighthouse's accessibility category runs a
  subset of axe rules and scores 100 on every page, and the custom audit adds
  structural, contrast and `<dl>` checks on top - but a full axe pass on every
  page would still be more thorough.
- **No testing with disabled users.**
- **Video captions** depend on the hosting platform and have not been verified.
- **External sites** — the donation platform, Instagram, TikTok, any store — are
  outside our control.

---

## Keeping it accessible

When adding anything:

1. Use the existing components. They already handle the semantics.
2. New icon-only button? Add an `sr-only` label.
3. New image? Real alt text, or `alt="" aria-hidden="true"` if decorative.
4. New decorative texture? `aria-hidden="true"` and `pointer-events-none`.
5. New heading? Check it does not skip a level.
6. New animation? Make sure `prefers-reduced-motion` disables it.
7. Run `node scripts/audit-breakpoints.mjs` before pushing.

A visitor should be able to find out what Cooper does, learn how to stay safe
online, and donate — using only a keyboard, or only a screen reader, or with
motion switched off.
