import './Wordmark.css'

/**
 * Text-only wordmark. No logo exists yet (brief §C) — "bos" is picked out in
 * Sunbird Orange so the mark carries the fynbos metaphor without an icon.
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
        <span className="wordmark-tagline">Rooted in local. Built to grow.</span>
      )}
    </span>
  )
}

export default Wordmark
