/**
 * GALLERY
 * ----------------------------------------------------------------------------
 * HOW TO ADD PHOTOS
 *   1. Put the image in /public/images/cooper/ (or a new folder).
 *      Recommended: at least 1400px on the long edge, JPEG or WebP.
 *   2. Add an entry below with a real `alt` description - it is read aloud by
 *      screen readers and shown if the image fails to load.
 *   3. Set `width` and `height` to the real pixel dimensions so the grid does
 *      not jump while images load.
 *
 * Aspect ratios are preserved. The grid never crops Cooper out of frame.
 */

export type GalleryCategory =
  | 'Cooper at Work'
  | 'Training'
  | 'Community Events'
  | 'Adventures'
  | 'Behind the Scenes'
  | 'Comic Cooper'

export interface GalleryItem {
  id: string
  src: string
  alt: string
  caption?: string
  category: GalleryCategory
  width: number
  height: number
  featured?: boolean
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'portrait-vest',
    src: '/images/cooper/cooper-portrait-vest.jpg',
    alt: 'Close-up portrait of Cooper, a yellow Labrador, wearing his olive working harness with an electronics detection patch',
    caption: 'On duty. The harness means Cooper is working.',
    category: 'Cooper at Work',
    width: 2400,
    height: 1601,
    featured: true,
  },
  {
    id: 'at-sheriffs-office',
    src: '/images/cooper/cooper-at-sheriffs-office.jpg',
    alt: 'Cooper sitting on the walkway in front of the El Dorado County Sheriff’s Office entrance, beside the bronze eagle statue',
    caption: 'Reporting for duty at the El Dorado County Sheriff’s Office.',
    category: 'Cooper at Work',
    width: 1600,
    height: 2842,
    featured: true,
  },
  {
    id: 'handler-portrait',
    src: '/images/cooper/cooper-and-handler.jpg',
    alt: 'Cooper sitting beside his handler, who is kneeling with one hand on Cooper’s back',
    caption: 'One team. Cooper finds the device; his handler does the rest.',
    category: 'Cooper at Work',
    width: 1800,
    height: 1616,
    featured: true,
  },
  {
    id: 'handler-bond',
    src: '/images/cooper/cooper-and-handler-bond.jpg',
    alt: 'Cooper looking up at his handler, face to face, mid-conversation',
    caption: 'Most of the job is trust.',
    category: 'Behind the Scenes',
    width: 1800,
    height: 1800,
    featured: true,
  },
  {
    id: 'sitting-indoors',
    src: '/images/cooper/cooper-sitting-indoors.jpg',
    alt: 'Cooper sitting indoors on a tiled floor in his ESD-K9 harness, looking up at the camera',
    caption: 'Waiting for the word.',
    category: 'Training',
    width: 1400,
    height: 2487,
  },
  {
    id: 'smiling-outdoors',
    src: '/images/cooper/cooper-smiling-outdoors.jpg',
    alt: 'Cooper sitting on a shaded path outdoors with his tongue out, looking pleased with himself',
    caption: 'Off the clock, and delighted about it.',
    category: 'Adventures',
    width: 1600,
    height: 2842,
    featured: true,
  },
  {
    id: 'in-the-car',
    src: '/images/cooper/cooper-in-the-car.jpg',
    alt: 'Cooper sitting upright on his travel bed in the back of the patrol vehicle, clipped in to a safety tether',
    caption: 'Secured and ready to roll. Every K9 rides belted in.',
    category: 'Cooper at Work',
    width: 1500,
    height: 2664,
  },
  {
    id: 'head-tilt',
    src: '/images/cooper/cooper-head-tilt.jpg',
    alt: 'Cooper on a shaded park path with his head tilted to one side and his tongue out',
    caption: 'The head tilt. Extremely effective, entirely deliberate.',
    category: 'Adventures',
    width: 1500,
    height: 2664,
    featured: true,
  },
  {
    id: 'off-duty-blanket',
    src: '/images/cooper/cooper-off-duty-blanket.jpg',
    alt: 'Cooper lying down indoors with his chin resting on a green and white checked blanket',
    caption: 'Harness off. This is the other half of the job.',
    category: 'Behind the Scenes',
    width: 1500,
    height: 2664,
    featured: true,
  },
  {
    id: 'public-safety-complex-art',
    src: '/images/cooper/cooper-public-safety-complex-art.jpg',
    alt: 'Illustrated artwork of Cooper sitting in front of the El Dorado County Public Safety Complex sign',
    caption: 'Cooper at the Public Safety Complex, in comic form.',
    category: 'Comic Cooper',
    width: 1400,
    height: 1120,
  },
  {
    id: 'art-leap',
    src: '/images/guide/cooper-leap.png',
    alt: 'Illustration of Cooper in a red cape leaping forward, wearing his navy ESD K9 harness',
    caption: 'Not all heroes wear capes. This one does.',
    category: 'Comic Cooper',
    width: 900,
    height: 880,
    featured: true,
  },
  {
    id: 'art-searching',
    src: '/images/guide/cooper-searching.png',
    alt: 'Illustration of Cooper nose-down over a hidden phone and hard drive, cape draped over his back',
    caption: 'Hide the thing. Cooper finds the thing.',
    category: 'Comic Cooper',
    width: 900,
    height: 865,
  },
  {
    id: 'art-shield',
    src: '/images/guide/cooper-shield.png',
    alt: 'Illustration of Cooper standing beside a large golden padlock shield',
    caption: 'Stay safe. Stay smart. Speak up.',
    category: 'Comic Cooper',
    width: 836,
    height: 900,
    featured: true,
  },
  {
    id: 'art-wave',
    src: '/images/guide/cooper-wave.png',
    alt: 'Illustration of Cooper sitting with one paw raised in greeting, cape behind him',
    caption: 'Come and say hello.',
    category: 'Comic Cooper',
    width: 577,
    height: 720,
  },
  {
    id: 'comic-poster',
    src: '/images/comic/cooper-comic-poster.jpg',
    alt: 'The full ESD K9 Cooper educational comic poster, showing Cooper searching indoors, outdoors, in vehicles, underwater and underground',
    caption: 'The full Cooper poster. Ask about printed copies for your classroom.',
    category: 'Comic Cooper',
    width: 1086,
    height: 1448,
    featured: true,
  },
  {
    id: 'sticker-art',
    src: '/images/comic/cooper-sticker-hide-the-thing.jpg',
    alt: 'Sticker artwork of Cooper nose-down over a phone, USB drive, memory card and hard drive, with the words Hide the thing, I find the thing, I get the food',
    caption: 'Cooper’s job description, abridged.',
    category: 'Comic Cooper',
    width: 900,
    height: 900,
  },
  {
    id: 'panel-underwater',
    src: '/images/comic/panel-underwater.jpg',
    alt: 'Comic panel showing Cooper swimming underwater following a scent trail',
    caption: 'Water searches. Yes, really.',
    category: 'Comic Cooper',
    width: 212,
    height: 346,
  },
  {
    id: 'panel-buried',
    src: '/images/comic/panel-buried.jpg',
    alt: 'Comic panel showing Cooper digging at soil where a device is buried',
    caption: 'Buried does not mean gone.',
    category: 'Comic Cooper',
    width: 212,
    height: 346,
  },
  {
    id: 'panel-training',
    src: '/images/comic/panel-training.jpg',
    alt: 'Comic panel showing Cooper giving his handler a high five during training',
    caption: 'Trained. Focused. Relentless.',
    category: 'Training',
    width: 326,
    height: 284,
  },
]

export const galleryCategories: GalleryCategory[] = [
  'Cooper at Work',
  'Training',
  'Community Events',
  'Adventures',
  'Behind the Scenes',
  'Comic Cooper',
]

export const featuredGallery = galleryItems.filter((i) => i.featured)
