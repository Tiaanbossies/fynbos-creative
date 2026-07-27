import { useEffect, useRef } from 'react'
import { revealOnScroll } from '../lib/motion.js'
import './CaseStudy.css'

/**
 * Measured render widths: ~327px on a phone, peaking at 848px just under the
 * 60rem two-column breakpoint, then settling to 410px once the container caps.
 * So the 796px source is correctly sized for wide 1x and for 2x phones — it was
 * only 1x phones that paid 92 KB to paint 327 pixels, hence the one small
 * variant rather than a full ladder.
 *
 * The small one is quantised back to a palette on purpose: this is flat logo
 * art, and resizing it in full RGBA produced a 226 KB file from a 92 KB source.
 */
const SHOT = '/case-studies/bossies-gym.png'
const SHOT_SM = '/case-studies/bossies-gym-400.png'

/**
 * The mockup's "One real result" row — screenshot left, story right.
 *
 * Brief §H forbids invented case studies, so this section exists only because
 * the client confirmed (2026-07-23) that Bossie's Gym consented and that the
 * specifics below are true: a family-run Centurion gym, eight coaches, live in
 * under three weeks. Do not add numbers to this section that did not come from
 * that confirmation.
 *
 * Alex Brush carries the kicker. It is the one script accent on the page and
 * it never sets anything a visitor must read to understand the section — the
 * h2 immediately below says the same thing in plain words.
 */
function CaseStudy() {
  const ref = useRef(null)

  useEffect(() => {
    revealOnScroll(ref.current)
  }, [])

  return (
    <section className="section case" aria-labelledby="case-heading">
      <div className="container case-grid" ref={ref}>
        <figure className="case-shot">
          {/* width/height were 1200x900 — a 4:3 box for a file that is 796x800.
              The reservation was the wrong shape, so the row reflowed on load. */}
          <img
            src={SHOT}
            srcSet={`${SHOT_SM} 400w, ${SHOT} 796w`}
            sizes="(min-width: 80rem) 410px, (min-width: 60rem) 32vw, 90vw"
            alt="Bossie's Gym and Personal Training Studio logo"
            width="796"
            height="800"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="case-copy">
          <p className="case-kicker" aria-hidden="true">
            One real result
          </p>
          <h2 className="case-heading" id="case-heading">
            Bossie&rsquo;s Gym went from word-of-mouth only to a bookable,
            WhatsApp-ready site.
          </h2>
          <p className="case-body">
            A family-run Centurion gym with eight coaches and no online presence
            at all. We built pricing, trial booking and click-to-chat into one
            page — live in under three weeks.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CaseStudy
