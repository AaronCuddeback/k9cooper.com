/**
 * COOPER'S PROFILE
 * ----------------------------------------------------------------------------
 * Cooper's history, training, certification and alert style were all supplied
 * by his handler. Nothing here has been invented to fill a gap, and nothing is
 * outstanding.
 *
 * If a future fact is genuinely unknown, mark it `pending: true` rather than
 * guessing - the profile card styles pending fields differently, and the note
 * explaining them is wired to reappear automatically.
 */

/** Cooper's date of birth. Everything age-related is derived from this. */
export const cooperDob = '2024-07-17'

/** Long-form date used in copy, e.g. "July 17, 2024". */
export const cooperDobLabel = 'July 17, 2024'

/**
 * Age in whole years, computed at build time so the profile card does not go
 * stale on his birthday. Rebuild and redeploy and it corrects itself.
 */
export function cooperAgeInYears(now: Date = new Date()): number {
  const dob = new Date(`${cooperDob}T00:00:00`)
  let years = now.getFullYear() - dob.getFullYear()
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())
  if (beforeBirthday) years -= 1
  return years
}

/** Organisations in Cooper's story. Every link is an official site. */
export interface Partner {
  id: string
  name: string
  url?: string
  role: string
}

export const cooperPartners: Partner[] = [
  {
    id: 'paws-with-a-cause',
    name: 'Paws With A Cause',
    url: 'https://pawswithacause.org/',
    role: 'Michigan. Where Cooper began, training as an assistance and facility dog.',
  },
  {
    id: 'jordan-detection-k9',
    name: 'Jordan Detection K9',
    url: 'https://www.jordandetectionk9.com/',
    role: 'Where Cooper spent six months learning to find hidden electronics.',
  },
  {
    id: 'us-secret-service',
    name: 'United States Secret Service',
    url: 'https://www.secretservice.gov/',
    role: 'Selected Cooper’s handler and placed Cooper as a Secret Service ESD K9.',
  },
  {
    id: 'ncfi',
    name: 'National Computer Forensics Institute',
    url: 'https://www.ncfi.usss.gov/',
    role: 'Alabama. Where Cooper and his handler met, trained together and certified.',
  },
  {
    id: 'edso',
    name: 'El Dorado County Sheriff’s Office',
    role: 'Cooper’s home agency, and where the team works today.',
  },
]

export interface StatItem {
  label: string
  value: string
  /** True when the value is not yet confirmed. Renders in muted italic. */
  pending?: boolean
}

export const cooperStats: StatItem[] = [
  { label: 'Breed', value: 'Yellow Labrador Retriever' },
  { label: 'Specialty', value: 'Electronics Storage Detection' },
  { label: 'Date of birth', value: cooperDobLabel },
  { label: 'Age', value: `${cooperAgeInYears()} years old` },
  { label: 'First career', value: 'Assistance dog in training, Paws With A Cause' },
  { label: 'Detection school', value: 'Jordan Detection K9' },
  { label: 'Certified', value: 'August 12, 2026 - NCFI, Alabama' },
  { label: 'Partnered with', value: 'Detective Aaron Cuddeback' },
  { label: 'Home turf', value: 'El Dorado County, California' },
  { label: 'Alert style', value: 'Passive sit, then points with his nose' },
]

/**
 * Cooper's trained final response, described in one place so the profile card,
 * the five-step search and the FAQ never drift apart.
 */
export const finalResponse = {
  short: 'Passive sit, then points with his nose',
  kid: 'He sits down. Then he points his nose right at the spot where the smell is strongest, and waits for his handler.',
  grownUp:
    'Cooper’s trained final response is a passive sit on picking up the odour, followed by pointing his nose at the source. He does not paw, dig, mouth or otherwise disturb the item - preserving the scene is a core part of the training.',
}

/** Short, warm, human facts. All supplied by Cooper's handler. */
export const funFacts: { emoji: string; text: string; pending?: boolean }[] = [
  { emoji: '🦴', text: 'Works for food. Genuinely, enthusiastically, for food.' },
  {
    emoji: '🎓',
    text: 'His first career was assistance dog. He was not the right fit - his real talent turned out to be his nose.',
  },
  {
    emoji: '⏱️',
    text: 'Six months of detection school before he was allowed anywhere near a real search.',
  },
  { emoji: '💧', text: 'Trained to search underwater, which most dogs would consider excessive.' },
  { emoji: '🔌', text: 'Cannot smell electricity. Can smell the chemistry inside electronics.' },
  {
    emoji: '🤝',
    text: 'He met his handler for the first time in Alabama, on the day he was awarded to him.',
  },
  {
    emoji: '🎂',
    text: `Born ${cooperDobLabel}, which makes him a very serious ${cooperAgeInYears()} year old.`,
  },
  {
    emoji: '😴',
    text: 'Favourite napping spot: his own kennel. He has strong opinions about his own bed.',
  },
  { emoji: '🎾', text: 'Off duty, the entire point of the day is chasing a ball.' },
]

