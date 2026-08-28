import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = pageMetadata({
  title: 'Accessibility',
  description:
    'How the ESD K9 Cooper website is built to be usable by everyone, what standard it targets, and how to report a problem.',
  path: '/accessibility',
})

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        kicker="Accessibility"
        tone="ink"
        title="Built to be usable by everyone"
        intro={
          <>
            A comic-book design should not cost anyone access to the
            information. Here is what has been done, and how to tell us if
            something is still wrong.
          </>
        }
        crumbs={[{ label: 'Accessibility' }]}
      />

      <section className="newsprint py-12 sm:py-16">
        <div className="shell-narrow prose-comic">
          <h2 className="text-title uppercase">The standard we aim at</h2>
          <p>
            This site targets{' '}
            <strong>WCAG 2.2 Level AA</strong>. That is a goal we build and test
            against rather than a certification, and where we fall short we would
            like to know.
          </p>

          <h2 className="mt-8 text-title uppercase">What that means here</h2>
          <ul>
            <li>
              <strong>Keyboard.</strong> Every menu, filter, accordion, lightbox
              and form control works without a mouse. A skip link jumps straight
              to the main content.
            </li>
            <li>
              <strong>Focus.</strong> A thick gold focus ring is visible on every
              interactive element, on both light and dark sections.
            </li>
            <li>
              <strong>Screen readers.</strong> Real headings in order, real lists,
              real buttons and links, and descriptive text for every icon-only
              control. Dialogs trap focus and return it where it came from.
            </li>
            <li>
              <strong>Images.</strong> Every photograph and comic panel has an
              alt description that says what is actually in it. Decorative
              textures are hidden from screen readers.
            </li>
            <li>
              <strong>Motion.</strong> If your device is set to reduce motion, the
              scrolling ticker stops, panels stop animating in, and transitions
              are removed. Nothing important is only communicated by movement.
            </li>
            <li>
              <strong>Colour.</strong> Nothing relies on colour alone. Status is
              always accompanied by a word or an icon, and text contrast is
              checked against AA.
            </li>
            <li>
              <strong>Typography.</strong> The comic display face is used only for
              headings, labels and sound effects. All body text is set in a
              highly legible sans-serif at a comfortable size, and the layout
              still works when text is enlarged.
            </li>
            <li>
              <strong>Touch.</strong> Interactive controls are at least 44 by 44
              pixels, and the layout never scrolls sideways - including on a
              320 pixel screen.
            </li>
          </ul>

          <h2 className="mt-8 text-title uppercase">Known limitations</h2>
          <ul>
            <li>
              Video captions and transcripts depend on the hosting platform.
              Where captions exist they are provided by the platform&rsquo;s own
              player.
            </li>
            <li>
              Linked external sites - the donation platform, social media and any
              store - are outside our control and have their own accessibility
              standards.
            </li>
          </ul>

          <h2 className="mt-8 text-title uppercase">Found a problem?</h2>
          <p>
            Please tell us. Email{' '}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> with the
            page, what you were trying to do, and what got in the way. Any
            assistive technology details you can include help a lot.
          </p>
        </div>
      </section>
    </>
  )
}
