/**
 * FREQUENTLY ASKED QUESTIONS
 * ----------------------------------------------------------------------------
 * Answers here are deliberately cautious. `needsReview` marks the technical,
 * legal and operational answers - re-check those with the agency whenever
 * training, procedure or the donation arrangement changes.
 */

export type FaqCategory =
  | 'About Cooper'
  | 'How It Works'
  | 'Booking Cooper'
  | 'Supporting Cooper'
  | 'This Website'

export interface Faq {
  id: string
  category: FaqCategory
  question: string
  answer: string[]
  /** Flags an answer that a subject-matter expert must approve. */
  needsReview?: boolean
}

export const faqs: Faq[] = [
  {
    id: 'how-old-is-cooper',
    category: 'About Cooper',
    question: 'How old is Cooper, and how long has he been working?',
    answer: [
      'Cooper was born on July 17, 2024. He was awarded to his handler on August 3, 2026 and certified as an Electronics Storage Detection team on August 12, 2026, so he is very much at the start of his career.',
      'Working detection dogs usually have a long one ahead of them. Cooper intends to spend all of it being paid in food.',
    ],
  },
  {
    id: 'where-was-cooper-trained',
    category: 'About Cooper',
    question: 'Where was Cooper trained?',
    answer: [
      'Cooper completed six months of electronics storage detection training at Jordan Detection K9, which qualified him as a United States Secret Service ESD K9.',
      'He and his handler then trained together through a two-week program at the National Computer Forensics Institute in Alabama, certifying as an Electronics Storage Detection team on August 12, 2026 before starting work in El Dorado County, California.',
    ],
  },
  {
    id: 'was-cooper-a-service-dog',
    category: 'About Cooper',
    question: 'Is it true Cooper was going to be an assistance dog?',
    answer: [
      'It is. At around a year old, Cooper began training with Paws With A Cause in Michigan to become an assistance and facility dog for people with disabilities.',
      'He was not the right fit for that program - which is a normal and important outcome, not a failure. A good program places the right dog in the right job. Cooper’s job turned out to involve his nose, and he found it about six months later.',
    ],
  },
  {
    id: 'who-is-coopers-handler',
    category: 'About Cooper',
    question: 'Who is Cooper’s handler?',
    answer: [
      'Detective Aaron Cuddeback of the El Dorado County Sheriff’s Office. The United States Secret Service selected him for the placement based on his work in Internet Crimes Against Children investigations and digital forensics.',
      'Cooper and Detective Cuddeback met for the first time on August 3, 2026, the day Cooper was awarded to him at the National Computer Forensics Institute. They train together, work together and go home together.',
    ],
  },
  {
    id: 'what-is-esd-k9',
    category: 'About Cooper',
    question: 'What is an ESD K9?',
    answer: [
      'ESD stands for Electronics Storage Device. An ESD K9 is a dog trained to find hidden electronics - phones, tablets, memory cards, USB drives, hard drives and similar items.',
      'Cooper does not detect drugs or explosives. His entire job is finding electronics that someone has deliberately hidden.',
    ],
  },
  {
    id: 'what-can-cooper-detect',
    category: 'About Cooper',
    question: 'What can Cooper actually detect?',
    answer: [
      'Cooper is trained to find electronic storage devices. In practice that includes phones, tablets, laptops, USB flash drives, memory cards, SIM cards and external drives.',
      'He finds the device. He has no idea what is on it, and neither does anyone else until trained investigators examine it properly.',
    ],
  },
  {
    id: 'how-does-he-find-them',
    category: 'How It Works',
    question: 'How does Cooper find electronics?',
    answer: [
      'He follows a smell. Certain compounds used in manufacturing electronic components give off a faint odour - commonly identified as triphenylphosphine oxide, or TPPO. People cannot smell it at all. Cooper was trained that this particular smell means a reward is coming, so he goes looking for it.',
      'He is not detecting metal, batteries, radio signals or whether a device is switched on.',
    ],
    needsReview: true,
  },
  {
    id: 'device-turned-off',
    category: 'How It Works',
    question: 'Can Cooper find a device that is turned off?',
    answer: [
      'Yes. Cooper works on odour, not on power. A device that is switched off, out of battery or completely broken still smells the same to him.',
    ],
    needsReview: true,
  },
  {
    id: 'how-does-he-alert',
    category: 'How It Works',
    question: 'How does Cooper tell his handler he has found something?',
    answer: [
      'Cooper gives what is called a passive alert. When he picks up the odour he sits down, and then points his nose at the source.',
      'That is deliberate. A dog who digs, paws or picks things up can damage the very thing everyone is looking for. Cooper sits, points, and waits for a person to take it from there.',
    ],
    needsReview: true,
  },
  {
    id: 'does-he-read-devices',
    category: 'How It Works',
    question: 'Does Cooper read or access the devices he finds?',
    answer: [
      'No. Cooper locates a device and tells his handler where it is. That is the entire extent of his involvement.',
      'Everything after that - collecting the device, examining it, and deciding whether it matters - is done by trained investigators under the applicable legal process.',
    ],
  },
  {
    id: 'where-can-he-search',
    category: 'How It Works',
    question: 'Where can Cooper search?',
    answer: [
      'Cooper is trained to work indoors, outdoors, in and around vehicles, in water and over buried locations.',
      'Where he actually searches is decided by the investigators he supports, and always within the legal authority for that search. Cooper is one tool in a lawful process, not a way around it.',
    ],
    needsReview: true,
  },
  {
    id: 'is-cooper-a-police-dog',
    category: 'About Cooper',
    question: 'Is Cooper a police dog? Should I be nervous around him?',
    answer: [
      'Cooper is a working detection K9, not a patrol dog. He is not trained for apprehension or protection work. He is a Labrador whose entire strategy in life is being pleasant at people until food happens.',
      'That said, when his harness is on he is working. Always ask his handler before saying hello.',
    ],
  },
  {
    id: 'book-cooper',
    category: 'Booking Cooper',
    question: 'How can Cooper visit our school, group or event?',
    answer: [
      'Email Cooper’s team with your organisation, the date and location, roughly how many people will be there, and what you are hoping the visit will cover.',
      'Requests are subject to availability and approval, and Cooper’s operational duties always come first. Please ask as far ahead as you can.',
    ],
  },
  {
    id: 'what-does-a-visit-look-like',
    category: 'Booking Cooper',
    question: 'What does a school visit actually involve?',
    answer: [
      'Typically a short, age-appropriate talk about what Cooper does, a live demonstration of a search, and a straightforward online-safety message that children can remember and act on.',
      'For older students and for grown-ups, the conversation goes further - practical settings, what grooming and sextortion actually look like, and what to do if something has already gone wrong.',
    ],
  },
  {
    id: 'submit-a-tip',
    category: 'This Website',
    question: 'Can I submit a case tip or report a crime through this website?',
    answer: [
      'No. This website is educational only. It is not monitored, and it cannot receive reports, tips, evidence or case information.',
      'If someone is in immediate danger, call 911.',
      'To report a crime that is not an emergency, contact your local law enforcement agency directly through their official channels.',
    ],
  },
  {
    id: 'how-to-support',
    category: 'Supporting Cooper',
    question: 'How can I support Cooper?',
    answer: [
      'The most direct way is a donation toward K9 care costs - veterinary care, food, training supplies, safety equipment and travel. There is a donate button and a QR code on the Support page.',
      'Following and sharing genuinely helps too. Every share puts the online-safety message in front of another family, and that costs nothing.',
    ],
  },
  {
    id: 'is-it-tax-deductible',
    category: 'Supporting Cooper',
    question: 'Is a donation tax deductible?',
    answer: [
      'This website makes no tax-deductibility claim. Please confirm with the receiving organisation, or with your own tax advisor.',
    ],
    needsReview: true,
  },
  {
    id: 'where-to-follow',
    category: 'Supporting Cooper',
    question: 'Where can I follow Cooper?',
    answer: [
      'Instagram and TikTok, both at @esdk9_cooper. Training clips, community events, the occasional nap, and safety reminders that are short enough to actually watch.',
    ],
  },
  {
    id: 'use-the-poster',
    category: 'This Website',
    question: 'Can we use Cooper’s poster in our classroom?',
    answer: [
      'Get in touch and ask. The poster was made to be used, and Cooper’s team can talk to you about printed copies or a file you can print yourself.',
    ],
  },
  {
    id: 'privacy',
    category: 'This Website',
    question: 'Does this website collect information about me or my child?',
    answer: [
      'No accounts, no logins, no comment sections and no data collection forms. The contact page opens your own email app rather than sending anything through this site.',
      'Anything you tick on the safety checklist stays in your own browser and is never sent anywhere. See the privacy page for the detail.',
    ],
  },
]

export const faqCategories: FaqCategory[] = [
  'About Cooper',
  'How It Works',
  'Booking Cooper',
  'Supporting Cooper',
  'This Website',
]

/** Homepage / support-page shortlist. */
export const topFaqIds = [
  'what-is-esd-k9',
  'how-does-he-find-them',
  'does-he-read-devices',
  'book-cooper',
]
