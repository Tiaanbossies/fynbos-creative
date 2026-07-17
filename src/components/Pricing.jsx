import { useEffect, useRef } from 'react'
import { TIERS } from '../lib/tiers.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { revealOnScroll } from '../lib/motion.js'
import './Pricing.css'

/**
 * Pricing — brief §E.4.
 *
 * Two brief rules shape this section and neither is negotiable:
 *
 *   1. §H — the R1,200 build fee is stated up front, never behind a
 *      "contact us" wall. It leads the section.
 *   2. §H — no fabricated statistics. tiers.js marks Bloom `featured`, but
 *      "Most popular" would be a claim about customers this business has no
 *      data for. Bloom is distinguished by a Sage wash alone.
 *
 * Presentation follows questionnaire §08 over the brief's "tier cards"
 * wording: plato.coffee is admired for having no heavy card/border treatment,
 * so the tiers are open columns divided by whitespace and a hairline rule.
 * Depth here would read as a SaaS dashboard — the opposite of the brief.
 */
function Pricing() {
  const tiersRef = useRef([])

  useEffect(() => {
    tiersRef.current.forEach((el, i) => {
      revealOnScroll(el, { delay: i * 90 })
    })
  }, [])

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <p className="eyebrow">Pricing</p>
        <h2 className="pricing-heading">Honest pricing, no surprises.</h2>
        <p className="pricing-lede">
          Every standard website is <strong>R1,200 once-off</strong> to build. After that you
          pick a monthly plan that keeps it hosted, updated and growing — cancel whenever you
          like.
        </p>

        <ul className="pricing-tiers">
          {TIERS.map((tier, i) => (
            <li
              key={tier.name}
              className={`pricing-tier${tier.featured ? ' is-featured' : ''}`}
              ref={(el) => {
                tiersRef.current[i] = el
              }}
            >
              <h3 className="pricing-tier-name">{tier.name}</h3>
              <p className="pricing-tier-who">{tier.whoFor}</p>

              <p className="pricing-tier-retainer">{tier.retainer}</p>
              <p className="pricing-tier-setup">{tier.setup}</p>

              <ul className="pricing-tier-includes">
                {tier.includes.map((item) => (
                  <li key={item} className="pricing-tier-item">
                    <svg
                      className="pricing-tick"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="pricing-foot">
          <a
            className="btn-accent"
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('pricing')}
          >
            Chat with us on WhatsApp
          </a>
          <p className="pricing-note">
            Online shops, booking systems and custom builds are quoted separately — tell us what
            you need and we&rsquo;ll give you a straight number.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
