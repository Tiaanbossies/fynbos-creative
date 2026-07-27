import { useEffect, useRef } from 'react'
import { revealOnScroll } from '../lib/motion.js'
import './CaseStudy.css'

/**
 * The delivered Bossie's Gym homepage. This slot showed the gym's *logo* until
 * 2026-07-27 — a proof section that proved nothing, since a logo is not
 * evidence that a site was built. The screenshot was supplied by the client on
 * that date (fynbos-assets/Clients/) and is the source of record; regenerate
 * all three widths together from it if it is ever replaced.
 *
 * Measured render widths: ~327px on a phone, peaking at 848px just under the
 * 60rem two-column breakpoint, then settling to 410px once the container caps.
 *
 * JPEG, not PNG: the 798 KB source is mostly a dark photographic gym interior,
 * which PNG cannot compress. Quality 82 keeps the overlaid UI text legible at
 * the sizes this actually paints, for 98 KB at full width.
 */
const SHOT = '/case-studies/bossies-gym-home-1122.jpeg'
const SHOT_MD = '/case-studies/bossies-gym-home-800.jpeg'
const SHOT_SM = '/case-studies/bossies-gym-home-400.jpeg'

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
          {/* width/height are the file's real dimensions, so the box reserved
              before load is the right shape and the row does not reflow. */}
          <img
            src={SHOT}
            srcSet={`${SHOT_SM} 400w, ${SHOT_MD} 800w, ${SHOT} 1122w`}
            sizes="(min-width: 80rem) 410px, (min-width: 60rem) 32vw, 90vw"
            alt="The Bossie's Gym homepage: membership prices, a free-trial booking prompt and a phone number, all visible without scrolling."
            width="1122"
            height="752"
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
