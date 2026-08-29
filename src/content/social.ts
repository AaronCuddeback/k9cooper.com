/**
 * FEATURED SOCIAL POSTS
 * ----------------------------------------------------------------------------
 * These are the hand-picked posts shown on the Social Hub. Nothing is scraped
 * from Instagram or TikTok and no unofficial API is used - you paste the
 * permalink, a caption and a thumbnail, and the card is built from those.
 *
 *
 * WHY THERE IS NO LIVE FEED
 * Reading an account's own posts is only possible through the Instagram API
 * with Instagram Login, which works exclusively for Professional (Business or
 * Creator) accounts. @esdk9_cooper is a personal account, so there is no
 * supported way to fetch its posts automatically. The alternatives - scraping,
 * or an unofficial third-party service holding a token - are respectively
 * against Instagram's terms and a security liability for an agency account, so
 * this site does neither. TikTok has no equivalent read API either.
 *
 * The practical cost is small: featuring a post is a two-minute manual job, and
 * a feed of six posts realistically needs updating a few times a year.
 *
 *
 * HOW TO FEATURE A POST
 *   1. Open the post on Instagram or TikTok and copy its link into `url`.
 *   2. Save its image into /public/images/social/ and point `thumbnail` there.
 *      Fastest way: the post's own preview image is published as an `og:image`
 *      meta tag on the permalink, which is what link previews use.
 *
 *        curl -sL -A "Mozilla/5.0 (compatible; facebookexternalhit/1.1)" \
 *          "https://www.instagram.com/p/POSTID/" \
 *          | grep -o '<meta property="og:image" content="[^"]*"'
 *
 *      Then download that URL. The CDN link is signed and expires, so always
 *      save the file locally - never hotlink it.
 *   3. Write a `caption` in your own words - one or two lines - and a
 *      `thumbnailAlt` describing the picture for screen readers.
 *   4. Set `date` to something short, e.g. 'Aug 2026'.
 *
 * A card whose `url` still starts with '[' renders muted and unclickable rather
 * than as a broken link, so a half-finished entry is safe to leave in place.
 * Do not ship one: this file is published as-is.
 *
 * NOTE ON CROPPING: `og:image` is Instagram's own square preview crop. For a
 * portrait photo that can cut awkwardly - ig-5 is a hand-made square crop of
 * the original photo for exactly that reason. If a crop looks wrong, replace
 * the file; the card does not care where the image came from.
 */

import type { SocialPost } from '@/components/social/SocialEmbed'

export const featuredPosts: SocialPost[] = [
  {
    id: 'ig-2',
    platform: 'instagram',
    url: 'https://www.instagram.com/p/DcUTP90klUA/',
    caption:
      'Meet Cooper. The introduction post - who he is, what an ESD K9 does, and what to expect from the account.',
    thumbnail: '/images/social/ig-2.jpg',
    thumbnailAlt:
      'Cooper and his handler face to face against a green wall, noses almost touching, both mid-conversation',
    date: 'Aug 2026',
  },
  {
    id: 'ig-1',
    platform: 'instagram',
    url: 'https://www.instagram.com/p/DcUoIuRijCD/',
    caption:
      'What exactly does an Electronics Storage Detection K9 do? The explainer poster, TPPO and all.',
    thumbnail: '/images/social/ig-1.jpg',
    thumbnailAlt:
      'The ESD K9 Cooper comic poster, showing Cooper in his harness beside a panel headed Cooper’s Superpower: His Nose',
    date: 'Aug 2026',
  },
  {
    id: 'ig-4',
    platform: 'instagram',
    url: 'https://www.instagram.com/p/DcWjMIvGAP-/',
    caption:
      'Morning miles and nose work. A walk is never just a walk - new places, new smells, new distractions to work through.',
    thumbnail: '/images/social/ig-4.jpg',
    thumbnailAlt:
      'Close-up of Cooper looking straight up at the camera on a shaded path, ears soft and mouth open',
    date: 'Aug 2026',
  },
  {
    id: 'ig-3',
    platform: 'instagram',
    url: 'https://www.instagram.com/p/DcZZ3oFycpp/',
    caption:
      'Back to school. Cooper’s first assignment of the year: think before you click, and tell a trusted adult.',
    thumbnail: '/images/social/ig-3.jpg',
    thumbnailAlt:
      'Cooper sitting outside El Dorado Elementary School beneath a Welcome Back banner, next to a Happy First Day of School board',
    date: 'Aug 2026',
  },
  {
    id: 'ig-5',
    platform: 'instagram',
    url: 'https://www.instagram.com/p/DcVCFufCn-R/',
    caption:
      'Relaxing on his first day off, after a long first week of work. Entirely earned.',
    thumbnail: '/images/social/ig-5.jpg',
    thumbnailAlt:
      'Cooper stretched out fast asleep on a soft bed at home, wearing a stars-and-stripes collar',
    date: 'Aug 2026',
  },
]
