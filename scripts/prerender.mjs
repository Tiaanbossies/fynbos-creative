/**
 * Post-build meta-prerender.
 *
 * Runs after `vite build`. Vite emits a single dist/index.html whose <head>
 * carries only the homepage's title/description/canonical/OG. This script
 * writes a static dist/<route>/index.html for every other route with that
 * route's own metadata baked in, so non-JS crawlers and social scrapers
 * (WhatsApp, Facebook, LinkedIn) get correct, per-URL tags. It also injects
 * FAQPage JSON-LD on /faq and writes dist/sitemap.xml.
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
  if (injected.length > 0) {
    html = html.replace('</head>', `${injected.join('\n    ')}\n  </head>`)
  }

  return html
}

function writeSitemap() {
  const urls = indexableRoutes()
    .map((path) => {
      const loc = path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`
      return `  <url><loc>${loc}</loc></url>`
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
