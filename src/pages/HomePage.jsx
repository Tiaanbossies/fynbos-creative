import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import { useSeo } from '../lib/useSeo.js'

/**
 * Home. Sections land here in the order set by brief §E:
 *   1. Hero            ✓
 *   2. Proof           — SKIPPED for now, on instruction. Slots back in here,
 *                        above How it works, when the Cozy Cage Rentals
 *                        content is ready.
 *   3. How it works    ✓
 *   4. Pricing         — next
 *   5. Case studies
 *   6. The Fynbos Network
 *   7. Contact
 */
function HomePage() {
  useSeo()

  return (
    <>
      <Hero />
      <HowItWorks />
    </>
  )
}

export default HomePage
