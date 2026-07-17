import { Link } from 'react-router-dom'
import Wordmark from './Wordmark.jsx'
import { NAV_LINKS, CONTACT_EMAIL } from '../lib/nav.js'
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
          <Wordmark withTagline />
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
