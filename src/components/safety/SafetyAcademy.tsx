'use client'

import { useMemo, useState } from 'react'
import * as Icons from 'lucide-react'
import {
  audienceLabels,
  safetyLessons,
  type Audience,
  type SafetyLesson,
} from '@/content/safety'
import { ComicPanel } from '@/components/comic/ComicPanel'
import { NoResults } from '@/components/ui/States'
import { cn } from '@/lib/utils'

const FILTERS: { value: Audience | 'all'; label: string }[] = [
  { value: 'all', label: 'Everyone' },
  { value: 'younger', label: audienceLabels.younger },
  { value: 'older', label: audienceLabels.older },
  { value: 'teens', label: audienceLabels.teens },
]

/** Maps the lesson `icon` string to a Lucide component, with a safe default. */
function lessonIcon(name: string) {
  const map: Record<string, Icons.LucideIcon> = {
    'user-lock': Icons.VenetianMask,
    key: Icons.KeyRound,
    'shield-check': Icons.ShieldCheck,
    'map-pin-off': Icons.MapPinOff,
    'camera-off': Icons.CameraOff,
    'user-search': Icons.UserSearch,
    'link-2-off': Icons.Link2Off,
    'message-square-warning': Icons.MessageSquareWarning,
    'door-open': Icons.DoorOpen,
    'image-down': Icons.ImageDown,
    users: Icons.Users,
    'heart-handshake': Icons.HeartHandshake,
  }
  return map[name] ?? Icons.ShieldCheck
}

/**
 * The twelve training-academy lessons, filterable by age band and expandable
 * to reveal the extra note written for parents and educators.
 */
export function SafetyAcademy() {
  const [filter, setFilter] = useState<Audience | 'all'>('all')

  const lessons = useMemo(
    () =>
      filter === 'all'
        ? safetyLessons
        : safetyLessons.filter((l) => l.audiences.includes(filter)),
    [filter],
  )

  return (
    <div>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
          Show lessons for
        </legend>
        {FILTERS.map((f) => (
          <label
            key={f.value}
            className={cn(
              'cursor-pointer border-[3px] border-ink px-3.5 py-2 font-display text-sm tracking-wide uppercase transition-colors',
              'has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-400',
              filter === f.value
                ? 'bg-red-500 text-white'
                : 'bg-white hover:bg-gold-200',
            )}
          >
            <input
              type="radio"
              name="audience-filter"
              value={f.value}
              checked={filter === f.value}
              onChange={() => setFilter(f.value)}
              className="sr-only"
            />
            {f.label}
          </label>
        ))}
      </fieldset>

      <p aria-live="polite" className="sr-only">
        Showing {lessons.length} lessons.
      </p>

      {lessons.length === 0 ? (
        <NoResults label="No lessons for that age group yet." />
      ) : (
        <ul className="mt-7 grid gap-6 md:grid-cols-2">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <LessonCard lesson={lesson} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LessonCard({ lesson }: { lesson: SafetyLesson }) {
  const [showGrownUps, setShowGrownUps] = useState(false)
  const Icon = lessonIcon(lesson.icon)
  const panelId = `grown-ups-${lesson.id}`

  return (
    <ComicPanel
      as="article"
      tone="white"
      tiltSeed={lesson.id}
      className="flex h-full flex-col p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center border-[3px] border-ink bg-gold-300 font-display text-xl">
          {lesson.number}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl leading-tight tracking-wide uppercase">
            {lesson.title}
          </h3>
          <p className="mt-1 text-[0.95rem] leading-snug font-bold text-red-700">
            {lesson.headline}
          </p>
        </div>
        <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-blue-500" />
      </div>

      <div className="mt-3.5 flex flex-col gap-2.5 text-[0.95rem] leading-relaxed text-ink-2">
        {lesson.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-4 border-[3px] border-ink bg-paper-2 p-3.5">
        <p className="font-comic text-base tracking-wide text-blue-700">
          Cooper says: do this
        </p>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {lesson.doThis.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-snug font-semibold">
              <Icons.Check
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-scent-500"
                strokeWidth={3}
              />
              {d}
            </li>
          ))}
        </ul>
      </div>

      {lesson.grownUps ? (
        <div className="mt-3.5">
          <button
            type="button"
            aria-expanded={showGrownUps}
            aria-controls={panelId}
            onClick={() => setShowGrownUps((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 underline decoration-2 underline-offset-4"
          >
            {showGrownUps ? (
              <Icons.ChevronUp aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Icons.ChevronDown aria-hidden="true" className="h-4 w-4" />
            )}
            For grown-ups
          </button>
          <div
            id={panelId}
            hidden={!showGrownUps}
            className="mt-2.5 border-l-[4px] border-blue-500 bg-blue-50 p-3.5 text-sm leading-relaxed text-ink-2"
          >
            {lesson.grownUps}
          </div>
        </div>
      ) : null}

      <div className="mt-auto pt-3.5">
        <ul className="flex flex-wrap gap-1.5">
          {lesson.audiences.map((a) => (
            <li key={a} className="badge badge-muted">
              {audienceLabels[a]}
            </li>
          ))}
        </ul>
      </div>
    </ComicPanel>
  )
}
