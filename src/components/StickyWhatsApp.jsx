import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { pulseWhatsApp } from '../lib/motion.js'
import './StickyWhatsApp.css'

/**
 * The most important element on the site (brief §B.1, questionnaire §08):
 * tappable on every page, on mobile, without scrolling.
 *
 * Deliberately dumb. It is plain markup with a real href — no reveal
 * animation, no IntersectionObserver, no data fetch, nothing that could fail
 * or defer. The brief requires it to "render and be tappable immediately, not
 * blocked by other components or animations loading", so the only motion here
 * is pulseWhatsApp, which is a pure enhancement layered on after paint and is
 * already reduced-motion guarded.
 *
 * Mobile-only: on desktop the header CTA carries this job (see Header.css).
 */
function StickyWhatsApp() {
  const ref = useRef(null)
  const { pathname } = useLocation()
  const [isYielding, setIsYielding] = useState(false)

  useEffect(() => {
    pulseWhatsApp(ref.current)
  }, [])

  /**
   * Yield while ANY in-page CTA is on screen.
   *
   * Without this the hero shows two identical Terracotta pills a thumb apart —
   * clutter, and a straight contradiction of the cognitive-fluency principle
   * in brief §C ("reduce decisions, reduce clutter, make the next action
   * obvious").
   *
   * Every in-page CTA is observed, not just the first. A page has several
   * (hero, pricing, contact), and matching only one silently reintroduces the
   * stacked-duplicate bug at whichever CTA happens to come later in the DOM.
   *
   * Fails OPEN by design: the bar is only ever hidden while the observer has
   * positively confirmed a CTA is visible. No marked CTA, no observer support,
   * or a thrown error all leave the bar showing — §B.1 is not allowed to
   * depend on this working.
   */
  useEffect(() => {
    const primaries = document.querySelectorAll('[data-primary-cta]')
    if (primaries.length === 0 || typeof IntersectionObserver === 'undefined') {
      setIsYielding(false)
      return undefined
    }

    /* Tracked as a set: entries only report CTAs that changed, so "is anything
       visible" cannot be answered from a single callback's entries alone. */
    const visible = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        })
        setIsYielding(visible.size > 0)
      },
      { threshold: 0.6 },
    )
    primaries.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      setIsYielding(false)
    }
  }, [pathname])

  return (
    <div
      className={isYielding ? 'sticky-whatsapp is-yielding' : 'sticky-whatsapp'}
      aria-hidden={isYielding}
    >
      <a
        ref={ref}
        className="sticky-whatsapp-btn"
        href={buildWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('sticky-mobile')}
      >
        <svg
          className="sticky-whatsapp-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2" />
        </svg>
        Chat with us on WhatsApp
      </a>
    </div>
  )
}

export default StickyWhatsApp
