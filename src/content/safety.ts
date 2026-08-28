/**
 * SAFETY HQ CONTENT
 * ----------------------------------------------------------------------------
 * This is the most carefully worded content on the site. Before changing
 * anything here, please read docs/CONTENT-REVIEW.md.
 *
 * Ground rules baked into this file:
 *   - Nothing blames a child, ever.
 *   - No fear-based messaging, no graphic detail.
 *   - Every lesson ends with an action a child can actually take.
 *   - External links stay switched off (`approved: false`) until the site
 *     owner has personally verified each destination.
 */

/* ==========================================================================
   COOPER'S SAFETY TIPS  (rotate on the homepage and in the footer)
   ========================================================================== */

export interface SafetyTip {
  id: string
  /** Short enough to fit in a speech bubble. */
  text: string
  audience: 'kids' | 'teens' | 'everyone'
}

export const safetyTips: SafetyTip[] = [
  {
    id: 'secret',
    text: 'If someone online asks you to keep a secret from your grown-ups, that is exactly when you go tell a grown-up.',
    audience: 'everyone',
  },
  {
    id: 'photos',
    text: 'Never send photos or videos of yourself to someone you only know online. Not even once. Not even if they sent one first.',
    audience: 'everyone',
  },
  {
    id: 'passwords',
    text: 'A good password is long and strange. Three random words beat one clever word every single time.',
    audience: 'everyone',
  },
  {
    id: 'not-who-they-say',
    text: 'People online can say they are anyone. A profile picture is not proof of anything.',
    audience: 'kids',
  },
  {
    id: 'location',
    text: 'Turn location sharing off in games and apps. Your friends already know where you live.',
    audience: 'everyone',
  },
  {
    id: 'free-stuff',
    text: 'Free skins, free coins, free anything - if a stranger offers it, they want something back. Walk away.',
    audience: 'kids',
  },
  {
    id: 'block',
    text: 'Blocking someone is not rude. It is a button, and it exists for exactly this.',
    audience: 'everyone',
  },
  {
    id: 'not-your-fault',
    text: 'If someone tricked you or scared you online, that is on them, not on you. Tell a trusted adult anyway.',
    audience: 'everyone',
  },
  {
    id: 'screenshot',
    text: 'Before you block someone who scared you, screenshot the conversation. Then show a grown-up.',
    audience: 'teens',
  },
  {
    id: 'two-step',
    text: 'Ask a grown-up to help you turn on two-step login. It is the single best ten minutes you will spend today.',
    audience: 'everyone',
  },
  {
    id: 'leave',
    text: 'You are allowed to leave a conversation. No goodbye, no explanation. Just leave.',
    audience: 'everyone',
  },
  {
    id: 'links',
    text: 'If a message says you must act right now, slow down. Urgency is the oldest trick there is.',
    audience: 'teens',
  },
]

/** Deterministic tip for a given day, so the server and browser agree. */
export function tipForDay(dayOfYear: number): SafetyTip {
  return safetyTips[dayOfYear % safetyTips.length]
}

/* ==========================================================================
   TRAINING ACADEMY LESSONS
   ========================================================================== */

export type Audience = 'younger' | 'older' | 'teens'

export interface SafetyLesson {
  id: string
  /** Comic-style badge number shown on the card. */
  number: number
  title: string
  /** One sentence, kid-facing. */
  headline: string
  audiences: Audience[]
  icon: string
  /** Two to four short paragraphs, kid-facing. */
  body: string[]
  /** Concrete actions. Written as imperatives. */
  doThis: string[]
  /** Optional extra detail written for parents and educators. */
  grownUps?: string
}

