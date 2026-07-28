/**
 * Post-build meta-prerender.
 *
 * Runs after `vite build`. Vite emits a single dist/index.html whose <head>
 * carries only the homepage's title/description/canonical/OG. This script
 * writes a static dist/<route>/index.html for every other route with that
 * route's own metadata baked in, so non-JS crawlers and social scrapers
 * (WhatsApp, Facebook, LinkedIn) get correct, per-URL tags. It also injects
 * FAQPage JSON-LD on /faq, Service/Offer JSON-LD on /pricing, and writes
 * dist/sitemap.xml.
 *
 * JSON-LD is emitted here rather than from a React component on purpose: the
 * consumers are crawlers reading the served HTML, and a <script> React inserts
 * after hydration is invisible to the ones that matter.
 *
 * It intentionally does NOT prerender page bodies — the #root stays empty and
 * React hydrates it. The goal here is correct head metadata, which is what the
 * SEO audit flagged as missing. Nginx's `try_files $uri $uri/ /index.html`
 * serves dist/services/index.html for /services automatically.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SITE, ROUTE_META, indexableRoutes } from '../src/lib/seo.js'
import { FAQS } from '../src/lib/faqs.js'
import { TIERS } from '../src/lib/tiers.js'
import { SERVICES } from '../src/lib/services.js'
import { WHATSAPP_NUMBER } from '../src/lib/whatsapp.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '../dist')

/** Escape a string for safe use inside an HTML double-quoted attribute or text node. */
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Replace the first tag matching `pattern` with `replacement`. Throws if the
 * tag isn't found, so a template change can never silently produce pages with
 * stale homepage metadata.
 */
function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`prerender: expected to find ${label} in dist/index.html`)
  }
  return html.replace(pattern, replacement)
}

/** Inverse of esc, for reading a value back out of the built template. */
function unesc(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

/**
 * Assert the homepage's baked metadata still matches SITE.
 *
 * This loop skips '/', because dist/index.html already carries the homepage's
 * head. The consequence is that the homepage's title and description live in
 * index.html while useSeo serves ROUTE_META's copies to the browser — the same
 * two strings in two files, six tags in total once og: and twitter: are counted.
 *
 * That duplication has already broken once. seo.js was rewritten without
 * index.html, and the result was a homepage that told a crawler one title and a
 * visitor another, which is invisible in every place you would think to look:
 * the page renders fine, the build passes, and the served HTML is correct in
 * isolation. Only comparing the two catches it.
 *
 * So the comparison happens here, every build. Throwing matches replaceTag and
 * assertLastmod: the failure mode this prevents is silent by nature, so the
 * check has to be the loud kind.
 */
function assertHomepageMirror(template) {
  const tags = [
    ['<title>', /<title>([\s\S]*?)<\/title>/, SITE.defaultTitle],
    ['description', /<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/>/, SITE.defaultDescription],
    ['og:title', /<meta property="og:title" content="([\s\S]*?)"\s*\/>/, SITE.defaultTitle],
    ['og:description', /<meta\s+property="og:description"\s+content="([\s\S]*?)"\s*\/>/, SITE.defaultDescription],
    ['twitter:title', /<meta name="twitter:title" content="([\s\S]*?)"\s*\/>/, SITE.defaultTitle],
    ['twitter:description', /<meta\s+name="twitter:description"\s+content="([\s\S]*?)"\s*\/>/, SITE.defaultDescription],
  ]

  const drift = []
  for (const [label, pattern, expected] of tags) {
    const match = template.match(pattern)
    if (!match) {
      throw new Error(`prerender: expected to find ${label} in dist/index.html`)
    }
    const actual = unesc(match[1]).trim()
    if (actual !== expected) {
      drift.push(`  ${label}\n    index.html: ${actual}\n    seo.js:     ${expected}`)
    }
  }

  if (drift.length > 0) {
    throw new Error(
      `prerender: index.html homepage metadata has drifted from SITE in src/lib/seo.js.\n` +
        `Both must carry the same strings — index.html is what a crawler reads for '/',\n` +
        `seo.js is what useSeo sets in the browser. Update whichever is stale.\n\n` +
        drift.join('\n\n'),
    )
  }
}

/**
 * Assert the ProfessionalService JSON-LD still agrees with the modules that
 * own its values.
 *
 * Same failure mode as assertHomepageMirror, one level deeper. That block is
 * hand-written in index.html, but four of its fields are copies: `telephone`
 * is WHATSAPP_NUMBER from whatsapp.js wearing a '+', and name/url/email are
 * SITE's. Nothing connected them, so the number a crawler reads and the number
 * the WhatsApp button dials could drift apart — and this is the site where
 * that matters most, because a WhatsApp click IS the conversion. A wrong
 * number in the markup does not break a build, fail a lint, or look wrong on
 * the page. It just sends enquiries somewhere nobody is listening.
 *
 * telephone is compared in E.164 ('+' prefixed) because that is what schema.org
 * consumers expect, while wa.me takes bare digits — so the two are stored in
 * different shapes on purpose and normalised here rather than being forced
 * into one shape that would be wrong for one of the two consumers.
 *
 * Throwing matches replaceTag, assertHomepageMirror and assertLastmod: the
 * failure this catches is silent by nature, so the check has to be loud.
 */
function assertBusinessEntity(template) {
  const blocks = template.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? []

  let entity = null
  for (const block of blocks) {
    const json = block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '')
    let parsed
    try {
      parsed = JSON.parse(json)
    } catch (error) {
      throw new Error(
        `prerender: a JSON-LD block in dist/index.html is not valid JSON — ${error.message}`,
      )
    }
    if (parsed['@type'] === 'ProfessionalService') {
      entity = parsed
    }
  }

  if (!entity) {
    throw new Error(
      'prerender: expected a ProfessionalService JSON-LD block in dist/index.html.\n' +
        'It identifies the business on every prerendered route, because this <head> is\n' +
        'copied to all of them. If it was removed on purpose, remove this check too.',
    )
  }

  const fields = [
    ['telephone', entity.telephone, `+${WHATSAPP_NUMBER}`, 'WHATSAPP_NUMBER in src/lib/whatsapp.js'],
    ['name', entity.name, SITE.name, 'SITE.name in src/lib/seo.js'],
    ['url', entity.url, `${SITE.url}/`, 'SITE.url in src/lib/seo.js'],
    ['email', entity.email, SITE.email, 'SITE.email in src/lib/seo.js'],
  ]

  const drift = fields
    .filter(([, actual, expected]) => actual !== expected)
    .map(
      ([label, actual, expected, source]) =>
        `  ${label}\n    index.html: ${JSON.stringify(actual)}\n    ${source}: ${JSON.stringify(expected)}`,
    )

  if (drift.length > 0) {
    throw new Error(
      `prerender: the ProfessionalService JSON-LD in index.html has drifted from the\n` +
        `modules that own its values. Update whichever is stale.\n\n` +
        drift.join('\n\n'),
    )
  }
}

function faqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`
}

/**
 * Parse a display price string from tiers.js / services.js into structured
 * numbers, or null when it genuinely has no number in it.
 *
 * The prices in those modules are *copy* — 'R1,200 once-off', 'R1,500 – R2,000/mo',
 * 'Quoted per job'. They are written to be read by a customer, and they are the
 * single source of truth the pricing page renders. Parsing them here rather
 * than adding a parallel set of numeric fields is deliberate: two fields for
 * one price is two things to keep in step, and the one that is never rendered
 * is the one that silently goes stale. A regex that breaks loudly when the copy
 * changes shape is the cheaper failure.
 *
 * Throws on anything without a parseable amount. Only prices already known to
 * carry a number are passed in — the build fee, the rescue range, the three
 * retainers — so a failure here means the copy changed shape, and stopping is
 * better than quietly dropping a plan out of the markup. The genuinely
 * price-less entries ('Quoted per job', Grove's 'Custom quote') are never
 * passed in at all, because there is no honest Offer price to give them.
 *
 * @param {string} price
 * @returns {{ min: number, max: number, monthly: boolean }}
 */
function parseZar(price) {
  const match = String(price)
    .trim()
    .match(/^(?:From\s+)?R([\d,]+)(?:\s*[–-]\s*R([\d,]+))?(\/mo)?/)
  if (!match) {
    throw new Error(
      `prerender: no amount found in price ${JSON.stringify(price)} — pricing copy changed shape, or a price-less entry reached the Offer builder`,
    )
  }
  const toNumber = (value) => Number(value.replace(/,/g, ''))
  const min = toNumber(match[1])
  const max = match[2] ? toNumber(match[2]) : min
  return { min, max, monthly: Boolean(match[3]) }
}

/**
 * A schema.org Offer for one priced thing.
 *
 * Ranges use a PriceSpecification with min/maxPrice; a single figure uses the
 * flat `price` field, which is what consumers handle best. Monthly amounts are
 * a UnitPriceSpecification with unitCode MON (UN/CEFACT for month) so a crawler
 * can tell R349/mo from R349 once-off — without it the recurring plans and the
 * once-off build fee are indistinguishable, and the cheapest number on the page
 * is the one that ends up quoted back at the business.
 */
function offerFor(name, description, price) {
  const { min, max, monthly } = parseZar(price)
  const offer = { '@type': 'Offer', name, description, priceCurrency: 'ZAR' }

  if (!monthly && min === max) {
    offer.price = String(min)
    return offer
  }

  offer.priceSpecification = {
    '@type': monthly ? 'UnitPriceSpecification' : 'PriceSpecification',
    priceCurrency: 'ZAR',
    ...(min === max ? { price: String(min) } : { minPrice: String(min), maxPrice: String(max) }),
    ...(monthly ? { unitCode: 'MON', unitText: 'month' } : {}),
  }
  return offer
}

/**
 * Service + Offer JSON-LD for /pricing.
 *
 * Every figure is read from tiers.js and services.js — the same exports the
 * page body renders — so the markup cannot claim a price the page does not
 * show. Grove's setup ("Custom quote") and the shop/booking service ("Quoted
 * per job") carry no price here, because they carry none there.
 *
 * Deliberately absent: aggregateRating, review, priceValidUntil. There are no
 * ratings or reviews to report, and an invented validity date is a claim about
 * the business nobody has made. Structured data that outruns the page is the
 * kind that earns a manual action.
 */
function pricingJsonLd() {
  const provider = {
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: `${SITE.url}/`,
    email: SITE.email,
    areaServed: { '@type': 'Country', name: 'South Africa' },
  }

  const byId = Object.fromEntries(SERVICES.map((service) => [service.id, service]))
  const build = byId.website
  const rescue = byId.rescue

  const offers = [
    offerFor(build.name, build.body, build.price),
    offerFor(rescue.name, rescue.body, rescue.price),
    ...TIERS.map((tier) =>
      offerFor(`${tier.name} plan`, `${tier.whoFor}. ${tier.summary}.`, tier.retainer),
    ),
  ]

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website design, hosting and care for small South African businesses',
    serviceType: 'Web design',
    url: `${SITE.url}/pricing`,
    provider,
    areaServed: { '@type': 'Country', name: 'South Africa' },
    offers,
  }
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`
}

