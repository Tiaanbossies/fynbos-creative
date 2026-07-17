const WHATSAPP_NUMBER = '27628034558'
const WHATSAPP_MESSAGE = "Hi, I'm interested in a website for my business"

export function buildWhatsAppLink(number = WHATSAPP_NUMBER, message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function trackWhatsAppClick(source) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: source })
}
