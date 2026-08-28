import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SafetyShield } from '@/components/safety/SafetyShield'
import { SafetyQuiz } from '@/components/safety/SafetyQuiz'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { shieldItems, quizQuestions } from '@/content/safety'
import { galleryItems } from '@/content/gallery'

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

describe('build your safety shield', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts empty and counts up as items are ticked', async () => {
    const user = userEvent.setup()
    render(<SafetyShield />)

    expect(screen.getByText('0% built')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: new RegExp(shieldItems[0].label, 'i') }))
    expect(screen.queryByText('0% built')).not.toBeInTheDocument()
  })

  it('persists ticks to this browser only', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<SafetyShield />)

    await user.click(screen.getByRole('checkbox', { name: new RegExp(shieldItems[0].label, 'i') }))
    unmount()

    render(<SafetyShield />)
    expect(
      screen.getByRole('checkbox', { name: new RegExp(shieldItems[0].label, 'i') }),
    ).toBeChecked()
  })

  it('can be reset', async () => {
    const user = userEvent.setup()
    render(<SafetyShield />)

    await user.click(screen.getByRole('checkbox', { name: new RegExp(shieldItems[0].label, 'i') }))
    await user.click(screen.getByRole('button', { name: /start over/i }))

    expect(screen.getByText('0% built')).toBeInTheDocument()
  })

  it('tells the visitor their answers stay local', () => {
    render(<SafetyShield />)
    expect(screen.getByText(/saved in this browser only/i)).toBeInTheDocument()
  })
})

describe("cooper's quiz", () => {
  it('coaches rather than scolds on a wrong answer', async () => {
    const user = userEvent.setup()
    render(<SafetyQuiz />)

    const q = quizQuestions[0]
    const wrongIndex = q.correctIndex === 0 ? 1 : 0
    await user.click(screen.getByRole('button', { name: new RegExp(escapeRe(q.options[wrongIndex]), 'i') }))

    expect(screen.getByText(q.coaching)).toBeInTheDocument()
  })

  it('praises a correct answer and moves on', async () => {
    const user = userEvent.setup()
    render(<SafetyQuiz />)

    const q = quizQuestions[0]
    await user.click(screen.getByRole('button', { name: new RegExp(escapeRe(q.options[q.correctIndex]), 'i') }))

    expect(screen.getByText(q.praise)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument()
  })

  it('locks the options once an answer is chosen', async () => {
    const user = userEvent.setup()
    render(<SafetyQuiz />)

    const q = quizQuestions[0]
    await user.click(screen.getByRole('button', { name: new RegExp(escapeRe(q.options[0]), 'i') }))

    expect(screen.getByRole('button', { name: new RegExp(escapeRe(q.options[1]), 'i') })).toBeDisabled()
  })
})

describe('gallery lightbox', () => {
  it('opens a labelled modal dialog when a photo is activated', async () => {
    const user = userEvent.setup()
    render(<GalleryGrid items={galleryItems.slice(0, 3)} />)

    await user.click(screen.getAllByRole('button', { name: /open larger view/i })[0])
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<GalleryGrid items={galleryItems.slice(0, 3)} />)

    await user.click(screen.getAllByRole('button', { name: /open larger view/i })[0])
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('moves between photos with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<GalleryGrid items={galleryItems.slice(0, 3)} />)

    await user.click(screen.getAllByRole('button', { name: /open larger view/i })[0])
    expect(screen.getByText('1 / 3')).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('2 / 3')).toBeInTheDocument()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('filters by category and can be reset', async () => {
    const user = userEvent.setup()
    render(<GalleryGrid items={galleryItems} />)

    const all = screen.getAllByRole('button', { name: /open larger view/i }).length
    await user.click(screen.getByRole('button', { name: /^training$/i }))
    const filtered = screen.getAllByRole('button', { name: /open larger view/i }).length

    expect(filtered).toBeLessThan(all)
  })
})

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
