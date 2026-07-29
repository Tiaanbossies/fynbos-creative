import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES } from '../lib/services.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { revealOnScroll } from '../lib/motion.js'
import { useSeo } from '../lib/useSeo.js'
import { useRevealText } from '../lib/useRevealText.js'
import './ServicesPage.css'

/**
 * The same delivered Bossie's Gym screenshot the homepage carries, at the same
 * three widths — see CaseStudy.jsx for where it came from, the client's consent,
 * and why it is a JPEG. The `sizes` below is this page's own — copying the
 * homepage's would misdeclare a different column. Measured here: the intro is two
 * 1fr tracks with a --space-12 gap inside the 72rem container, so above the cap
 * the column is a fixed 492px ((1152 - 120 padding - 48 gap) / 2), and between
 * 60rem and the cap it tracks at ~43vw. Pinning a px value above the cap matters
 * for the reason AboutPage.jsx documents: a vw carried all the way up keeps
 * over-requesting once the container has stopped growing.
 */
const SHOT = '/case-studies/bossies-gym-home-1122.jpeg'
const SHOT_MD = '/case-studies/bossies-gym-home-800.jpeg'
const SHOT_SM = '/case-studies/bossies-gym-home-400.jpeg'

/**
 * Services.
 *
 * Prices sit next to each service rather than behind a "contact us" wall
 * (§H), and the two that genuinely cannot carry a fixed number say so plainly
 * with a range or "quoted per job" — vagueness would read as a sales tactic
 * to exactly the audience this business is trying to win over.
 *
 * Open rows, no cards: same treatment as Pricing, per questionnaire §08.
 */
function ServicesPage() {
  useSeo()

  const rowsRef = useRef([])
  const headingRef = useRevealText()

  useEffect(() => {
    rowsRef.current.forEach((el, i) => {
      revealOnScroll(el, { delay: i * 70 })
    })
  }, [])

  return (
    <>
      {/*
        Copy left, a real screenshot right. This is the page's answer to the
        critique's "Marlize" note — she leaves the homepage and never sees a
        photograph of anything again, so her doubt is not about price but about
        whether there is real work behind the business. It also fills the top of
        the page, which the closing band did not reach.

        Nothing in the caption is new: every fact in it is from the same client
        confirmation that CaseStudy.jsx records. Brief §H forbids inventing case
        studies, and that applies just as much to a caption.
      */}
      <section className="section services-intro">
        <div className="container services-intro-grid">
          <div className="services-intro-copy">
            <h1 className="services-heading" ref={headingRef}>
              Everything handled, start to finish.
            </h1>
            <p className="services-lede">
              Most people who come to us don&rsquo;t want to learn how websites work — they want
              to be findable, look credible, and get on with running their business. So we do the
              whole thing for you, and keep doing it after launch.
            </p>
          </div>

          <figure className="services-shot">
            <img
              src={SHOT}
              srcSet={`${SHOT_SM} 400w, ${SHOT_MD} 800w, ${SHOT} 1122w`}
              sizes="(min-width: 75rem) 492px, (min-width: 60rem) 43vw, 90vw"
              alt="The Bossie's Gym homepage: membership prices, a free-trial booking prompt and a phone number, all visible without scrolling."
              width="1122"
              height="752"
              /* NOT loading="lazy", unlike the homepage's copy of this image.
                 There the shot is most of a page down and lazy is right; here it
                 is in the intro and paints in the first viewport at desktop, so
                 deferring it only pushes out the largest thing on the screen.
                 width/height are the file's real dimensions either way, so the
                 box is reserved before load and the row does not reflow. */
              decoding="async"
            />
            <figcaption className="services-shot-caption">
              Bossie&rsquo;s Gym — a family-run Centurion gym. Pricing, trial booking and
              click-to-chat on one page, live in under three weeks.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section services-list-section">
        <div className="container">
          <ul className="services-list">
            {SERVICES.map((service, i) => (
              <li
                key={service.id}
                className="service"
                ref={(el) => {
                  rowsRef.current[i] = el
                }}
              >
                <div className="service-head">
                  <h2 className="service-name">{service.name}</h2>
                  <p className="service-price">{service.price}</p>
                </div>
                <p className="service-body">{service.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/*
        The closing CTA is its own full-bleed band rather than the last row of the
        list — see .section-band in base.css. It is the page's one element that
        reaches the viewport edge, which is what stops the desktop layout reading
        as a narrow column against half a screen of blank paper.
      */}
      <section className="section section-band services-foot-section">
        <div className="container">
          <div className="page-foot">
            <div className="page-foot-words">
              <p className="services-note">
                Not sure which of these you need? Message us and we&rsquo;ll tell you honestly
                — including if the answer is &ldquo;less than you think&rdquo;. Full monthly
                plans are on the <Link to="/pricing">pricing page</Link>.
              </p>
            </div>
            <div className="page-foot-action">
              <a
                className="btn-accent"
                data-primary-cta
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('services')}
              >
                Chat with us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ServicesPage
