import { Link } from 'react-router-dom'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { useSeo } from '../lib/useSeo.js'
import './NotFoundPage.css'

/**
 * The 404.
 *
 * This used to be PagePlaceholder, which told every visitor on an unmatched URL
 * that the page was "built in a later phase" — on a site whose whole pitch is
 * that the business is real and finished. The people who land here are the ones
 * most likely to have been actively trying to reach us: a stale link, a typo, an
 * old business card. They get a way onward, not an apology for a half-built
 * site.
 *
 * No "error", no "404" in the body copy: the audience is non-technical and the
 * status code is not their problem. The <h1> says what happened in plain words
 * and the rest of the page is exits.
 *
 * Bare useSeo() — metaForPath has no entry for an unmatched path, so this
 * inherits the noindex "Page not found" fallback. That is deliberate; adding a
 * ROUTE_META entry would make the 404 indexable and put it in the sitemap.
 */
const EXITS = [
  { to: '/services', label: 'Services', note: 'What we build, and what it includes.' },
  { to: '/pricing', label: 'Pricing', note: 'Every number, stated up front.' },
  { to: '/faq', label: 'Questions', note: 'The things people ask before getting in touch.' },
]

function NotFoundPage() {
  useSeo()

  return (
    <section className="section not-found">
      <div className="container not-found-inner">
        <h1 className="not-found-heading">That page isn&rsquo;t here.</h1>
        <p className="not-found-lede">
          It may have moved, or the link may have a typo in it. Nothing is broken
          on your side — here&rsquo;s the way back in.
        </p>

        <ul className="not-found-exits">
          {EXITS.map((exit) => (
            <li className="not-found-exit" key={exit.to}>
              <Link className="not-found-exit-link" to={exit.to}>
                {exit.label}
              </Link>
              <span className="not-found-exit-note">{exit.note}</span>
            </li>
          ))}
        </ul>

        <div className="not-found-foot">
          <a
            className="btn-accent"
            data-primary-cta
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('not-found')}
          >
            Chat with us on WhatsApp
          </a>
          <p className="not-found-note">
            Or start over from the <Link to="/">home page</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
