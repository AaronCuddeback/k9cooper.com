# Deployment

The site is hosted on **Cloudflare Pages**, free tier, at **k9cooper.com**.

- **Cost:** $0/month for hosting. You pay only to renew the domain at Namecheap.
- **How it updates:** push to `main` on GitHub → Cloudflare builds and publishes
  automatically, usually within a couple of minutes.

---

## Why Cloudflare and not Vercel or Netlify

Worth recording, because the obvious choice is wrong here.

**Vercel** is the default host for Next.js, but its
[fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) state
the free Hobby plan is "restricted to non-commercial personal use only", and
list *"Any method of requesting or processing payment from visitors of the
site"* as commercial usage — with an explicit note that **asking for donations
counts**. This site has a Donate button, a QR code and a shop page. That puts it
on Pro at $20/user/month.

**Netlify** allows commercial use on its free plan, but new accounts run on a
**300 credit/month** budget (bandwidth 20 credits/GB, deploys 15 credits each —
roughly 15 GB). When the credits run out **Netlify pauses every site and
visitors get a "Site not available" page** until the next billing cycle. With a
7.4 MB video on a site whose traffic comes from social media, one popular post
could take it offline.

**Cloudflare Pages** has unmetered bandwidth, no commercial-use restriction and
no pause-on-cap behaviour. Free tier limits are 500 builds/month, 100 custom
domains, 20,000 files, 25 MiB per file. This site is ~200 files and ~27 MB, with
a largest file of 7.4 MB.

### The one Cloudflare catch: video

Cloudflare's terms allow Pages and Workers to serve "non-HTML content (e.g.,
image files, audio files) **other than video files**". The training clip in
`public/videos/` is video.

In practice a single 36-second clip on a small community site is not what that
rule is aimed at, and it is very unlikely to draw attention. The compliant fix,
if you ever want it or if the site grows, is **Cloudflare R2**, which explicitly
permits video and has **no egress charges at all** (free tier: 10 GB storage,
10 million reads/month — the clip is 7.4 MB). See "Moving the video to R2" below.

---

## How the build works

The site is a **static export**. Every page prerenders to plain HTML — there are
no API routes, server actions, middleware or dynamically rendered pages — so
Cloudflare serves files and never runs Node.

`next.config.ts` sets `output: 'export'`, which has three consequences that are
easy to forget:

1. **`headers()` in `next.config.ts` does nothing in production.** Next is not
   in the request path. The live security headers are in **`public/_headers`**,
   which Cloudflare reads. *Change both together or they will drift.*
2. **`next/image` cannot resize on demand,** so `images.unoptimized` is on.
   Images are served exactly as they sit in `/public` — keep them sensibly
   sized at rest. See `docs/ASSETS.md`.
3. **Dynamic routes need at least one param.** While no adventures or events are
   published, `generateStaticParams()` would return an empty array, which the
   export treats as missing and fails the build. Each route emits one throwaway
   slug instead, and `scripts/postbuild-clean.mjs` deletes the resulting file so
   the path 404s properly. All of this becomes a no-op once real content exists.

Build command: `npm run build` → output in `./out`.

---

## First-time setup

Done once. Steps marked **(you)** need an account login, so they cannot be
automated.

### 1. Create the GitHub repository **(you)**

Make a **private** repo — the site content is public but the repo does not need
to be. Do not initialise it with a README, since this project already has one.

Then, in the project folder:

```bash
git remote add origin https://github.com/YOUR-USERNAME/k9cooper.git
```

```bash
git push -u origin main
```

The first push will open a browser window to sign in to GitHub. That is Git
Credential Manager; after the first time it remembers you.

### 2. Connect Cloudflare Pages **(you)**

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to
Git**, pick the repo, then set:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | `20` (add env var `NODE_VERSION` = `20`) |

Set `NEXT_PUBLIC_SITE_URL` to `https://k9cooper.com` in the Pages environment
variables, for both Production and Preview.

### 3. Point k9cooper.com at Cloudflare **(you)**

The domain is registered at **Namecheap**. Cloudflare needs to run DNS for it.

1. In Cloudflare: **Add a site** → `k9cooper.com` → Free plan. Cloudflare will
   give you two nameservers.
2. In Namecheap: **Domain List → Manage → Nameservers → Custom DNS**, and enter
   the two Cloudflare nameservers.
3. Back in Cloudflare Pages: **Custom domains → Set up a custom domain** → add
   both `k9cooper.com` and `www.k9cooper.com`.

Nameserver changes usually take under an hour but can take up to 24. HTTPS
certificates are issued automatically once DNS resolves.

> Leave the Namecheap nameservers alone until Cloudflare shows the domain as
> active, or the site will be unreachable in between.

---

## Routine updates

Once setup is done this is the whole workflow, and Claude can run it:

```bash
git add -A && git commit -m "Describe the change" && git push
```

Cloudflare builds automatically. Watch progress under **Workers & Pages → your
project → Deployments**.

**Rolling back:** open any previous deployment in that list and choose
**Rollback to this deployment**. This is why the site is on Git rather than
direct uploads.

Always run the full check before pushing:

```bash
npm run check
```

That runs typecheck, lint, tests and the production build.

---

## Moving the video to R2 (optional)

Only needed if you want to be strictly correct about Cloudflare's video terms,
or if you add more video.

1. Cloudflare dashboard → **R2 → Create bucket** → name it `k9cooper-media`.
2. Upload `public/videos/cooper-training-day.mp4`.
3. Enable a public URL: either the bucket's **r2.dev** domain, or connect a
   subdomain such as `media.k9cooper.com`.
4. In `src/content/videos.ts`, change the entry's `src` from
   `/videos/cooper-training-day.mp4` to the full R2 URL.
5. Delete the file from `public/videos/` so it stops being committed and served
   from Pages.

Egress from R2 is free, so this costs nothing at this scale.

---

## Troubleshooting

**Build fails with "Page is missing generateStaticParams()".**
An adventures or events route has no entries *and* the placeholder guard was
removed. Restore the guard in the relevant `[slug]/page.tsx`.

**Security headers missing in production.**
Check `public/_headers` exists in the build output (`out/_headers`). It is
copied automatically because it lives in `/public`.

**Social share previews show no image.**
Next writes the Open Graph card as an extensionless file, `out/opengraph-image`.
The `Content-Type: image/png` rule for `/opengraph-image` in `public/_headers`
is what makes it serve as an image. Do not delete that rule.

**Site is live but the domain shows a Cloudflare error.**
DNS has not finished propagating, or the custom domain was not added under
Pages → Custom domains. Both `k9cooper.com` and `www.k9cooper.com` need adding.
