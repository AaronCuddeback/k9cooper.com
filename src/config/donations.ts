/**
 * Donation configuration.
 *
 * IMPORTANT - read before editing:
 *  - This website never collects or stores payment information. Every donate
 *    button hands the visitor off to the external donation platform below.
 *  - Do not add tax-deductibility, nonprofit-status or endorsement claims here
 *    unless the exact wording has been approved. See `legalNotes` below.
 */

export const donationConfig = {
  /** Where every Donate button and the QR code point. */
  url: 'https://www.zeffy.com/en-US/donation-form/donate-to-help-the-el-dorado-county-k-9-association',

  /** Name of the organisation that receives the donation. */
  recipient: 'El Dorado County K-9 Association',

  /** Name of the payment platform, shown for transparency. */
  platform: 'Zeffy',

  /** The QR code image supplied by the site owner. */
  qr: {
    src: '/images/support/donation-qr-code.png',
    /** Filename used when a visitor saves or shares the code. */
    downloadName: 'esd-k9-cooper-donation-qr.png',
    width: 720,
    height: 740,
  },

  /**
   * What support helps provide.
   * REVIEW: confirm every category below is accurate for this fund before launch.
   */
  supports: [
    {
      title: 'Veterinary care',
      body: 'Routine checkups, vaccinations, dental care and the unexpected vet visits every working dog eventually needs.',
      icon: 'stethoscope',
    },
    {
      title: 'Food and nutrition',
      body: 'A working nose runs on good fuel. Quality food keeps Cooper healthy, focused and ready for long search days.',
      icon: 'bone',
    },
    {
      title: 'Training supplies',
      body: 'Training aids, scent kits, reward toys and the practice gear Cooper works with almost every single day.',
      icon: 'target',
    },
    {
      title: 'Safety equipment',
      body: 'Harnesses, leashes, cooling and warming gear, paw protection and reflective equipment for low-light work.',
      icon: 'shield',
    },
    {
      title: 'Travel and transport',
      body: 'Crates, vehicle safety equipment and the cost of getting Cooper to searches, schools and community events.',
      icon: 'truck',
    },
    {
      title: 'Enrichment and downtime',
      body: 'Toys, grooming, bedding and rest. Cooper is a working K9 and a very good dog. Both matter.',
      icon: 'heart',
    },
  ],

  /**
   * Transparency and legal language shown on /support.
   *
   * These lines deliberately make no tax-deductibility claim and name no
   * charitable status. Do not add either without written confirmation from the
   * receiving organisation.
   */
  legalNotes: [
    'Donations are processed by the external platform named above. This website does not collect, process or store any payment information.',
    'Contributions support K9 care costs. They are not a payment for services and do not create any relationship with, or obligation from, any law enforcement agency.',
    'This website makes no claim about the tax treatment of a donation. For anything to do with deductibility, please check with the receiving organisation or your own tax advisor.',
  ],

  /** Donation FAQs shown on the Support page. */
  faqs: [
    {
      q: 'Where does my donation actually go?',
      a: 'Your gift goes to the El Dorado County K-9 Association through their own donation page. It helps cover the ongoing cost of keeping working K9s like Cooper healthy, equipped and ready: veterinary care, food, training supplies, safety gear and travel.',
    },
    {
      q: 'Does this website take my card details?',
      a: 'No. This site never sees or stores payment information. The Donate button opens the donation platform on its own secure page, and everything happens there.',
    },
    {
      q: 'Is my donation tax deductible?',
      a: 'We do not make any tax-deductibility claim on this website. Please check with the receiving organisation, or with your own tax advisor, before assuming a donation is deductible.',
    },
    {
      q: 'Can I give something other than money?',
      a: 'Sometimes, yes. Food, equipment, veterinary services and event sponsorship are all genuinely useful. Email Cooper’s team and tell us what you have in mind.',
    },
    {
      q: 'Can my business sponsor Cooper?',
      a: 'We would love to hear from you. Local veterinary practices, pet food suppliers, equipment makers and community businesses can all help. Get in touch and we will talk through what makes sense.',
    },
    {
      q: 'I would rather give in person at an event.',
      a: 'Come say hello. Bring your phone. The same QR code on this page is on Cooper’s event materials, so you can scan and give in about thirty seconds.',
    },
  ],
} as const
