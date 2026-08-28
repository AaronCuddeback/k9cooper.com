/**
 * ADVENTURES / MISSION LOGS
 * ----------------------------------------------------------------------------
 * HOW TO ADD A STORY
 *   1. Copy an entry below, paste it at the TOP of the `adventures` array.
 *   2. Change `slug`, `title`, `date`, `category`, `summary` and `body`.
 *   3. Drop any new photos into /public/images/adventures/ and reference them.
 *   4. Delete `isSample: true` from real posts.
 *
 * BODY BLOCKS - the `body` array accepts these shapes:
 *   { type: 'p',      text: '...' }
 *   { type: 'h',      text: '...' }                       // section heading
 *   { type: 'list',   items: ['...', '...'] }
 *   { type: 'quote',  text: '...', attribution: '...' }
 *   { type: 'callout',label: 'Cooper’s Safety Tip', text: '...' }
 *   { type: 'image',  src: '/images/...', alt: '...', caption: '...' }
 *
 * WHAT NOT TO PUBLISH
 *   Do not describe live investigations, case outcomes, search tactics,
 *   addresses, or anything that would help a person hide a device. Training
 *   and community stories only, unless specifically cleared.
 */

export type AdventureCategory =
  | 'Training'
  | 'Community'
  | 'Behind the Scenes'
  | 'Demonstration'
  | 'Travel'
  | 'Milestone'

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'callout'; label: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export interface Adventure {
  slug: string
  title: string
  /** ISO date, e.g. "2026-08-14". */
  date: string
  category: AdventureCategory
  cover: { src: string; alt: string }
  summary: string
  body: Block[]
  /** Extra photos shown in a gallery strip under the story. */
  gallery?: { src: string; alt: string }[]
  /** Optional video. `provider` drives the click-to-load facade. */
  video?: {
    provider: 'youtube' | 'vimeo'
    id: string
    title: string
    /** Local poster image. Falls back to a comic placeholder if omitted. */
    poster?: string
  }
  featured?: boolean
  isSample?: boolean
}

export const adventures: Adventure[] = [
  /*
    No mission logs published yet. Add one by following the "HOW TO ADD A STORY"
    steps at the top of this file. The listing page, the browser, the homepage
    "latest adventures" strip and the individual story pages all pick it up.
  */
]

/* ------------------------------------------------------------------------- */

export const sortedAdventures = [...adventures].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)

export function getAdventure(slug: string): Adventure | undefined {
  return adventures.find((a) => a.slug === slug)
}

export function relatedAdventures(slug: string, limit = 2): Adventure[] {
  const current = getAdventure(slug)
  if (!current) return sortedAdventures.slice(0, limit)
  const sameCategory = sortedAdventures.filter(
    (a) => a.slug !== slug && a.category === current.category,
  )
  const others = sortedAdventures.filter(
    (a) => a.slug !== slug && a.category !== current.category,
  )
  return [...sameCategory, ...others].slice(0, limit)
}

export const adventureCategories: AdventureCategory[] = [
  'Training',
  'Community',
  'Behind the Scenes',
  'Demonstration',
  'Travel',
  'Milestone',
]
