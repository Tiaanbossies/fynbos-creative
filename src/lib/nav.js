/**
 * Single source of truth for site navigation — Header and Footer both read
 * this so the two can never drift apart.
 *
 * Page set is fixed by the build brief (§E) and the existing 8 pages whose SEO
 * metadata is carried forward.
 */
export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/industries', label: 'Industries' },
  { to: '/partners', label: 'Partners' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: 'About' },
]

/**
 * The single address shown anywhere on the site. hello@ exists as a forwarding
 * alias only — it is never displayed, so there is one address for a visitor to
 * remember and one inbox to answer from.
 */
export const CONTACT_EMAIL = 'tiaan@fynboscreative.co.za'
