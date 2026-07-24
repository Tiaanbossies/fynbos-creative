import { useEffect, useState } from 'react'
import './BackToTop.css'

/* Scroll distance before the button appears — roughly one viewport in. */
const SHOW_AFTER = 600

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Back-to-top button — a floating pill that fades in once the visitor has
 * scrolled past SHOW_AFTER and returns them to the top. Adapted from the
 * 21st.dev "Scroll to Top" pattern.
 *
 * Desktop only (see CSS): on mobile the fixed WhatsApp bar owns the bottom of
 * the viewport (brief §B.1), and a second floating control down there would
 * clutter the single action the site exists to drive. The smooth scroll falls
 * back to an instant jump under reduced-motion.
 */
function BackToTop() {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setIsShown(window.scrollY > SHOW_AFTER)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      type="button"
      className={isShown ? 'back-to-top is-shown' : 'back-to-top'}
      onClick={toTop}
      aria-hidden={!isShown}
      tabIndex={isShown ? 0 : -1}
      aria-label="Back to top"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  )
}

export default BackToTop
