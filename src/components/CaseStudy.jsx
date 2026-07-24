import { useEffect, useRef } from 'react'
import { revealOnScroll } from '../lib/motion.js'
import './CaseStudy.css'

const SHOT = '/case-studies/bossies-gym.png'

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
          <img
            src={SHOT}
            alt="Bossie's Gym and Personal Training Studio logo"
            width="1200"
            height="900"
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
