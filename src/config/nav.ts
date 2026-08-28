/**
 * Site navigation.
 *
 * Top-level items with `children` render as a dropdown on desktop and as a
 * grouped section inside the mobile drawer.
 */

export interface NavItem {
  label: string
  href: string
  description?: string
  children?: NavItem[]
}

export const mainNav: NavItem[] = [
  {
    label: 'Meet Cooper',
    href: '/meet-cooper',
    description: 'Who Cooper is, and how he got here',
    children: [
      {
        label: 'Cooper’s Story',
        href: '/meet-cooper',
        description: 'Biography, fun facts and milestones',
      },
      {
        label: 'What Cooper Does',
        href: '/what-cooper-does',
        description: 'How an ESD K9 finds hidden electronics',
      },
      {
        label: 'The Mission',
        href: '/mission',
        description: 'Why this work matters',
      },
    ],
  },
  {
    label: 'Safety HQ',
    href: '/safety-hq',
    description: 'Free online-safety training for kids and families',
  },
  {
    label: 'Adventures',
    href: '/adventures',
    description: 'Mission logs, training days and field notes',
  },
  {
    label: 'Events',
    href: '/events',
    description: 'Where to meet Cooper',
  },
  {
    label: 'More',
    href: '/gallery',
    description: 'Photos, videos, shop and supporters',
    children: [
      { label: 'Gallery', href: '/gallery', description: 'Photos and videos' },
      { label: 'Social Hub', href: '/social', description: 'Instagram and TikTok' },
      { label: 'Shop', href: '/shop', description: 'Stickers, patches and more' },
      { label: 'Sponsors', href: '/sponsors', description: 'The people behind Cooper' },
      { label: 'FAQ', href: '/faq', description: 'Common questions, answered' },
      { label: 'Contact', href: '/contact', description: 'Book Cooper or get in touch' },
    ],
  },
]

/** Grouped links used by the footer. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'About Cooper',
    items: [
      { label: 'Cooper’s Story', href: '/meet-cooper' },
      { label: 'What Cooper Does', href: '/what-cooper-does' },
      { label: 'The Mission', href: '/mission' },
      { label: 'Frequently Asked Questions', href: '/faq' },
    ],
  },
  {
    title: 'Get Involved',
    items: [
      { label: 'Support Cooper', href: '/support' },
      { label: 'Events & Appearances', href: '/events' },
      { label: 'Shop', href: '/shop' },
      { label: 'Sponsors & Supporters', href: '/sponsors' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Learn & Follow',
    items: [
      { label: 'Safety HQ', href: '/safety-hq' },
      { label: 'For Grown-Ups', href: '/safety-hq#grown-ups' },
      { label: 'Adventures', href: '/adventures' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Social Hub', href: '/social' },
    ],
  },
]
