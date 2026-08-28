import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ContactForm } from '@/components/contact/ContactForm'
import { siteConfig } from '@/config/site'

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

/** jsdom refuses real navigation, so capture the assignment instead. */
function stubLocation() {
  const store = { href: '' }
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      get href() {
        return store.href
      },
      set href(value: string) {
        store.href = value
      },
    },
  })
  return store
}

describe('contact form validation', () => {
  beforeEach(() => {
    stubLocation()
  })

  it('warns clearly that the form is not for reports or emergencies', () => {
    render(<ContactForm />)
    expect(
      screen.getByText(/do not use this form to report a crime/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/call 911/i)).toBeInTheDocument()
  })

  it('blocks submission and lists every problem when the form is empty', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: /open in my email app/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/please fix 5 things/i)

    // Each message appears twice on purpose: once in the summary at the top of
    // the form, and once beside the field it belongs to.
    for (const message of [
      /please tell us your name/i,
      /we need an email address/i,
      /please choose what this is about/i,
      /at least a couple of sentences/i,
      /confirm you have read the notice/i,
    ]) {
      expect(screen.getAllByText(message).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('rejects a malformed email address', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText(/your name/i), 'Alex Reed')
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /open in my email app/i }))

    expect(
      (await screen.findAllByText(/does not look like a complete email address/i)).length,
    ).toBeGreaterThan(0)
  })

  it('marks invalid fields with aria-invalid for screen readers', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: /open in my email app/i }))

    expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('requires the consent checkbox even when everything else is filled in', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText(/your name/i), 'Alex Reed')
    await user.type(screen.getByLabelText(/email address/i), 'alex@example.com')
    await user.selectOptions(
      screen.getByLabelText(/what is this about/i),
      'Media enquiry',
    )
    await user.type(
      screen.getByLabelText(/your message/i),
      'We would like to interview Cooper for a local piece about online safety.',
    )
    await user.click(screen.getByRole('button', { name: /open in my email app/i }))

    expect(
      (await screen.findAllByText(/confirm you have read the notice/i)).length,
    ).toBeGreaterThan(0)
  })

  it('builds a prefilled mailto to the configured address when valid', async () => {
    const location = stubLocation()
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText(/your name/i), 'Alex Reed')
    await user.type(screen.getByLabelText(/email address/i), 'alex@example.com')
    await user.selectOptions(
      screen.getByLabelText(/what is this about/i),
      'Appearance or school visit request',
    )
    await user.type(
      screen.getByLabelText(/your message/i),
      'Could Cooper visit our school assembly in October? Around 200 students.',
    )
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /open in my email app/i }))

    expect(location.href).toContain(`mailto:${siteConfig.email}`)
    expect(location.href).toContain(encodeURIComponent('Appearance or school visit request'))
    expect(location.href).toContain(encodeURIComponent('Alex Reed'))
    expect(await screen.findByRole('status')).toHaveTextContent(
      /your email app should have opened/i,
    )
  })

  it('does nothing when the hidden honeypot field is filled', async () => {
    const location = stubLocation()
    const user = userEvent.setup()
    const { container } = render(<ContactForm />)

    const honeypot = container.querySelector<HTMLInputElement>('input[name="website"]')
    expect(honeypot).not.toBeNull()
    honeypot!.value = 'spam-bot'

    await user.type(screen.getByLabelText(/your name/i), 'Bot')
    await user.click(screen.getByRole('button', { name: /open in my email app/i }))

    expect(location.href).toBe('')
  })
})
