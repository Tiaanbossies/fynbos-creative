/**
 * Analytics consent — the gate everything in analytics.js sits behind.
 *
 * POPIA position: opt-in. Nothing is sent until a visitor actively accepts, so
 * the default state of a first visit is "not processing". That costs real data
 * — visitors who ignore the banner are never counted — and it is the right
 * trade for a site whose entire pitch is being straight with people. The
 * privacy policy states this, and the two must not drift.
 *
 * Keep this module free of TOP-LEVEL browser access. scripts/prerender.mjs
 * imports whatsapp.js, whatsapp.js imports analytics.js, and analytics.js
 * imports this — so Node loads this file at build time. Every localStorage and
 * window touch below is inside a function for that reason, and the try/catch
 * around each one covers Safari private mode, where reading localStorage can
 * throw rather than returning null.
 */

const STORAGE_KEY = 'fynbos.analytics.consent'

export const GRANTED = 'granted'
export const DECLINED = 'declined'

/** Subscribers are React components wanting to re-render on a change. */
const listeners = new Set()

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * @returns {'granted'|'declined'|null} null means "has not been asked yet",
 *   which is what makes the banner appear. It is deliberately distinct from
 *   'declined' — a visitor who said no must not be asked again on every visit.
 */
export function readConsent() {
  if (!isBrowser()) return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === GRANTED || value === DECLINED ? value : null
  } catch {
    /* Private mode, or storage disabled. Treated as "never asked", and since
       nothing can be persisted the banner will ask again next visit. That is
       the correct failure direction: it never silently starts tracking. */
    return null
  }
}

export function hasConsented() {
  return readConsent() === GRANTED
}

/**
 * Record a decision. Passing null clears it, which is how the privacy policy's
 * "change your mind" control puts a visitor back to un-asked.
 */
export function setConsent(value) {
  if (!isBrowser()) return
  try {
    if (value === null) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
  } catch {
    /* Ignore: an unwritable store means the answer does not persist, not that
       the visitor's choice should be overridden for this page view. */
  }
  for (const listener of listeners) listener(value)
}

/** @returns {() => void} unsubscribe */
export function onConsentChange(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
