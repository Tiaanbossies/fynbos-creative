import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../lib/nav.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { validateEnquiry, submitEnquiry } from '../lib/contact.js'
import { revealOnScroll } from '../lib/motion.js'
import './Contact.css'

const EMPTY = { name: '', contact: '', message: '' }

/**
 * Field name -> input id, in the order they appear in the form.
 *
 * validateEnquiry returns an object keyed by field name, and an object's key
 * order is not the form's visual order — so a failed submit has to consult this
 * list rather than Object.keys(errors) to know which field is *first*. Keep it
 * in step with the markup below if a field is ever added or reordered.
 */
const FIELDS = [
  { name: 'name', id: 'contact-name' },
  { name: 'contact', id: 'contact-detail' },
  { name: 'message', id: 'contact-message' },
]

/**
 * Contact — brief §E.7.
 *
 * WhatsApp leads because that is how this audience actually makes contact
 * (§B.1). The form exists because §B.5 requires a real fallback rather than a
 * link-only section — three fields, "no more fields than that".
 *
 * The failure path is the important part. If the form cannot send, the visitor
 * is told plainly and handed WhatsApp and email instead. It must never show a
 * reassuring confirmation over an enquiry that went nowhere: this is a
 * lead-generation site, and a silently dropped message is a lost client.
 */
function Contact() {
  const formRef = useRef(null)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  /**
   * Counts failed submits, and is the trigger for both the live-region notice
   * and the focus move below. A counter rather than a boolean because two
   * failed submits in a row must re-fire the focus effect; a boolean would
   * already be true and the effect would not run.
   */
  const [invalidAttempt, setInvalidAttempt] = useState(0)

  useEffect(() => {
    revealOnScroll(formRef.current)
  }, [])

  /**
   * Validation used to fail silently for anyone not looking at the form: three
   * good error messages appeared, but focus stayed on the submit button and
   * nothing announced that anything had gone wrong, so a keyboard or
   * screen-reader user had to go hunting for it.
   *
   * Moving focus to the first invalid field announces its label AND its error,
   * because aria-describedby is already wired on every input. That has to
   * happen after the commit that renders the error, or the description does not
   * exist yet to be read out.
   *
   * `errors` is deliberately NOT a dependency: this effect must run on a failed
   * submit and at no other time. Adding it would re-steal focus on every
   * keystroke that cleared an error. The closure reads the errors set by the
   * same render that bumped the counter, which is exactly what is wanted.
   */
  useEffect(() => {
    if (invalidAttempt === 0) return
    const first = FIELDS.find((field) => errors[field.name])
    if (!first) return
    document.getElementById(first.id)?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidAttempt])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    /* Drop the summary as soon as any correction starts. The per-field errors
       below stay until each is actually fixed; it is the "3 fields need
       attention" line that becomes wrong the moment one of them is being
       addressed. */
    setInvalidAttempt(0)
    /* Clear this field's error as soon as it is being corrected — leaving it
       up while someone fixes it reads as nagging. */
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const found = validateEnquiry(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setStatus('idle')
      setInvalidAttempt((attempt) => attempt + 1)
      return
    }

    setInvalidAttempt(0)

    setStatus('sending')
    try {
      await submitEnquiry(values)
      setStatus('sent')
      setValues(EMPTY)
    } catch {
      /* Deliberately not surfacing the thrown message: whether it failed
         because the endpoint is unconfigured or the network dropped, what the
         visitor needs is the same — the other two ways to reach us. */
      setStatus('failed')
    }
  }

  const isSending = status === 'sending'
  const errorCount = Object.keys(errors).length

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <h2 className="contact-heading">Prefer to just ask a question?</h2>
        <p className="contact-lede">
          Send a quick message — you&rsquo;ll get a reply from Tiaan on WhatsApp
          or email, whichever is easier for you.
        </p>

        {/**
          * WhatsApp stays FIRST in the DOM: brief §B.1 makes it the primary
          * action, and on a phone this block is what a visitor meets before
          * the form. The mockup's desktop arrangement — form left, CTA right —
          * is done with grid `order` in Contact.css, so the source order and
          * the tab order still lead with WhatsApp.
          */}
        <div className="contact-layout">
          <div className="contact-direct">
            <a
              className="btn-accent contact-direct-cta"
              data-primary-cta
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('contact')}
            >
              Chat with us on WhatsApp
            </a>
            <p className="contact-email">
              Or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>

          <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="contact-field">
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
              />
              {errors.name && (
                <p className="contact-error" id="contact-name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="contact-field">
              <label htmlFor="contact-detail">Phone number or email</label>
              {/* type stays "text" because this field accepts a phone number OR
                  an email, and validateEnquiry is deliberately permissive about
                  which. inputMode only chooses the on-screen keyboard: most of
                  this audience types a phone number here, and a QWERTY keypad
                  for digits is friction on the cheapest path to contact. It
                  constrains nothing — the telephone keypad keeps a text key on
                  both iOS and Android, so an email is still typable. */}
              <input
                id="contact-detail"
                name="contact"
                type="text"
                inputMode="tel"
                autoComplete="tel"
                value={values.contact}
                onChange={handleChange}
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={errors.contact ? 'contact-detail-error' : undefined}
              />
              {errors.contact && (
                <p className="contact-error" id="contact-detail-error">
                  {errors.contact}
                </p>
              )}
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">What do you need?</label>
              <textarea
                id="contact-message"
                name="message"
                rows="3"
                value={values.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message && (
                <p className="contact-error" id="contact-message-error">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Spam trap. Hidden from people and assistive tech alike, so it
                does not count against the three fields §B.5 allows. */}
            <input
              className="contact-gotcha"
              type="text"
              name="_gotcha"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />

            <button className="contact-submit" type="submit" disabled={isSending}>
              {isSending ? 'Sending…' : 'Send message'}
            </button>

            {/* POPIA §B.6 — say what the details are for, at the point they are
                handed over, not only in the policy. */}
            <p className="contact-consent">
              We use your details only to reply to this enquiry. Read our{' '}
              <Link to="/privacy">privacy policy</Link>.
            </p>

            {/**
              * The one existing live region carries the validation notice too,
              * rather than a second one: two live regions announcing into the
              * same moment interrupt each other.
              *
              * Screen-reader-only on purpose. The visible cue for a sighted
              * keyboard user is the focus ring landing on the offending field,
              * and each error is already printed under its own input — a
              * visible summary here would be a third statement of the same
              * thing, below the button, which no design asked for.
              */}
            <div className="contact-status" aria-live="polite">
              {invalidAttempt > 0 && errorCount > 0 && (
                <p className="visually-hidden">
                  {errorCount === 1
                    ? '1 field needs attention.'
                    : `${errorCount} fields need attention.`}
                </p>
              )}
              {status === 'sent' && (
                <p className="contact-status-ok">
                  Thanks — we&rsquo;ve got it. Tiaan will get back to you shortly.
                </p>
              )}
              {status === 'failed' && (
                <p className="contact-status-fail">
                  Sorry, that didn&rsquo;t send. Please{' '}
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('contact-form-fallback')}
                  >
                    message us on WhatsApp
                  </a>{' '}
                  or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — we
                  don&rsquo;t want to miss you.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
