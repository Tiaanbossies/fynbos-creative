import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import StickyWhatsApp from './components/StickyWhatsApp.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import HomePage from './pages/HomePage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import { NAV_LINKS } from './lib/nav.js'
import { useSeo } from './lib/useSeo.js'
import './App.css'

/**
 * PHASE 2 STUB — replaced section by section in Phases 3 and 4.
 *
 * Exists so the shell (header, footer, sticky CTA) can be reviewed against a
 * real router on real routes. It is not content and must not survive review.
 */
function PagePlaceholder({ label }) {
  // Bare call: title + noindex come from ROUTE_META (placeholders and the 404
  // are flagged noindex there), so thin pages never get indexed.
  useSeo()

  return (
    <section className="section">
      <div className="container">
        <h1 className="placeholder-heading">{label}</h1>
        <p className="placeholder-note">
          Placeholder — this page is built in a later phase.
        </p>
      </div>
    </section>
  )
}

/**
 * Routes with a real page built. Everything else in NAV_LINKS still falls
 * through to PagePlaceholder — add the path here when its page lands, or the
 * placeholder will shadow it with a duplicate route.
 */
const BUILT_ROUTES = new Set(['/', '/services', '/pricing', '/about', '/faq'])

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      {/* Target of the header skip link. */}
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          {NAV_LINKS.filter((link) => !BUILT_ROUTES.has(link.to)).map((link) => (
            <Route
              key={link.to}
              path={link.to}
              element={<PagePlaceholder label={link.label} />}
            />
          ))}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<PagePlaceholder label="Page not found" />} />
        </Routes>
      </main>

      <Footer />
      <StickyWhatsApp />
    </>
  )
}

export default App
