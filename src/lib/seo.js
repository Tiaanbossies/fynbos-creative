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

/*
 * Titles lead with what a stranger would type, not with the brand. "Fynbos
 * Creative" means nothing to someone searching for a website, so spending the
 * first 15 characters on it buries the match — but the brand still closes
 * every title, where it does its real job of making the result look like a
 * business rather than a directory scrape.
 *
 * Descriptions stay under ~160 characters, where Google truncates. Three of
 * these previously ran to 162-178 and lost their closing sentence, which in
 * each case was the one naming the price — for this audience the whole reason
 * to click.
 *
 * Any change to the '/' values must be mirrored into index.html by hand:
 * prerender.mjs skips '/' because dist/index.html already carries homepage
 * meta, so the static homepage head comes from that template while only the
 * client-side useSeo hook reads these. Same two strings, two places — six tags
 * once og: and twitter: are counted.
 *
 * Forgetting one half is not a silent failure any more: prerender.mjs runs
 * assertHomepageMirror on every build and fails it, naming each tag that has
 * drifted and both values. That check exists because this exact duplication
 * did break once, in the way that is invisible from either side alone.
 */
export const SITE = {
  url: 'https://fynboscreative.co.za',
  name: 'Fynbos Creative',
  defaultTitle: 'Small Business Web Design South Africa — Fynbos Creative',
  defaultDescription:
    'Websites built for small South African businesses from R1,200 once-off, then R349/mo to keep it hosted, updated and found on Google. Founder-led, no jargon.',
  /**
   * Social share image: a dedicated 1200×630 card, the size WhatsApp, Facebook
   * and LinkedIn all crop to. It replaced the 1280x720 hero poster, which was
   * the wrong aspect and lost its edges in every preview.
   *
   * Built from the lockup, the headline and the two prices — deliberately the
   * same numbers as defaultDescription, because a share card quoting a price
   * the site does not is the kind of drift nobody notices until a customer
   * does. Regenerate it rather than editing the PNG.
   *
   * Not the same asset as `logo` or `image` in the JSON-LD: `logo` is the bare
   * mark for a knowledge panel, `image` is the hero photograph, and this is a
   * composed card that would be wrong in either role.
   */
  ogImage: 'https://fynboscreative.co.za/og-card.png',
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
 *
 * `lastmod` is the date that route's *content* last meaningfully changed, and
 * it is maintained by hand on purpose. Both obvious alternatives are worse:
 *
 *   - Reading git history would work locally and be absent in production —
 *     .dockerignore excludes .git, so the released build is the one place the
 *     date could never be derived.
 *   - Source-file mtime is a lie on any CI: a fresh clone stamps every file
 *     with the checkout time, so every page would claim to have changed on
 *     every deploy.
 *
 * A lastmod that moves when nothing changed is worse than no lastmod at all —
 * it is the signal a crawler learns to ignore first. So it lives here, beside
 * the copy it describes, and is bumped when that copy is edited. The seeds
 * below are each route's real last content commit as of 2026-07-27.
 * scripts/prerender.mjs throws on a missing or malformed date.
 */
export const ROUTE_META = {
  '/': {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    lastmod: '2026-07-27',
  },
  '/services': {
    title: 'Web Design, Hosting & Content — Fynbos Creative',
    description:
      'Websites from R1,200, rescue and rebuild from R2,500, hosting and care from R349/mo, plus content, photography and online shops for small SA businesses.',
    lastmod: '2026-07-25',
  },
  '/pricing': {
    title: 'Website Pricing from R1,200 — Fynbos Creative',
    description:
      'R1,200 once-off to build your website, then a monthly plan from R349/mo that keeps it hosted, updated and growing. Cancel whenever you like.',
    lastmod: '2026-07-25',
  },
  '/about': {
    title: 'Founder-Led Web Design in South Africa — Fynbos Creative',
    description:
      'Founder-led web services for small South African businesses. You deal with Tiaan directly — not a call centre — for honest, done-for-you websites.',
    lastmod: '2026-07-25',
  },
  '/faq': {
    title: 'Web Design FAQs: Cost, Plans, Contracts — Fynbos Creative',
    description:
      'Straight answers on cost, monthly plans, contracts, and getting started with Fynbos Creative — honest web services for small South African businesses.',
    lastmod: '2026-07-25',
  },
  '/privacy': {
    title: 'Privacy Policy — Fynbos Creative',
    description:
      'How Fynbos Creative collects, uses and protects your personal information, in line with South Africa’s POPIA.',
    /* Bumped: the analytics section was rewritten from "we run no analytics" to
       a description of what first-party analytics now collects. That is a real
       content change, which is exactly what this date is for. */
    lastmod: '2026-07-29',
  },
  /**
   * The owner's analytics dashboard. noindex, so indexableRoutes() drops it
   * from the sitemap and prerender.mjs stamps a robots tag on it.
   *
   * It is listed here rather than left to metaForPath's fallback so it gets its
   * own title instead of "Page not found" — but note that being unlisted is not
   * what protects it. The real control is in Postgres: no SELECT policy on the
   * events table, and a passphrase checked by a SECURITY DEFINER function.
   */
  '/analytics': {
    title: 'Analytics — Fynbos Creative',
    description: 'Private dashboard.',
    noindex: true,
    lastmod: '2026-07-29',
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

/**
 * Routes that belong in the sitemap: every mapped route that is indexable.
 *
 * Returns `{ path, lastmod }` rather than bare paths because a sitemap entry is
 * the pair, and splitting them would mean the caller re-reading ROUTE_META to
 * get the half this function dropped.
 *
 * @returns {{ path: string, lastmod: string }[]}
 */
export function indexableRoutes() {
  return Object.entries(ROUTE_META)
    .filter(([, meta]) => !meta.noindex)
    .map(([path, meta]) => ({ path, lastmod: meta.lastmod }))
}
