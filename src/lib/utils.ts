/** Tiny className joiner. Keeps the bundle free of a clsx dependency. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Deterministic pseudo-random index from a string. Used for stable tilts. */
export function hashIndex(seed: string, length: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) % 100000
  }
  return length > 0 ? h % length : 0
}

/** Slight rotation applied to comic panels so the grid never looks machine-set. */
const TILTS = ['-1.1deg', '0.8deg', '-0.5deg', '1.3deg', '-0.9deg', '0.4deg']

export function tiltFor(seed: string): string {
  return TILTS[hashIndex(seed, TILTS.length)]
}

/** True for links that leave the site. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href)
}
