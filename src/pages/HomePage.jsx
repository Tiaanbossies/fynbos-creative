import Hero from '../components/Hero.jsx'
import CaseStudy from '../components/CaseStudy.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Pricing from '../components/Pricing.jsx'
import SeoPanel from '../components/SeoPanel.jsx'
import Values from '../components/Values.jsx'
import Contact from '../components/Contact.jsx'
import { useSeo } from '../lib/useSeo.js'
import './HomePage.css'

/**
 * Home — the "Fynbos Home" mockup composition, adopted 2026-07-23.
 *
 * Section order is the mockup's, which reorders brief §E: proof now comes
 * immediately after the hero rather than sitting below How it works, because
 * a hesitant visitor is asked to trust the business before being asked to read
 * the process.
 *
 *   1. Hero (split, founder strip)     ✓
 *   2. Bossie's Gym case study         ✓ — client confirmed consent 2026-07-23
 *   3. How it works + Pricing (offer)  ✓ — one row, two columns
 *   4. Built for visibility (SEO)      ✓
 *   5. Values                          ✓ — all three cleared 2026-07-23
 *   6. Contact                         ✓
 *
 * The old Proof section (Cozy Cage Rentals) is still unbuilt; its asset sits
 * in public/case-studies/. It would slot in beside Bossie's Gym as a second
 * case study when that content is ready.
 */
function HomePage() {
  useSeo()

  return (
    <>
      <Hero />
      <CaseStudy />

      {/* The mockup's 1fr / 1.6fr offer row: process on the left, prices on
          the right, divided by a single vertical hairline. Both columns are
          plain divs so this grid owns the section semantics. */}
      <section className="section offer" aria-label="How it works and pricing">
        <div className="container offer-grid">
          <HowItWorks />
          <Pricing />
        </div>
      </section>

      <SeoPanel />
      <Values />
      <Contact />
    </>
  )
}

export default HomePage
