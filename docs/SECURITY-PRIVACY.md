# Security and privacy

## The short version

The most secure code is code that does not exist. This site has:

- no database
- no user accounts or authentication
- no server-side form handler
- no payment processing
- no API keys of any kind
- no third-party scripts loaded on page load

Every page is prerendered static HTML. There is essentially no attack surface,
and nothing stored that could be breached.

---

## Threat model

| Risk | Status |
| --- | --- |
| Database breach | No database exists |
| Credential stuffing / account takeover | No accounts exist |
| Payment card theft | No payment data ever touches this site |
| Form spam and abuse | No server endpoint to abuse |
| Leaked API key | No keys in the project |
| XSS via user content | No user-generated content |
| XSS via injected JSON-LD | `<` escaped in `jsonLd()` before injection |
| Malicious external redirect | All external links are hard-coded in config |
| Tab-nabbing | `rel="noopener noreferrer"` on every external link |
| Supply-chain compromise | 5 runtime dependencies. See below. |

---

## Dependencies

Runtime: `next`, `react`, `react-dom`, `lucide-react`. That is it.

Framer Motion was removed during the build — a 400-byte `IntersectionObserver`
component replaced it, cutting both the bundle and one more package to trust.

Everything else is a dev dependency and never reaches a visitor.

```bash
npm audit
npm outdated
```

Run both quarterly. Next.js security patches should be applied promptly.

---

## Security headers

Set in `next.config.ts` and applied to every route:

| Header | Value | Why |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Stops MIME sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Stops clickjacking via framing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | camera, microphone, geolocation all denied | The site never needs them |
| `Strict-Transport-Security` | 2 years, includeSubDomains, preload | Forces HTTPS |
| `X-DNS-Prefetch-Control` | `on` | Minor performance |

`poweredByHeader` is disabled so the stack is not advertised.

### Content Security Policy

**Not yet enabled.** Next.js inlines a bootstrap script and critical CSS, so a
strict CSP needs a per-request nonce, which needs middleware — and middleware
means the site is no longer purely static.

If you want one, the standard approach is a nonce-based CSP generated in
`middleware.ts`. Weigh it against losing full static rendering. The current risk
is low because there is no user content and no third-party script.

---

## External links

Every link that leaves the site:

- opens in a new tab
- carries `rel="noopener noreferrer"`
- announces "(opens in a new tab)" to screen readers

`<LinkButton>` and `<DonateButton>` apply this automatically. Use them rather
than raw anchors.

---

## Donations

Donations are handled entirely by the external platform (Zeffy) on their own
pages.

- This site never sees, processes, transmits or stores payment information.
- The donate button is a plain outbound link.
- No iframe, no embedded payment widget, no card fields anywhere.
- The QR code encodes the same URL as the button.

This is stated plainly on the support page and in the privacy notice, because it
is a genuine trust signal, not just a legal nicety.

**If you change the donation URL**, regenerate the QR code image to match.
Nothing validates that they agree.

---

## The contact form

The form does **not** submit to a server. It validates locally, then opens the
visitor's own email client with a pre-written message.

Consequences, all good:

- No endpoint to spam, so no CAPTCHA needed.
- No mail-provider API key to leak.
- No inbox to fill with bot submissions.
- The visitor keeps a copy in their own sent items.
- Nothing typed into the form is ever transmitted to this website.

A honeypot field is already in place for when a real backend is added.

### If you later add a server-side form

`src/components/contact/ContactForm.tsx` has a comment block with the steps.
Non-negotiables:

1. Re-validate every field on the server. Never trust the client checks.
2. Rate limit by IP.
3. Keep the honeypot, and add a privacy-respecting challenge if needed.
4. Mail provider key in a **non-**`NEXT_PUBLIC_` environment variable.
5. Never log message contents.
6. Keep the "do not send case information" warning.

---

## Data collected

**None.** No accounts, no forms that submit, no comments, no newsletter, no
tracking.

Two things are written to the visitor's own browser storage. Neither is a cookie
and neither is ever transmitted:

| Key | Contents | Why |
| --- | --- | --- |
| `cooper:safety-shield` | Which shield items are ticked | So progress survives a reload |
| `cooper:sticky-donate-dismissed` | A single flag | So the mobile bar stays closed |

Both are wrapped in `try/catch` so private browsing with storage disabled does
not break anything.

---

## Children

Parts of this site are written for children, which raises the bar:

- No personal information is collected from anyone, of any age.
- No way for a child to create an account, submit anything, upload anything, or
  be contacted through the site.
- No behavioural advertising and no ad or tracking pixels.
- No comment section and no user-generated content.
- No social embeds that would let a platform set cookies before a deliberate
  click.
- Video players load only after the visitor presses play.

**This is not a compliance claim.** COPPA and applicable state privacy law
should be reviewed by a qualified professional before launch. The design
minimises exposure; it does not certify anything.

---

## Operational security in content

The content deliberately avoids:

- search tactics and deployment procedures
- training thresholds and detection limits
- case details, outcomes or investigative information
- private addresses, non-public appearances or operational locations
- anything that would help a person conceal a device

`src/content/events.ts` supports `visibility: 'private'`, which filters an event
out of every view — but the safer habit is simply not to add it.

Filenames, alt text and metadata were reviewed for the same reason.

Every page where someone might try to report something states plainly that the
site cannot take reports and that emergencies go to 911.

---

## If something goes wrong

There is no database to restore and no user data to notify anyone about. The
site is a static build from a Git repository, so recovery is a redeploy.

1. Roll back to the previous deployment in Vercel — instant.
2. Or `git revert` and push.

Keep the repository private if the owner prefers. Nothing in it is secret, but
there is no reason to publish the content pipeline either.
