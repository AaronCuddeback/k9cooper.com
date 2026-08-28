/**
 * Screenshot helper for visual QA.
 *
 * Uses the DevTools protocol with real device-metric emulation, so mobile
 * widths reflect the actual layout viewport (Chrome's --window-size flag does
 * not, which makes naive headless screenshots misleading on phones).
 *
 *   node scripts/shot.mjs <out-dir> <width> <path> [path...]
 *
 * Example:
 *   node scripts/shot.mjs ./shots 390 / /safety-hq /support
 */
import { spawn } from 'node:child_process'
import http from 'node:http'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
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
  console.error('No Chrome or Edge binary found.')
  process.exit(1)
}

const [outDir, widthArg, ...paths] = process.argv.slice(2)
if (!outDir || !widthArg || paths.length === 0) {
  console.error('usage: node scripts/shot.mjs <out-dir> <width> <path> [path...]')
  process.exit(1)
}

const width = Number(widthArg)
const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3000'
const PORT = 9223
mkdirSync(outDir, { recursive: true })

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${join(process.env.TEMP ?? '/tmp', 'cooper-shot-profile')}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port: PORT, path }, (res) => {
        let d = ''
        res.on('data', (c) => (d += c))
        res.on('end', () => resolve(JSON.parse(d)))
      })
      .on('error', reject)
  })
}

for (let i = 0; i < 80; i += 1) {
  try {
    await get('/json/version')
    break
  } catch {
    await new Promise((r) => setTimeout(r, 400))
  }
}

const targets = await get('/json/list')
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl, {
  maxPayload: 256 * 1024 * 1024,
})
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
  new Promise((resolve) => {
    const i = ++id
    pending.set(i, resolve)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height: 900,
  deviceScaleFactor: 1,
  mobile: width < 768,
})

for (const path of paths) {
  await send('Page.navigate', { url: BASE + path })
  await new Promise((r) => setTimeout(r, 2600))

  // Scroll to the bottom and back so lazy images and reveals fire.
  await send('Runtime.evaluate', {
    expression:
      'window.scrollTo(0, document.body.scrollHeight); new Promise(r => setTimeout(r, 900)).then(() => window.scrollTo(0, 0))',
    awaitPromise: true,
  })
  await new Promise((r) => setTimeout(r, 900))

  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: await fullPageClip(width),
  })

  const name = (path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-')) + `-${width}`
  const file = join(outDir, `${name}.png`)
  writeFileSync(file, Buffer.from(result.result.data, 'base64'))
  console.log(file)
}

async function fullPageClip(w) {
  const r = await send('Runtime.evaluate', {
    expression: 'Math.min(document.documentElement.scrollHeight, 12000)',
    returnByValue: true,
  })
  return { x: 0, y: 0, width: w, height: r.result.result.value, scale: 1 }
}

ws.close()
chrome.kill()
