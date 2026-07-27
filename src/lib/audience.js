/**
 * Who the site is for, in the visitor's own words.
 *
 * Every string here is lifted from the Customer Segments block of
 * Fynbos-Creative-Business-Plan.pdf (§4, Business Model Canvas) — the approved
 * source for this section. Nothing is invented and nothing is extrapolated:
 * the five categories and the "no site, a stale one, or a DIY one they don't
 * trust" persona are the plan's, not a copywriter's guess at them.
 *
 * If a category is ever added here it must come from that document or a later
 * client confirmation. Brief §H forbids widening the claimed audience on
 * instinct — naming an industry the venture has never served reads as a client
 * list to a visitor scanning for someone like themselves.
 */
export const AUDIENCE_LEDE =
  'Built for sole proprietors and teams of one to five — the owner-operator with no in-house digital skill, and either no website, a stale one, or a DIY one they never quite trusted.'

export const AUDIENCE_SEGMENTS = [
  { id: 'trades', label: 'Trades & artisans' },
  { id: 'retail', label: 'Retail & social-commerce sellers' },
  { id: 'personal-care', label: 'Personal care & services' },
  { id: 'hospitality', label: 'Guesthouses & cafés' },
  { id: 'professional', label: 'Professional services' },
]
