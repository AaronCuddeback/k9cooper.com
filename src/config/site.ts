/**
 * Site-wide configuration.
 *
 * Everything a non-developer is likely to need to change lives in the
 * `src/config` folder. Edit the values below, save, redeploy.
 */

export const siteConfig = {
  /** Used for canonical URLs, sitemap, robots.txt and social share images. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://k9cooper.com',

  name: 'ESD K9 Cooper',
  shortName: 'K9 Cooper',
  tagline: 'One Nose. One Mission. Protect Children.',
  altTagline:
    'Not all heroes wear capes. Some have four paws and an incredible nose.',

  description:
    'Meet ESD K9 Cooper, a yellow Labrador trained by Jordan Detection K9 and certified as a United States Secret Service Electronics Storage Detection K9, working with Detective Aaron Cuddeback and the El Dorado County Sheriff’s Office High Tech Crimes Unit. Learn how Cooper finds hidden electronics, get free online-safety lessons for kids and families, follow his adventures, and help support his care.',

  /** Shown in the footer and used as the contact address across the site. */
  email: 'esdk9cooper@gmail.com',

  /**
   * REVIEW: agency wording. This is used in the footer, the "about" copy and
   * structured data. Confirm the exact approved unit name and any required
   * disclaimer before launch.
   */
  agency: {
    unit: 'High Tech Crimes Unit',
    office: 'El Dorado County Sheriff’s Office',
    taskForce: 'Sacramento Valley High Tech Crimes Task Force',
    region: 'El Dorado County, California',
  },

  /**
   * Cooper's handler. Name and rank confirmed by the handler, and cleared for
   * publication by the El Dorado County Sheriff's Office.
   */
  handler: {
    name: 'Aaron Cuddeback',
    rank: 'Detective',
    /** Name with rank, for prose: "Detective Aaron Cuddeback". */
    fullName: 'Detective Aaron Cuddeback',
    title: 'Cooper’s Handler',
    office: 'El Dorado County Sheriff’s Office',
    /** Why the Secret Service selected him. Kept short and factual. */
    background:
      'Selected by the United States Secret Service for his work in Internet Crimes Against Children investigations and digital forensics.',
    /** Set to false to hide the handler's name everywhere on the site. */
    showName: true,
  },

  /**
   * Cooper's training and certification lineage. Used in the "about" copy,
   * the Meet Cooper timeline and structured data.
   */
  program: {
    /** Where Cooper learned electronics detection. */
    trainer: 'Jordan Detection K9',
    trainerUrl: 'https://www.jordandetectionk9.com/',
    /** The program Cooper was placed through. */
    sponsor: 'United States Secret Service',
    sponsorShort: 'U.S. Secret Service',
    sponsorUrl: 'https://www.secretservice.gov/',
    /** Where the team met, trained together and certified. */
    certifiedAt: 'National Computer Forensics Institute',
    certifiedAtShort: 'NCFI',
    certifiedAtUrl: 'https://www.ncfi.usss.gov/',
    certifiedLocation: 'Alabama',
    certifiedOn: 'August 12, 2026',
    /** The team course itself. Certification came on day 11 of 13. */
    courseRan: 'August 2 to August 14, 2026',
    /** The day Cooper was awarded to his handler. */
    awardedOn: 'August 3, 2026',
    /** Where Cooper started out, before detection work. */
    origin: 'Paws With A Cause',
    originUrl: 'https://pawswithacause.org/',
  },

  /** Locale + timezone used for every date on the site. */
  locale: 'en-US',
  timeZone: 'America/Los_Angeles',

  /** Emergency guidance shown wherever visitors might try to report something. */
  emergency: {
    line: 'This website is educational. It is not monitored and cannot take reports.',
    action: 'If someone is in danger right now, call 911.',
  },
} as const

export type SiteConfig = typeof siteConfig
