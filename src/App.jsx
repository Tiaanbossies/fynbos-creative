import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
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

/**
 * Everything a visitor sees: nav, footer, the consent notice and both WhatsApp
 * affordances.
 *
 * The consent notice sits above <main> and in normal flow — it used to be a
 * bottom-fixed overlay after the footer, which covered the decisive content of
 * four pages (see ConsentBanner.css). With it in flow at the top, visual order
 * and tab order agree, which is what WCAG 2.4.3 asks for, and a keyboard visitor
 * meets the choice immediately rather than traversing the page to find it. It
 * renders only on a first visit, so it costs a returning visitor nothing.
 */
function MarketingLayout() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <ConsentBanner />

      {/* Target of the header skip link. */}
      <main id="main">
        <Outlet />
      </main>

      <Footer />
      <StickyWhatsApp />
      <BackToTop />
    </>
  )
}

/**
 * The analytics dashboard's shell: a <main> landmark and nothing else.
 *
 * AnalyticsPage.css has always said the dashboard "gets no hero, no CTA and no
 * persuasion" — but all of those rendered on it anyway, because the marketing
 * chrome wrapped every route. It carried the nav, the terracotta WhatsApp CTA,
 * the footer, the sticky bar, and a consent notice asking the owner for
 * permission to count their own clicks.
 *
 * Nothing about the security model changes here, because none of it ever lived
 * in this file: the page is unlisted rather than protected, the passphrase is
 * checked by a SECURITY DEFINER function inside Postgres and never in React, and
 * the events table has no anon SELECT policy. This only stops the dashboard
 * dressing up as a sales page. It stays noindex through ROUTE_META.
 */
function DashboardLayout() {
  return (
    <main id="main">
      <Outlet />
    </main>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MarketingLayout />}>
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Outside MarketingLayout, deliberately. Not in NAV_LINKS and not in
            BUILT_ROUTES either: BUILT_ROUTES exists only to stop PagePlaceholder
            shadowing a nav entry, and this is not a nav entry, so adding it
            there would be a no-op that implied otherwise. It IS in ROUTE_META,
            flagged noindex, which keeps it out of the sitemap and puts a robots
            tag on the prerendered page. */}
        <Route element={<DashboardLayout />}>
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
