import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DonateButton } from '@/components/donate/DonateButton'
import { donationConfig } from '@/config/donations'
import { track } from '@/lib/analytics'

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

describe('donation links', () => {
  beforeEach(() => {
    vi.mocked(track).mockClear()
  })

  it('points every donate button at the configured donation URL', () => {
    render(<DonateButton placement="test" />)
    const link = screen.getByTestId('donate-button')
    expect(link).toHaveAttribute('href', donationConfig.url)
  })

  it('opens the donation platform in a new tab without leaking the referrer opener', () => {
    render(<DonateButton placement="test" />)
    const link = screen.getByTestId('donate-button')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(link.getAttribute('rel')).toContain('noreferrer')
  })

  it('warns screen reader users that the link opens a new tab', () => {
    render(<DonateButton placement="test" label="Support Cooper" />)
    expect(
      screen.getByRole('link', { name: /opens the donation page in a new tab/i }),
    ).toBeInTheDocument()
  })

  it('records the placement so we can see which callout works', async () => {
    const user = userEvent.setup()
    render(<DonateButton placement="home-hero" />)
    await user.click(screen.getByTestId('donate-button'))
    expect(track).toHaveBeenCalledWith('donate_click', { placement: 'home-hero' })
  })

  it('uses an https donation URL', () => {
    expect(donationConfig.url).toMatch(/^https:\/\//)
  })
})
