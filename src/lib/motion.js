import { animate } from 'animejs'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Fades/slides an element in once it enters the viewport.
 * No-ops (leaves element at its natural, final state) under reduced-motion.
 *
 * Content stays visible by default: an element already near the initial
 * viewport animates in immediately on mount rather than being hidden, and
 * anything below the fold gets a bounded safety-net timeout so it's
 * guaranteed to reveal even if IntersectionObserver never fires (e.g. a
 * non-scrolling screenshot/PDF/crawler capture) — the reveal must enhance an
 * already-visible page, never gate it.
 */
export function revealOnScroll(el, { delay = 0 } = {}) {
  if (!el) return

  if (prefersReducedMotion()) return

  let fired = false
  const reveal = () => {
    if (fired) return
    fired = true
    animate(el, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
      delay,
      easing: 'easeOutQuad',
    })
  }

  const rect = el.getBoundingClientRect()
  if (rect.top < window.innerHeight * 1.3) {
    el.style.opacity = '0'
    el.style.transform = 'translateY(12px)'
    reveal()
    return
  }

  el.style.opacity = '0'
  el.style.transform = 'translateY(12px)'

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        reveal()
        obs.unobserve(el)
      })
    },
    { threshold: 0.15 },
  )

  observer.observe(el)

  setTimeout(() => {
    reveal()
    observer.disconnect()
  }, 600)
}

/**
 * A soft, recurring attention pulse for the primary WhatsApp CTA.
 * Never runs under reduced-motion.
 */
export function pulseWhatsApp(el) {
  if (!el || prefersReducedMotion()) return

  animate(el, {
    scale: [1, 1.04, 1],
    duration: 1800,
    delay: 2000,
    loop: true,
    loopDelay: 3000,
    easing: 'easeInOutSine',
  })
}
