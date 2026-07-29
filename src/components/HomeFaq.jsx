import { Link } from 'react-router-dom'
import { FAQS } from '../lib/faqs.js'
import './HomeFaq.css'

/**
 * A short FAQ excerpt, immediately before the closing CTA.
 *
 * The four questions below are the ones standing between a warm visitor and a
 * message: what it costs, why there is a monthly fee at all, whether they are
 * locked in, and whether they need to be technical. Answering those on the page
 * where the decision happens is worth more than a link to /faq that most people
 * will not follow.
 *
 * Selected by id from faqs.js rather than sliced by index, so reordering that
 * file cannot silently change which four appear here. The text is read from the
 * same export /faq uses — there is no second copy of any answer, and editing
 * faqs.js updates both.
 *
 * Deliberately NO FAQPage JSON-LD here. scripts/prerender.mjs already emits it
 * for /faq from this same array, and two FAQPage blocks on one origin competing
 * for the same questions is an SEO liability rather than twice the coverage.
 *
 * Native <details>/<summary>, matching FaqPage — keyboard operable for free,
 * and it works before the JS bundle arrives, which matters on the metered
 * mobile connections brief §B.9 calls out.
 */
const HOME_FAQ_IDS = ['cost', 'monthly', 'contract', 'technical']

function HomeFaq() {
  /*
   * filter(Boolean) is not defensive padding: if an id here is ever renamed in
   * faqs.js this section quietly shows three questions instead of crashing the
   * homepage. There is no test suite to catch the rename, so failing soft on
   * the marketing page is the right trade.
   */
  const shown = HOME_FAQ_IDS.map((id) =>
    FAQS.find((faq) => faq.id === id),
  ).filter(Boolean)

  return (
    <section className="section home-faq" aria-labelledby="home-faq-heading">
      <div className="container home-faq-inner">
        <h2 className="home-faq-heading" id="home-faq-heading">
          Before you ask
        </h2>

        <div className="home-faq-list">
          {shown.map((faq) => (
            <details className="home-faq-item" key={faq.id}>
              <summary className="home-faq-question">
                <span>{faq.question}</span>
                {/* The chevron is duplicated from FaqPage rather than shared:
                    the two components are namespaced apart on purpose (see the
                    header of HomeFaq.css), and a shared icon component would be
                    a third file to keep in step for eleven lines of markup.
                    What must not diverge is the affordance — without it these
                    rows read as four plain lines of text and nobody taps. */}
                <svg
                  className="home-faq-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="home-faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>

        <p className="home-faq-more">
          <Link to="/faq">See all questions</Link>
        </p>
      </div>
    </section>
  )
}

export default HomeFaq