export const safetyLessons: SafetyLesson[] = [
  {
    id: 'personal-info',
    number: 1,
    title: 'Guard Your Secret Identity',
    headline: 'Superheroes do not hand out their home address. Neither should you.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'user-lock',
    body: [
      'Your full name, your school, your address, your phone number and your birthday are all pieces of a puzzle. On their own they seem harmless. Put together, they tell a stranger exactly how to find you.',
      'A username does not have to be your real name. In fact, it is better if it is not.',
    ],
    doThis: [
      'Pick a username that says nothing about your real name, age, school or town.',
      'Never post your school name, your team name or a photo in school uniform.',
      'If a game or app asks for your address, ask a grown-up first. Most of the time the answer is no.',
    ],
    grownUps:
      'Audit your child’s public profiles together, on their device, with them driving. What is visible to a stranger? Kids are far more receptive to this as a shared investigation than as an inspection.',
  },
  {
    id: 'passwords',
    number: 2,
    title: 'Build an Unbreakable Password',
    headline: 'Long and weird beats short and clever.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'key',
    body: [
      'A password is a door. A short password is a door made of paper.',
      'The trick is length, not complexity. Three or four random words stuck together are easy for you to remember and very hard for anyone else to guess. Something like "otter-lantern-puddle-42".',
      'The other rule: a different password for every important account. If one gets out, the rest are still locked.',
    ],
    doThis: [
      'Make your passwords at least fifteen characters long.',
      'Use different passwords for different accounts, especially email.',
      'Never share a password with a friend. Not even a best friend.',
      'Ask a grown-up about a password manager, which remembers them all for you.',
    ],
    grownUps:
      'A family password manager is the highest-value change most households can make. Set one up together and move the important accounts into it in one sitting.',
  },
  {
    id: 'two-step',
    number: 3,
    title: 'Add a Second Lock',
    headline: 'Two-step login means a stolen password is not enough.',
    audiences: ['older', 'teens'],
    icon: 'shield-check',
    body: [
      'Two-step login, sometimes called two-factor or MFA, asks for a second thing after your password. Usually a code from an app on your phone.',
      'It means that even if someone steals your password, they still cannot get in. This is the single strongest thing you can switch on.',
    ],
    doThis: [
      'Ask a grown-up to help you turn on two-step login for email first, then games and social apps.',
      'Use an authenticator app rather than text messages where you can.',
      'Write down the backup codes and keep them somewhere safe at home.',
    ],
    grownUps:
      'Start with the email account - it is the recovery route for everything else. An authenticator app is meaningfully stronger than SMS codes.',
  },
  {
    id: 'location',
    number: 4,
    title: 'Turn Off the Tracking Beacon',
    headline: 'Your photos and games can quietly broadcast where you are.',
    audiences: ['older', 'teens'],
    icon: 'map-pin-off',
    body: [
      'Lots of apps share your location by default. Some games show it to everyone you play with. Some photos carry the exact spot they were taken.',
      'You almost never need this switched on. Your actual friends already know where you are.',
    ],
    doThis: [
      'Go through your phone settings with a grown-up and turn location off for apps that do not truly need it.',
      'Turn off location tags on your camera.',
      'Do not post photos that show your house number, your street sign or your school.',
      'Wait until you are home to post about a trip.',
    ],
  },
  {
    id: 'photos',
    number: 5,
    title: 'Some Pictures Can Never Come Back',
    headline: 'Never send photos or videos of yourself to someone you met online.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'camera-off',
    body: [
      'Once a photo leaves your phone, you do not control it any more. It can be saved, copied and sent on, even in apps that promise it will disappear.',
      'If someone you only know online asks you for a photo of yourself, that is a red flag, no matter how nice they have been up to that point. Especially if they have been very nice.',
      'And if it has already happened: you are not in trouble, and it is not your fault. Tell a trusted adult. There are people whose whole job is helping fix exactly this.',
    ],
    doThis: [
      'Never send photos or video of yourself to someone you have not met in real life.',
      'If someone asks, stop replying, screenshot the conversation, block them, and tell a grown-up.',
      'If it already happened, tell a trusted adult today. It can be dealt with, and faster than you think.',
    ],
    grownUps:
      'Sextortion of minors is a real and growing crime, and shame is the mechanism that keeps it working. The single most protective thing a household can do is make it genuinely believable, in advance, that a child will not be punished for coming forward. Say it out loud before anything happens.',
  },
  {
    id: 'strangers',
    number: 6,
    title: 'People Online Are Not Always Who They Say',
    headline: 'A photo, an age and a name are all easy to fake.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'user-search',
    body: [
      'Someone online can claim to be twelve, or a girl from the next town, or a talent scout, or a friend of your cousin. None of that is checkable.',
      'The people who do this are patient. They are friendly first. They pay attention, they take your side, and they build trust deliberately - and then they ask for something.',
      'That pattern is the warning sign, not the person seeming mean.',
    ],
    doThis: [
      'Only accept friend or follow requests from people you know in real life.',
      'Never agree to meet someone in person that you met online.',
      'If a new online friend wants to move to a private chat app quickly, tell a grown-up.',
      'Trust the feeling in your stomach. It is usually right.',
    ],
  },
  {
    id: 'scams',
    number: 7,
    title: 'Spot the Trap',
    headline: 'Free stuff, urgent warnings and impossible prizes are all bait.',
    audiences: ['older', 'teens'],
    icon: 'link-2-off',
    body: [
      'Scam messages want one of two things: for you to click a link, or for you to hand over a password or a code.',
      'They work by rushing you. "Your account will be deleted in one hour." "Claim before midnight." "Send me the code you just got and I will send the coins."',
      'A code that arrives on your phone is a key. Nobody legitimate will ever ask you to read it out.',
    ],
    doThis: [
      'Never give anyone a verification code, even a friend. Especially a friend whose account may have been stolen.',
      'Do not click links in messages you were not expecting.',
      'If a message rushes you, that is the reason to slow down.',
      'Go to the app or website directly instead of using the link you were sent.',
    ],
  },
  {
    id: 'cyberbullying',
    number: 8,
    title: 'When Words Are Used as Weapons',
    headline: 'You do not have to absorb it, and you do not have to handle it alone.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'message-square-warning',
    body: [
      'Cyberbullying is being targeted, insulted, excluded, embarrassed or threatened online. It can come from strangers or from people you know.',
      'Replying almost always makes it worse, because a reaction is the point. Saving the evidence and telling someone almost always makes it better.',
      'And if you have seen it happen to someone else: quietly checking in with them matters more than you would guess.',
    ],
    doThis: [
      'Do not reply. Do not argue. That is the fuel.',
      'Screenshot it, then block and report the account.',
      'Tell a trusted adult - a parent, a teacher, a school counsellor, a coach.',
      'If you see it happening to someone else, message them privately and tell an adult.',
    ],
    grownUps:
      'Children very often hide cyberbullying because they fear losing the device or the account. Separating the response from device removal makes disclosure far more likely.',
  },
  {
    id: 'leave',
    number: 9,
    title: 'You Are Allowed to Leave',
    headline: 'No goodbye. No explanation. Just go.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'door-open',
    body: [
      'You never owe anyone online a conversation. Not politeness, not a reason, not one more message.',
      'If a chat starts to feel uncomfortable, weird, or just off - close it. You can put the phone down mid-sentence. That is a completely acceptable thing to do.',
    ],
    doThis: [
      'Close the app. Put the device down. Walk away.',
      'Tell a grown-up what happened while it is still fresh.',
      'Block the account so it cannot start again tomorrow.',
    ],
  },
  {
    id: 'evidence',
    number: 10,
    title: 'Save the Proof Before You Block',
    headline: 'One screenshot now saves a lot of trouble later.',
    audiences: ['older', 'teens'],
    icon: 'image-down',
    body: [
      'If something serious happens, a grown-up may need to show someone what was said. Once you block an account, those messages can disappear.',
      'So the order matters: screenshot first, then block, then tell.',
      'Do not go back and reply to get more evidence. You have enough.',
    ],
    doThis: [
      'Screenshot the messages, including the username and the date.',
      'Then block and report the account.',
      'Then show a trusted adult.',
      'Do not delete anything until a grown-up says it is fine to.',
    ],
  },
  {
    id: 'trusted-adult',
    number: 11,
    title: 'Pick Your Trusted Adults Now',
    headline: 'Decide who you would tell before you ever need to.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'users',
    body: [
      'A trusted adult is someone who will listen without exploding: a parent, a grandparent, an aunt or uncle, a teacher, a coach, a school counsellor.',
      'Choose two or three, right now, while nothing is wrong. Then if something does go wrong, you are not also trying to work out who to tell.',
      'If the first one does not take it seriously, tell the next one. Keep going until someone helps.',
    ],
    doThis: [
      'Write down the names of three trusted adults.',
      'Tell them they are on your list. It is a nice thing to be told.',
      'If something happens, tell one of them the same day.',
    ],
  },
  {
    id: 'not-your-fault',
    number: 12,
    title: 'It Is Never Your Fault',
    headline: 'Adults who trick or threaten children are responsible. Not you.',
    audiences: ['younger', 'older', 'teens'],
    icon: 'heart-handshake',
    body: [
      'If someone manipulated you, pressured you, lied to you or threatened you online, they broke the rules. You did not.',
      'People in that situation often feel embarrassed and stay quiet, and staying quiet is exactly what the other person is counting on.',
      'Telling a grown-up is the thing that ends it. It gets better from there, usually much faster than you expect.',
    ],
    doThis: [
      'Tell a trusted adult today, even if you think you did something wrong.',
      'Remember that you are not in trouble.',
      'Keep telling adults until one of them helps you properly.',
    ],
    grownUps:
      'The first sixty seconds of a disclosure set everything that follows. Stay calm, thank them for telling you, and make it unambiguous that they are not in trouble. Investigation and consequences can wait; the child’s willingness to keep talking cannot.',
  },
]

