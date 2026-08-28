import { PawPrint } from 'lucide-react'

const PHRASES = [
  'One Nose. One Mission. Protect Children.',
  'Stay Safe. Stay Smart. Speak Up.',
  'Trained. Focused. Relentless.',
  'Not all heroes wear capes.',
]

/**
 * The red banner strip that runs under the hero, echoing the footer band on
 * the printed poster. The scroll animation is CSS-only and is disabled
 * automatically under `prefers-reduced-motion`, where it becomes a static row.
 */
export function MissionTicker() {
  const run = [...PHRASES, ...PHRASES]

  return (
    <div className="relative overflow-hidden border-y-[4px] border-ink bg-red-500 py-2.5">
      <div
        aria-hidden="true"
        className="benday absolute inset-0 opacity-25"
        style={{ ['--benday-color' as string]: 'rgb(0 0 0 / 0.45)' }}
      />
      <p className="sr-only">{PHRASES.join('. ')}</p>
      <div
        aria-hidden="true"
        className="relative flex w-max items-center gap-6 motion-safe:animate-[ticker_38s_linear_infinite] motion-reduce:flex-wrap motion-reduce:justify-center"
      >
        {run.map((phrase, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-6 font-display text-base tracking-[0.14em] whitespace-nowrap text-white uppercase sm:text-lg"
          >
            {phrase}
            <PawPrint className="h-4 w-4 shrink-0 text-gold-300" />
          </span>
        ))}
      </div>

      <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}
