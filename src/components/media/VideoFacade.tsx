'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import type { CooperVideo } from '@/content/videos'
import { isVideoReady } from '@/content/videos'

/**
 * Click-to-load video.
 *
 * Nothing is requested from YouTube or Vimeo until the visitor presses play.
 * That keeps the page fast and keeps third-party cookies off the site for
 * anyone who never watches a video.
 *
 * Self-hosted (`provider: 'local'`) videos never touch a third party at all.
 * They still use the same facade, and carry `preload="none"` so the file is
 * not fetched until someone actually presses play - the poster image is all
 * that loads otherwise.
 */
export function VideoFacade({
  video,
  className,
  priority = false,
}: {
  video: CooperVideo
  className?: string
  priority?: boolean
}) {
  const [playing, setPlaying] = useState(false)
  const ready = isVideoReady(video)
  const isLocal = video.provider === 'local'

  const src =
    video.provider === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`
      : `https://player.vimeo.com/video/${video.videoId}?autoplay=1&dnt=1`

  // Portrait clips (phone footage) get a 9:16 frame, capped in width so they
  // do not tower over the rest of the page on a desktop screen.
  const portrait = video.aspect === 'portrait'

  return (
    <figure
      className={cn(
        'ink pop overflow-hidden bg-ink',
        portrait && 'mx-auto w-full max-w-sm',
        className,
      )}
    >
      <div
        className={cn(
          'relative w-full',
          portrait ? 'aspect-[9/16]' : 'aspect-video',
        )}
      >
        {playing && ready && isLocal ? (
          /*
            The element only mounts after a real click, so this is a
            user-initiated play rather than an autoplaying page.

            `autoPlay` alone is not reliable: the play happens a tick after the
            gesture, and a browser that blocks sound-on autoplay will silently
            pause, leaving the visitor to press play a second time. Asking
            explicitly on mount - and ignoring a rejection - avoids that.
          */
          <video
            ref={(el) => {
              el?.play().catch(() => {
                /* Blocked by policy; the controls are right there. */
              })
            }}
            src={video.src}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full bg-ink object-contain"
          >
            {video.captions ? (
              <track
                kind="captions"
                src={video.captions}
                srcLang="en"
                label="English"
                default
              />
            ) : null}
            <p className="p-4 text-paper">
              Your browser cannot play this video.{' '}
              <a href={video.src} className="underline">
                Download it instead
              </a>
              .
            </p>
          </video>
        ) : playing && ready ? (
          <iframe
            src={src}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            {video.poster ? (
              <Image
                src={video.poster}
                alt=""
                fill
                priority={priority}
                sizes={
                  portrait
                    ? '(max-width: 640px) 100vw, 384px'
                    : '(max-width: 768px) 100vw, 760px'
                }
                className="object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="benday absolute inset-0 bg-blue-700"
                style={{ ['--benday-color' as string]: 'rgb(255 255 255 / 0.2)' }}
              />
            )}

            <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />

            {ready ? (
              <button
                type="button"
                onClick={() => {
                  setPlaying(true)
                  track('video_play', { video: video.id, provider: video.provider })
                }}
                className="group absolute inset-0 grid place-items-center"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full border-[4px] border-ink bg-gold-300 transition-transform group-hover:scale-110">
                  <Play
                    aria-hidden="true"
                    className="ml-1 h-9 w-9 text-ink"
                    fill="currentColor"
                  />
                </span>
                <span className="sr-only">Play video: {video.title}</span>
              </button>
            ) : (
              <div className="absolute inset-0 grid place-items-center p-6">
                <p className="max-w-sm border-[3px] border-ink bg-paper px-4 py-3 text-center text-sm font-bold text-ink">
                  Video coming soon.
                </p>
              </div>
            )}

            {video.duration ? (
              <span className="absolute right-3 bottom-3 border-2 border-ink bg-ink px-2 py-0.5 font-mono text-xs font-bold text-paper">
                {video.duration}
              </span>
            ) : null}
          </>
        )}
      </div>

      <figcaption className="border-t-[3px] border-ink bg-white p-4">
        <p className="font-display text-lg tracking-wide uppercase">{video.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{video.description}</p>
        {ready && !isLocal ? (
          <a
            href={
              video.provider === 'youtube'
                ? `https://www.youtube.com/watch?v=${video.videoId}`
                : `https://vimeo.com/${video.videoId}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 underline decoration-2 underline-offset-4"
          >
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            Watch on {video.provider === 'youtube' ? 'YouTube' : 'Vimeo'}
          </a>
        ) : null}
        <p className="mt-2 text-xs text-ink-3">
          {isLocal
            ? 'This video is hosted on this website. Nothing is requested from any third party, and nothing loads until you press play.'
            : 'Captions and a transcript are provided on the hosting platform where available.'}
        </p>
      </figcaption>
    </figure>
  )
}
