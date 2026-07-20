import { useEffect, useRef } from 'react'
import { TIERS } from '../lib/tiers.js'
import { revealOnScroll } from '../lib/motion.js'
import './PricingTiers.css'

/**
 * The three retainer tiers, rendered as open columns.
 *
 * Shared by the homepage Pricing section and the dedicated pricing page so the
 * tier presentation can never drift between the two — both read TIERS and get
 * the same markup, styles and reveal.
 *
 * Design rules carried from the brief (§H) and questionnaire (§08):
 *   - Bloom is marked `featured` in tiers.js but wears only a Sage wash. A
 *     "Most popular" badge would assert customer behaviour this business has no
 *     data for, so it is deliberately absent.
 *   - Open columns divided by whitespace and a hairline — no cards, no borders,
 *     no shadows. Depth here would read as a SaaS dashboard.
 */
function PricingTiers() {
  const tiersRef = useRef([])

  useEffect(() => {
    tiersRef.current.forEach((el, i) => {
      revealOnScroll(el, { delay: i * 90 })
    })
  }, [])

  return (
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
  )
}

export default PricingTiers
