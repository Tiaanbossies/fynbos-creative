/**
 * The business number, in wa.me form: digits only, country code, no '+'.
 *
 * Exported because it is duplicated: the ProfessionalService JSON-LD in
 * index.html carries the same number as `telephone`, in E.164 ('+' prefixed).
 * scripts/prerender.mjs imports this and fails the build if the two disagree,
 * so the copy in the markup cannot quietly rot into a number nobody answers.
 *
 * Keep this module free of top-level browser access — the Node prerender
 * imports it, the same constraint seo.js carries.
 */
import { track } from './analytics.js'

export const WHATSAPP_NUMBER = '27628034558'
const WHATSAPP_MESSAGE = "Hi, I'm interested in a website for my business"

export function buildWhatsAppLink(number = WHATSAPP_NUMBER, message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/**
 * Record a WhatsApp click — the one metric PRODUCT.md defines success by.
 *
 * This used to be a no-op: it was guarded behind `typeof window.gtag`, no
 * analytics tag was ever installed, and so every call from all five sources
 * (hero, pricing, contact, sticky-mobile, contact-form-fallback) silently did
 * nothing. It now goes to our own Supabase project via analytics.js.
 *
 * The consent gate lives in analytics.js rather than here, so there is exactly
 * one place that can decide to send. Callers stay unchanged and unconditional —
 * a caller that has to remember to check consent is a caller that will forget.
 *
 * The import is safe for the Node prerender that reads WHATSAPP_NUMBER from
 * this file: analytics.js has no top-level browser access, by the same rule
 * this module follows.
 */
export function trackWhatsAppClick(source) {
  track('whatsapp_click', source)
}