/**
 * Cooper's story in prose, used on the Meet Cooper page.
 *
 * This is the one part of the site that makes claims about a real career, so
 * keep it factual and keep it approved. Do not add operational detail here.
 */
export const cooperBio: string[] = [
  'Cooper is a yellow Labrador Retriever, born on July 17, 2024. He is an Electronics Storage Detection K9 - and he did not start out that way.',
  'At around a year old, Cooper began training with Paws With A Cause in Michigan to become an assistance and facility dog supporting people with disabilities. It is demanding work, and it is not the right fit for every dog. It was not the right fit for Cooper.',
  'What Cooper did have was a nose, and a serious appetite for using it. At about a year and a half old he was accepted into the electronics detection program at Jordan Detection K9, where he spent six rigorous months learning to find hidden electronic storage devices - the training that qualified him as a United States Secret Service ESD K9.',
  'The Secret Service then selected the other half of the team. Detective Aaron Cuddeback of the El Dorado County Sheriff’s Office was chosen on the strength of his work in Internet Crimes Against Children investigations and digital forensics.',
  'Cooper was awarded to Detective Cuddeback on August 3, 2026 at the National Computer Forensics Institute in Alabama. That was the day the two of them met. The course ran two weeks, August 2 to August 14, spent training as one unit rather than two halves - and on August 12 they passed their certification as an Electronics Storage Detection team.',
  'Today Cooper works alongside Detective Cuddeback with the High Tech Crimes Unit at the El Dorado County Sheriff’s Office. The rest of the time he is a Labrador, and he would very much like to know what you are eating.',
]

export interface Milestone {
  date: string
  title: string
  body: string
  pending?: boolean
}

export const milestones: Milestone[] = [
  {
    date: 'July 17, 2024',
    title: 'A very good dog is born',
    body: 'Cooper arrives. No job yet, no harness, and no idea that any of this is coming.',
  },
  {
    date: 'Summer 2025',
    title: 'First career: assistance dog',
    body: 'At around a year old, Cooper begins training with Paws With A Cause in Michigan to become an assistance and facility dog supporting people with disabilities.',
  },
  {
    date: 'Late 2025',
    title: 'A change of direction',
    body: 'Assistance work turns out not to be the right fit for Cooper. That is not a failure - it is how a good program finds the right job for the right dog. Cooper’s job was still out there.',
  },
  {
    date: 'Early 2026',
    title: 'Accepted into detection school',
    body: 'At about a year and a half old, Cooper is accepted into the electronics detection program at Jordan Detection K9, and begins six rigorous months of electronics storage detection training as a United States Secret Service ESD K9.',
  },
  {
    date: 'August 3, 2026',
    title: 'Cooper is awarded to his handler',
    body: 'The United States Secret Service selects Detective Aaron Cuddeback of the El Dorado County Sheriff’s Office, based on his work in Internet Crimes Against Children and digital forensics. Cooper is awarded to him at the National Computer Forensics Institute in Alabama - the day the two of them meet for the first time.',
  },
  {
    date: 'August 12, 2026',
    title: 'Certified as a team',
    body: 'Two weeks at the NCFI, August 2 to August 14, spent training together rather than separately. On day eleven they pass: Cooper and Detective Cuddeback are a certified Electronics Storage Detection team.',
  },
  {
    date: 'Later that month',
    title: 'On duty in El Dorado County',
    body: 'Cooper and Detective Cuddeback begin work together at the El Dorado County Sheriff’s Office in California, where they serve today.',
  },
  {
    date: '2026',
    title: 'Cooper goes public',
    body: 'Cooper’s Instagram and TikTok launch, along with the educational poster used in classrooms and community events.',
  },
]

/** The five-step story used on the "What Cooper Does" page. */
export interface MissionStep {
  n: number
  title: string
  kid: string
  grownUp: string
  sfx?: string
  image?: { src: string; alt: string }
}

