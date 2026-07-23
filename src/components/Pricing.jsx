import { useEffect, useRef } from 'react'
import { TIERS } from '../lib/tiers.js'
import { revealOnScroll } from '../lib/motion.js'
import './Pricing.css'

/**
 * Right column of the homepage offer row — the mockup's compact price cards
 * plus a comparison table.
 *
 * Two brief rules still shape this and neither is negotiable:
 *
 *   1. §H — the R1,200 build fee is stated up front, never behind a
 *      "contact us" wall. It leads the section.
 *   2. §H — no fabricated statistics. Bloom is marked `featured` in tiers.js
 *      and the mockup gives it a Terracotta border, but there is no "Most
 *      popular" badge: that would be a claim about customers this business
 *      has no data for.
 *
 * The cards ARE cards here, with borders and a hover lift. That reverses the
 * open-column treatment questionnaire §08 asked for, on the mockup's
 * authority — see the shadow note in tokens.css for where to pull back if the
 * flat treatment is ever restored. The full open-column presentation still
 * lives on /pricing via PricingTiers.
 */

/* Row order matches the tier order: [Seed, Bloom, Grove]. */
const COMPARISON = [
  { id: 'hosting', label: 'Hosting & maintenance', has: [true, true, true] },
  {
    id: 'google',
    label: 'Google Business + WhatsApp chat',
    has: [true, true, true],
  },
  {
    id: 'optimisation',
    label: 'Monthly optimisation + blog post',
    has: [false, true, true],
  },
  {
    id: 'social',
    label: 'Social media + partner network',
    has: [false, false, true],
  },
]

function Pricing() {
  const cardsRef = useRef([])

  useEffect(() => {
    cardsRef.current.forEach((el, i) => {
      revealOnScroll(el, { delay: i * 90 })
    })
  }, [])

  return (
    <div className="pricing" id="pricing">
      <h2 className="pricing-heading">Pricing that grows with you</h2>
      <p className="pricing-lede">
        <strong>R1,200 flat build fee.</strong> Online shops, booking systems
        and custom builds are quoted separately.
      </p>

      <ul className="price-cards">
        {TIERS.map((tier, i) => (
          <li
            key={tier.name}
            className={`price-card${tier.featured ? ' is-featured' : ''}`}
            ref={(el) => {
              cardsRef.current[i] = el
            }}
          >
            <h3 className="price-card-name">{tier.name}</h3>
            <p className="price-card-retainer">{tier.retainer}</p>
            <p className="price-card-summary">{tier.summary}</p>
          </li>
        ))}
      </ul>

      <table className="price-table">
        <caption className="visually-hidden">
          What each monthly plan includes
        </caption>
        <thead>
          <tr>
            <th scope="col">Included</th>
            {TIERS.map((tier) => (
              <th scope="col" key={tier.name}>
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.label}</th>
              {row.has.map((included, i) => (
                <td key={TIERS[i].name}>
                  {/* The glyph is decorative; the word is what a screen
                      reader announces, so the table never depends on a tick
                      being perceived. */}
                  <span
                    className={included ? 'price-yes' : 'price-no'}
                    aria-hidden="true"
                  >
                    {included ? '✓' : '—'}
                  </span>
                  <span className="visually-hidden">
                    {included ? 'Included' : 'Not included'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Pricing
