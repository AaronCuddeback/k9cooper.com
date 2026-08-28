/**
 * SPONSORS AND SUPPORTERS
 * ----------------------------------------------------------------------------
 * IMPORTANT: never add an organisation here until they have agreed, in writing,
 * to be listed publicly. Listing a business implies a relationship that may not
 * exist yet.
 *
 * The array below is intentionally EMPTY. The sponsors page renders a
 * well-designed "become the first supporter" state until real entries exist.
 *
 * To add one:
 *   {
 *     id: 'example-vet',
 *     name: 'Example Veterinary Clinic',
 *     level: 'Veterinary Partner',
 *     url: 'https://example.com',
 *     logo: { src: '/images/sponsors/example.png', width: 400, height: 200 },
 *     blurb: 'One approved sentence about the partnership.',
 *   }
 */

export type SponsorLevel =
  | 'Founding Partner'
  | 'Veterinary Partner'
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

export const sponsors: Sponsor[] = []

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
