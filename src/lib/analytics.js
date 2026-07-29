/**
 * First-party analytics. Events go to our own Supabase project and nowhere
 * else — no Google, no third-party script, no advertising network, nothing
 * embedded in the page from another origin.
 *
 * WHAT IS SENT, and it is the same list the privacy policy states in words:
 *   event          'whatsapp_click'
 *   source         which CTA — hero | pricing | contact | sticky-mobile |
 *                  contact-form-fallback
 *   path           the page the click happened on
 *   referrer_host  HOSTNAME ONLY, never the full referring URL, because a full
 *                  referrer can carry a search query or a token in its path
 *   device         'mobile' | 'desktop', from a width check — not a UA string,
 *                  and not a fingerprint
 *   session_id     a random id held in sessionStorage, gone when the tab closes
 *
 * What is NOT sent: no cookies, no IP address, no name, no message text, and
 * nothing that survives the tab.
 *
 * TWO CONSTRAINTS THAT ARE EASY TO BREAK:
 *
 * 1. No top-level browser access. scripts/prerender.mjs imports whatsapp.js at
 *    build time, and whatsapp.js imports this file, so Node evaluates this
 *    module. Everything touching window/fetch/crypto is inside a function.
 *    Reading import.meta.env at module scope IS safe — Vite inlines it, and the
 *    optional chaining below covers Node, where it is undefined.
 * 2. Nothing fires without consent. Every path into the network goes through
 *    hasConsented(). Opt-in, so a visitor who has not answered is not tracked.
 */

import { hasConsented } from './consent.js'

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY

const SESSION_KEY = 'fynbos.analytics.sid'

function isBrowser() {
  return typeof window !== 'undefined'
}

/** Configured is not the same as consented — both are required to send. */
export function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

/**
 * Per-visit id. sessionStorage, not localStorage, and not a cookie: it dies
 * with the tab, so it can tell one visitor clicking twice from two visitors
 * without following anyone between visits. It is still an identifier, which is
 * why the privacy policy names it rather than calling the data "anonymous".
 */
function sessionId() {
  if (!isBrowser()) return null
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = window.crypto?.randomUUID?.()
      if (!id) return null
      window.sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return null
  }
}

/** Hostname only. Same-origin referrers are dropped as noise. */
function referrerHost() {
  try {
    if (!document.referrer) return null
    const host = new URL(document.referrer).hostname
    return host === window.location.hostname ? null : host
  } catch {
    return null
  }
}

function deviceKind() {
  try {
    return window.matchMedia('(max-width: 47.99rem)').matches ? 'mobile' : 'desktop'
  } catch {
    return null
  }
}

/**
 * Record an event. Safe to call from anywhere, including before consent and
 * before configuration — it returns silently in both cases.
 *
 * Deliberately fire-and-forget, and deliberately swallowing failures. This is
 * the opposite of contact.js, which must never resolve quietly: a lost enquiry
 * is a lost client, but a lost analytics event is a missing row in a chart. The
 * visitor is mid-click on the one action this whole site exists to produce, and
 * nothing about our measurement is allowed to interrupt it.
 *
 * keepalive lets the request outlive the page if the click navigates away.
 */
export function track(event, source) {
  if (!isBrowser() || !isConfigured() || !hasConsented()) return

  const sid = sessionId()
  if (!sid) return

  try {
    fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        event,
        source: source ?? null,
        path: window.location.pathname,
        referrer_host: referrerHost(),
        device: deviceKind(),
        session_id: sid,
      }),
    }).catch(() => {})
  } catch {
    /* Never let measurement throw into a click handler. */
  }
}

/**
 * The dashboard's only read path. Calls the SECURITY DEFINER function, which
 * verifies the passphrase inside Postgres and returns aggregates — the anon key
 * alone cannot read a single event row, because the table has no SELECT policy.
 * See supabase/migrations/20260729000000_analytics.sql.
 *
 * Unlike track(), this one throws: a dashboard that silently shows nothing is
 * indistinguishable from a quiet week.
 */
export async function fetchSummary(passphrase, days = 30) {
  if (!isConfigured()) {
    throw new Error(
      'Analytics is not configured — this build has no VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.',
    )
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/analytics_summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ passphrase, days }),
  })

  if (!response.ok) {
    /* The function raises SQLSTATE 28000 on a bad passphrase and PostgREST maps
       that to a 4xx. Anything else is a real fault and says so differently. */
    if ([400, 401, 403].includes(response.status)) {
      throw new Error('That passphrase was not accepted.')
    }
    throw new Error(`Could not load analytics (HTTP ${response.status}).`)
  }

  return response.json()
}
