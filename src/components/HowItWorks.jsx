import { useEffect, useRef } from 'react'
import { revealOnScroll } from '../lib/motion.js'
import './HowItWorks.css'

/**
 * Copy is verbatim from brief §E.3 — do not "improve" it. Its plainness is the
 * point: no jargon (§B.4), and the visitor scans rather than reads.
 *
 * The mockup condenses this to three steps ("We chat / We build / We manage").
 * The client chose (2026-07-23) to keep the brief's four and adopt only the
 * mockup's PRESENTATION — a numbered column, no icons, no eyebrow — so the
 * wording below stays untouched while the layout follows the mockup.
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

/**
 * Left column of the homepage offer row. The numerals are not decorative
 * scaffolding — this genuinely is an ordered sequence, and the order is the
 * information: a visitor is being told what happens first, and what happens
 * after they have paid.
 */
function HowItWorks() {
  const stepsRef = useRef([])

  useEffect(() => {
    stepsRef.current.forEach((el, i) => {
      /* Staggered so the steps read as a sequence, not a flash. */
      revealOnScroll(el, { delay: i * 90 })
    })
  }, [])

  return (
    <div className="how" id="how-it-works">
      <h2 className="how-heading">How it works</h2>

      <ol className="how-steps">
        {STEPS.map((step, i) => (
          <li
            key={step.id}
            className="how-step"
            ref={(el) => {
              stepsRef.current[i] = el
            }}
          >
            <span className="how-step-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="how-step-text">
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default HowItWorks
