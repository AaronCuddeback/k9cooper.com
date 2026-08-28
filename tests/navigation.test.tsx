import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { mainNav } from '@/config/nav'

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

describe('mobile navigation', () => {
  it('keeps the drawer closed until the menu button is pressed', () => {
    render(<SiteHeader />)
    expect(screen.queryByRole('dialog', { name: /site menu/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open the menu/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('opens the drawer as a labelled modal dialog', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    await user.click(screen.getByRole('button', { name: /open the menu/i }))

    const dialog = screen.getByRole('dialog', { name: /site menu/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('lists every top-level destination inside the drawer', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)
    await user.click(screen.getByRole('button', { name: /open the menu/i }))

    const dialog = screen.getByRole('dialog', { name: /site menu/i })
    for (const item of mainNav) {
      const targets = item.children ?? [item]
      for (const target of targets) {
        expect(
          within(dialog).getAllByRole('link', { name: new RegExp(target.label, 'i') }).length,
        ).toBeGreaterThan(0)
      }
    }
  })

  it('closes the drawer when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    await user.click(screen.getByRole('button', { name: /open the menu/i }))
    expect(screen.getByRole('dialog', { name: /site menu/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /site menu/i })).not.toBeInTheDocument()
  })

  it('closes the drawer with the close button and restores focus to the toggle', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    const toggle = screen.getByRole('button', { name: /open the menu/i })
    await user.click(toggle)
    await user.click(screen.getByRole('button', { name: /close the menu/i }))

    expect(screen.queryByRole('dialog', { name: /site menu/i })).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('exposes the desktop dropdown with the correct aria state', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    const trigger = screen.getByRole('button', { name: /meet cooper/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: /what cooper does/i })).toBeInTheDocument()
  })

  it('always offers a donate route from the header', () => {
    render(<SiteHeader />)
    expect(screen.getAllByTestId('donate-button').length).toBeGreaterThan(0)
  })
})
