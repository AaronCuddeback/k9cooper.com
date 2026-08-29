/**
 * STATIC SERVER FOR THE EXPORTED SITE
 * ----------------------------------------------------------------------------
 * The site builds with `output: 'export'`, so `next start` refuses to run it.
 * The QA scripts need something to point at, and `npx serve` proved unreliable
 * here - it opens a read stream per request and fell over with EMFILE part-way
 * through a 133-page audit, after which every remaining page measured as blank
 * and the audit reported 133 false failures.
 *
 * This does the same job in ~80 lines with buffered reads, so there are no
 * long-lived handles to exhaust. It mirrors the two behaviours the export
 * relies on: clean URLs (`/faq` serves `faq.html`) and a real 404 page.
 *
 *   node scripts/serve-export.mjs [port]
 *
 * Defaults to port 3000. Ctrl-C to stop.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const ROOT = join(process.cwd(), 'out')
const PORT = Number(process.argv[2] ?? 3000)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
}

async function readIfFile(path) {
  try {
    const s = await stat(path)
    if (!s.isFile()) return null
    return await readFile(path)
  } catch {
    return null
  }
}

/** Resolve a URL path to a file the way a static host would. */
async function resolve(pathname) {
  // Block traversal above the export root.
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const base = join(ROOT, safe)

  const candidates = extname(safe)
    ? [base]
    : [base, `${base}.html`, join(base, 'index.html')]

  for (const candidate of candidates) {
    if (!candidate.startsWith(ROOT)) continue
    const body = await readIfFile(candidate)
    if (body) return { body, path: candidate }
  }
  return null
}

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  const hit = await resolve(pathname === '/' ? '/index.html' : pathname)

  if (hit) {
    const type = TYPES[extname(hit.path)] ?? 'application/octet-stream'
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    })
    res.end(hit.body)
    return
  }

  const notFound = await readIfFile(join(ROOT, '404.html'))
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(notFound ?? 'Not found')
})

server.listen(PORT, () => {
  console.log(`Serving ./out on http://localhost:${PORT}`)
})
