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
 */
function PrivacyPolicy() {
  useSeo({
    title: 'Privacy Policy — Fynbos Creative',
    description:
      'How Fynbos Creative collects, uses and protects your personal information, in line with the Protection of Personal Information Act (POPIA).',
  })

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
            We use Google Analytics to understand how visitors use this site
            (pages viewed, general location, device type). This data is
            anonymised and used only to improve the site — we don&apos;t sell or
            share it with third parties for marketing.
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
