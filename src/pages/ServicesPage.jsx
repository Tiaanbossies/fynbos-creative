import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES } from '../lib/services.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { revealOnScroll } from '../lib/motion.js'
import { useSeo } from '../lib/useSeo.js'
import { useRevealText } from '../lib/useRevealText.js'
import './ServicesPage.css'

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
      <section className="section services-intro">
        <div className="container">
          <h1 className="services-heading" ref={headingRef}>
            Everything handled, start to finish.
          </h1>
          <p className="services-lede">
            Most people who come to us don&rsquo;t want to learn how websites work — they want
            to be findable, look credible, and get on with running their business. So we do the
            whole thing for you, and keep doing it after launch.
          </p>
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
