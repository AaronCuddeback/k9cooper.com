'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { mainNav, type NavItem } from '@/config/nav'
import { DonateButton } from '@/components/donate/DonateButton'
import { SocialIconRow } from '@/components/social/SocialIcons'
import { CooperBadge } from './CooperBadge'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  /** Portals need a DOM target, which only exists after the first client render. */
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  // Close everything on navigation.
  useEffect(() => {
    setDrawerOpen(false)
    setOpenMenu(null)
  }, [pathname])

  // Escape closes whichever layer is open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (drawerOpen) {
        setDrawerOpen(false)
        toggleRef.current?.focus()
      } else if (openMenu) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen, openMenu])

  // Click outside closes the desktop dropdown.
  useEffect(() => {
    if (!openMenu) return
    function onPointer(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [openMenu])

  // Lock body scroll and trap focus while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = drawerRef.current
    panel?.querySelector<HTMLElement>('a, button')?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [drawerOpen])

  const isActive = useCallback(
    (item: NavItem) => {
      if (item.href === '/') return pathname === '/'
      const hrefs = [item.href, ...(item.children?.map((c) => c.href) ?? [])]
      return hrefs.some((h) => pathname === h || pathname.startsWith(`${h}/`))
    },
    [pathname],
  )

  return (
    <header
      data-site-header
      className="no-print sticky top-0 z-50 border-b-[3px] border-ink bg-paper/95 backdrop-blur-sm supports-[backdrop-filter]:bg-paper/85"
    >
      <div className="shell flex h-16 items-center justify-between gap-3 md:h-20">
        <Wordmark />

        <nav
          ref={navRef}
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex"
        >
          {mainNav.map((item) =>
            item.children ? (
              <DropdownItem
                key={item.label}
                item={item}
                active={isActive(item)}
                open={openMenu === item.label}
                onToggle={() =>
                  setOpenMenu((current) => (current === item.label ? null : item.label))
                }
                onClose={() => setOpenMenu(null)}
              />
            ) : (
              <TopLink key={item.label} item={item} active={isActive(item)} />
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <SocialIconRow
            placement="header"
            className="hidden xl:flex"
            iconClassName="h-4 w-4"
          />
          <DonateButton
            placement="header"
            size="sm"
            label="Donate"
            className="hidden sm:inline-flex"
          />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            className="grid h-11 w-11 place-items-center border-[3px] border-ink bg-white lg:hidden"
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
            <span className="sr-only">Open the menu</span>
          </button>
        </div>
      </div>

      {/*
        The drawer is PORTALLED to <body> rather than rendered here.

        This header carries `backdrop-blur`, and `backdrop-filter` makes an
        element a containing block for `position: fixed` descendants. Rendered
        inside the header, the drawer's `fixed inset-0` resolved against the
        64px-tall header instead of the viewport, so it collapsed to a sliver
        with its links crushed on top of each other. The portal moves it out of
        that containing block.
      */}
      {drawerOpen && mounted
        ? createPortal(
            <MobileDrawer
              ref={drawerRef}
              onClose={() => {
                setDrawerOpen(false)
                toggleRef.current?.focus()
              }}
              isActive={isActive}
            />,
            document.body,
          )
        : null}
    </header>
  )
}

/* -------------------------------------------------------------------------- */

function Wordmark() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <CooperBadge
        className="h-10 w-10 md:h-12 md:w-12"
        sizes="(min-width: 768px) 48px, 40px"
        priority
      />
      <span className="leading-none">
        <span className="block font-display text-lg leading-none tracking-wide uppercase md:text-2xl">
          ESD K9 <span className="text-red-600">Cooper</span>
        </span>
        <span className="mt-0.5 hidden text-[0.6rem] font-bold tracking-[0.18em] text-ink-3 uppercase sm:block">
          One Nose. One Mission.
        </span>
        <span className="sr-only">home</span>
      </span>
    </Link>
  )
}

function TopLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative px-3 py-2 font-display text-base tracking-wide uppercase transition-colors',
        active ? 'text-red-600' : 'text-ink hover:text-blue-600',
      )}
    >
      {item.label}
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-2 -bottom-0.5 h-[3px] bg-red-500"
        />
      ) : null}
    </Link>
  )
}

function DropdownItem({
  item,
  active,
  open,
  onToggle,
  onClose,
}: {
  item: NavItem
  active: boolean
  open: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const id = useId()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          'relative flex items-center gap-1 px-3 py-2 font-display text-base tracking-wide uppercase transition-colors',
          active ? 'text-red-600' : 'text-ink hover:text-blue-600',
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
        />
        {active ? (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 -bottom-0.5 h-[3px] bg-red-500"
          />
        ) : null}
      </button>

      {open ? (
        <div
          id={id}
          className="absolute top-full left-0 z-50 mt-2 w-72 border-[3px] border-ink bg-white pop"
        >
          <ul>
            {item.children?.map((child) => (
              <li key={child.href} className="border-b-2 border-ink/10 last:border-b-0">
                <Link
                  href={child.href}
                  onClick={onClose}
                  className="block px-4 py-3 transition-colors hover:bg-gold-200"
                >
                  <span className="block font-display text-base tracking-wide uppercase">
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className="mt-0.5 block text-sm leading-snug text-ink-3">
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function MobileDrawer({
  ref,
  onClose,
  isActive,
}: {
  ref: React.RefObject<HTMLDivElement | null>
  onClose: () => void
  isActive: (item: NavItem) => boolean
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-ink/70"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div
        ref={ref}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="absolute inset-y-0 right-0 flex w-[min(22rem,90vw)] flex-col border-l-[4px] border-ink bg-paper"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b-[3px] border-ink px-4">
          <span className="font-display text-lg tracking-wide uppercase">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center border-[3px] border-ink bg-white"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Close the menu</span>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/"
                className="block py-2.5 font-display text-xl tracking-wide uppercase"
              >
                Home
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.label} className="border-t-2 border-ink/10 pt-1">
                {item.children ? (
                  <>
                    <p className="pt-2 pb-1 font-comic text-lg tracking-wide text-red-600">
                      {item.label}
                    </p>
                    <ul className="mb-1 flex flex-col">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={isActive(child) ? 'page' : undefined}
                            className="block py-2.5 pl-3 font-display text-lg tracking-wide uppercase"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(item) ? 'page' : undefined}
                    className="block py-2.5 font-display text-xl tracking-wide uppercase"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t-[3px] border-ink bg-paper-2 p-4">
          <DonateButton placement="mobile-drawer" className="w-full" />
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">
              Follow Cooper
            </p>
            <SocialIconRow placement="mobile-drawer" />
          </div>
        </div>
      </div>
    </div>
  )
}
