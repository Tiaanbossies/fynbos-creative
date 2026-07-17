import { useEffect, useRef } from 'react'
import { revealOnScroll } from '../lib/motion.js'
import './HowItWorks.css'

/**
 * Copy is verbatim from brief §E.3 — do not "improve" it. Its plainness is the
 * point: no jargon (§B.4), and the visitor scans rather than reads, so it is
 * icon + short label, never paragraphs (§C, cognitive fluency).
 */
const STEPS = [
  {
    id: 'chat',
    title: 'Chat to us on WhatsApp',
    body: 'Tell us about your business.',
  },
  {
    id: 'build',
    title: 'We build your site',
    body: 'You approve it, no jargon.',
  },
  {
    id: 'live',
    title: 'You go live',
    body: 'Found on Google, ready for enquiries.',
  },
  {
    id: 'grow',
    title: 'We keep it running',
    body: 'Hosting, updates, growth support every month.',
  },
]

/* Line icons, drawn to inherit currentColor so they can never introduce a
   colour outside the palette. */
const ICONS = {
  chat: (
    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
  ),
  build: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </>
  ),
  grow: (
    <>
      <path d="M12 21V9" />
      <path d="M12 12c0-3.5 2.5-6.5 6-7 .5 3.5-2 7-6 7z" />
      <path d="M12 15c0-3-2-5.5-5-6-.4 3 1.6 6 5 6z" />
    </>
  ),
}

function HowItWorks() {
  const stepsRef = useRef([])

  useEffect(() => {
    stepsRef.current.forEach((el, i) => {
      /* Staggered so the four steps read as a sequence, not a flash. */
      revealOnScroll(el, { delay: i * 90 })
    })
  }, [])

  return (
    <section className="section how" id="how-it-works">
      <div className="container">
        <p className="eyebrow">How it works</p>
        <h2 className="how-heading">Four steps. No jargon.</h2>

        <ol className="how-steps">
          {STEPS.map((step, i) => (
            <li
              key={step.id}
              className="how-step"
              ref={(el) => {
                stepsRef.current[i] = el
              }}
            >
              <span className="how-step-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[step.id]}
                </svg>
              </span>
              <span className="how-step-num">{i + 1}</span>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
