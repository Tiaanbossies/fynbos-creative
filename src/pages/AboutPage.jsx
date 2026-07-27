import { Link } from 'react-router-dom'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import { CONTACT_EMAIL } from '../lib/nav.js'
import { useSeo } from '../lib/useSeo.js'
import { useRevealText } from '../lib/useRevealText.js'
import './AboutPage.css'

/**
 * About.
 *
 * The whole point of this page is brief §C's central positioning: Fynbos
 * Creative is founder-led and the named person is a trust *advantage*, not a
 * weakness to disguise behind a fake "team". So the page names Tiaan, shows his
 * face, and says plainly that you deal with one person.
 *
 * Nothing here is invented. Brief §H forbids fabricated statistics and warns
 * against implying staff who don't exist, so the copy stays on established
 * positioning — founder-led, WhatsApp-first, honest pricing, ongoing support,
 * a light network of local partners — and claims no years, counts or awards
 * the brief doesn't give.
 *
 * The three "how we work" principles restate the brief's own promises (§B, §C)
 * rather than adding new ones.
 */
function AboutPage() {
  useSeo({
    title: 'About — Fynbos Creative',
    description:
      'Fynbos Creative is founder-led. You deal with Tiaan directly — not a call centre — for honest, done-for-you web services built for small South African businesses.',
  })

  const headingRef = useRevealText()

  return (
    <>
      <section className="section about-intro">
        <div className="container">
          <h1 className="about-heading" ref={headingRef}>
            A real person, not a call centre.
          </h1>
          <p className="about-lede">
            Fynbos Creative exists for the business owner stuck in the middle — too small for the
            agencies that quote in tens of thousands, and burned once too often by freelancers who
            vanish the moment something breaks. There&rsquo;s a better option in between, and it
            has a name and a face.
          </p>
        </div>
      </section>

      <section className="section about-founder">
        <div className="container about-founder-grid">
          <figure className="about-portrait">
            <img
              src="/team/tiaan.jpeg"
              alt="Tiaan, founder of Fynbos Creative"
              width="1200"
              height="1600"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className="about-founder-copy">
            <h2 className="about-founder-name">Hi, I&rsquo;m Tiaan.</h2>
            <p>
              Fynbos Creative is me. When you message on WhatsApp, it&rsquo;s me who answers — not
              a ticketing system, not an account manager reading off a script. I build your
              website, I look after it once it&rsquo;s live, and I&rsquo;m the person you come back
              to when you need a change or something isn&rsquo;t working.
            </p>
            <p>
              I started this because I kept meeting people running good, honest businesses who
              were being let down online — sold something they didn&rsquo;t understand, overcharged
              for it, then left to figure out the rest alone. That&rsquo;s the opposite of how this
              works. I explain things in plain language, I do the technical part for you, and I
              stay involved long after launch.
            </p>
            <p>
              I don&rsquo;t pretend to be a big team, because I&rsquo;m not — and that&rsquo;s the
              point. For the things a website sometimes needs beyond a build, like photography or
              social content, I bring in a small circle of trusted local partners rather than
              stretching to fake it. You always know who you&rsquo;re dealing with.
            </p>
          </div>
        </div>
      </section>

      <section className="section about-different">
        <div className="container">
          <h2 className="about-section-heading">Rooted in local. Built to grow.</h2>
          <p className="about-section-lede">
            That tagline isn&rsquo;t decoration. It&rsquo;s how the whole thing is meant to work —
            three promises I hold myself to on every project.
          </p>

          <ul className="about-values">
            <li className="about-value">
              <h3 className="about-value-name">You deal with a person</h3>
              <p className="about-value-body">
                One named point of contact, start to finish. No call centre, no hand-offs, no
                &ldquo;let me escalate that&rdquo;. If you have my number, you have the person who
                can actually help.
              </p>
            </li>
            <li className="about-value">
              <h3 className="about-value-name">No jargon, no homework</h3>
              <p className="about-value-body">
                You tell me about your business; I handle the technical part. Hosting, domains,
                Google, updates — the things you shouldn&rsquo;t have to learn — are done for you,
                explained only as much as you want them to be.
              </p>
            </li>
            <li className="about-value">
              <h3 className="about-value-name">I stick around</h3>
              <p className="about-value-body">
                Launch is the start, not the finish. Your site stays hosted, updated and looked
                after every month — and I&rsquo;m still here when your business changes and it
                needs to change with it.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section about-foot-section">
        <div className="container">
          <div className="about-foot">
            <h2 className="about-foot-heading">Let&rsquo;s talk about your business.</h2>
            <p className="about-foot-lede">
              The easiest way to start is a message — tell me what you do and what you&rsquo;re
              stuck on, and I&rsquo;ll tell you honestly whether I can help.
            </p>
            <a
              className="btn-accent"
              data-primary-cta
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('about')}
            >
              Chat with us on WhatsApp
            </a>
            <p className="about-foot-note">
              Prefer email? Reach me at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Or
              see exactly what I do on the <Link to="/services">services</Link> and{' '}
              <Link to="/pricing">pricing</Link> pages.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
