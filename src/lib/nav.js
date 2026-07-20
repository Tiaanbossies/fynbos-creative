/**
 * Single source of truth for site navigation — Header and Footer both read
 * this so the two can never drift apart.
 *
 * Only pages that are actually built appear here. Work, Industries and Partners
 * are defined in the brief (§E) but need real client work and partner consent
 * before they can ship (§H) — advertising them in the nav while they're empty
 * placeholders damages the exact trust the rest of the site earns, so they stay
 * out of the nav until their content exists. Add each back (with its route in
 * App.jsx and its ROUTE_META entry) when it lands.
 */
export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
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
