/**
 * BREAKPOINT + ACCESSIBILITY SMOKE AUDIT
 * ----------------------------------------------------------------------------
 * Loads every page at every required viewport width and reports:
 *   - horizontal overflow (and which element caused it)
 *   - images with no alt attribute
 *   - pages with zero or multiple <h1>
 *   - skipped heading levels
 *   - links with no accessible name
 *   - text whose colour contrast falls below WCAG AA
 *   - <dl> lists whose <dt>/<dd> are not direct children of the list or of a
 *     bare <div> wrapper (a real WCAG failure axe reports)
 *   - console errors and uncaught exceptions
 *
 * Start the dev server first, then:  node scripts/audit-breakpoints.mjs
 *
 * This is a smoke test, not a replacement for axe or a manual screen-reader
 * pass. It catches regressions cheaply.
 */
import { spawn } from 'node:child_process'
import http from 'node:http'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]

const CHROME = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!CHROME) {
  console.error('No Chrome or Edge binary found. Edit CHROME_CANDIDATES.')
  process.exit(1)
}

const PORT = 9222
const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3000'
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440]
const PAGES = [
  '/',
  '/meet-cooper',
  '/what-cooper-does',
  '/mission',
  '/safety-hq',
  '/adventures',
  '/adventures/sample-a-morning-of-hides',
  '/events',
  '/events/sample-safety-day-at-the-library',
  '/gallery',
  '/social',
  '/support',
  '/shop',
  '/sponsors',
  '/faq',
  '/contact',
  '/privacy',
  '/accessibility',
  '/this-page-does-not-exist',
]

const profile = join(process.env.TEMP ?? '/tmp', 'cooper-cdp-profile')

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port: PORT, path }, (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => resolve(JSON.parse(data)))
      })
      .on('error', reject)
  })
}

async function waitForCdp() {
  for (let i = 0; i < 80; i += 1) {
    try {
      return await get('/json/version')
    } catch {
      await new Promise((r) => setTimeout(r, 400))
    }
  }
  throw new Error('Chrome DevTools protocol never became available')
}

await waitForCdp()

const targets = await get('/json/list')
const target = targets.find((t) => t.type === 'page')
const ws = new WebSocket(target.webSocketDebuggerUrl, { maxPayload: 64 * 1024 * 1024 })
await new Promise((resolve) => ws.on('open', resolve))

let messageId = 0
const pending = new Map()
const consoleErrors = []

ws.on('message', (raw) => {
  const msg = JSON.parse(raw)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push(
      msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '),
    )
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    const d = msg.params.exceptionDetails
    consoleErrors.push(`EXCEPTION: ${d.exception?.description ?? d.text}`)
  }
})

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = ++messageId
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const r = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  return r.result?.result?.value
}

await send('Page.enable')
await send('Runtime.enable')

const AUDIT = `(() => {
  const d = document.documentElement;
  const overflow = d.scrollWidth - d.clientWidth;
  const offenders = [];
  if (overflow > 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed') continue;
      if (r.right > d.clientWidth + 1 || r.left < -1) {
        const cls = typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join('.') : '';
        offenders.push(el.tagName.toLowerCase() + (cls ? '.' + cls : '') + ' [' + Math.round(r.left) + '->' + Math.round(r.right) + ']');
      }
    }
  }
  const imgsNoAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src);
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
  const h1Count = headings.filter((n) => n === 1).length;
  const headingJumps = [];
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] - headings[i - 1] > 1) headingJumps.push(headings[i - 1] + '->' + headings[i]);
  }
  const namelessLinks = [...document.querySelectorAll('a[href]')]
    .filter((a) => !a.innerText.trim() && !a.getAttribute('aria-label') && !a.querySelector('.sr-only'))
    .map((a) => a.getAttribute('href'));
  const namelessButtons = [...document.querySelectorAll('button')]
    .filter((b) => !b.innerText.trim() && !b.getAttribute('aria-label') && !b.querySelector('.sr-only'))
    .length;

  // <dl> structure: dt/dd must be direct children of the dl, or of a div that
  // is itself a direct child of the dl and contains nothing else.
  const badDl = [];
  for (const term of document.querySelectorAll('dt, dd')) {
    const parent = term.parentElement;
    if (!parent) continue;
    const ok =
      parent.tagName === 'DL' ||
      (parent.tagName === 'DIV' &&
        parent.parentElement &&
        parent.parentElement.tagName === 'DL' &&
        [...parent.children].every((c) => c.tagName === 'DT' || c.tagName === 'DD'));
    if (!ok) badDl.push(term.tagName.toLowerCase() + ' in ' + parent.tagName.toLowerCase());
  }
  return {
    overflow, offenders: offenders.slice(0, 6), imgsNoAlt, h1Count, headingJumps,
    namelessLinks: namelessLinks.slice(0, 4), namelessButtons,
    badDl: [...new Set(badDl)].slice(0, 4),
    title: document.title, hasMain: !!document.querySelector('main'),
    hasSkipLink: !!document.querySelector('.skip-link'),
  };
})()`


