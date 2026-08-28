import Image from 'next/image'
import type { ReactNode } from 'react'
import { SpeechBubble } from '@/components/comic/SpeechBubble'
import { cn } from '@/lib/utils'

/**
 * COOPER GUIDE
 * ----------------------------------------------------------------------------
 * Cooper's recurring appearance across the site: a heavy-inked photo medallion
 * with a speech bubble. He introduces sections, gives safety tips and points
 * at things.
 *
 * PLACEHOLDER NOTE FOR ILLUSTRATED POSES
 * The medallions below use real photographs of Cooper. If a set of illustrated
 * character poses is commissioned later, drop transparent PNGs into
 * /public/images/guide/ and swap the `src` values in POSES.
 * Recommended: 800x800px, transparent background, Cooper facing slightly
 * inward, consistent line weight with the comic poster.
 * Required poses: alert, happy, working, duty, pointing, sitting-proud.
 *
 * Cooper never covers page content and never follows the viewport. He is a
 * guide, not a chatbot.
 */

export type CooperPose =
  | 'alert'
  | 'happy'
  | 'working'
  | 'duty'
  | 'resting'
  | 'curious'

const POSES: Record<CooperPose, { src: string; alt: string }> = {
  alert: {
    src: '/images/cooper/cooper-face-alert.jpg',
    alt: 'Cooper looking straight at the camera with his tongue out, ears relaxed',
  },
  happy: {
    src: '/images/cooper/cooper-face-happy.jpg',
    alt: 'Cooper with his head tilted to one side, grinning',
  },
  working: {
    src: '/images/cooper/cooper-face-working.jpg',
    alt: 'Cooper in the back of the vehicle, alert and waiting to work',
  },
  duty: {
    src: '/images/cooper/cooper-face-duty.jpg',
    alt: 'Cooper on duty in his harness outside the Sheriff’s Office',
  },
  resting: {
    src: '/images/cooper/cooper-face-resting.jpg',
    alt: 'Cooper off duty with his chin resting on a blanket',
  },
  curious: {
    src: '/images/cooper/cooper-face-curious.jpg',
    alt: 'Cooper looking off to one side, interested in something',
  },
}

const SIZES = {
  sm: { box: 'h-16 w-16 sm:h-20 sm:w-20', px: 96 },
  md: { box: 'h-24 w-24 sm:h-28 sm:w-28', px: 160 },
  lg: { box: 'h-32 w-32 sm:h-40 sm:w-40', px: 224 },
}

interface CooperGuideProps {
  children: ReactNode
  pose?: CooperPose
  label?: string
  size?: keyof typeof SIZES
  /** Side the medallion sits on. */
  side?: 'left' | 'right'
  tone?: 'cream' | 'white' | 'gold' | 'blue'
  className?: string
  /** Stacks vertically at every breakpoint - useful in narrow columns. */
  stacked?: boolean
}

export function CooperGuide({
  children,
  pose = 'alert',
  label,
  size = 'md',
  side = 'left',
  tone = 'cream',
  className,
  stacked = false,
}: CooperGuideProps) {
  const p = POSES[pose]
  const s = SIZES[size]

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        stacked ? 'flex-col' : 'flex-col sm:flex-row',
        !stacked && side === 'right' && 'sm:flex-row-reverse',
        className,
      )}
    >
      <CooperMedallion src={p.src} alt={p.alt} boxClass={s.box} px={s.px} />
      <SpeechBubble
        tail={stacked ? 'none' : side === 'left' ? 'left' : 'right'}
        tone={tone}
        label={label}
        className="flex-1"
      >
        {children}
      </SpeechBubble>
    </div>
  )
}

/** The medallion on its own - used in the header, footer and tip cards. */
export function CooperMedallion({
  src,
  alt,
  boxClass,
  px,
  className,
}: {
  src: string
  alt: string
  boxClass: string
  px: number
  className?: string
}) {
  return (
    <div className={cn('relative shrink-0', boxClass, className)}>
      {/* Gold ring behind the photo, offset slightly like mis-registered ink. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-gold-300 ink"
      />
      <span
        aria-hidden="true"
        className="benday absolute inset-0 rounded-full opacity-60"
        style={{ ['--benday-size' as string]: '5px' }}
      />
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        sizes={`${px}px`}
        className="relative h-full w-full rounded-full object-cover ink"
      />
    </div>
  )
}
