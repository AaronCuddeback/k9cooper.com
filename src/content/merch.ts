/**
 * MERCHANDISE
 * ----------------------------------------------------------------------------
 * HOW TO ADD A PRODUCT
 *   1. Copy an entry, change the `id`, `name`, `price` and `image`.
 *   2. Paste the external store link into `buyUrl`.
 *   3. Set `status` to 'available', 'coming-soon' or 'sold-out'.
 *
 * This site does not process payments. Every product links out to an external
 * store. Do not add tax-deductibility or "proceeds go to X" claims unless the
 * exact wording has been confirmed - see `proceedsNote` below.
 */

export type MerchStatus = 'available' | 'coming-soon' | 'sold-out'

export interface MerchItem {
  id: string
  name: string
  category: 'Stickers' | 'Patches' | 'Apparel' | 'Headwear' | 'Collectibles' | 'Youth'
  description: string
  price?: string
  status: MerchStatus
  images: { src: string; alt: string }[]
  variants?: string[]
  buyUrl?: string
  featured?: boolean
}

/**
 * Shown in the fine print on /shop. Deliberately makes no financial claim: no
 * tax-deductibility, no named beneficiary, no implied agency endorsement.
 * Do not add one without written confirmation.
 */
export const proceedsNote =
  'Merchandise is sold through an external store, not by this website. Buying something is a way to show support and spread the message - it is not a donation, and no claim is made about how any store’s proceeds are used. To give directly toward K9 care costs, use the donation page.'

export const merchItems: MerchItem[] = [
  {
    id: 'hide-the-thing-sticker',
    name: '"Hide the Thing" Die-Cut Sticker',
    category: 'Stickers',
    description:
      'Cooper’s job description in three lines. Weatherproof vinyl, good on a laptop, a water bottle or a hard case.',
    status: 'coming-soon',
    images: [
      {
        src: '/images/comic/cooper-sticker-hide-the-thing.jpg',
        alt: 'Die-cut sticker artwork of Cooper nose-down over a phone, USB drive, memory card and hard drive, reading Hide the thing, I find the thing, I get the food',
      },
    ],
    variants: ['3 inch', '5 inch'],
    featured: true,
  },
  {
    id: 'cooper-comic-poster',
    name: 'ESD K9 Cooper Educational Poster',
    category: 'Collectibles',
    description:
      'The full comic poster used at schools and community events. Explains what an ESD K9 does, where Cooper searches, and what kids can do to stay safe online.',
    status: 'coming-soon',
    images: [
      {
        src: '/images/comic/cooper-comic-poster.jpg',
        alt: 'The full ESD K9 Cooper educational comic poster',
      },
    ],
    variants: ['11x17', '18x24'],
    featured: true,
  },
  {
    id: 'cooper-patch',
    name: 'ESD K9 Cooper Patch',
    category: 'Patches',
    description:
      'Embroidered hook-and-loop patch, sized for a vest, bag or cap.',
    status: 'coming-soon',
    images: [
      {
        src: '/images/guide/cooper-shield.png',
        alt: 'Placeholder image: illustration of Cooper in his cape beside a padlock shield',
      },
    ],
  },
  {
    id: 'cooper-tee',
    name: 'One Nose. One Mission. Tee',
    category: 'Apparel',
    description:
      'Cooper’s motto on a shirt.',
    status: 'coming-soon',
    images: [
      {
        src: '/images/cooper/cooper-portrait-vest.jpg',
        alt: 'Placeholder image: Cooper in his working harness',
      },
    ],
    variants: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'cooper-hat',
    name: 'Cooper Cap',
    category: 'Headwear',
    description: 'Embroidered cap.',
    status: 'coming-soon',
    images: [
      {
        src: '/images/cooper/cooper-smiling-outdoors.jpg',
        alt: 'Placeholder image: Cooper outdoors with his tongue out',
      },
    ],
  },
  {
    id: 'junior-deputy-pack',
    name: 'Junior Handler Sticker Pack',
    category: 'Youth',
    description:
      'A small pack of Cooper stickers for younger fans, handed out at school visits and community events.',
    status: 'coming-soon',
    images: [
      {
        src: '/images/comic/panel-kids-online.jpg',
        alt: 'Comic panel of three children looking at a tablet together',
      },
    ],
  },
]

export const merchCategories = [
  'Stickers',
  'Patches',
  'Apparel',
  'Headwear',
  'Collectibles',
  'Youth',
] as const

/** A product is only clickable once a real store URL has been pasted in. */
export function isBuyable(item: MerchItem): boolean {
  return (
    item.status === 'available' && !!item.buyUrl && !item.buyUrl.startsWith('[')
  )
}
