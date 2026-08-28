/**
 * VIDEOS
 * ----------------------------------------------------------------------------
 * HOW TO FEATURE A VIDEO
 *   Local:   drop the .mp4 into /public/videos/ and set `provider: 'local'`
 *     with `src: '/videos/your-file.mp4'`. Nothing leaves your own domain.
 *   YouTube: the id is the part after `v=` or after `youtu.be/`.
 *     https://www.youtube.com/watch?v=ABCdef12345  ->  videoId: 'ABCdef12345'
 *   Vimeo:   the numeric id.
 *     https://vimeo.com/123456789                  ->  videoId: '123456789'
 *
 * Videos are NOT embedded or downloaded on page load. Each one renders a
 * lightweight poster with a play button, and the real player only loads when a
 * visitor clicks it. That keeps the page fast and keeps third-party cookies off
 * the site until someone deliberately asks for them. Self-hosted videos use
 * `preload="none"`, so the file is not fetched until play is pressed either.
 *
 * `poster` should be a local image. If you leave it out, a comic placeholder
 * is drawn instead - no request is made to YouTube.
 *
 * `aspect` controls the shape of the frame. Phone footage is almost always
 * 'portrait'; leave it unset for normal landscape video.
 *
 * ENCODING A SELF-HOSTED CLIP
 *   ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
 *          -movflags +faststart -c:a aac -b:a 128k public/videos/output.mp4
 *   `+faststart` matters: without it the browser must download the whole file
 *   before it can start playing.
 */

export interface CooperVideo {
  id: string
  provider: 'youtube' | 'vimeo' | 'local'
  /** YouTube/Vimeo id. Leave empty for a local video. */
  videoId: string
  /** Path under /public for a self-hosted file, e.g. '/videos/clip.mp4'. */
  src?: string
  title: string
  description: string
  /** Local poster image path. */
  poster?: string
  /** Frame shape. Defaults to landscape 16:9. */
  aspect?: 'landscape' | 'portrait'
  /** Roughly how long it runs, shown as a badge. */
  duration?: string
  /** Optional captions track, e.g. '/videos/clip.vtt'. */
  captions?: string
  featured?: boolean
  isSample?: boolean
}

export const videos: CooperVideo[] = [
  {
    id: 'training-day-tiny-hide',
    provider: 'local',
    videoId: '',
    src: '/videos/cooper-training-day.mp4',
    title: 'Training Day: The Tiny Hide',
    description:
      'The hide may be tiny, but Cooper’s nose knows exactly what it is looking for. A memory card, a window blind, and about thirty seconds of work.',
    poster: '/videos/cooper-training-day-poster.jpg',
    aspect: 'portrait',
    duration: '0:36',
    featured: true,
  },
]

export const featuredVideo = videos.find((v) => v.featured) ?? videos[0]

/**
 * A video is playable once it actually points at something: a local file, or a
 * platform id that is no longer a `[PLACEHOLDER]`.
 */
export function isVideoReady(v: CooperVideo): boolean {
  if (v.provider === 'local') return Boolean(v.src)
  return Boolean(v.videoId) && !v.videoId.startsWith('[')
}
