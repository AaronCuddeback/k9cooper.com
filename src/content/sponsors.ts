/**
 * SPONSORS AND SUPPORTERS
 * ----------------------------------------------------------------------------
 * IMPORTANT: never add an organisation here until they have agreed, in writing,
 * to be listed publicly. Listing a business implies a relationship that may not
 * exist yet.
 *
 * To add one:
 *   {
 *     id: 'example-vet',
 *     name: 'Example Veterinary Clinic',
 *     level: 'Veterinary Partner',
 *     url: 'https://example.com',
 *     logo: { src: '/images/sponsors/example.webp', width: 400, height: 200 },
 *     blurb: 'One approved sentence about the partnership.',
 *   }
 *
 * The logo goes in /public/images/sponsors/. Trim it to the artwork's own edges
 * so the card controls the padding, size it to about 400px on the long side
 * (it renders at roughly half that), and set `width`/`height` to the real pixel
 * dimensions so the grid does not jump while it loads.
 *
 * If this array is emptied again, the page falls back to a "be the first
 * supporter" state rather than showing a gap.
 */

export type SponsorLevel =
  | 'Founding Partner'
  | 'Veterinary Partner'
  | 'Grooming Partner'
  | 'Equipment Partner'
  | 'Community Supporter'
  | 'Event Sponsor'

export interface Sponsor {
  id: string
  name: string
  level: SponsorLevel
  url?: string
  logo?: { src: string; width: number; height: number }
  blurb?: string
}

export const sponsors: Sponsor[] = [
  {
    id: 'bens-barketplace-folsom',
    name: 'Ben’s Barketplace',
    level: 'Grooming Partner',
    url: 'https://bensbarketplace.com/locations/folsom/',
    logo: {
      src: '/images/sponsors/bens-barketplace.webp',
      width: 400,
      height: 400,
    },
    blurb:
      'The Folsom store keeps Cooper clean, with free dog washes whenever he needs one. A working K9 finds a great many things worth rolling in.',
  },
]

export const sponsorLevels: {
  level: SponsorLevel
  description: string
  examples: string
}[] = [
  {
    level: 'Veterinary Partner',
    description:
      'Clinics and veterinary professionals who help keep Cooper healthy and working.',
    examples: 'Checkups, dental care, emergency treatment, preventative medicine.',
  },
  {
    level: 'Grooming Partner',
    description:
      'Groomers and pet stores keeping a working dog clean, comfortable and presentable.',
    examples: 'Dog washes, grooming, nail trims, coat and paw care.',
  },
  {
    level: 'Equipment Partner',
    description:
      'Businesses supplying the gear a working K9 gets through faster than you would think.',
    examples: 'Harnesses, leashes, cooling gear, crates, vehicle safety equipment.',
  },
  {
    level: 'Community Supporter',
    description:
      'Local businesses and organisations backing Cooper’s community and school programme.',
    examples: 'Printing, venues, refreshments, event support, raffle contributions.',
  },
  {
    level: 'Event Sponsor',
    description:
      'Sponsors of a specific demonstration, fundraiser or community appearance.',
    examples: 'Underwriting the cost of a single event or school programme.',
  },
]