export const audienceLabels: Record<Audience, string> = {
  younger: 'Ages 5-8',
  older: 'Ages 9-12',
  teens: 'Ages 13+',
}

/* ==========================================================================
   BUILD YOUR SAFETY SHIELD
   ========================================================================== */

export interface ShieldItem {
  id: string
  label: string
  detail: string
}

export const shieldItems: ShieldItem[] = [
  { id: 's1', label: 'My passwords are long', detail: 'At least fifteen characters, and different for each account.' },
  { id: 's2', label: 'Two-step login is on', detail: 'Email first, then games and social apps.' },
  { id: 's3', label: 'My accounts are private', detail: 'Only people I actually know can see my posts.' },
  { id: 's4', label: 'Location sharing is off', detail: 'In games, in apps, and on my camera.' },
  { id: 's5', label: 'I know my trusted adults', detail: 'I can name three people I would tell.' },
  { id: 's6', label: 'I never send photos to strangers', detail: 'Not even if they send one first.' },
  { id: 's7', label: 'I know how to block and report', detail: 'I have found the buttons before I needed them.' },
  { id: 's8', label: 'I check before I click', detail: 'Especially when a message is trying to rush me.' },
]

/* ==========================================================================
   COOPER'S QUIZ
   ========================================================================== */

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  /** Shown for a correct answer. */
  praise: string
  /** Shown for a wrong answer. Encouraging, never scolding. */
  coaching: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Someone you have never met in real life sends you a friend request. What do you do?',
    options: [
      'Accept it - more friends is better',
      'Decline it, and tell a grown-up if they keep asking',
      'Accept it but do not talk to them',
    ],
    correctIndex: 1,
    praise: 'Exactly right. If you do not know them in real life, they do not get in.',
    coaching:
      'Close. The safest move is to decline - and if the same person keeps trying, that is worth telling a grown-up about.',
  },
  {
    id: 'q2',
    question: 'Which of these is the strongest password?',
    options: ['Cooper2015!', 'otter-lantern-puddle-42', 'P@ssw0rd'],
    correctIndex: 1,
    praise: 'Nice. Long and random beats short and clever every time.',
    coaching:
      'Not quite. Length is what matters most. Four random words stuck together are much harder to crack than one word with symbols in it.',
  },
  {
    id: 'q3',
    question: 'An online friend asks you to send a photo of yourself. What is the right move?',
    options: [
      'Send one, but only your face',
      'Say no, screenshot the chat, block them, and tell a grown-up',
      'Ignore the message and keep chatting about other things',
    ],
    correctIndex: 1,
    praise: 'Perfect. Screenshot, block, tell. That order matters.',
    coaching:
      'The safest answer is to say no, screenshot the conversation, block the account and tell a grown-up. Ignoring it usually means they just ask again.',
  },
  {
    id: 'q4',
    question: 'A message says your game account will be deleted in one hour unless you click a link. What is happening?',
    options: [
      'A real warning - click quickly',
      'Probably a scam using urgency to rush you',
      'A glitch you should ignore completely',
    ],
    correctIndex: 1,
    praise: 'Yes. Rushing you is the trick. Slowing down beats it.',
    coaching:
      'When a message tries to rush you, that is the warning sign. Go to the app or website directly instead of clicking the link, and check with a grown-up.',
  },
  {
    id: 'q5',
    question: 'Someone online tricked you and now you feel embarrassed. Whose fault is it?',
    options: ['Yours, for falling for it', 'Theirs. Completely.', 'Nobody’s - it just happens'],
    correctIndex: 1,
    praise: 'That is the most important answer on this whole page. It is never your fault.',
    coaching:
      'It is theirs. An adult who tricks or pressures a child is the one who broke the rules. You are not in trouble - please tell a trusted adult today.',
  },
]

