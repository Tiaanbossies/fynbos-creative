import { useEffect, useRef } from 'react'
import './ScrollProgress.css'

/**
 * Reading-progress indicator — a thin terracotta bar pinned to the top of the
 * viewport that fills as the visitor scrolls a page. Adapted from the 21st.dev
 * "Scroll Progress" pattern to plain CSS and a scaleX transform (compositor-only,
 * no layout thrash).
 *
 * Decorative and aria-hidden: it only repeats what the scrollbar already tells
 * a visitor, so it adds nothing for assistive tech. It reflects scroll position
 * rather than animating on its own, so it stays on under reduced-motion — there
 * is no autonomous movement to suppress.
 */
function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const el = barRef.current
      if (!el) return
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="scroll-progress" aria-hidden="true" ref={barRef} />
}

export default ScrollProgress
