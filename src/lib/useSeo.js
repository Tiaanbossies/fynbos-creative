import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE, metaForPath } from './seo.js'

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function removeMeta(name) {
  document.querySelector(`meta[name="${name}"]`)?.remove()
}

function setCanonical(href) {
  let tag = document.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Keeps the document head in sync with the current route on client navigation.
 *
 * Values default from the shared ROUTE_META (via metaForPath) so client nav and
 * the static prerender agree; pass overrides only for something ROUTE_META
 * can't know. The static per-route HTML from scripts/prerender.mjs is what
 * crawlers see first — this hook keeps things correct once React takes over.
 *
 * @param {{ title?: string, description?: string, noindex?: boolean }} [overrides]
 */
export function useSeo(overrides = {}) {
  const location = useLocation()

  useEffect(() => {
    const base = metaForPath(location.pathname)
    const title = overrides.title || base.title || SITE.defaultTitle
    const description =
      overrides.description || base.description || SITE.defaultDescription
    const noindex = overrides.noindex ?? base.noindex ?? false

    document.title = title
    setMeta('description', description)
    setCanonical(`${SITE.url}${location.pathname}`)

    if (noindex) {
      setMeta('robots', 'noindex, follow')
    } else {
      // Removing (not setting "index") keeps a route from carrying a stale
      // noindex after client nav away from a placeholder page.
      removeMeta('robots')
    }
  }, [overrides.title, overrides.description, overrides.noindex, location.pathname])
}
