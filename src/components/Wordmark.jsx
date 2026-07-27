import { TAGLINE } from '../lib/nav.js'
import './Wordmark.css'

/**
 * Text-only wordmark, with "bos" picked out in Sunbird Orange.
 *
 * This predates the logo and outlived it. The delivered mark (see BrandMark)
 * is line art at roughly one stroke weight, which turns to mush below about
 * 28px; set type does not. So the header pairs the two — mark for identity,
 * this for legibility — rather than shrinking the full lockup into the nav.
 *
 * The tagline was previously set in Alex Brush, the script+sans lockup admired
 * on lovegreen.co.za (questionnaire §08). The moodboard type stack dropped the
 * script face — Amatic SC is already hand-lettered, so a second decorative face
 * fought it — and the tagline now sets in the body font.
 */
function Wordmark({ withTagline = false }) {
  return (
    <span className="wordmark">
      <span className="wordmark-name">
        Fyn<span className="wordmark-accent">bos</span> Creative
      </span>
      {withTagline && (
        <span className="wordmark-tagline">{TAGLINE}</span>
      )}
    </span>
  )
}

export default Wordmark
