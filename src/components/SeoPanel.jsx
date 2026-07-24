import { useEffect, useRef } from 'react'
import { revealOnScroll } from '../lib/motion.js'
import './SeoPanel.css'

/**
 * "Built for visibility" — the mockup's SEO section.
 *
 * The left panel is an ILLUSTRATION of a search result, drawn in CSS: a search
 * box, a highlighted result, and grey bars standing in for the listings below
 * it. It deliberately shows no ranking, no position number and no metrics,
 * because brief §H forbids fabricated statistics and a mocked-up "#1 result"
 * would be exactly that. It is decorative and marked aria-hidden; the heading
 * and paragraph carry the whole claim.
 */
function SeoPanel() {
  const ref = useRef(null)

  useEffect(() => {
    revealOnScroll(ref.current)
  }, [])

  return (
    <section className="section seo" aria-labelledby="seo-heading">
      <div className="container seo-grid" ref={ref}>
        <svg
          className="seo-leaf"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z"
            fill="var(--olive)"
          />
        </svg>

        <div className="seo-mock" aria-hidden="true">
          <div className="seo-search">
            <span className="seo-google">
              <span className="seo-g1">G</span>
              <span className="seo-g2">o</span>
              <span className="seo-g3">o</span>
              <span className="seo-g1">g</span>
              <span className="seo-g4">l</span>
              <span className="seo-g2">e</span>
            </span>
            <span className="seo-query">Plumber near me</span>
          </div>

          <div className="seo-result">
            <span>Fynbos Creative</span>
          </div>

          <div className="seo-bars">
            <span className="seo-bar is-strong" style={{ width: '70%' }} />
            <span className="seo-bar" style={{ width: '85%' }} />
            <span className="seo-bar" style={{ width: '60%' }} />
            <span
              className="seo-bar is-strong is-spaced"
              style={{ width: '55%' }}
            />
            <span className="seo-bar" style={{ width: '75%' }} />
          </div>
        </div>

        <div className="seo-copy">
          <h2 className="seo-heading" id="seo-heading">
            Built for visibility,
            <br />
            not just decoration.
          </h2>
          <p className="seo-body">
            Every site is optimised for Google and local SEO to ensure customers
            find your business when they search.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SeoPanel