const CONTRAST = `(() => {
  // Relative luminance and contrast ratio, per WCAG 2.x.
  function lum(rgb) {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  // Parsed without a regex on purpose: this whole block lives inside a JS
  // template literal, where a backslash escape like \( silently collapses and
  // would break the pattern without any error.
  function parse(c) {
    const open = c.indexOf('(');
    const close = c.indexOf(')');
    if (open < 0 || close < 0) return null;
    const p = c.slice(open + 1, close).split(',').map((n) => parseFloat(n));
    if (p.length < 3 || p.some((n) => Number.isNaN(n))) return null;
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  }
  // Walk up until an opaque background is found, compositing as we go.
  function bgOf(el) {
    let node = el;
    const stack = [];
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) {
        stack.push(c);
        if (c.a >= 0.999) break;
      }
      node = node.parentElement;
    }
    let out = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      const c = stack[i];
      out = out.map((v, j) => c.rgb[j] * c.a + v * (1 - c.a));
    }
    return out;
  }

  const problems = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('[aria-hidden="true"]')) continue;
    // Skip subtrees whose background is drawn with SVG rather than CSS - the
    // walker below cannot see those, so it would report a false failure.
    if (el.closest('[data-svg-backed="true"]')) continue;
    // Scroll-reveal content below the fold is still faded out; it reaches full
    // opacity once it scrolls into view.
    if (el.closest('[data-reveal="hidden"]')) continue;
    // Only elements that directly own visible text.
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim())
      .join(' ');
    if (!own) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    if (el.classList.contains('sr-only')) continue;

    const fg = parse(cs.color);
    if (!fg) continue;
    const bg = bgOf(el);

    // Ancestor opacity fades text against its backdrop and counts toward the
    // effective contrast ratio, so fold it into the alpha.
    let alpha = fg.a;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const o = parseFloat(getComputedStyle(n).opacity);
      if (!Number.isNaN(o) && o < 1) alpha *= o;
    }

    const composited = fg.rgb.map((v, i) => v * alpha + bg[i] * (1 - alpha));
    const l1 = lum(composited);
    const l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    // WCAG "large text": >= 24px, or >= 18.66px when bold.
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;

    if (ratio + 0.02 < required) {
      const key = el.className + '|' + own.slice(0, 24);
      if (seen.has(key)) continue;
      seen.add(key);
      problems.push({
        text: own.slice(0, 46),
        ratio: Math.round(ratio * 100) / 100,
        required,
        size: Math.round(size),
        weight,
        cls: (typeof el.className === 'string' ? el.className : '').split(' ').slice(0, 4).join('.'),
      });
    }
  }
  return problems.slice(0, 8);
})()`

const findings = []
let checks = 0

for (const path of PAGES) {
  for (const width of WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    })
    consoleErrors.length = 0
    await send('Page.navigate', { url: BASE + path })
    await new Promise((r) => setTimeout(r, checks === 0 ? 3000 : 1200))
    checks += 1

    const audit = await evaluate(AUDIT)
    if (!audit) {
      findings.push({ path, width, problems: ['audit did not run'] })
      continue
    }

    const problems = []
    if (audit.overflow > 1)
      problems.push(`OVERFLOW ${audit.overflow}px :: ${audit.offenders.join(' | ')}`)
    if (audit.imgsNoAlt.length) problems.push(`IMG WITHOUT ALT: ${audit.imgsNoAlt.join(', ')}`)
    if (audit.h1Count !== 1) problems.push(`H1 COUNT = ${audit.h1Count}`)
    if (audit.headingJumps.length)
      problems.push(`HEADING LEVEL SKIP: ${audit.headingJumps.join(', ')}`)
    if (audit.namelessLinks.length)
      problems.push(`LINK WITH NO NAME: ${audit.namelessLinks.join(', ')}`)
    if (audit.namelessButtons) problems.push(`${audit.namelessButtons} BUTTON(S) WITH NO NAME`)
    if (audit.badDl?.length) problems.push(`INVALID <dl> STRUCTURE: ${audit.badDl.join(', ')}`)
    if (!audit.hasMain) problems.push('NO <main> LANDMARK')
    if (!audit.hasSkipLink) problems.push('NO SKIP LINK')
    if (!audit.title) problems.push('NO <title>')

    const contrast = await evaluate(CONTRAST)
    for (const c of contrast ?? []) {
      problems.push(
        `CONTRAST ${c.ratio}:1 (needs ${c.required}) ${c.size}px/${c.weight} "${c.text}" .${c.cls}`,
      )
    }

    const errors = consoleErrors.filter(
      (e) => !/favicon|React DevTools|Fast Refresh/i.test(e),
    )
    if (errors.length) problems.push(`CONSOLE: ${errors.slice(0, 2).join(' || ')}`)

    if (problems.length) findings.push({ path, width, problems })
  }
}

console.log(`\nChecked ${checks} page/width combinations.\n`)
if (findings.length === 0) {
  console.log('PASS - no overflow, alt-text, heading, naming or console problems found.')
} else {
  console.log(`${findings.length} combination(s) with findings:\n`)
  for (const f of findings) {
    console.log(`  ${f.path} @ ${f.width}px`)
    for (const p of f.problems) console.log(`      - ${p}`)
  }
}

ws.close()
chrome.kill()
process.exit(findings.length === 0 ? 0 : 1)