/* ==========================================================================
   KID-FRIENDLY GLOSSARY
   ========================================================================== */

export interface GlossaryEntry {
  term: string
  definition: string
}

export const glossary: GlossaryEntry[] = [
  { term: 'ESD K9', definition: 'Electronics Storage Device K9. A dog trained to find hidden electronics like phones, memory cards and USB drives.' },
  { term: 'Alert', definition: 'The signal a detection dog gives when he finds the smell he was trained on. Cooper does not bark or dig at it - he shows his handler.' },
  { term: 'Handler', definition: 'The person who works with a police dog every day. They train together, work together and go home together.' },
  { term: 'TPPO', definition: 'A chemical used in making some electronic parts. It has a smell that Cooper can be trained to find. Humans cannot smell it at all.' },
  { term: 'Evidence', definition: 'Something that helps investigators understand what happened. A phone that was hidden on purpose can be evidence.' },
  { term: 'Two-step login', definition: 'A second lock on your account, usually a code from an app, so a stolen password is not enough to get in.' },
  { term: 'Phishing', definition: 'A fake message pretending to be someone you trust, designed to get your password or your money.' },
  { term: 'Grooming', definition: 'When an adult builds trust with a child online on purpose, so they can ask for something harmful later. It is never the child’s fault.' },
  { term: 'Blocking', definition: 'Stopping an account from contacting you at all. It is a normal thing to do and you never need a reason.' },
  { term: 'Reporting', definition: 'Telling the app, the website or a grown-up that an account is behaving badly, so someone can act on it.' },
]

