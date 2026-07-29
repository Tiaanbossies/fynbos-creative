import { useSeo } from '../lib/useSeo.js'
import { CONTACT_EMAIL } from '../lib/nav.js'
import './PrivacyPolicy.css'

/**
 * POPIA privacy policy — body copy carried forward from the previous build
 * (brief §B.6).
 *
 * Only deviation from the source: the POPIA contact address was
 * info@fynboscreative.co.za (a leftover from the fynbosdigital rebrand). It is
 * now tiaan@, on instruction — the address a data subject writes to must be one
 * that is actually monitored, and it now matches the footer.
 *
 * The analytics paragraph previously claimed Google Analytics. Nothing of the
 * sort was ever installed — index.html loads no tag, and whatsapp.js guards
 * trackWhatsAppClick behind `typeof window.gtag === 'function'`, so every click
 * event silently no-ops. A POPIA page overstating what is collected is the one
 * kind of inaccuracy that costs more than it saves, so the claim is gone.
 *
 * If analytics is ever added, this paragraph is the first thing that must
 * change — it now asserts the absence, not merely omits the presence.
 */
function PrivacyPolicy() {
  useSeo()

  return (
    <section id="privacy" className="section privacy-policy">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p className="section-lede">
          We only collect what we need to help you — nothing more.
        </p>
        <div className="privacy-body">
          <h2>What we collect</h2>
          <p>
            When you message us on WhatsApp or email, we collect your name and
            contact details (phone number or email) and the message you send, so
            we can reply to your enquiry.
          </p>
          <h2>Website analytics</h2>
          <p>
            This site runs no analytics, no tracking pixels and no advertising
            cookies. We don&apos;t know who visits, what you look at or where you
            came from — the first we hear from you is when you message us.
          </p>
          <h2>How we use your information</h2>
          <p>
            Your contact details are used only to respond to your enquiry and,
            if you become a client, to deliver our services. We don&apos;t sell
            or rent your information to anyone.
          </p>
          <h2>Your rights</h2>
          <p>
            Under the Protection of Personal Information Act (POPIA), you can
            ask us what information we hold about you, ask us to correct it, or
            ask us to delete it. Contact us on WhatsApp or at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to make any
            of these requests.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PrivacyPolicy
