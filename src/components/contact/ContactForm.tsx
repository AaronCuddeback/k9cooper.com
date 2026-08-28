'use client'

import { useId, useRef, useState } from 'react'
import { AlertTriangle, Check, Mail, ShieldAlert } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * CONTACT COMPOSER
 * ----------------------------------------------------------------------------
 * This form does NOT transmit anything to a server.
 *
 * It validates locally and then opens the visitor's own email client with a
 * neatly formatted message ready to send. That is a deliberate choice:
 *
 *   - No backend, no database, no API keys, nothing to leak.
 *   - No spam endpoint to abuse, so no CAPTCHA needed.
 *   - The visitor keeps a copy in their own sent items.
 *   - The site stays fully static and free to host.
 *
 * TO SWITCH TO A REAL SERVER-SIDE FORM LATER
 *   1. Create `src/app/api/contact/route.ts` (or a server action).
 *   2. Re-validate every field on the server - never trust these checks.
 *   3. Add rate limiting and a spam control (honeypot + a privacy-respecting
 *      challenge). The honeypot field below is already in place.
 *   4. Keep the mail provider key in an environment variable, never in client
 *      code. See .env.example.
 *   5. Replace `buildMailto()` with a fetch to your endpoint and keep the same
 *      success and error states.
 */

const REASONS = [
  'Appearance or school visit request',
  'Community presentation',
  'Law enforcement collaboration',
  'Sponsorship opportunity',
  'Merchandise question',
  'Media enquiry',
  'General support or feedback',
] as const

