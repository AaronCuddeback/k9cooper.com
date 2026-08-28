/**
 * Cooper's social accounts.
 *
 * `handle` is displayed, `url` is where the button goes. Set `enabled: false`
 * to hide a platform everywhere without deleting the entry.
 */

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook'

export interface SocialAccount {
  platform: SocialPlatform
  label: string
  handle: string
  url: string
  enabled: boolean
  /** Short call to action used on buttons and cards. */
  cta: string
}

export const socialAccounts: SocialAccount[] = [
  {
    platform: 'instagram',
    label: 'Instagram',
    handle: '@esdk9_cooper',
    url: 'https://www.instagram.com/esdk9_cooper/',
    enabled: true,
    cta: 'Follow on Instagram',
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    handle: '@esdk9_cooper',
    url: 'https://www.tiktok.com/@esdk9_cooper',
    enabled: true,
    cta: 'Watch on TikTok',
  },
  // Add YouTube / Facebook here later: copy an entry above and set the
  // handle, url and `enabled: true`.
]

export const activeSocialAccounts = socialAccounts.filter(
  (a) => a.enabled && a.url,
)

export function getSocial(platform: SocialPlatform): SocialAccount | undefined {
  return activeSocialAccounts.find((a) => a.platform === platform)
}
