import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../lib/nav.js'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { validateEnquiry, submitEnquiry } from '../lib/contact.js'
import { revealOnScroll } from '../lib/motion.js'
import './Contact.css'

const EMPTY = { name: '', contact: '', message: '' }

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

  useEffect(() => {
    revealOnScroll(formRef.current)
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
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
      return
    }

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

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <p className="eyebrow">Get in touch</p>
        <h2 className="contact-heading">Let&rsquo;s talk about your business.</h2>
        <p className="contact-lede">
          The quickest way to reach us is WhatsApp — you&rsquo;ll get a reply from Tiaan, not a
          call centre. Prefer to write instead? Leave your details below.
        </p>

        <div className="contact-layout">
          <div className="contact-direct">
            <a
              className="btn-accent"
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
              <input
                id="contact-detail"
                name="contact"
                type="text"
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

            <div className="contact-status" aria-live="polite">
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
