import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { readConsent, setConsent, onConsentChange, GRANTED, DECLINED } from '../lib/consent.js'
import './ConsentBanner.css'

/**
 * The POPIA notice.
 *
 * Opt-in: this appears before anything is recorded, and analytics.js sends
 * nothing until "Allow" is pressed. A visitor who never answers is never
 * tracked — which is why the two buttons are the only way out of this component
 * and neither is pre-selected.
 *
 * Deliberately NOT a modal. It does not trap focus, does not cover the page and
 * does not block the WhatsApp CTA — the one action this site exists to produce
 * must stay reachable by someone who wants to ignore a privacy notice. That is
 * also why "No thanks" is a real, equally-weighted button rather than a grey
 * link: consent that is awkward to refuse is not freely given, and POPIA asks
 * that it be freely given.
 *
 * It renders only when there is no stored answer, so it is a first-visit thing
 * rather than a permanent fixture. Once answered, the control on /privacy is
 * where the choice can be changed.
 */
function ConsentBanner() {
  /* Read storage in a lazy initialiser, not an effect. This is a client-rendered
     Vite app — the prerender writes <head> only and leaves #root empty — so the
     first render already runs in the browser and can read the real answer. The
     previous `undefined` sentinel existed to avoid flashing the banner at someone
     who had already answered, but it also meant the banner arrived one effect
     late, appearing in a page the visitor had started reading. Reading
     synchronously avoids both. readConsent() is Node-safe (returns null with no
     window), so this file stays importable at build time. */
  const [consent, setConsentState] = useState(() => readConsent())

  useEffect(() => onConsentChange(setConsentState), [])

  /* null means "never asked" — the only state that shows the notice. */
  if (consent === GRANTED || consent === DECLINED) return null

  return (
    <aside
      className="consent-banner"
      /* A region, not a dialog: nothing is trapped and nothing is blocked. */
      role="region"
      aria-label="Privacy choice"
    >
      <div className="consent-banner-inner">
        <p className="consent-banner-copy">
          We&rsquo;d like to count which page you were on when you tap
          &ldquo;Chat with us on WhatsApp&rdquo;, so we know which parts of this
          site are actually helping. It runs on our own systems — no Google, no
          advertising trackers, no cookies. Only if you say yes.{' '}
          <Link to="/privacy">What we&rsquo;d record</Link>.
        </p>
        <div className="consent-banner-actions">
          <button
            type="button"
            className="consent-banner-btn consent-banner-btn--yes"
            onClick={() => setConsent(GRANTED)}
          >
            Allow
          </button>
          <button
            type="button"
            className="consent-banner-btn"
            onClick={() => setConsent(DECLINED)}
          >
            No thanks
          </button>
        </div>
      </div>
    </aside>
  )
}

export default ConsentBanner
