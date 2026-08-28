/**
 * Renders a local HTML file to a PNG at exact pixel dimensions.
 *
 * Built for social cards, where the platform expects a precise size and
 * downscales anything larger (Instagram feed: 1080x1350 for 4:5 portrait).
 * Captures at deviceScaleFactor 2 and lets you downscale afterwards, which
 * keeps text crisp instead of soft.
 *
 *   node scripts/social-card.mjs <input.html> <output.png> <width> <height> [scale]
 *
 * Example:
 *   node scripts/social-card.mjs card.html card@2x.png 1080 1350 2
 *
 * Shares the Chrome-discovery approach with scripts/shot.mjs.
 */
import { spawn } from 'node:child_process'
import http from 'node:http'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
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

const [inFile, outFile, wArg, hArg, scaleArg] = process.argv.slice(2)
if (!inFile || !outFile || !wArg || !hArg) {
  console.error(
    'usage: node scripts/social-card.mjs <input.html> <output.png> <width> <height> [scale]',
  )
  process.exit(1)
}

const width = Number(wArg)
const height = Number(hArg)
const scale = Number(scaleArg ?? 2)
const PORT = 9224

mkdirSync(dirname(resolve(outFile)), { recursive: true })

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--allow-file-access-from-files',
    `--user-data-dir=${resolve(process.env.TEMP ?? '/tmp', 'cooper-card-profile')}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

function get(path) {
  return new Promise((res, rej) => {
    http
      .get({ host: '127.0.0.1', port: PORT, path }, (r) => {
        let d = ''
        r.on('data', (c) => (d += c))
        r.on('end', () => res(JSON.parse(d)))
      })
      .on('error', rej)
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
  new Promise((r) => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: scale,
  mobile: false,
})

await send('Page.navigate', { url: pathToFileURL(resolve(inFile)).href })
// Give webfonts and images time to load and paint.
await new Promise((r) => setTimeout(r, 3500))
await send('Runtime.evaluate', {
  expression: 'document.fonts ? document.fonts.ready.then(() => true) : true',
  awaitPromise: true,
})
await new Promise((r) => setTimeout(r, 500))

/*
  clip.scale stays at 1. The device-metrics override above already applies
  deviceScaleFactor, so passing `scale` here too multiplies it a second time
  and silently yields a 4x image when you asked for 2x.
*/
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: false,
  clip: { x: 0, y: 0, width, height, scale: 1 },
})

writeFileSync(resolve(outFile), Buffer.from(shot.result.data, 'base64'))
console.log(
  `[social-card] wrote ${outFile} at ${width * scale}x${height * scale} (${width}x${height} @${scale}x)`,
)

ws.close()
chrome.kill()
process.exit(0)
