import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES } from '../lib/services.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { revealOnScroll } from '../lib/motion.js'
import { useSeo } from '../lib/useSeo.js'
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
  useSeo({
    title: 'Services — Fynbos Creative',
    description:
      'Websites built for you from R1,200, website rescue and rebuild, hosting and maintenance from R349/mo, content, photography, and online shops — for small South African businesses.',
  })

  const rowsRef = useRef([])

  useEffect(() => {
    rowsRef.current.forEach((el, i) => {
      revealOnScroll(el, { delay: i * 70 })
    })
  }, [])

  return (
    <>
      <section className="section services-intro">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h1 className="services-heading">Everything handled, start to finish.</h1>
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

          <div className="services-foot">
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
            <p className="services-note">
              Not sure which of these you need? Message us and we&rsquo;ll tell you honestly —
              including if the answer is &ldquo;less than you think&rdquo;. Full monthly plans
              are on the <Link to="/pricing">pricing page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default ServicesPage
