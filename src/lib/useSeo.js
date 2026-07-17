import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://fynboscreative.co.za'
const DEFAULT_TITLE = 'Fynbos Creative — Web Services & Media for SA SMEs'
const DEFAULT_DESCRIPTION =
  'Fynbos Creative — done-for-you web services and media for South African SMEs. Low setup cost, monthly retainer, a partner network that helps you grow.'

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
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
 * @param {{ title?: string, description?: string }} [options]
 */
export function useSeo({ title, description } = {}) {
  const location = useLocation()

  useEffect(() => {
    document.title = title || DEFAULT_TITLE
    setMeta('description', description || DEFAULT_DESCRIPTION)
    setCanonical(`${SITE_URL}${location.pathname}`)
  }, [title, description, location.pathname])
}