/* ==========================================================================
   FAMILY CHECKLIST  (printable)
   ========================================================================== */

export const familyChecklist: { section: string; items: string[] }[] = [
  {
    section: 'Tonight, together',
    items: [
      'Name three trusted adults each child can go to.',
      'Say out loud: "You will never be in trouble for telling me."',
      'Agree where devices live overnight.',
      'Agree what happens if something goes wrong (hint: not confiscation).',
    ],
  },
  {
    section: 'Accounts and logins',
    items: [
      'Turn on two-step login for email first, then everything else.',
      'Move important passwords into a password manager.',
      'Check that no password is used on more than one account.',
      'Write down and safely store the backup codes.',
    ],
  },
  {
    section: 'Privacy settings',
    items: [
      'Set social accounts to private.',
      'Turn off location sharing in games, apps and the camera.',
      'Review who can send messages or friend requests.',
      'Look at each profile as a stranger would - what can they see?',
    ],
  },
  {
    section: 'Every month',
    items: [
      'Ask what apps and games they are using now. The answer changes.',
      'Play one of their games with them. It is the best conversation opener there is.',
      'Re-check privacy settings after any big app update.',
      'Ask: "has anything online felt weird lately?" and then be quiet and listen.',
    ],
  },
]

/* ==========================================================================
   EXTERNAL RESOURCES
   --------------------------------------------------------------------------
   INTENTIONALLY EMPTY-BY-DEFAULT.

   Nothing in this list is shown on the site until `approved` is set to true.
   Before flipping any flag, the site owner must open the link, confirm the
   destination is correct and current, and confirm it is appropriate to
   recommend from a page written for children.

   Do not add emergency numbers or reporting hotlines here without verifying
   them against the official source first.
   ========================================================================== */

export interface SafetyResource {
  name: string
  url: string
  description: string
  audience: 'kids' | 'teens' | 'parents' | 'educators'
  approved: boolean
}

export const safetyResources: SafetyResource[] = [
]

export const approvedResources = safetyResources.filter(
  (r) => r.approved && r.url,
)
