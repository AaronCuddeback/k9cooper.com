/**
 * MOBILE DRAWER GEOMETRY CHECK
 * ----------------------------------------------------------------------------
 * Opens the mobile navigation at each phone width and verifies it is actually
 * usable. This exists because a real bug slipped past both the unit tests and
 * the static audit: the header carries `backdrop-blur`, and `backdrop-filter`
 * makes an element a containing block for `position: fixed` descendants, so the
 * drawer's `fixed inset-0` resolved against the 64px header instead of the
 * viewport. It collapsed to a sliver with every link stacked on top of itself.
 *
 * jsdom cannot catch that (no layout), and the static audit never opens the
 * drawer. So this does.
 *
 * Start the server, then:  node scripts/audit-mobile-nav.mjs
 */
import { spawn } from 'node:child_process'
import http from 'node:http'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => existsSync(p))

if (!CHROME) {
  console.error('No Chrome or Edge binary found.')
  process.exit(1)
}

const PORT = 9241
const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3000'
const WIDTHS = [320, 375, 390, 430, 768]

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    `--user-data-dir=${join(process.env.TEMP ?? '/tmp', 'cooper-navcheck')}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const get = (p) =>
  new Promise((res, rej) =>
    http
      .get({ host: '127.0.0.1', port: PORT, path: p }, (r) => {
        let d = ''
        r.on('data', (c) => (d += c))
        r.on('end', () => res(JSON.parse(d)))
      })
      .on('error', rej),
  )

for (let i = 0; i < 80; i += 1) {
  try {
    await get('/json/version')
    break
  } catch {
    await new Promise((r) => setTimeout(r, 400))
  }
}

const target = (await get('/json/list')).find((t) => t.type === 'page')
const ws = new WebSocket(target.webSocketDebuggerUrl, { maxPayload: 64 * 1024 * 1024 })
await new Promise((r) => ws.on('open', r))

let id = 0
const pending = new Map()
ws.on('message', (raw) => {
  const m = JSON.parse(raw)
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m)
    pending.delete(m.id)
  }
})
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const evaluate = async (expression) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }))
    .result?.result?.value

await send('Page.enable')
await send('Runtime.enable')

const INSPECT = `(() => {
  const dlg = document.getElementById('mobile-drawer');
  if (!dlg) return { error: 'drawer did not open' };
  const r = dlg.getBoundingClientRect();
  const nav = dlg.querySelector('nav');

  // A link inside a scrolling container still reports coordinates when it is
  // scrolled out of sight, so clip every rect to its scrollable ancestors and
  // only reason about what is actually on screen.
  function visibleRect(el) {
    let r = el.getBoundingClientRect();
    let top = r.top, bottom = r.bottom, left = r.left, right = r.right;
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (!/auto|scroll|hidden|clip/.test(cs.overflowY + cs.overflowX)) continue;
      const c = n.getBoundingClientRect();
      top = Math.max(top, c.top);
      bottom = Math.min(bottom, c.bottom);
      left = Math.max(left, c.left);
      right = Math.min(right, c.right);
    }
    return { top, bottom, left, right, h: Math.max(0, bottom - top), w: Math.max(0, right - left) };
  }

  const all = [...dlg.querySelectorAll('a')];
  const links = all.map((a) => {
    const full = a.getBoundingClientRect();
    const vis = visibleRect(a);
    return {
      label: a.innerText.trim().slice(0, 24),
      top: vis.top, bottom: vis.bottom, left: vis.left, right: vis.right,
      h: vis.h, w: vis.w,
      fullH: full.height, fullW: full.width,
      onScreen: vis.h > 4 && vis.w > 4,
    };
  });

  const shown = links.filter((l) => l.onScreen);

  // Genuine 2D intersection - links sitting side by side in a row (the social
  // icons) share a vertical band without actually overlapping.
  let overlaps = 0;
  const overlapExamples = [];
  for (let i = 0; i < shown.length; i += 1) {
    for (let j = i + 1; j < shown.length; j += 1) {
      const a = shown[i], b = shown[j];
      const vOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      const hOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      if (vOverlap > 2 && hOverlap > 2) {
        overlaps += 1;
        if (overlapExamples.length < 3) overlapExamples.push(a.label + ' / ' + b.label);
      }
    }
  }

  return {
    drawerHeight: Math.round(r.height),
    drawerWidth: Math.round(r.width),
    viewportHeight: innerHeight,
    viewportWidth: innerWidth,
    navScrollable: nav ? nav.scrollHeight > nav.clientHeight : false,
    navClientHeight: nav ? nav.clientHeight : 0,
    linkCount: links.length,
    onScreenLinks: shown.length,
    // Laid-out size of zero means the link is genuinely broken, not just scrolled away.
    zeroSizeLinks: links.filter((l) => l.fullH < 1 || l.fullW < 1).length,
    overlappingPairs: overlaps,
    overlapExamples,
    bodyLocked: document.body.style.overflow === 'hidden',
    hasDonate: !!dlg.querySelector('[data-testid="donate-button"]'),
    smallTargets: links.filter((l) => l.fullH > 0 && l.fullH < 24).length,
  };
})()`

const findings = []

for (const width of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 844,
    deviceScaleFactor: 1,
    mobile: width < 768,
  })
  await send('Page.navigate', { url: BASE + '/' })
  await new Promise((r) => setTimeout(r, width === WIDTHS[0] ? 3000 : 1400))

  const hasToggle = await evaluate(
    `!!document.querySelector('button[aria-controls="mobile-drawer"]')`,
  )

  // At 768px the drawer is still the active pattern (desktop nav starts at lg).
  if (!hasToggle) {
    findings.push({ width, problems: ['no menu button rendered'] })
    continue
  }

  await evaluate(`document.querySelector('button[aria-controls="mobile-drawer"]').click()`)
  await new Promise((r) => setTimeout(r, 600))

  const d = await evaluate(INSPECT)
  const problems = []

  if (!d || d.error) {
    problems.push(d?.error ?? 'inspection failed')
  } else {
    // The drawer must fill the viewport height, not its containing block.
    if (d.drawerHeight < d.viewportHeight - 2)
      problems.push(
        `drawer is ${d.drawerHeight}px tall but the viewport is ${d.viewportHeight}px` +
          ' - it is probably trapped in a containing block (backdrop-filter, transform, filter)',
      )
    if (d.overlappingPairs > 0)
      problems.push(
        `${d.overlappingPairs} pair(s) of on-screen links overlap: ${d.overlapExamples.join('; ')}`,
      )
    if (d.zeroSizeLinks > 0) problems.push(`${d.zeroSizeLinks} link(s) have zero size`)
    if (d.smallTargets > 0)
      problems.push(`${d.smallTargets} link(s) under the 24px target-size minimum`)
    if (!d.bodyLocked) problems.push('body scroll was not locked')
    if (!d.hasDonate) problems.push('no donate control inside the drawer')
    if (d.linkCount < 10) problems.push(`only ${d.linkCount} links found`)
  }

  if (problems.length) findings.push({ width, problems })
  else
    console.log(
      `  ${String(width).padStart(4)}px  OK  drawer ${d.drawerHeight}px, ${d.linkCount} links,` +
        ` ${d.onScreenLinks} on screen, nav ${d.navScrollable ? 'scrolls' : 'fits'}`,
    )

  await evaluate(`document.querySelector('#mobile-drawer button')?.click()`)
}

console.log('')
if (findings.length === 0) {
  console.log(`PASS - mobile drawer usable at all ${WIDTHS.length} widths.`)
} else {
  for (const f of findings) {
    console.log(`  ${f.width}px`)
    for (const p of f.problems) console.log(`      - ${p}`)
  }
}

ws.close()
chrome.kill()
process.exit(findings.length === 0 ? 0 : 1)
