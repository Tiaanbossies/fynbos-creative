/**
 * Single source of truth for every page's SEO metadata.
 *
 * Both sides of the site read this one file so they can never drift:
 *   - the client (useSeo.js) sets document title/description/canonical/robots
 *     on navigation;
 *   - the build-time prerender script (scripts/prerender.mjs) bakes the same
 *     values — plus Open Graph/Twitter tags and JSON-LD — into a static
 *     per-route index.html, so non-JS crawlers and social scrapers (WhatsApp,
 *     Facebook, LinkedIn) see correct, per-URL metadata.
 *
 * Keep this file free of React/browser imports: the Node prerender script
 * imports it directly.
 */

export const SITE = {
  url: 'https://fynboscreative.co.za',
  name: 'Fynbos Creative',
  defaultTitle: 'Fynbos Creative — Web Services & Media for SA SMEs',
  defaultDescription:
    'Fynbos Creative — done-for-you web services and media for South African SMEs. Low setup cost, monthly retainer, a partner network that helps you grow.',
  /**
   * Social share image. Reuses the real hero poster rather than a placeholder;
   * swap for a dedicated 1200×630 asset when one exists.
   */
  ogImage: 'https://fynboscreative.co.za/video/preview-frame.jpg',
  email: 'tiaan@fynboscreative.co.za',
  founder: 'Tiaan',
}

/**
 * path → metadata. Every built, navigable route has an entry.
 *
 * Work, Industries and Partners are intentionally absent: they aren't built or
 * linked yet (see nav.js), so they fall to the noindex "Page not found"
 * fallback in metaForPath rather than being prerendered as empty shells. Add an
 * entry here when each page ships.
 *
 * Unknown paths (the wildcard 404) are handled by metaForPath, not here.
 */
export const ROUTE_META = {
  '/': {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  '/services': {
    title: 'Services — Fynbos Creative',
    description:
      'Websites built for you from R1,200, website rescue and rebuild, hosting and maintenance from R349/mo, content, photography, and online shops — for small South African businesses.',
  },
  '/pricing': {
    title: 'Pricing — Fynbos Creative',
    description:
      'Straightforward pricing: R1,200 once-off to build your website, then a monthly plan from R349/mo that keeps it hosted, updated and growing. Cancel whenever you like.',
  },
  '/about': {
    title: 'About — Fynbos Creative',
    description:
      'Fynbos Creative is founder-led. You deal with Tiaan directly — not a call centre — for honest, done-for-you web services built for small South African businesses.',
  },
  '/faq': {
    title: 'FAQ — Fynbos Creative',
    description:
      'Straight answers on cost, monthly plans, contracts, and getting started with Fynbos Creative — honest web services for small South African businesses.',
  },
  '/privacy': {
    title: 'Privacy Policy — Fynbos Creative',
    description:
      'How Fynbos Creative collects, uses and protects your personal information, in line with South Africa’s POPIA.',
  },
}

/**
 * Metadata for a path, with a safe fallback for anything unmapped (the 404).
 * Unmapped routes are set noindex so stray URLs can't be indexed.
 *
 * @param {string} pathname
 * @returns {{ title: string, description: string, noindex?: boolean }}
 */
export function metaForPath(pathname) {
  return (
    ROUTE_META[pathname] ?? {
      title: `Page not found — ${SITE.name}`,
      description: SITE.defaultDescription,
      noindex: true,
    }
  )
}

/** Routes that belong in the sitemap: every mapped route that is indexable. */
export function indexableRoutes() {
  return Object.entries(ROUTE_META)
    .filter(([, meta]) => !meta.noindex)
    .map(([path]) => path)
}
