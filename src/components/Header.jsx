import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import Wordmark from './Wordmark.jsx'
import { NAV_LINKS } from '../lib/nav.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import './Header.css'

/* Past this many pixels the hero media is no longer behind the nav. */
const SOLIDIFY_AT = 24

/**
 * Transparent over the hero media, solidifying on scroll — the bugatti.com
 * treatment called out in questionnaire §08.
 *
 * Transparency is keyed off whether hero media is ACTUALLY behind the header,
 * not off the route. In the transparent state the logo, wordmark and nav flip to
 * Parchment to read against the video; if that state is ever entered on a page
 * with no media, it is Parchment-on-Parchment and the header vanishes. Any
 * page wanting the treatment marks its media with `data-hero-media`.
 */
function Header() {
  const { pathname } = useLocation()
  const [hasHeroMedia, setHasHeroMedia] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isTransparent = hasHeroMedia && !isScrolled && !isMenuOpen

  /* Before paint, so the header never flashes the wrong treatment. */
  useLayoutEffect(() => {
    setHasHeroMedia(Boolean(document.querySelector('[data-hero-media]')))
  }, [pathname])

  useEffect(() => {
    if (!hasHeroMedia) return undefined

    const onScroll = () => setIsScrolled(window.scrollY > SOLIDIFY_AT)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasHeroMedia])

  /* A left-open menu across a route change would trap the user. */
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={[
        'site-header',
        isTransparent ? 'is-transparent' : 'is-solid',
        isMenuOpen ? 'is-menu-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <a className="skip-link visually-hidden" href="#main">
        Skip to content
      </a>

      <div className="container header-inner">
        <Link to="/" className="header-brand" aria-label="Fynbos Creative — home">
          {/*
            Over the video the logo has to be Parchment to survive whatever
            frame is behind it, and the artwork's own colours cannot do that —
            so the transparent state swaps to the masked tone. Solid, it is the
            delivered artwork.
          */}
          <BrandMark tone={isTransparent ? 'mono' : 'colour'} />
          <Wordmark />
        </Link>

        <nav className="header-nav" id="primary-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive ? 'header-link is-active' : 'header-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <a
          className="header-cta"
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('header')}
        >
          Chat with us on WhatsApp
        </a>

        <button
          type="button"
          className="header-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="header-toggle-bar" />
          <span className="header-toggle-bar" />
          <span className="header-toggle-bar" />
        </button>
      </div>
    </header>
  )
}

export default Header
