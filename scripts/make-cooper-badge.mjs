/**
 * Builds the site's brand mark: public/images/brand/cooper-badge.png
 *
 * Run with:  node scripts/make-cooper-badge.mjs
 *
 * The site is a personal, educational project about Cooper and is NOT an
 * official Sheriff's Office publication, so it does not use any agency seal or
 * unit logo as its mark. Cooper's own illustrated face is the mark instead.
 *
 * The source is the full-figure "wave" pose. This crops to his head, pads it so
 * the ears do not touch the edge of a circular mask, and writes a 512px square
 * PNG with a transparent background.
 *
 * If the source artwork is ever redrawn, re-check CROP by eye - the numbers
 * below are measured against this specific 577x720 drawing, not derived.
 *
 * Not part of the build. sharp ships with Next.js, so no extra install.
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

const SRC = join(root, 'public', 'images', 'guide', 'cooper-wave.png')
const OUT = join(root, 'public', 'images', 'brand', 'cooper-badge.png')

/** Square window around Cooper's head in the 577x720 source. */
const CROP = { left: 120, top: 0, width: 290, height: 290 }
/** Transparent breathing room so a circular mask does not clip his ears. */
const PAD = 14
const SIZE = 512

const padded = await sharp(SRC)
  .extract(CROP)
  .extend({
    top: PAD,
    bottom: PAD,
    left: PAD,
    right: PAD,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer()

const info = await sharp(padded)
  .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toFile(OUT)

console.log(`brand/cooper-badge.png  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`)
