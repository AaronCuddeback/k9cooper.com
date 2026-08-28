/**
 * Post-export cleanup.
 *
 * `output: 'export'` refuses to build a dynamic route whose
 * generateStaticParams() returns an empty array, so while there are no
 * published adventures or events those routes emit one throwaway slug
 * ('none-published-yet'). See the comment in each [slug]/page.tsx.
 *
 * The emitted file is a near-empty shell, because notFound() has nothing to
 * render server-side in an export. Leaving it in place means
 * /adventures/none-published-yet serves a blank page instead of the site's
 * real 404. Deleting it lets Cloudflare fall through to 404.html, which is
 * what we want.
 *
 * This is a no-op once real content exists - the placeholder is not generated
 * at all then, so nothing matches and nothing is removed.
 */
import { rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'out')
const PLACEHOLDER = 'none-published-yet'

if (!existsSync(OUT)) {
  console.log('[postbuild] no ./out directory - nothing to clean')
  process.exit(0)
}

const targets = ['adventures', 'events'].flatMap((route) => [
  join(OUT, route, `${PLACEHOLDER}.html`),
  join(OUT, route, `${PLACEHOLDER}.txt`),
])

let removed = 0
for (const path of targets) {
  if (!existsSync(path)) continue
  await rm(path, { force: true })
  removed += 1
}

console.log(
  removed > 0
    ? `[postbuild] removed ${removed} placeholder file(s) so they 404 properly`
    : '[postbuild] no placeholder files present - real content is published',
)
