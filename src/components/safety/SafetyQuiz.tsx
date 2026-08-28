'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { quizQuestions } from '@/content/safety'
import { track } from '@/lib/analytics'
import { CooperMedallion } from '@/components/CooperGuide'
import { cn } from '@/lib/utils'

/**
 * COOPER'S QUIZ
 *
 * Five questions, one at a time. Wrong answers get coaching rather than a
 * buzzer, and nothing is scored publicly - the point is the explanation, not
 * the mark. No answers leave the browser.
 */
export function SafetyQuiz() {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = quizQuestions[step]
  const answered = picked !== null
  const isCorrect = answered && picked === q.correctIndex

  function choose(index: number) {
    if (answered) return
    setPicked(index)
    if (index === q.correctIndex) setCorrectCount((c) => c + 1)
  }

  function next() {
    if (step + 1 >= quizQuestions.length) {
      setFinished(true)
      track('safety_quiz_complete', { score: correctCount, total: quizQuestions.length })
      return
    }
    setStep((s) => s + 1)
    setPicked(null)
  }

  function restart() {
    setStep(0)
    setPicked(null)
    setCorrectCount(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="ink pop bg-white p-6 text-center sm:p-8">
        <CooperMedallion
          src="/images/cooper/cooper-face-happy.jpg"
          alt="Cooper with his head tilted, grinning"
          boxClass="h-24 w-24 mx-auto"
          px={160}
        />
        <p className="mt-4 font-comic text-2xl tracking-wide text-red-600">
          Training complete!
        </p>
        <p className="mt-1 font-display text-4xl uppercase">
          {correctCount} / {quizQuestions.length}
        </p>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-2">
          {correctCount === quizQuestions.length
            ? 'A perfect run. You already know the things that matter most - now go tell someone else.'
            : 'Every one you got wrong is one you will remember. That is how this works. Have another go whenever you like.'}
        </p>
        <button type="button" onClick={restart} className="btn btn-sm mt-5">
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Run it again
        </button>
      </div>
    )
  }

  return (
    <div className="ink pop bg-white p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="font-comic text-lg tracking-wide text-blue-700">
          Question {step + 1} of {quizQuestions.length}
        </p>
        <ul aria-hidden="true" className="flex gap-1.5">
          {quizQuestions.map((_, i) => (
            <li
              key={i}
              className={cn(
                'h-2.5 w-6 border-2 border-ink',
                i < step ? 'bg-scent-300' : i === step ? 'bg-gold-300' : 'bg-paper-3',
              )}
            />
          ))}
        </ul>
      </div>

      <h3 className="mt-3 text-title uppercase">{q.question}</h3>

      <ul className="mt-5 flex flex-col gap-2.5">
        {q.options.map((option, i) => {
          const chosen = picked === i
          const isRight = i === q.correctIndex
          const state = !answered
            ? 'idle'
            : isRight
              ? 'right'
              : chosen
                ? 'wrong'
                : 'dim'

          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={cn(
                  'flex w-full items-start gap-3 border-[3px] border-ink p-3.5 text-left font-semibold transition-colors',
                  state === 'idle' && 'bg-white hover:bg-gold-200',
                  state === 'right' && 'bg-scent-300',
                  state === 'wrong' && 'bg-red-100',
                  state === 'dim' && 'bg-paper-2 opacity-60',
                )}
              >
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center border-2 border-ink bg-white font-display text-sm"
                >
                  {state === 'right' ? (
                    <Check className="h-4 w-4" strokeWidth={4} />
                  ) : state === 'wrong' ? (
                    <X className="h-4 w-4" strokeWidth={4} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span>{option}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div aria-live="polite">
        {answered ? (
          <div
            className={cn(
              'mt-5 border-l-[5px] p-4',
              isCorrect ? 'border-scent-400 bg-scent-300/30' : 'border-blue-500 bg-blue-50',
            )}
          >
            <p className="font-comic text-lg tracking-wide">
              {isCorrect ? 'Nailed it.' : 'Close - here is the thing.'}
            </p>
            <p className="mt-1 leading-relaxed text-ink-2">
              {isCorrect ? q.praise : q.coaching}
            </p>
          </div>
        ) : null}
      </div>

      {answered ? (
        <button type="button" onClick={next} className="btn btn-blue mt-5 w-full sm:w-auto">
          {step + 1 >= quizQuestions.length ? 'See how I did' : 'Next question'}
        </button>
      ) : null}
    </div>
  )
}
