import './BrandMark.css'

/**
 * The Fynbos Creative logo — the circular protea/sunbird badge (`mark`), or the
 * badge with the "Fynbos / CREATIVE" letterforms beneath it (`lockup`).
 *
 * Drawn as a CSS mask over `currentColor`, not an `<img>`. The header flips its
 * brand to Parchment while it floats transparent over the hero video, and the
 * footer runs inverted on Olive; an `<img>` cannot inherit colour, so each
 * context would need its own recoloured copy of the file. A mask inherits, so
 * one asset serves every context and the logo can never drift from tokens.css.
 *
 * Both variants are decorative. Every place they appear already carries an
 * accessible name — the header link's `aria-label`, the footer's adjacent
 * tagline — so announcing the logo again would only add a duplicate.
 */
function BrandMark({ variant = 'mark' }) {
  return <span className={`brand-mark brand-mark-${variant}`} aria-hidden="true" />
}

export default BrandMark
