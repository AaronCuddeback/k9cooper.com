import Image from 'next/image'
import type { Block } from '@/content/adventures'
import { CooperGuide } from '@/components/CooperGuide'

/** Renders the structured story blocks used by adventure posts. */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h':
            return (
              <h2 key={i} className="mt-3 text-title uppercase">
                {block.text}
              </h2>
            )

          case 'p':
            return (
              <p key={i} className="text-[1.05rem] leading-relaxed text-ink-2">
                {block.text}
              </p>
            )

          case 'list':
            return (
              <ul key={i} className="prose-comic">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )

          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-[6px] border-red-500 bg-paper-2 py-4 pr-4 pl-5"
              >
                <p className="font-comic text-xl leading-snug tracking-wide">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.attribution ? (
                  <footer className="mt-1.5 text-sm font-bold text-ink-3">
                    &mdash; {block.attribution}
                  </footer>
                ) : null}
              </blockquote>
            )

          case 'callout':
            return (
              <CooperGuide key={i} pose="alert" label={block.label} tone="gold">
                <p>{block.text}</p>
              </CooperGuide>
            )

          case 'image':
            return (
              <figure key={i} className="ink pop overflow-hidden bg-white">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 92vw, 720px"
                  className="h-auto w-full"
                />
                {block.caption ? (
                  <figcaption className="border-t-[3px] border-ink px-4 py-3 text-sm text-ink-2">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
