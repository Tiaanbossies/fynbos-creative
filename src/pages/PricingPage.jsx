import { Link } from 'react-router-dom'
import PricingTiers from '../components/PricingTiers.jsx'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { useSeo } from '../lib/useSeo.js'
import { useRevealText } from '../lib/useRevealText.js'
import './PricingPage.css'

/**
 * Pricing.
 *
 * The dedicated page the homepage Pricing section links deeper into. It leads
 * with the one-off build fee because brief §H is non-negotiable: the R1,200
 * price is stated plainly and early, never behind a "contact us" wall.
 *
 * Order:
 *   1. Build fee — the once-off number, up front.
 *   2. Monthly plans — the three tiers, shared with the homepage via
 *      <PricingTiers /> so the two can never drift.
 *   3. Website Rescue & Rebuild — the standalone named service (§G), for people
 *      who arrive with an old site rather than a blank slate.
 *   4. Custom work — stated as "quoted per job", not hidden.
 *
 * No fabricated statistics or "most popular" claims (§H) — Bloom carries a Sage
 * wash and nothing more.
 */
function PricingPage() {
  useSeo()

  const headingRef = useRevealText()

  return (
    <>
      <section className="section pricing-page-intro">
        <div className="container">
          <h1 className="pricing-page-heading" ref={headingRef}>
            Honest pricing, no surprises.
          </h1>
          <p className="pricing-page-lede">
            One once-off fee to build your website, then a monthly plan that keeps it hosted,
            updated and growing. No lock-in contracts, no hidden setup costs — cancel whenever
            you like.
          </p>
        </div>
      </section>

      <section className="section pricing-buildfee-section">
        <div className="container">
          <div className="pricing-buildfee">
            <div className="pricing-buildfee-head">
              <h2 className="pricing-buildfee-name">Your website, built for you</h2>
              <p className="pricing-buildfee-price">R1,200 once-off</p>
            </div>
            <p className="pricing-buildfee-body">
              A clean, mobile-first website that tells people what you do and makes it easy to
              contact you. Paid once, up front — the monthly plans below are separate, and only
              start once your site is live. Online shops and booking systems need more than a
              standard build, so those are quoted per job.
            </p>
          </div>
        </div>
      </section>

      <section className="section pricing-plans-section">
        <div className="container">
          <h2 className="pricing-plans-heading">Then pick a monthly plan</h2>
          <p className="pricing-plans-lede">
            Every plan keeps your site hosted, backed up and looked after. Move up or down a
            plan as your business changes — you are never locked in.
          </p>

          <PricingTiers />
        </div>
      </section>

      <section className="section pricing-rescue-section">
        <div className="container">
          <div className="pricing-rescue">
            <div className="pricing-rescue-head">
              <h2 className="pricing-rescue-name">Website Rescue &amp; Rebuild</h2>
              <p className="pricing-rescue-price">R2,500 &ndash; R8,000</p>
            </div>
            <p className="pricing-rescue-body">
              Already have a site that is broken, outdated, or that nobody has touched in years?
              We take it over, fix what is worth keeping and rebuild the rest. Priced on how much
              work it actually needs, so you get a straight number before we start — not a
              surprise invoice after.
            </p>
          </div>
        </div>
      </section>

      <section className="section pricing-page-foot-section">
        <div className="container">
          <div className="pricing-page-foot">
            <h2 className="pricing-page-foot-heading">Not sure which plan fits?</h2>
            <p className="pricing-page-foot-lede">
              Tell us a little about your business and we&rsquo;ll point you at the right one —
              honestly, including if the answer is a smaller plan than you expected.
            </p>
            <a
              className="btn-accent"
              data-primary-cta
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('pricing-page')}
            >
              Chat with us on WhatsApp
            </a>
            <p className="pricing-page-note">
              Want the detail on what each plan actually does for you? That&rsquo;s on the{' '}
              <Link to="/services">services page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default PricingPage
