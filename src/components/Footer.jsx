import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import { NAV_LINKS, CONTACT_EMAIL, TAGLINE } from '../lib/nav.js'
import './Footer.css'

/**
 * Business info + POPIA privacy link + email (brief §E.8, §B.6).
 *
 * The founder is named here on purpose. Brief §C: the visible, named point of
 * contact is a trust advantage — never dress this up as a bigger "team".
 */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          {/*
            The full lockup, not the text wordmark — the artwork already sets
            "Fynbos / CREATIVE", so pairing the two would print the name twice.
            The name still exists as real text in the copyright line below.

            Mono, always: this sits on Olive, where the artwork's own deep green
            is 1.51:1 and its sage 2.38:1. Only the masked tone survives here.
          */}
          <BrandMark variant="lockup" tone="mono" />
          <p className="footer-tagline">{TAGLINE}</p>
          <p className="footer-blurb">
            Founder-led web services for small South African businesses. You
            deal with Tiaan — not a call centre.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {NAV_LINKS.filter((link) => link.to !== '/').map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer-contact">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>

      <div className="container footer-legal">
        <p>
          &copy; {new Date().getFullYear()} Fynbos Creative. Proudly South
          African, serving businesses nationwide.
        </p>
      </div>
    </footer>
  )
}

export default Footer