/** Build a route's HTML from the homepage template. */
function renderRoute(template, path, meta) {
  const url = `${SITE.url}${path}`
  let html = template

  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`, '<title>')
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${esc(meta.description)}" />`,
    'description meta',
  )
  html = replaceTag(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`,
    'canonical link',
  )
  html = replaceTag(
    html,
    /<meta property="og:title" content="[\s\S]*?"\s*\/>/,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    'og:title',
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    'og:description',
  )
  html = replaceTag(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`,
    'og:url',
  )
  html = replaceTag(
    html,
    /<meta name="twitter:title" content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    'twitter:title',
  )
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    'twitter:description',
  )

  const injected = []
  if (meta.noindex) {
    injected.push('<meta name="robots" content="noindex, follow" />')
  }
  if (path === '/faq') {
    injected.push(faqJsonLd())
  }
  if (path === '/pricing') {
    injected.push(pricingJsonLd())
  }
  if (injected.length > 0) {
    html = html.replace('</head>', `${injected.join('\n    ')}\n  </head>`)
  }

  return html
}

/**
 * Validate a ROUTE_META lastmod, naming the offending route.
 *
 * The regex alone is not enough — it happily accepts 2026-02-31 — so the value
 * is round-tripped through Date and compared back, which catches impossible
 * days instead of letting Date silently roll them over into the next month.
 * Throwing matches replaceTag's posture: a build that stops is better than a
 * sitemap that ships a bad date, because a crawler's response to an invalid
 * <lastmod> is to discount every date in the file, not just the broken one.
 */
function assertLastmod(path, lastmod) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(lastmod ?? ''))) {
    throw new Error(
      `prerender: ROUTE_META['${path}'] needs a lastmod of the form YYYY-MM-DD (got ${JSON.stringify(lastmod)})`,
    )
  }
  if (new Date(`${lastmod}T00:00:00Z`).toISOString().slice(0, 10) !== lastmod) {
    throw new Error(
      `prerender: ROUTE_META['${path}'] lastmod '${lastmod}' is not a real date`,
    )
  }
}

/**
 * Emit dist/sitemap.xml.
 *
 * <loc> and <lastmod> only. <changefreq> and <priority> are deliberately
 * omitted: Google ignores both, and priority is relative *within* one sitemap,
 * so across six URLs it says nothing a crawler could act on. Two fields that
 * are true beat four where half are decoration.
 */
function writeSitemap() {
  const urls = indexableRoutes()
    .map(({ path, lastmod }) => {
      assertLastmod(path, lastmod)
      const loc = path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  writeFileSync(resolve(DIST, 'sitemap.xml'), xml, 'utf8')
}

function main() {
  const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')
  assertHomepageMirror(template)
  assertBusinessEntity(template)

  let count = 0
  for (const [path, meta] of Object.entries(ROUTE_META)) {
    if (path === '/') continue // dist/index.html already carries homepage meta
    const html = renderRoute(template, path, meta)
    const outDir = resolve(DIST, `.${path}`)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(resolve(outDir, 'index.html'), html, 'utf8')
    count += 1
  }

  writeSitemap()
  // eslint-disable-next-line no-console
  console.log(`prerender: wrote ${count} route pages + sitemap.xml`)
}

main()
