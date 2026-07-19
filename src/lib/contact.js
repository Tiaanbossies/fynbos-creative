/**
 * Contact enquiry handling — validation and submission.
 *
 * Kept out of the component because the failure behaviour here is the part
 * that matters commercially: a dropped enquiry is a lost R1,200+ client. Every
 * path in this file either succeeds or throws something the UI can show. It
 * never resolves quietly on failure.
 */

/* Formspree free tier (brief §B.5). Set VITE_FORMSPREE_ID in .env — see
   .env.example. Absent, submitEnquiry throws rather than posting nowhere. */
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/'

const MIN_NAME_LENGTH = 2
const MIN_MESSAGE_LENGTH = 4
/* SA numbers land at 9 digits (082 123 4567) once spaces and +27 are stripped. */
const MIN_PHONE_DIGITS = 9

export function isContactConfigured() {
  return Boolean(FORMSPREE_ID)
}

/**
 * Deliberately permissive. The audience is non-technical (brief §C) and a
 * rejected-but-valid phone number is a lost enquiry, so this only catches
 * input that could not reach anyone — not input that looks unusual.
 */
function looksReachable(contact) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
  const digitCount = (contact.match(/\d/g) || []).length
  return isEmail || digitCount >= MIN_PHONE_DIGITS
}

/**
 * @param {{ name: string, contact: string, message: string }} values
 * @returns {Record<string, string>} field name → message; empty when valid
 */
export function validateEnquiry(values) {
  const errors = {}
  const name = values.name.trim()
  const contact = values.contact.trim()
  const message = values.message.trim()

  if (name.length < MIN_NAME_LENGTH) {
    errors.name = 'Please tell us your name.'
  }

  if (!contact) {
    errors.contact = 'Please leave a phone number or email so we can reply.'
  } else if (!looksReachable(contact)) {
    errors.contact = "That doesn't look like a phone number or email address."
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = 'Please tell us briefly what you need.'
  }

  return errors
}

/**
 * Posts the enquiry to Formspree.
 *
 * @param {{ name: string, contact: string, message: string }} values
 * @throws {Error} with a message safe to show the visitor
 */
export async function submitEnquiry(values) {
  if (!isContactConfigured()) {
    /* A deployment mistake, not a visitor mistake. Throwing keeps the UI
       honest — it shows the WhatsApp/email fallback instead of a false
       "thanks, we'll be in touch" over an enquiry that went nowhere. */
    throw new Error('The form is not set up yet.')
  }

  let response
  try {
    response = await fetch(`${FORMSPREE_ENDPOINT}${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: values.name.trim(),
        contact: values.contact.trim(),
        message: values.message.trim(),
      }),
    })
  } catch {
    /* Offline, DNS, blocked — the visitor's connection, most likely. */
    throw new Error('We could not send that — please check your connection.')
  }

  if (!response.ok) {
    throw new Error('We could not send that just now.')
  }
}
