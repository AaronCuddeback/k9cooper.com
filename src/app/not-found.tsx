import Link from 'next/link'
import { CooperGuide } from '@/components/CooperGuide'
import { CooperArt } from '@/components/CooperArt'
import { ActionBurst } from '@/components/comic/ActionBurst'

export default function NotFound() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-blue-800 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="speed-lines pointer-events-none absolute inset-0"
        style={{
          ['--speed-x' as string]: '50%',
          ['--speed-y' as string]: '40%',
          ['--speed-color' as string]: 'rgb(255 255 255 / 0.10)',
        }}
      />

      <div className="shell relative text-center">
        <ActionBurst tone="gold" rotate={-6} className="mx-auto w-40 sm:w-52">
          <span className="font-comic text-3xl sm:text-5xl">404</span>
        </ActionBurst>

        <h1 className="mt-8 text-display text-paper uppercase">
          Cooper searched everywhere
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-50">
          Indoors, outdoors, in the vehicle, underwater and underground. This page
          is not here. That happens sometimes - even with a nose like his.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-lg btn-gold">
            Back to the start
          </Link>
          <Link href="/safety-hq" className="btn btn-lg bg-white">
            Visit Safety HQ
          </Link>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 text-left sm:grid-cols-[auto_1fr] sm:items-center">
          <CooperArt pose="peek" sizes="170px" className="mx-auto max-w-[150px]" />
          <CooperGuide pose="curious" label="Cooper says" tone="white">
            <p>
              If you got here from a link on this site, that is our fault, not
              yours. Let us know and we will fix it.
            </p>
          </CooperGuide>
        </div>
      </div>
    </section>
  )
}