type Errors = Partial<Record<'name' | 'email' | 'reason' | 'message' | 'consent', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactForm() {
  const baseId = useId()
  const [values, setValues] = useState({
    name: '',
    email: '',
    organisation: '',
    reason: '',
    message: '',
    consent: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  function validate(): Errors {
    const next: Errors = {}
    if (!values.name.trim()) next.name = 'Please tell us your name.'
    if (!values.email.trim()) next.email = 'We need an email address to reply to.'
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = 'That does not look like a complete email address.'
    if (!values.reason) next.reason = 'Please choose what this is about.'
    if (values.message.trim().length < 20)
      next.message = 'Please add a little more detail - at least a couple of sentences.'
    if (!values.consent) next.consent = 'Please confirm you have read the notice above.'
    return next
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Honeypot: real people never fill this in, because they cannot see it.
    if (honeypotRef.current?.value) return

    const next = validate()
    setErrors(next)

    if (Object.keys(next).length > 0) {
      summaryRef.current?.focus()
      return
    }

    window.location.href = buildMailto(values)
    track('appearance_request', { reason: values.reason })
    setSent(true)
  }

  if (sent) {
    return (
      <div role="status" className="ink pop bg-scent-300 p-6 sm:p-8">
        <Check aria-hidden="true" className="h-10 w-10" strokeWidth={3} />
        <h2 className="mt-3 font-display text-2xl tracking-wide uppercase">
          Your email app should have opened
        </h2>
        <div className="prose-comic mt-3 text-ink-2">
          <p>
            Your message is drafted and waiting -{' '}
            <strong>you still need to press send in your email app.</strong>
          </p>
          <p>
            If nothing opened, your device may not have an email app configured.
            Write to{' '}
            <a href={`mailto:${siteConfig.email}`} className="font-bold">
              {siteConfig.email}
            </a>{' '}
            directly instead.
          </p>
        </div>
        <button type="button" onClick={() => setSent(false)} className="btn btn-sm mt-5">
          Write another message
        </button>
      </div>
    )
  }

  const errorList = Object.entries(errors)

  return (
    <form noValidate onSubmit={onSubmit} className="ink pop bg-white p-5 sm:p-7">
      {/* ---- Safety notice ---- */}
      <div
        role="note"
        className="flex items-start gap-3 border-[3px] border-red-500 bg-red-50 p-4"
      >
        <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="text-sm leading-relaxed">
          <p className="font-extrabold text-red-700">
            Do not use this form to report a crime or send sensitive information.
          </p>
          <p className="mt-1 text-ink-2">
            No case details, no evidence, no personal information about a child,
            no screenshots. This mailbox is not monitored around the clock and
            cannot take reports.{' '}
            <strong>If someone is in danger right now, call 911.</strong>
          </p>
        </div>
      </div>

      {/* ---- Error summary ---- */}
      <div
        ref={summaryRef}
        tabIndex={-1}
        aria-live="assertive"
        className={cn('mt-5', errorList.length === 0 && 'hidden')}
      >
        {errorList.length > 0 ? (
          <div role="alert" className="border-[3px] border-red-500 bg-red-100 p-4">
            <p className="flex items-center gap-2 font-display text-lg tracking-wide uppercase">
              <AlertTriangle aria-hidden="true" className="h-5 w-5 text-red-600" />
              Please fix {errorList.length}{' '}
              {errorList.length === 1 ? 'thing' : 'things'}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {errorList.map(([field, message]) => (
                <li key={field}>
                  <a
                    href={`#${baseId}-${field}`}
                    className="font-bold text-red-700 underline decoration-2 underline-offset-4"
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field
          id={`${baseId}-name`}
          label="Your name"
          required
          error={errors.name}
          value={values.name}
          autoComplete="name"
          onChange={(v) => setValues((s) => ({ ...s, name: v }))}
        />
        <Field
          id={`${baseId}-email`}
          label="Email address"
          type="email"
          inputMode="email"
          required
          error={errors.email}
          value={values.email}
          autoComplete="email"
          onChange={(v) => setValues((s) => ({ ...s, email: v }))}
        />
      </div>

      <div className="mt-5">
        <Field
          id={`${baseId}-organisation`}
          label="Organisation"
          hint="School, department, business or group. Leave blank if this is personal."
          value={values.organisation}
          autoComplete="organization"
          onChange={(v) => setValues((s) => ({ ...s, organisation: v }))}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${baseId}-reason`}
          className="block font-display text-base tracking-wide uppercase"
        >
          What is this about?{' '}
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        </label>
        <select
          id={`${baseId}-reason`}
          required
          aria-required="true"
          aria-invalid={!!errors.reason}
          aria-describedby={errors.reason ? `${baseId}-reason-error` : undefined}
          value={values.reason}
          onChange={(e) => setValues((s) => ({ ...s, reason: e.target.value }))}
          className={cn(
            'mt-1.5 min-h-12 w-full border-[3px] bg-white px-3 py-2.5 text-base',
            errors.reason ? 'border-red-500' : 'border-ink',
          )}
        >
          <option value="">Choose one...</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.reason ? (
          <p id={`${baseId}-reason-error`} className="mt-1.5 text-sm font-bold text-red-700">
            {errors.reason}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${baseId}-message`}
          className="block font-display text-base tracking-wide uppercase"
        >
          Your message{' '}
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        </label>
        <p id={`${baseId}-message-hint`} className="mt-0.5 text-sm text-ink-3">
          For an appearance request, include the date, location, rough audience
          size and what you would like covered.
        </p>
        <textarea
          id={`${baseId}-message`}
          rows={6}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={cn(
            `${baseId}-message-hint`,
            errors.message ? `${baseId}-message-error` : '',
          ).trim()}
          value={values.message}
          onChange={(e) => setValues((s) => ({ ...s, message: e.target.value }))}
          className={cn(
            'mt-1.5 w-full border-[3px] bg-white px-3 py-2.5 text-base',
            errors.message ? 'border-red-500' : 'border-ink',
          )}
        />
        {errors.message ? (
          <p id={`${baseId}-message-error`} className="mt-1.5 text-sm font-bold text-red-700">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot - visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={`${baseId}-website`}>Leave this field empty</label>
        <input
          ref={honeypotRef}
          id={`${baseId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-5">
        <label
          className={cn(
            'flex cursor-pointer items-start gap-3 border-[3px] p-4',
            'has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-400',
            errors.consent ? 'border-red-500 bg-red-50' : 'border-ink bg-paper-2',
          )}
        >
          <input
            id={`${baseId}-consent`}
            type="checkbox"
            checked={values.consent}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${baseId}-consent-error` : undefined}
            onChange={(e) => setValues((s) => ({ ...s, consent: e.target.checked }))}
            className="mt-0.5 h-5 w-5 shrink-0 accent-red-500"
          />
          <span className="text-sm leading-relaxed">
            I have read the notice above. I am not sending case information,
            evidence, or personal details about a child, and I understand this
            message opens in my own email app rather than being submitted to this
            website.{' '}
            <span className="text-red-600" aria-hidden="true">
              *
            </span>
          </span>
        </label>
        {errors.consent ? (
          <p id={`${baseId}-consent-error`} className="mt-1.5 text-sm font-bold text-red-700">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <button type="submit" className="btn btn-lg btn-donate mt-6 w-full sm:w-auto">
        <Mail aria-hidden="true" className="h-5 w-5" />
        Open in my email app
      </button>

      <p className="mt-3 text-sm text-ink-3">
        This form sends nothing by itself. It drafts an email in your own app so
        you can read it, edit it and press send.
      </p>
    </form>
  )
}

/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  type = 'text',
  inputMode,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  required?: boolean
  type?: string
  inputMode?: 'text' | 'email' | 'tel'
  autoComplete?: string
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div>
      <label htmlFor={id} className="block font-display text-base tracking-wide uppercase">
        {label}
        {required ? (
          <span className="text-red-600" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-0.5 text-sm text-ink-3">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error}
        aria-describedby={cn(hintId ?? '', errorId ?? '').trim() || undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'mt-1.5 min-h-12 w-full border-[3px] bg-white px-3 py-2.5 text-base',
          error ? 'border-red-500' : 'border-ink',
        )}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function buildMailto(values: {
  name: string
  email: string
  organisation: string
  reason: string
  message: string
}): string {
  const subject = `[${values.reason}] - ${values.name}`
  const body = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    values.organisation ? `Organisation: ${values.organisation}` : null,
    `Reason: ${values.reason}`,
    '',
    values.message,
    '',
    '---',
    'Sent from the ESD K9 Cooper website contact page.',
  ]
    .filter((line) => line !== null)
    .join('\r\n')

  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
