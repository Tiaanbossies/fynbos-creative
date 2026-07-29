import { useEffect, useState } from 'react'
import { useSeo } from '../lib/useSeo.js'
import { CONTACT_EMAIL } from '../lib/nav.js'
import { readConsent, setConsent, onConsentChange, GRANTED, DECLINED } from '../lib/consent.js'
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
 * THE ANALYTICS SECTION HAS NOW CHANGED TWICE, and the history matters.
 *
 * It first claimed Google Analytics that was never installed. That claim was
 * deleted and replaced with an assertion of absence, with a note saying this
 * paragraph is the first thing that must change if analytics is ever added.
 * This is that change: first-party analytics is now installed, so the section
 * describes what is actually collected, why, on what lawful basis, and who it
 * is shared with (nobody).
 *
 * The copy here is the contract that analytics.js implements. If the field list
 * in analytics.js changes, this page is wrong until it is edited to match —
 * there is no build check tying the two together, only this note and the
 * matching one in analytics.js.
 */
function PrivacyPolicy() {
  useSeo()

  /* Mirrors the stored choice so the control below reports the visitor's actual
     state rather than a guess, and updates live if the banner is used in
     another tab of the same page. */
  const [consent, setConsentState] = useState(() => readConsent())

  useEffect(() => onConsentChange(setConsentState), [])

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
            We count how many people click our &ldquo;Chat with us on
            WhatsApp&rdquo; buttons, so we can tell which pages actually help
            someone get in touch. This runs on our own systems &mdash; there is
            no Google Analytics, no Facebook pixel, no advertising network and
            no third-party tracking script anywhere on this site.
          </p>
          <p>
            <strong>Only with your permission.</strong> Nothing is recorded
            until you press &ldquo;Allow&rdquo; on the notice you saw when you
            arrived. If you ignored it or chose &ldquo;No thanks&rdquo;, we have
            recorded nothing about your visit at all. That permission is our
            lawful basis under POPIA &mdash; your consent, freely given, and you
            can withdraw it at any time using the button below.
          </p>
          <p>When you have allowed it, each click records:</p>
          <ul>
            <li>that a WhatsApp button was clicked, and which one;</li>
            <li>the page you were on when you clicked it;</li>
            <li>
              the website that sent you to us, if any &mdash; the site&apos;s
              name only, such as &ldquo;google.com&rdquo;, never the full link;
            </li>
            <li>whether you are on a phone or a computer;</li>
            <li>
              a random number that lasts until you close the tab, so we can tell
              one person clicking twice from two different people. It is deleted
              when you close the tab and cannot be linked to you or to any later
              visit.
            </li>
          </ul>
          <p>
            We do not use cookies for this. We do not store your IP address,
            your name, your location, or anything you type. We cannot tell who
            you are from it, and we do not try to.
          </p>
          <h2>How we use your information</h2>
          <p>
            Your contact details are used only to respond to your enquiry and,
            if you become a client, to deliver our services. The analytics
            counts are used only to decide which parts of this website to
            improve. We don&apos;t sell or rent your information to anyone, and
            we don&apos;t share it with advertisers or analytics companies
            &mdash; the click data sits in our own database and goes nowhere
            else.
          </p>
          <h2>Where it is kept, and for how long</h2>
          <p>
            Enquiries reach us by WhatsApp or email and stay in those accounts.
            The analytics counts are stored in our own database, hosted by
            Supabase, our data processor. Because the session number is deleted
            when you close your tab, the click records cannot be traced back to
            an individual afterwards.
          </p>
          {/* The policy says consent can be withdrawn at any time, so there has
              to be something here that withdraws it. A POPIA page describing a
              right the site gives you no way to exercise is the same class of
              problem as the Google Analytics claim it replaced. */}
          <h2>Your choice about analytics</h2>
          <p className="privacy-consent-state">
            {consent === GRANTED
              ? 'Right now: you have allowed us to count your WhatsApp clicks.'
              : consent === DECLINED
                ? 'Right now: you have declined, and nothing about your visits is being recorded.'
                : 'Right now: you have not answered yet, so nothing is being recorded.'}
          </p>
          <div className="privacy-consent-actions">
            {consent !== GRANTED && (
              <button type="button" onClick={() => setConsent(GRANTED)}>
                Allow analytics
              </button>
            )}
            {consent !== DECLINED && (
              <button type="button" onClick={() => setConsent(DECLINED)}>
                {consent === GRANTED ? 'Withdraw my permission' : 'No thanks'}
              </button>
            )}
          </div>
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
