import { useEffect, useRef } from 'react'
import { revealOnScroll } from '../lib/motion.js'
import { AUDIENCE_LEDE, AUDIENCE_SEGMENTS } from '../lib/audience.js'
import './Audience.css'

/**
 * The recognition beat: "this is for someone like me."
 *
 * Sits between the proof and the offer on purpose. A visitor who has just seen
 * a real delivered site is asked one question — is this for my kind of
 * business? — before being shown a process and a price. Discovering the answer
 * later, halfway down a pricing table, loses them.
 *
 * Deliberately NOT a five-card grid. The segments are four-word labels with no
 * supporting copy, so cards would be five identical boxes padded out to look
 * substantial — the generic SaaS reflex PRODUCT.md rejects, and a pattern prior
 * critique specifically credited this page for avoiding. A wrapped inline list
 * says the same thing in a fifth of the height and stays honest about how
 * little there is to say.
 *
 * It is a real <ul>: five sibling categories are a list, and a screen reader
 * announcing the count is exactly what this section is for.
 */
function Audience() {
  const ref = useRef(null)

  useEffect(() => {
    revealOnScroll(ref.current)
  }, [])

  return (
    <section className="section audience" aria-labelledby="audience-heading">
      <div className="container audience-inner" ref={ref}>
        <h2 className="audience-heading" id="audience-heading">
          Who this is for
        </h2>
        <p className="audience-lede">{AUDIENCE_LEDE}</p>

        <ul className="audience-list">
          {AUDIENCE_SEGMENTS.map((segment) => (
            <li className="audience-item" key={segment.id}>
              {segment.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Audience
