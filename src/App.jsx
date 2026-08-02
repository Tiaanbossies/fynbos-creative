import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import StickyWhatsApp from './components/StickyWhatsApp.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import BackToTop from './components/BackToTop.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import ConsentBanner from './components/ConsentBanner.jsx'
import HomePage from './pages/HomePage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import { NAV_LINKS } from './lib/nav.js'
import { useSeo } from './lib/useSeo.js'
import './App.css'

/**
 * Holding page for a nav entry whose real page has not been built yet.
 *
 * It used to serve the 404 as well, which meant every mistyped URL told the
 * visitor the site was unfinished. That job now belongs to NotFoundPage; this
 * is only ever reached through NAV_LINKS, where "built in a later phase" is
 * true and the visitor followed our own link to get here.
 *
 * Currently unreachable — BUILT_ROUTES covers every NAV_LINKS entry, so the
 * filter below yields nothing. It is kept because it is the guard that stops a
 * newly-added nav link 404ing before its page lands; see CLAUDE.md's
 * three-place route contract.
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
      <ScrollProgress />
      <Header />

      {/* Above <main>, and in normal flow — it used to sit after the footer as a
          bottom-fixed overlay. That placement kept the tab order sane while the
          notice floated at the bottom of the screen, but the overlay itself
          covered the decisive content of four pages (see ConsentBanner.css).
          Now that the notice occupies real space at the top, visual order and
          tab order agree, which is what WCAG 2.4.3 actually asks for, and a
          keyboard visitor meets the choice immediately instead of traversing
          the page to find it. It renders only on a first visit, so it costs a
          returning visitor nothing. */}
      <ConsentBanner />

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
          {/* The analytics dashboard. Not in NAV_LINKS and not in BUILT_ROUTES:
              BUILT_ROUTES only exists to stop PagePlaceholder shadowing a nav
              entry, and this is not a nav entry, so adding it there would be a
              no-op that implied otherwise. It IS in ROUTE_META, flagged
              noindex, which keeps it out of the sitemap and puts a robots tag
              on the prerendered page.

              Note this is unlisted, not secured. The real protection is in
              Postgres — see analytics.js and the migration. */}
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <StickyWhatsApp />
      <BackToTop />
    </>
  )
}

export default App
