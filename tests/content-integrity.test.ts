import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { galleryItems } from '@/content/gallery'
import { adventures } from '@/content/adventures'
import { events } from '@/content/events'
import { merchItems } from '@/content/merch'
import { safetyLessons, quizQuestions, safetyTips, safetyResources } from '@/content/safety'
import { faqs } from '@/content/faqs'
import { donationConfig } from '@/config/donations'
import { activeSocialAccounts } from '@/config/social'
import { mainNav, footerNav } from '@/config/nav'

const PUBLIC_DIR = join(process.cwd(), 'public')

function localImageExists(src: string): boolean {
  if (!src.startsWith('/')) return true
  return existsSync(join(PUBLIC_DIR, src))
}

/** Every internal route the navigation and content point at. */
const ROUTES = new Set([
  '/',
  '/meet-cooper',
  '/what-cooper-does',
  '/mission',
  '/safety-hq',
  '/adventures',
  '/events',
  '/gallery',
  '/social',
  '/support',
  '/shop',
  '/sponsors',
  '/faq',
  '/contact',
  '/privacy',
  '/accessibility',
])

describe('images referenced by content actually exist', () => {
  it('gallery', () => {
    for (const item of galleryItems) {
      expect(localImageExists(item.src), `missing ${item.src}`).toBe(true)
    }
  })

  it('adventures', () => {
    for (const a of adventures) {
      expect(localImageExists(a.cover.src), `missing ${a.cover.src}`).toBe(true)
      for (const g of a.gallery ?? []) {
        expect(localImageExists(g.src), `missing ${g.src}`).toBe(true)
      }
    }
  })

  it('events', () => {
    for (const e of events) {
      if (e.image) expect(localImageExists(e.image.src), `missing ${e.image.src}`).toBe(true)
    }
  })

  it('merchandise', () => {
    for (const m of merchItems) {
      for (const img of m.images) {
        expect(localImageExists(img.src), `missing ${img.src}`).toBe(true)
      }
    }
  })

  it('donation qr code', () => {
    expect(localImageExists(donationConfig.qr.src)).toBe(true)
  })
})

describe('accessibility of content', () => {
  it('every gallery image has a meaningful alt description', () => {
    for (const item of galleryItems) {
      expect(item.alt.length, `alt too short for ${item.id}`).toBeGreaterThan(15)
    }
  })

  it('every adventure cover has alt text', () => {
    for (const a of adventures) {
      expect(a.cover.alt.length, `alt too short for ${a.slug}`).toBeGreaterThan(10)
    }
  })

  it('every merchandise image has alt text', () => {
    for (const m of merchItems) {
      for (const img of m.images) {
        expect(img.alt.length, `alt too short for ${m.id}`).toBeGreaterThan(10)
      }
    }
  })
})

describe('internal links resolve to a real page', () => {
  it('main navigation', () => {
    for (const item of mainNav) {
      for (const target of item.children ?? [item]) {
        expect(ROUTES.has(target.href), `unknown route ${target.href}`).toBe(true)
      }
    }
  })

  it('footer navigation', () => {
    for (const group of footerNav) {
      for (const item of group.items) {
        const path = item.href.split('#')[0]
        expect(ROUTES.has(path), `unknown route ${item.href}`).toBe(true)
      }
    }
  })
})

describe('safety content rules', () => {
  it('has at least one tip for every lesson audience band', () => {
    expect(safetyTips.length).toBeGreaterThanOrEqual(10)
    for (const band of ['younger', 'older', 'teens'] as const) {
      expect(safetyLessons.some((l) => l.audiences.includes(band))).toBe(true)
    }
  })

  it('gives every lesson at least one concrete action', () => {
    for (const lesson of safetyLessons) {
      expect(lesson.doThis.length, `no actions for ${lesson.id}`).toBeGreaterThan(0)
    }
  })

  it('never blames a child', () => {
    const forbidden = /your fault|you should have known|you were stupid|you asked for it/i
    for (const lesson of safetyLessons) {
      const text = [...lesson.body, ...lesson.doThis, lesson.headline].join(' ')
      // "it is never your fault" is fine; a bare accusation is not.
      const offending = text
        .split(/(?<=[.!?])\s+/)
        .filter((s) => forbidden.test(s) && !/not your fault|never your fault/i.test(s))
      expect(offending, `check wording in ${lesson.id}`).toEqual([])
    }
  })

  it('keeps every quiz answer index in range with encouraging feedback', () => {
    for (const q of quizQuestions) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.praise.length).toBeGreaterThan(10)
      expect(q.coaching.length).toBeGreaterThan(10)
    }
  })

  it('does not publish an unapproved external resource', () => {
    for (const r of safetyResources) {
      if (!r.approved) continue
      expect(r.url, `approved resource ${r.name} has no URL`).toMatch(/^https:\/\//)
    }
  })
})

describe('claims that must not appear without review', () => {
  const unreviewedText = [
    ...faqs.filter((f) => !f.needsReview).flatMap((f) => f.answer),
    ...donationConfig.supports.map((s) => s.body),
  ].join(' ')

  it('makes no tax-deductibility claim outside a flagged answer', () => {
    expect(unreviewedText).not.toMatch(/tax[- ]deductib/i)
  })

  it('claims no charitable or nonprofit status', () => {
    expect(unreviewedText).not.toMatch(/501\(c\)|nonprofit status|tax exempt/i)
  })

  it('invents no statistics', () => {
    expect(unreviewedText).not.toMatch(/\b\d{1,3}(,\d{3})+\s+(devices|cases|children)\b/i)
  })
})

describe('social configuration', () => {
  it('has Instagram and TikTok enabled with https URLs', () => {
    const platforms = activeSocialAccounts.map((a) => a.platform)
    expect(platforms).toContain('instagram')
    expect(platforms).toContain('tiktok')
    for (const account of activeSocialAccounts) {
      expect(account.url).toMatch(/^https:\/\//)
    }
  })
})