export const missionSteps: MissionStep[] = [
  {
    n: 1,
    title: 'The mission comes in',
    kid: 'Investigators have a place to search and they need to know whether any electronics are hidden there. Cooper gets called in.',
    grownUp:
      'Cooper is deployed only in support of lawful searches conducted by trained investigators. Every deployment operates within the legal authority already established for that search.',
    sfx: 'READY!',
  },
  {
    n: 2,
    title: 'Harness on, nose down',
    kid: 'When the harness goes on, Cooper knows it is time to work. He starts reading the room the way you would read a page.',
    grownUp:
      'The harness functions as a clear working cue. Cooper searches systematically rather than randomly, covering the space in a pattern and working the airflow through it.',
    sfx: 'SNIFF! SNIFF!',
    image: {
      src: '/images/comic/panel-indoors.jpg',
      alt: 'Comic panel showing Cooper searching a bedroom, nose to the floor, following a scent trail',
    },
  },
  {
    n: 3,
    title: 'He finds the trail',
    kid: 'Electronics give off a tiny trace of a chemical. It is far too faint for a person to notice - but not for a nose like Cooper’s. Once he catches it, he follows it.',
    grownUp:
      'Cooper is trained on an odour associated with compounds used in electronic components, commonly identified as triphenylphosphine oxide (TPPO). He is following that chemical signature, not metal, batteries or a powered-on state.',
    sfx: 'GOT IT!',
    image: {
      src: '/images/comic/panel-how-it-works.jpg',
      alt: 'Comic panel showing Cooper following a green scent trail toward a phone on the ground',
    },
  },
  {
    n: 4,
    title: 'He tells his handler',
    kid: 'Cooper does not grab it, chew it or dig it up. He sits down, points his nose right at the spot where the smell is strongest, and then he waits.',
    grownUp:
      'Cooper gives a passive sit on picking up the odour, then points his nose at the source. He does not paw, dig or mouth the item - preserving the scene is a core part of the training.',
    sfx: 'FOUND IT!',
  },
  {
    n: 5,
    title: 'People take it from there',
    kid: 'Investigators - not Cooper - carefully collect the device and work out whether it matters. Cooper gets paid in food and praise, which is the correct arrangement.',
    grownUp:
      'Recovery, examination and any evidentiary determination are made by trained personnel under the applicable legal process. A K9 alert locates a device; it does not establish what is on it or what it means.',
    sfx: 'PAW-SOME!',
    image: {
      src: '/images/comic/panel-training.jpg',
      alt: 'Comic panel showing Cooper high-fiving his handler after a successful search',
    },
  },
]

/** Where Cooper can search - taken from the educational poster. */
export const searchEnvironments = [
  {
    id: 'indoors',
    title: 'Indoors',
    body: 'Bedrooms, closets, drawers, furniture and everywhere in between.',
    image: {
      src: '/images/comic/panel-indoors.jpg',
      alt: 'Comic panel of Cooper searching a bedroom floor beside a nightstand',
    },
  },
  {
    id: 'outdoors',
    title: 'Outdoors',
    body: 'Parks, trails, fields and anywhere a device could be dropped or stashed.',
    image: {
      src: '/images/comic/panel-outdoors.jpg',
      alt: 'Comic panel of Cooper searching through grass and leaves outdoors',
    },
  },
  {
    id: 'vehicles',
    title: 'In vehicles',
    body: 'Under seats, inside compartments, in trunks and in hard-to-reach places.',
    image: {
      src: '/images/comic/panel-vehicles.jpg',
      alt: 'Comic panel of Cooper searching the interior of a vehicle',
    },
  },
  {
    id: 'underwater',
    title: 'Underwater',
    body: 'Cooper is trained for water searches, and can work devices that ended up somewhere wet.',
    image: {
      src: '/images/comic/panel-underwater.jpg',
      alt: 'Comic panel of Cooper swimming underwater following a scent trail',
    },
  },
  {
    id: 'buried',
    title: 'Buried',
    body: 'If it went under the soil, his nose can still find the trail coming back up.',
    image: {
      src: '/images/comic/panel-buried.jpg',
      alt: 'Comic panel of Cooper digging at soil where a device is buried',
    },
  },
]

/** Devices Cooper is trained to locate. Deliberately generic. */
export const deviceTypes = [
  'Phones',
  'Tablets',
  'Laptops',
  'USB flash drives',
  'Memory cards',
  'External hard drives',
  'SIM cards',
  'Other concealed electronic storage',
]
