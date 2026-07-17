import './Wordmark.css'

/**
 * Text-only wordmark. No logo exists yet (brief §C) — "bos" is picked out in
 * Terracotta so the mark carries the fynbos metaphor without an icon.
 *
 * The Alex Brush tagline is the script+sans lockup admired on lovegreen.co.za
 * (questionnaire §08). It is the ONLY sanctioned script usage — never body,
 * never headings.
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
