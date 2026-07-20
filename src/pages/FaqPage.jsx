import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FAQS } from '../lib/faqs.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { revealOnScroll } from '../lib/motion.js'
import { useSeo } from '../lib/useSeo.js'
import './FaqPage.css'

/**
 * FAQ.
 *
 * Built on native <details>/<summary> rather than a JS accordion: it is
 * keyboard- and screen-reader-accessible for free, works with no JavaScript,
 * and matches the brief's "keep it simple, no heavy interactivity" instruction
 * (§H). The rows are open, divided by a hairline — same no-card language as the
 * Services and Pricing pages (questionnaire §08).
 *
 * All answers live in faqs.js and trace to established facts; nothing here is
 * invented (§H).
 */
function FaqPage() {
  useSeo({
    title: 'FAQ — Fynbos Creative',
    description:
      'Straight answers on cost, monthly plans, contracts, ownership and getting started with Fynbos Creative — honest web services for small South African businesses.',
  })

  const rowsRef = useRef([])

  useEffect(() => {
    rowsRef.current.forEach((el, i) => {
      revealOnScroll(el, { delay: i * 50 })
    })
  }, [])

  return (
    <>
      <section className="section faq-intro">
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h1 className="faq-heading">The questions everyone asks.</h1>
          <p className="faq-lede">
            No fine print, no runaround — just straight answers to the things people want to know
            before they get in touch. Can&rsquo;t see yours? Message me and ask.
          </p>
        </div>
      </section>

      <section className="section faq-list-section">
        <div className="container">
          <ul className="faq-list">
            {FAQS.map((faq, i) => (
              <li
                key={faq.id}
                className="faq-item"
                ref={(el) => {
                  rowsRef.current[i] = el
                }}
              >
                <details className="faq-details">
                  <summary className="faq-question">
                    <span>{faq.question}</span>
                    <svg
                      className="faq-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="faq-answer">{faq.answer}</p>
                </details>
              </li>
            ))}
          </ul>

          <div className="faq-foot">
            <a
              className="btn-accent"
              data-primary-cta
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('faq')}
            >
              Chat with us on WhatsApp
            </a>
            <p className="faq-note">
              Want the detail behind the answers? The <Link to="/services">services</Link> and{' '}
              <Link to="/pricing">pricing</Link> pages lay it all out.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default FaqPage
