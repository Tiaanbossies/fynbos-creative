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
export const WHATSAPP_NUMBER = '27628034558'
const WHATSAPP_MESSAGE = "Hi, I'm interested in a website for my business"

export function buildWhatsAppLink(number = WHATSAPP_NUMBER, message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function trackWhatsAppClick(source) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: source })
}
