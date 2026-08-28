import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { StructuredData } from '@/components/StructuredData'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({
  crumbs,
  tone = 'ink',
  className,
}: {
  crumbs: Crumb[]
  tone?: 'ink' | 'paper'
  className?: string
}) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...crumbs]

  return (
    <>
      <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {all.map((crumb, i) => {
            const last = i === all.length - 1
            return (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 ? (
                  <ChevronRight
                    aria-hidden="true"
                    className={cn(
                      'h-3.5 w-3.5 shrink-0',
                      tone === 'paper' ? 'text-blue-200' : 'text-ink-3',
                    )}
                  />
                ) : null}
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      'inline-block py-1 font-semibold underline decoration-2 underline-offset-4',
                      tone === 'paper'
                        ? 'text-blue-100 hover:text-gold-200'
                        : 'text-ink-2 hover:text-red-600',
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? 'page' : undefined}
                    className={cn(
                      'font-bold',
                      tone === 'paper' ? 'text-gold-200' : 'text-ink',
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: crumb.label,
            ...(crumb.href ? { item: `${siteConfig.url}${crumb.href}` } : {}),
          })),
        }}
      />
    </>
  )
}
