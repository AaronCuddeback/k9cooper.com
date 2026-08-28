/*
  Required by `output: 'export'`. Without it the static export build fails on
  this route. See docs/DEPLOYMENT.md.
*/
export const dynamic = 'force-static'

import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'

export const alt = `${siteConfig.name} - ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Default social share card. Generated at build time so no design tool round
 * trip is needed when the tagline changes.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0c2549',
          padding: '72px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.14) 2px, transparent 2px)',
            backgroundSize: '18px 18px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '18px',
            background: '#bf2026',
            display: 'flex',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            letterSpacing: 6,
            color: '#f8ca3e',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Electronics Storage Device K9
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 132,
            lineHeight: 1,
            color: '#ffffff',
            fontWeight: 900,
            marginTop: 18,
            letterSpacing: -2,
          }}
        >
          ESD K9 COOPER
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            background: '#bf2026',
            color: '#ffffff',
            fontSize: 44,
            fontWeight: 800,
            padding: '14px 26px',
            alignSelf: 'flex-start',
          }}
        >
          One Nose. One Mission. Protect Children.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 34,
            fontSize: 28,
            color: '#cfe0f6',
          }}
        >
          {siteConfig.agency.unit} &nbsp;&middot;&nbsp; {siteConfig.agency.office}
        </div>
      </div>
    ),
    size,
  )
}
